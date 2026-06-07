import { SearchX, Sparkles } from "lucide-react";

interface EmptyStateProps {
  query?: string;
}

const QUICK_PROMPTS = [
  "кофейня рядом со мной",
  "самый дешевый донер",
  "ресторан с рейтингом 4.8+",
  "барбершоп открыт сейчас",
];

export function EmptyState({ query }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
      <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        {query ? (
          <SearchX size={28} className="text-primary/60" />
        ) : (
          <Sparkles size={28} className="text-primary/60" />
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-base">
          {query ? `Ничего не найдено по «${query}»` : "Введи запрос выше"}
        </h3>
        <p className="text-sm text-muted max-w-xs">
          {query
            ? "Попробуй другую формулировку или смени город."
            : "Спроси AI о любом месте — кафе, ресторанах, барбершопах и не только."}
        </p>
      </div>

      {!query && (
        <div className="space-y-2">
          <p className="text-xs text-dim">Например:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {QUICK_PROMPTS.map((p) => (
              <span
                key={p}
                className="text-xs px-3 py-1.5 rounded-full glass border-border/60 text-muted"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
