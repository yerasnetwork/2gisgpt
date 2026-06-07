"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, X } from "lucide-react";
import { clsx } from "clsx";
import { City } from "@/lib/types";
import { DEFAULT_CITY } from "@/lib/cities";
import { CitySelector } from "@/components/ui/CitySelector";

interface SearchBarProps {
  initialQuery?: string;
  initialCity?: City;
  loading?: boolean;
}

const SUGGESTIONS = [
  "самый дешевый донер в городе",
  "кофейня с wifi рядом со мной",
  "казахская кухня с рейтингом выше 4.5",
  "барбершоп открыт сейчас",
  "уютный ресторан для свидания",
  "доставка суши до 30 минут",
  "топ пиццерии по рейтингу",
  "суши рядом с хорошими отзывами",
];

export function SearchBar({ initialQuery = "", initialCity = DEFAULT_CITY, loading }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery]     = useState(initialQuery);
  const [city, setCity]       = useState<City>(initialCity);
  const [focused, setFocused] = useState(false);
  const [showSug, setShowSug] = useState(false);

  useEffect(() => { setQuery(initialQuery); }, [initialQuery]);
  useEffect(() => { setCity(initialCity); },  [initialCity]);

  const filtered = SUGGESTIONS.filter(
    (s) => s.includes(query.toLowerCase()) && s !== query.toLowerCase()
  );

  const submit = (q: string) => {
    if (!q.trim()) return;
    setShowSug(false);
    router.push(`/search?q=${encodeURIComponent(q.trim())}&city=${encodeURIComponent(city)}`);
  };

  return (
    <div className="w-full space-y-2">
      {/* City selector with built-in geolocation */}
      <CitySelector value={city} onChange={setCity} />

      <div className="relative">
        <div
          className={clsx(
            "flex items-center rounded-xl border transition-all duration-200",
            focused
              ? "border-primary/60 shadow-glow-blue bg-card"
              : "border-border bg-card/80"
          )}
        >
          {loading ? (
            <span className="ml-4 size-4 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
          ) : (
            <Search
              size={16}
              className={clsx("ml-4 shrink-0 transition-colors", focused ? "text-primary" : "text-muted")}
            />
          )}

          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowSug(true); }}
            onFocus={() => { setFocused(true); setShowSug(true); }}
            onBlur={() => { setFocused(false); setTimeout(() => setShowSug(false), 150); }}
            onKeyDown={(e) => e.key === "Enter" && submit(query)}
            placeholder="Введи новый запрос..."
            className="flex-1 bg-transparent px-3 py-3.5 text-sm text-white placeholder:text-muted outline-none"
          />

          {query && (
            <button
              onClick={() => setQuery("")}
              className="mr-1 p-1.5 rounded-lg text-muted hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          )}

          <button
            onClick={() => submit(query)}
            disabled={!query.trim() || loading}
            className={clsx(
              "mr-2 shrink-0 flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer",
              query.trim() && !loading
                ? "bg-primary text-white hover:brightness-110"
                : "bg-white/5 text-dim cursor-not-allowed"
            )}
          >
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Suggestions dropdown */}
        {showSug && query.length > 1 && filtered.length > 0 && (
          <div className="absolute top-full mt-1 inset-x-0 z-50 rounded-xl glass border border-border overflow-hidden shadow-card">
            {filtered.slice(0, 5).map((s) => (
              <button
                key={s}
                onMouseDown={() => submit(s)}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-muted hover:bg-white/5 hover:text-white text-left transition-colors cursor-pointer"
              >
                <Search size={13} className="shrink-0" />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
