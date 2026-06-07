"use client";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  showNumber?: boolean;
}

export function StarRating({ rating, max = 5, size = 14, showNumber = true }: StarRatingProps) {
  const full   = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const empty  = max - full - (hasHalf ? 1 : 0);

  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex items-center gap-0.5">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f-${i}`} size={size} className="star-fill" fill="currentColor" />
        ))}
        {hasHalf && (
          <span className="relative inline-flex">
            <Star size={size} className="star-empty" fill="currentColor" />
            <span className="absolute inset-0 overflow-hidden w-1/2">
              <Star size={size} className="star-fill" fill="currentColor" />
            </span>
          </span>
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e-${i}`} size={size} className="star-empty" fill="currentColor" />
        ))}
      </span>
      {showNumber && (
        <span className="text-xs font-semibold text-rating">{rating.toFixed(1)}</span>
      )}
    </span>
  );
}
