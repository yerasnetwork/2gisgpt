"use client";
import { Business } from "@/lib/types";
import { BusinessCard, BusinessCardSkeleton } from "./BusinessCard";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";

type SortKey = "aiScore" | "rating" | "distance" | "priceLevel";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "aiScore",    label: "AI"         },
  { key: "rating",     label: "Рейтинг"   },
  { key: "distance",   label: "Расстояние" },
  { key: "priceLevel", label: "Цена"       },
];

interface ResultsListProps {
  businesses: Business[];
  loading?: boolean;
}

export function ResultsList({ businesses, loading }: ResultsListProps) {
  const [sort, setSort]       = useState<SortKey>("aiScore");
  const [openOnly, setOpenOnly] = useState(false);

  const filtered = [...businesses].filter(b => !openOnly || b.isOpen);

  let sorted: Business[];
  if (filtered.length === 0) {
    sorted = [];
  } else {
    const topIdx = filtered.reduce(
      (bi, b, i) => ((b.aiScore ?? 0) > (filtered[bi].aiScore ?? 0) ? i : bi),
      0,
    );
    const topAi = filtered[topIdx];
    const rest = filtered
      .filter((_, i) => i !== topIdx)
      .sort((a, b) => {
        if (sort === "distance")   return (a.distance ?? 9999) - (b.distance ?? 9999);
        if (sort === "priceLevel") return a.priceLevel - b.priceLevel;
        return (b[sort] ?? 0) - (a[sort] ?? 0);
      });
    sorted = [topAi, ...rest];
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => <BusinessCardSkeleton key={i} />)}
      </div>
    );
  }

  if (!businesses.length) return null;

  return (
    <div className="space-y-3">
      {/* Controls — scrollable on mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {/* Open-only toggle */}
        <button
          onClick={() => setOpenOnly(p => !p)}
          className={clsx(
            "flex items-center gap-1.5 shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer",
            openOnly
              ? "bg-success/10 border-success/30 text-success"
              : "border-border text-muted hover:text-white hover:border-border-bright/40"
          )}
        >
          <SlidersHorizontal size={11} />
          Открытые
        </button>

        {/* Divider */}
        <div className="w-px h-4 bg-border shrink-0" />

        {/* Sort pills */}
        <div className="flex items-center gap-1 shrink-0">
          <ArrowUpDown size={11} className="text-dim shrink-0" />
          {SORT_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={clsx(
                "shrink-0 text-xs px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer",
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

      {/* Count */}
      <p className="text-xs text-muted px-0.5">
        Найдено <span className="text-white font-medium">{sorted.length}</span> мест
      </p>

      {/* Cards */}
      <div className="space-y-2.5">
        {sorted.map((b, i) => <BusinessCard key={b.id} business={b} rank={i + 1} />)}
      </div>
    </div>
  );
}
