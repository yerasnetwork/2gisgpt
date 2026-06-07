"use client";
import { Zap, Clock } from "lucide-react";

interface AIResponseProps {
  summary: string;
  query: string;
  processingMs?: number;
  streaming?: boolean; // true while Claude is still writing
}

function parseMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary/90 font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-accent not-italic">$1</em>');
}

export function AIResponse({ summary, query, processingMs, streaming = false }: AIResponseProps) {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-primary/20 bg-primary/10">
        <div className="relative size-5 shrink-0">
          <div className="size-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Zap size={11} className="text-primary" />
          </div>
          {/* live pulse when streaming */}
          {streaming && (
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-accent animate-ping" />
          )}
        </div>
        <span className="text-xs font-semibold text-primary">AI Ответ</span>

        {streaming && (
          <span className="text-[10px] text-accent animate-pulse ml-1">генерирую...</span>
        )}

        {!streaming && processingMs !== undefined && (
          <div className="ml-auto flex items-center gap-1 text-[11px] text-muted">
            <Clock size={11} />
            {(processingMs / 1000).toFixed(1)}с
          </div>
        )}
      </div>

      {/* Query echo */}
      <div className="px-4 pt-3 pb-1">
        <p className="text-[11px] text-muted">
          Запрос: <span className="text-white font-mono">&ldquo;{query}&rdquo;</span>
        </p>
      </div>

      {/* Summary with streaming cursor */}
      <div className="px-4 pb-4 pt-1">
        {summary ? (
          <p className="text-sm text-muted leading-relaxed ai-prose">
            <span dangerouslySetInnerHTML={{ __html: parseMarkdown(summary) }} />
            {streaming && (
              <span className="cursor-blink inline-block w-0.5 h-3.5 bg-primary/70 ml-0.5 align-middle" />
            )}
          </p>
        ) : (
          /* empty skeleton while first words arrive */
          <div className="space-y-2">
            <div className="h-3 skeleton w-3/4" />
            <div className="h-3 skeleton w-full" />
            <div className="h-3 skeleton w-1/2" />
          </div>
        )}
      </div>
    </div>
  );
}

export function AIResponseSkeleton() {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-primary/20 bg-primary/10">
        <div className="size-5 rounded-full skeleton" />
        <div className="h-3 w-24 skeleton" />
      </div>
      <div className="p-4 space-y-2">
        <div className="h-3 skeleton w-3/4" />
        <div className="h-3 skeleton w-full" />
        <div className="h-3 skeleton w-5/6" />
      </div>
    </div>
  );
}
