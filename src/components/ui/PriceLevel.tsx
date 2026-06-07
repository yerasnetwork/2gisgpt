"use client";
import { clsx } from "clsx";

interface PriceLevelProps {
  level: 1 | 2 | 3;
  className?: string;
}

const LABEL: Record<1 | 2 | 3, string> = { 1: "₸", 2: "₸₸", 3: "₸₸₸" };
const COLOR: Record<1 | 2 | 3, string> = {
  1: "text-success",
  2: "text-warning",
  3: "text-danger",
};

export function PriceLevel({ level, className }: PriceLevelProps) {
  return (
    <span className={clsx("font-mono text-sm font-bold", COLOR[level], className)}>
      {LABEL[level]}
    </span>
  );
}
