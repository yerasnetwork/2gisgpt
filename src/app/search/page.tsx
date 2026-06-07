"use client";
import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";
import { Business, City } from "@/lib/types";
import { StreamEvent } from "@/app/api/search/route";
import { SearchBar } from "@/components/search/SearchBar";
import { AIResponse } from "@/components/search/AIResponse";
import { ResultsList } from "@/components/search/ResultsList";
import { EmptyState } from "@/components/search/EmptyState";
import { DEFAULT_CITY } from "@/lib/cities";

function SearchContent() {
  const params = useSearchParams();
  const query  = params.get("q") ?? "";
  const city   = (params.get("city") ?? DEFAULT_CITY) as City;

  /* Stream state */
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [summaryText, setSummaryText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDone,      setIsDone]      = useState(false);
  const [totalMs,     setTotalMs]     = useState<number | undefined>();
  const [warn,        setWarn]        = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const runSearch = useCallback(async (q: string, c: City) => {
    if (!q.trim()) {
      setBusinesses([]);
      setSummaryText("");
      setIsDone(false);
      return;
    }

    /* Cancel any in-flight request */
    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;

    setBusinesses([]);
    setSummaryText("");
    setIsStreaming(true);
    setIsDone(false);
    setWarn(null);

    try {
      const res = await fetch("/api/search", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ query: q, city: c }),
        signal:  abort.signal,
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const dec    = new TextDecoder();
      let   buf    = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buf += dec.decode(value, { stream: true });

        /* Extract complete SSE lines from buffer */
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6)) as StreamEvent;

            if (event.type === "businesses") {
              setBusinesses(event.data);

            } else if (event.type === "delta") {
              setSummaryText(prev => prev + event.text);

            } else if (event.type === "warn") {
              setWarn(event.message);

            } else if (event.type === "done") {
              setTotalMs(event.ms);
              setIsStreaming(false);
              setIsDone(true);
            }
          } catch { /* malformed SSE line — skip */ }
        }
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setWarn("Ошибка соединения. Проверь интернет и попробуй снова.");
      setIsStreaming(false);
      setIsDone(true);
    }
  }, []);

  useEffect(() => {
    runSearch(query, city);
    return () => abortRef.current?.abort();
  }, [query, city, runSearch]);

  const hasBusinesses = businesses.length > 0;
  const loading       = isStreaming && !hasBusinesses;

  return (
    <div className="min-h-screen bg-bg">
      {/* Ambient */}
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="fixed top-0 right-0 orb orb-blue w-96 h-96 opacity-30 translate-x-1/2 -translate-y-1/2" />

      {/* Topbar */}
      <header className="sticky top-0 z-50 border-b border-border glass">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 h-14 flex items-center gap-2 sm:gap-3">
          <Link href="/" className="text-muted hover:text-white transition-colors shrink-0 p-1">
            <ArrowLeft size={17} />
          </Link>

          <Link href="/" className="flex items-center gap-1 shrink-0">
            <div className="size-6 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Zap size={11} className="text-primary" />
            </div>
            <span className="font-bold text-xs hidden sm:block">
              Local<span className="gradient-text">AI</span>
            </span>
          </Link>

          <div className="flex-1 min-w-0">
            <SearchBar initialQuery={query} initialCity={city} loading={isStreaming} />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* Warning banner */}
        {warn && (
          <div className="rounded-lg bg-warning/10 border border-warning/30 px-4 py-2.5 text-xs text-warning leading-relaxed">
            {warn}
          </div>
        )}

        {/* AI response — show as soon as streaming starts or summary exists */}
        {(isStreaming || summaryText) && query && (
          <AIResponse
            summary={summaryText}
            query={query}
            processingMs={isDone ? totalMs : undefined}
            streaming={isStreaming}
          />
        )}

        {/* Business cards — skeleton while waiting for first businesses event */}
        {query && (
          <ResultsList
            businesses={businesses}
            loading={loading}
          />
        )}

        {/* Empty / welcome */}
        {!query && <EmptyState />}
        {isDone && !isStreaming && hasBusinesses === false && query && (
          <EmptyState query={query} />
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
