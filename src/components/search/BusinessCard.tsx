"use client";
import { MapPin, Clock, Phone, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import { Business } from "@/lib/types";
import { StarRating } from "@/components/ui/StarRating";
import { PriceLevel } from "@/components/ui/PriceLevel";
import { Badge } from "@/components/ui/Badge";

interface BusinessCardProps {
  business: Business;
  rank: number;
}

const RANK_COLORS = [
  "bg-rating/15 border-rating/30 text-rating",
  "bg-muted/10 border-muted/20 text-muted",
  "bg-accent-warm/10 border-accent-warm/20 text-accent-warm",
];

export function BusinessCard({ business: b, rank }: BusinessCardProps) {
  const rankStyle = RANK_COLORS[rank - 1] ?? "bg-card border-border text-dim";

  return (
    <article className="group flex gap-4 p-4 rounded-xl glass border border-border card-hover cursor-pointer">
      {/* Rank badge */}
      <div className={clsx(
        "size-10 shrink-0 rounded-xl border flex items-center justify-center font-bold text-sm",
        rankStyle
      )}>
        #{rank}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-sm leading-tight truncate group-hover:text-primary transition-colors">
              {b.name}
            </h3>
            <p className="text-xs text-muted truncate">{b.category}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <PriceLevel level={b.priceLevel} />
            <ChevronRight size={14} className="text-dim group-hover:text-primary transition-colors" />
          </div>
        </div>

        {/* Ratings row */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
          <StarRating rating={b.rating} size={12} />
          <span className="text-[11px] text-muted">{b.reviewCount} отзывов</span>
          {b.distance && (
            <span className="flex items-center gap-0.5 text-[11px] text-muted">
              <MapPin size={10} />
              {b.distance < 1000 ? `${b.distance} м` : `${(b.distance / 1000).toFixed(1)} км`}
            </span>
          )}
        </div>

        {/* Address + hours */}
        <div className="flex items-center gap-3 flex-wrap text-[11px] text-muted">
          <span className="flex items-center gap-1 truncate">
            <MapPin size={10} className="shrink-0" />
            {b.address}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={10} className="shrink-0" />
            {b.isOpen ? (
              <span className="text-success">Открыто{b.openUntil ? ` до ${b.openUntil}` : ""}</span>
            ) : (
              <span className="text-danger">Закрыто{b.openUntil ? ` · откроется в ${b.openUntil}` : ""}</span>
            )}
          </span>
          {b.phone && (
            <span className="flex items-center gap-1">
              <Phone size={10} />
              {b.phone}
            </span>
          )}
        </div>

        {/* Tags */}
        {b.tags && b.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {b.tags.map((t) => (
              <Badge key={t} variant="muted">{t}</Badge>
            ))}
          </div>
        )}

        {/* AI score + reason */}
        {b.aiScore !== undefined && (
          <div className="flex items-start gap-2 pt-1 border-t border-border/50">
            <div className="flex items-center gap-1 shrink-0">
              <div className="h-1.5 w-20 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                  style={{ width: `${b.aiScore}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold text-primary">{b.aiScore}</span>
            </div>
            {b.aiReason && (
              <p className="text-[11px] text-muted leading-relaxed">{b.aiReason}</p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function BusinessCardSkeleton() {
  return (
    <div className="flex gap-4 p-4 rounded-xl glass border border-border">
      <div className="size-10 rounded-xl skeleton shrink-0" />
      <div className="flex-1 space-y-2.5">
        <div className="h-4 skeleton w-2/3" />
        <div className="h-3 skeleton w-1/2" />
        <div className="h-3 skeleton w-3/4" />
        <div className="h-3 skeleton w-full" />
      </div>
    </div>
  );
}
