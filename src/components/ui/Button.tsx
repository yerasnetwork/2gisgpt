"use client";
import { clsx } from "clsx";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary:   "bg-primary text-white hover:brightness-110 shadow-glow-blue",
  secondary: "glass border-border-bright/40 text-white hover:border-border-bright/70",
  ghost:     "text-muted hover:text-white hover:bg-white/5",
  danger:    "bg-danger/10 border border-danger/30 text-danger hover:bg-danger/20",
};

const sizes: Record<Size, string> = {
  sm: "h-8  px-3   text-sm  gap-1.5",
  md: "h-10 px-4   text-sm  gap-2",
  lg: "h-12 px-6   text-base gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, icon, children, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          "inline-flex items-center justify-center font-medium rounded-lg",
          "transition-all duration-150 focus-ring cursor-pointer",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : icon}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
