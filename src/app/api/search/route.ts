import { NextRequest } from "next/server";
import { Business, SearchRequest } from "@/lib/types";
import { SearchFilters, searchPlaces } from "@/lib/twogis";
import { MOCK_BUSINESSES } from "@/lib/mockData";

/* SSE stream event types sent to the client */
export type StreamEvent =
  | { type: "businesses"; data: Business[] }
  | { type: "delta";      text: string }
  | { type: "warn";       message: string }
  | { type: "done";       ms: number };

/* ── Helpers ──────────────────────────────────────────────────── */
const encoder = new TextEncoder();

function sse(controller: ReadableStreamDefaultController, event: StreamEvent) {
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
}

/* Parse one Anthropic SSE line → text delta or null */
function extractDelta(line: string): string | null {
  if (!line.startsWith("data: ")) return null;
  const raw = line.slice(6).trim();
  if (!raw || raw === "[DONE]") return null;
  try {
    const obj = JSON.parse(raw) as Record<string, unknown>;
    if (obj.type === "content_block_delta") {
      const delta = obj.delta as Record<string, unknown> | undefined;
      if (delta?.type === "text_delta") return String(delta.text ?? "");
    }
  } catch { /* skip */ }
  return null;
}

/* Stream Claude response and pipe deltas to the SSE controller */
async function streamClaude(
  apiKey: string,
  system: string,
  userPrompt: string,
  controller: ReadableStreamDefaultController,
) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key":         apiKey,
      "anthropic-version": "2023-06-01",
      "content-type":      "application/json",
    },
    body: JSON.stringify({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 400,
      stream:     true,
      system,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!res.ok || !res.body) throw new Error(`Claude stream ${res.status}`);

  const reader  = res.body.getReader();
  const dec     = new TextDecoder();
  let   buf     = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";

    for (const line of lines) {
      const text = extractDelta(line);
      if (text) sse(controller, { type: "delta", text });
    }
  }
}

/* Quick non-streaming Claude call → string */
async function callClaude(apiKey: string, system: string, prompt: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key":         apiKey,
      "anthropic-version": "2023-06-01",
      "content-type":      "application/json",
    },
    body: JSON.stringify({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json() as { content?: Array<{ text?: string }> };
  return data.content?.[0]?.text ?? "";
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
    async start(controller) {
      try {
        /* ── No API keys → stream mock data ── */
        if (!ANTHROPIC_KEY || !TWOGIS_KEY) {
          sse(controller, { type: "warn", message: "API ключи не заданы — показаны демо-данные. Добавь ANTHROPIC_API_KEY и TWOGIS_API_KEY в .env.local" });

          const mock = MOCK_BUSINESSES.filter(b => !city || b.city === city);
          sse(controller, { type: "businesses", data: mock });

          const summary = `Нашёл **${mock.length} заведений** по запросу «${query}» в городе ${city}. Это демо-данные — подключи API ключи для реальных результатов.`;
          for (const word of summary.split(" ")) {
            sse(controller, { type: "delta", text: word + " " });
            await new Promise(r => setTimeout(r, 35));
          }

          sse(controller, { type: "done", ms: Date.now() - start });
          controller.close();
          return;
        }

        /* ── Step 1: Extract search intent with Claude ── */
        const intentJson = await callClaude(
          ANTHROPIC_KEY,
          "Extract search intent from a local business query in Kazakhstan. " +
          "Return ONLY a JSON object with: " +
          "category (string, the business type in Russian), " +
          "keywords (string[], key terms), " +
          "minRating (number|null, min rating 1-5), " +
          "maxPrice (1|2|3|null where 1=cheap 3=expensive), " +
          "openNow (boolean), " +
          "sortBy ('rating'|'distance'|'price'|'popularity'). " +
          "Output only valid JSON, no explanation.",
          `Query: "${query}"\nCity: ${city}`,
        );

        let filters: SearchFilters = {};
        try {
          /* Claude might wrap it in a markdown code block */
          const cleaned = intentJson.replace(/```json\n?|\n?```/g, "").trim();
          filters = JSON.parse(cleaned) as SearchFilters;
        } catch {
          /* fallback: no filters */
          filters = { sortBy: "popularity" };
        }

        /* ── Step 2: Call 2GIS ── */
        let businesses: Business[] = [];
        try {
          businesses = await searchPlaces(query, city, filters, TWOGIS_KEY, 20);
        } catch (err) {
          sse(controller, { type: "warn", message: `2GIS: ${(err as Error).message}` });
          businesses = MOCK_BUSINESSES.filter(b => !city || b.city === city);
        }

        /* ── Step 3: Send businesses to client immediately ── */
        sse(controller, { type: "businesses", data: businesses });

        /* ── Step 4: Stream Claude ranking summary ── */
        const topList = businesses.slice(0, 6)
          .map((b, i) => `${i + 1}. ${b.name} (${b.category}) — рейтинг ${b.rating}, ${b.reviewCount} отзывов, цена ${["₸","₸₸","₸₸₸"][b.priceLevel - 1]}, ${b.isOpen ? "открыто до " + b.openUntil : "закрыто"}`)
          .join("\n");

        await streamClaude(
          ANTHROPIC_KEY,
          "Ты — дружелюбный местный гид по Казахстану. " +
          "Пиши по-русски. Будь конкретным и кратким (2–4 предложения). " +
          "Упоминай названия заведений жирным (**Название**). " +
          "Выдели лучший вариант и объясни почему. " +
          "Если есть что-то важное (цена, рейтинг, расстояние) — скажи. " +
          "Не начинай с 'Я нашёл' — начни сразу с сути.",
          `Пользователь искал: "${query}" в городе ${city}.\n\nРезультаты:\n${topList}`,
          controller,
        );

        sse(controller, { type: "done", ms: Date.now() - start });
      } catch (err) {
        sse(controller, { type: "warn", message: `Ошибка: ${(err as Error).message}` });
        sse(controller, { type: "done", ms: Date.now() - start });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":    "text/event-stream",
      "Cache-Control":   "no-cache, no-transform",
      "Connection":      "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
