import { NextRequest } from "next/server";
import { Business, SearchRequest } from "@/lib/types";
import { SearchFilters, searchPlaces } from "@/lib/twogis";
import { MOCK_BUSINESSES } from "@/lib/mockData";

export type StreamEvent =
  | { type: "businesses"; data: Business[] }
  | { type: "delta";      text: string }
  | { type: "warn";       message: string }
  | { type: "done";       ms: number };

/* ── SSE helpers ─────────────────────────────────────────────── */
const encoder = new TextEncoder();

function sse(ctrl: ReadableStreamDefaultController, event: StreamEvent) {
  ctrl.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
}

function extractDelta(line: string): string | null {
  if (!line.startsWith("data: ")) return null;
  const raw = line.slice(6).trim();
  if (!raw || raw === "[DONE]") return null;
  try {
    const obj = JSON.parse(raw) as Record<string, unknown>;
    if (obj.type === "content_block_delta") {
      const d = obj.delta as Record<string, unknown> | undefined;
      if (d?.type === "text_delta") return String(d.text ?? "");
    }
  } catch { /* skip */ }
  return null;
}

/* ── Claude helpers ───────────────────────────────────────────── */
async function callClaude(apiKey: string, system: string, prompt: string, maxTokens = 400): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json() as { content?: Array<{ text?: string }>; error?: { message: string } };
  if (data.error) console.error("[callClaude] API error:", data.error.message);
  return data.content?.[0]?.text ?? "";
}

async function streamClaude(
  apiKey: string,
  system: string,
  prompt: string,
  ctrl: ReadableStreamDefaultController,
) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 350,
      stream: true,
      system,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok || !res.body) throw new Error(`Claude ${res.status}`);
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      const text = extractDelta(line);
      if (text) sse(ctrl, { type: "delta", text });
    }
  }
}

/* ── Main route ──────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  const start = Date.now();
  const body  = (await req.json()) as SearchRequest;
  const { query, city } = body;

  if (!query?.trim()) {
    return new Response(JSON.stringify({ error: "query is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  const TWOGIS_KEY    = process.env.TWOGIS_API_KEY ?? process.env.DGIS_API_KEY;

  const stream = new ReadableStream({
    async start(ctrl) {
      try {
        /* ── No Claude key → static mock ── */
        if (!ANTHROPIC_KEY) {
          sse(ctrl, { type: "warn", message: "ANTHROPIC_API_KEY не задан — показаны демо-данные." });
          const mock = MOCK_BUSINESSES.filter(b => !city || b.city === city);
          sse(ctrl, { type: "businesses", data: mock });
          const text = `Нашёл **${mock.length} заведений** по запросу «${query}» в городе ${city}. Добавь API ключ для реальных результатов.`;
          for (const w of text.split(" ")) {
            sse(ctrl, { type: "delta", text: w + " " });
            await new Promise(r => setTimeout(r, 30));
          }
          sse(ctrl, { type: "done", ms: Date.now() - start });
          ctrl.close();
          return;
        }

        /* ── Step 1: Extract intent ── */
        const intentRaw = await callClaude(
          ANTHROPIC_KEY,
          "Extract search intent from a local business query. Return ONLY valid JSON with these fields:\n" +
          "- category: string (business type in Russian, e.g. 'кофейня', 'донер', 'барбершоп')\n" +
          "- minRating: number|null (only if user explicitly says 'хороший', 'топ', '4+' etc, otherwise null)\n" +
          "- maxPrice: 1|2|3|null (1=cheap 3=expensive — ONLY if user explicitly says 'дешевый', 'бюджетный', 'дорогой', otherwise null)\n" +
          "- openNow: boolean (true ONLY if user explicitly says 'открытый', 'сейчас', 'сегодня', otherwise false)\n" +
          "- sortBy: 'rating'|'distance'|'popularity' (default 'popularity')\n" +
          "IMPORTANT: Do NOT infer price from food type. 'донер'/'шаурма'/'кофе' alone does NOT mean maxPrice=1.",
          `User query: "${query}"\nCity: ${city}, Kazakhstan`,
        );
        let filters: SearchFilters = { sortBy: "popularity" };
        try {
          const c = intentRaw.replace(/```json\n?|```\n?/g, "").trim();
          filters = JSON.parse(c) as SearchFilters;
        } catch { /* use defaults */ }

        /* ── Step 2: Search 2GIS ── */
        let businesses: Business[] = [];

        if (TWOGIS_KEY) {
          try {
            businesses = await searchPlaces(query, city, filters, TWOGIS_KEY, 10);
          } catch { /* 2GIS unavailable */ }
        }

        /* apply client-side filters */
        if (filters.openNow)  businesses = businesses.filter(b => b.isOpen);
        if (filters.maxPrice) businesses = businesses.filter(b => b.priceLevel <= filters.maxPrice!);
        businesses.sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0));

        /* ── Step 3: Send businesses immediately ── */
        sse(ctrl, { type: "businesses", data: businesses });

        /* ── Step 4: Stream summary or "not found" ── */
        if (businesses.length === 0) {
          const noResultText = `По запросу «${query}» в городе ${city} ничего не найдено. Попробуй другой запрос или сними фильтры.`;
          for (const w of noResultText.split(" ")) {
            sse(ctrl, { type: "delta", text: w + " " });
            await new Promise(r => setTimeout(r, 25));
          }
        } else {
          const topList = businesses.slice(0, 6)
            .map((b, i) =>
              `${i + 1}. ${b.name} (${b.category}) — ${b.rating}★, ${b.reviewCount} отзывов, ` +
              `цена ${["₸","₸₸","₸₸₸"][b.priceLevel - 1]}, ${b.isOpen ? `открыто до ${b.openUntil}` : "закрыто"}`
            ).join("\n");

          await streamClaude(
            ANTHROPIC_KEY,
            "You are a friendly local guide for Kazakhstan cities. Write in RUSSIAN only. Be concise (2-3 sentences). " +
            "Highlight the best option with **bold name**. Mention specific advantages: price, rating, open hours. " +
            "Do NOT start with 'Ya nashel' or 'Vot'. Start directly with a recommendation.",
            `User searched: "${query}" in ${city}, Kazakhstan\n\nTop results:\n${topList}`,
            ctrl,
          );
        }

        sse(ctrl, { type: "done", ms: Date.now() - start });
      } catch (err) {
        sse(ctrl, { type: "warn", message: `Ошибка: ${(err as Error).message}` });
        sse(ctrl, { type: "done", ms: Date.now() - start });
      } finally {
        ctrl.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":      "text/event-stream",
      "Cache-Control":     "no-cache, no-transform",
      "Connection":        "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
