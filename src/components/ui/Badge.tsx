"use client";
import { clsx } from "clsx";

type Variant = "default" | "success" | "warning" | "danger" | "primary" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

const variants: Record<Variant, string> = {
  default:  "bg-card border border-border text-muted",
  primary:  "bg-primary/10 border border-primary/30 text-primary",
  success:  "bg-success/10 border border-success/30 text-success",
  warning:  "bg-warning/10 border border-warning/30 text-warning",
  danger:   "bg-danger/10 border border-danger/30 text-danger",
  muted:    "bg-white/5 text-dim border border-white/5",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
