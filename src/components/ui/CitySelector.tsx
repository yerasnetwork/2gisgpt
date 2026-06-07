"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, ChevronDown, Navigation, Search, Check, Loader2, AlertCircle } from "lucide-react";
import { clsx } from "clsx";
import { City } from "@/lib/types";
import { KZ_CITIES } from "@/lib/cities";
import { useGeolocation } from "@/hooks/useGeolocation";

interface CitySelectorProps {
  value: City;
  onChange: (city: City) => void;
  className?: string;
}

export function CitySelector({ value, onChange, className }: CitySelectorProps) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const ref                 = useRef<HTMLDivElement>(null);
  const inputRef            = useRef<HTMLInputElement>(null);
  const { status, city: geoCity, detect } = useGeolocation();

  useEffect(() => {
    if (status === "success" && geoCity) { onChange(geoCity); setOpen(false); }
  }, [status, geoCity, onChange]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
    else setSearch("");
  }, [open]);

  const filtered = KZ_CITIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.region ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleDetect = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    detect();
  }, [detect]);

  const isLoading = status === "loading";
  const isDenied  = status === "denied" || status === "error";

  return (
    <div ref={ref} className={clsx("relative inline-flex items-center gap-1.5 flex-wrap", className)}>
      {/* City trigger */}
      <button
        onClick={() => setOpen(p => !p)}
        className={clsx(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-all duration-150 cursor-pointer",
          open
            ? "bg-primary/20 border-primary/50 text-white"
            : "glass border-border text-muted hover:text-white hover:border-border-bright/40"
        )}
      >
        <MapPin size={12} className={open ? "text-primary" : "text-muted"} />
        <span className="max-w-[100px] truncate">{value || "Выбери город"}</span>
        <ChevronDown size={11} className={clsx("transition-transform duration-200", open && "rotate-180")} />
      </button>

      {/* GPS button */}
      <button
        onClick={handleDetect}
        disabled={isLoading}
        title={isLoading ? "Определяю..." : isDenied ? "Нет доступа" : "Рядом со мной"}
        className={clsx(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-all duration-150 cursor-pointer",
          isLoading && "opacity-70 cursor-not-allowed",
          isDenied
            ? "border-danger/40 text-danger bg-danger/10"
            : "glass border-border text-muted hover:text-accent hover:border-accent/40"
        )}
      >
        {isLoading ? <Loader2 size={12} className="animate-spin text-accent" />
          : isDenied ? <AlertCircle size={12} />
          : <Navigation size={12} />}
        <span className="hidden xs:block sm:block">
          {isLoading ? "Определяю..." : isDenied ? "Нет доступа" : "Рядом со мной"}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className={clsx(
          "absolute top-full mt-2 z-[200] rounded-xl glass border border-border shadow-card overflow-hidden",
          /* on mobile: full screen width, anchored left; on desktop: 272px */
          "left-0 w-[calc(100vw-2rem)] sm:w-72 max-w-sm",
        )}>
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
            <Search size={13} className="text-muted shrink-0" />
            <input
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск города..."
              className="flex-1 bg-transparent text-xs text-white placeholder:text-dim outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-dim hover:text-white text-xs cursor-pointer">✕</button>
            )}
          </div>

          {/* GPS inside dropdown */}
          <button
            onClick={handleDetect}
            disabled={isLoading}
            className={clsx(
              "w-full flex items-center gap-2.5 px-4 py-2.5 text-xs border-b border-border transition-colors cursor-pointer",
              isDenied ? "text-danger/80 bg-danger/5" : "text-accent hover:bg-accent/5"
            )}
          >
            {isLoading ? <Loader2 size={13} className="animate-spin shrink-0" />
              : isDenied ? <AlertCircle size={13} className="shrink-0" />
              : <Navigation size={13} className="shrink-0" />}
            <span className="font-medium">
              {isLoading ? "Определяю местоположение..." : isDenied ? "Разреши геолокацию" : "Определить автоматически (GPS)"}
            </span>
          </button>

          {/* List */}
          <div className="max-h-56 overflow-y-auto overscroll-contain">
            {filtered.length === 0
              ? <p className="px-4 py-3 text-xs text-dim text-center">Не найдено</p>
              : filtered.map(c => (
                <button
                  key={c.name}
                  onClick={() => { onChange(c.name); setOpen(false); }}
                  className={clsx(
                    "w-full flex items-center justify-between gap-2 px-4 py-2 text-xs transition-colors cursor-pointer text-left",
                    c.name === value
                      ? "bg-primary/15 text-primary"
                      : "text-muted hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{c.name}</span>
                    {c.region && <span className="text-[10px] text-dim">{c.region}</span>}
                  </div>
                  {c.name === value && <Check size={12} className="shrink-0" />}
                </button>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}
