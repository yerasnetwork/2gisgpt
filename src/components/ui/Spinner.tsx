"use client";
import { clsx } from "clsx";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        "inline-block rounded-full border-2 border-current border-t-transparent animate-spin",
        className ?? "size-5"
      )}
      aria-label="Загружаю..."
    />
  );
}
