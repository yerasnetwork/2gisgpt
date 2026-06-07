"use client";
import { Business } from "@/lib/types";
import { BusinessCard, BusinessCardSkeleton } from "./BusinessCard";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";

type SortKey = "aiScore" | "rating" | "distance" | "priceLevel";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "aiScore",    label: "AI оценка"  },
  { key: "rating",     label: "Рейтинг"    },
  { key: "distance",   label: "Расстояние" },
  { key: "priceLevel", label: "Цена"       },
];

interface ResultsListProps {
  businesses: Business[];
  loading?: boolean;
}

export function ResultsList({ businesses, loading }: ResultsListProps) {
  const [sort, setSort] = useState<SortKey>("aiScore");
  const [openOnly, setOpenOnly] = useState(false);

  const sorted = [...businesses]
    .filter((b) => !openOnly || b.isOpen)
    .sort((a, b) => {
      if (sort === "distance") return (a.distance ?? 9999) - (b.distance ?? 9999);
      if (sort === "priceLevel") return a.priceLevel - b.priceLevel;
      return (b[sort] ?? 0) - (a[sort] ?? 0);
    });

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <BusinessCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!businesses.length) return null;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <SlidersHorizontal size={13} />
          <span>Фильтр:</span>
        </div>

        <button
          onClick={() => setOpenOnly((p) => !p)}
          className={clsx(
            "text-xs px-3 py-1 rounded-full border transition-all cursor-pointer",
            openOnly
              ? "bg-success/10 border-success/30 text-success"
              : "border-border text-muted hover:border-border-bright/40 hover:text-white"
          )}
        >
          Только открытые
        </button>

        <div className="ml-auto flex items-center gap-1">
          <ArrowUpDown size={13} className="text-muted" />
          <div className="flex gap-1">
            {SORT_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={clsx(
                  "text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer",
                  sort === key
                    ? "bg-primary/15 border-primary/30 text-primary"
                    : "border-border text-muted hover:text-white"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-muted">
        Показано <span className="text-white font-medium">{sorted.length}</span> из {businesses.length} мест
      </p>

      {/* Cards */}
      <div className="space-y-3">
        {sorted.map((b, i) => (
          <BusinessCard key={b.id} business={b} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}
