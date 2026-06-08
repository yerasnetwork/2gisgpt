"use client";
import { MapPin, Clock, Phone, ChevronRight, ExternalLink, Star } from "lucide-react";
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
  "bg-white/10 border-white/15 text-muted",
  "bg-accent-warm/10 border-accent-warm/20 text-accent-warm",
];

export function BusinessCard({ business: b, rank }: BusinessCardProps) {
  const rankStyle = RANK_COLORS[rank - 1] ?? "bg-card border-border text-dim";

  return (
    <article className="group flex gap-3 p-3.5 sm:p-4 rounded-xl glass border border-border card-hover cursor-pointer">
      {/* Rank badge */}
      <div className={clsx(
        "size-9 sm:size-10 shrink-0 rounded-xl border flex items-center justify-center font-bold text-xs sm:text-sm",
        rankStyle
      )}>
        #{rank}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm leading-snug truncate group-hover:text-primary transition-colors">
              {b.name}
            </h3>
            <p className="text-xs text-muted truncate">{b.category}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <PriceLevel level={b.priceLevel} />
            <ChevronRight size={13} className="text-dim group-hover:text-primary transition-colors hidden sm:block" />
          </div>
        </div>

        {/* Rating + distance row */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
          <StarRating rating={b.rating} size={11} />
          <span className="text-[11px] text-muted">{b.reviewCount} отз.</span>
          {b.distance && (
            <span className="flex items-center gap-0.5 text-[11px] text-muted">
              <MapPin size={10} />
              {b.distance < 1000 ? `${b.distance} м` : `${(b.distance / 1000).toFixed(1)} км`}
            </span>
          )}
        </div>

        {/* Address + hours — stack on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-[11px] text-muted">
          <span className="flex items-center gap-1 min-w-0">
            <MapPin size={10} className="shrink-0" />
            <span className="truncate">{b.address}</span>
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <Clock size={10} className="shrink-0" />
            {b.isOpen ? (
              <span className="text-success">Открыто{b.openUntil ? ` до ${b.openUntil}` : ""}</span>
            ) : (
              <span className="text-danger">
                Закрыто{b.openUntil
                  ? ` · откр. ${b.openTomorrow ? "завтра в" : "в"} ${b.openUntil}`
                  : ""}
              </span>
            )}
          </span>
          {b.phone && (
            <span className="flex items-center gap-1 hidden sm:flex">
              <Phone size={10} />
              {b.phone}
            </span>
          )}
        </div>

        {/* Tags */}
        {b.tags && b.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {b.tags.slice(0, 3).map(t => <Badge key={t} variant="muted">{t}</Badge>)}
          </div>
        )}

        {/* AI score bar + 2GIS reviews button */}
        <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-border/40">
          {b.aiScore !== undefined ? (
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="h-1.5 w-14 sm:w-20 rounded-full bg-border overflow-hidden shrink-0">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  style={{ width: `${b.aiScore}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold text-primary shrink-0">{b.aiScore}</span>
              {b.aiReason && (
                <p className="text-[11px] text-muted leading-relaxed line-clamp-1 hidden sm:block">{b.aiReason}</p>
              )}
            </div>
          ) : <div />}

          {b.twogisUrl && (
            <a
              href={b.twogisUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1 shrink-0 text-[11px] px-2.5 py-1 rounded-lg border border-border bg-bg-card hover:border-primary/40 hover:text-primary text-muted transition-all"
            >
              <Star size={9} className="shrink-0" />
              Отзывы
              <ExternalLink size={9} className="shrink-0" />
            </a>
          )}</div>
      </div>
    </article>
  );
}

export function BusinessCardSkeleton() {
  return (
    <div className="flex gap-3 p-3.5 rounded-xl glass border border-border">
      <div className="size-9 rounded-xl skeleton shrink-0" />
      <div className="flex-1 space-y-2.5">
        <div className="h-4 skeleton w-2/3" />
        <div className="h-3 skeleton w-1/2" />
        <div className="h-3 skeleton w-3/4" />
        <div className="h-3 skeleton w-full" />
      </div>
    </div>
  );
}
