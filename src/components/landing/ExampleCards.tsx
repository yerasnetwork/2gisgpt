"use client";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { PriceLevel } from "@/components/ui/PriceLevel";
import { Badge } from "@/components/ui/Badge";
import { MOCK_BUSINESSES } from "@/lib/mockData";

const SHOWCASE = [
  {
    query: "самый дешевый донер в городе",
    city: "Атырау",
    businesses: MOCK_BUSINESSES.filter((b) => ["1", "2"].includes(b.id)),
    aiText: "Kebab House — лидер по цене. Донер от 800 ₸, работает до 2 ночи. Дастархан чуть дороже, но рейтинг 4.8 и вкусней.",
  },
  {
    query: "кофейня с хорошими отзывами",
    city: "Атырау",
    businesses: MOCK_BUSINESSES.filter((b) => b.id === "3"),
    aiText: "Mono Coffee — specialty кофе, рейтинг 4.7, тихая атмосфера и быстрый wifi. Идеально для работы.",
  },
  {
    query: "лучший барбершоп сейчас открыт",
    city: "Алматы",
    businesses: MOCK_BUSINESSES.filter((b) => b.id === "4"),
    aiText: "Barberia Almaty — рейтинг 4.9 из 5 (587 отзывов). Топ-1 в городе, онлайн-запись, открыт до 21:00.",
  },
];

export function ExampleCards() {
  const router = useRouter();

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <p className="text-xs font-semibold tracking-widest text-accent-warm uppercase">Примеры</p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Посмотри, как это{" "}
            <span className="gradient-text-warm">работает</span>
          </h2>
        </div>

        <div className="space-y-8">
          {SHOWCASE.map(({ query, city, businesses, aiText }, idx) => (
            <div key={idx} className="rounded-2xl glass border border-border overflow-hidden">
              {/* Query bar */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-bg-2/60">
                <div className="size-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                  <span className="text-[10px] text-primary font-bold">AI</span>
                </div>
                <span className="text-sm font-mono text-muted">
                  &ldquo;<span className="text-white">{query}</span>&rdquo;
                </span>
                <Badge variant="muted" className="ml-auto shrink-0">{city}</Badge>
              </div>

              {/* AI summary */}
              <div className="px-5 py-4 border-b border-border bg-accent/5">
                <p className="text-xs text-muted leading-relaxed">
                  <span className="text-accent font-semibold mr-1.5">AI:</span>
                  {aiText}
                </p>
              </div>

              {/* Result cards */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {businesses.map((b, rank) => (
                  <div
                    key={b.id}
                    className="flex gap-3 p-3 rounded-xl bg-card border border-border card-hover"
                  >
                    {/* Rank */}
                    <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                      #{rank + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm truncate">{b.name}</p>
                          <p className="text-xs text-muted truncate">{b.category}</p>
                        </div>
                        <PriceLevel level={b.priceLevel} />
                      </div>

                      <div className="flex items-center gap-3 mt-2">
                        <StarRating rating={b.rating} size={11} />
                        <span className="text-[11px] text-muted">({b.reviewCount})</span>
                        {b.distance && (
                          <span className="text-[11px] text-muted ml-auto">{b.distance}м</span>
                        )}
                      </div>

                      {/* AI reason */}
                      {b.aiReason && (
                        <p className="text-[11px] text-accent/80 mt-1.5 leading-relaxed line-clamp-2">
                          {b.aiReason}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-border flex justify-end">
                <button
                  onClick={() =>
                    router.push(`/search?q=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`)
                  }
                  className="flex items-center gap-1.5 text-xs text-primary hover:underline cursor-pointer"
                >
                  Попробовать этот запрос
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
