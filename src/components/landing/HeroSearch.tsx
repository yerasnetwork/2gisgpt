"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { City } from "@/lib/types";
import { DEFAULT_CITY } from "@/lib/cities";
import { CitySelector } from "@/components/ui/CitySelector";

const EXAMPLE_QUERIES = [
  "самый дешевый донер в городе",
  "топ кофейни с хорошими отзывами рядом",
  "лучший барбершоп сейчас открыт",
  "уютное кафе с wifi для работы",
  "казахская кухня с рейтингом выше 4.5",
];

const TYPEWRITER_SPEED = 55;
const PAUSE_MS         = 2000;

export function HeroSearch() {
  const router = useRouter();
  const [city, setCity]               = useState<City>(DEFAULT_CITY);
  const [input, setInput]             = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [queueIdx, setQueueIdx]       = useState(0);
  const [focused, setFocused]         = useState(false);

  /* typewriter for placeholder */
  useEffect(() => {
    if (focused) return;
    const query = EXAMPLE_QUERIES[queueIdx];
    let i = 0;

    const type = () => {
      if (i <= query.length) {
        setPlaceholder(query.slice(0, i));
        i++;
        timerId = window.setTimeout(type, TYPEWRITER_SPEED);
      } else {
        timerId = window.setTimeout(() => {
          setPlaceholder("");
          setQueueIdx((p) => (p + 1) % EXAMPLE_QUERIES.length);
        }, PAUSE_MS);
      }
    };

    let timerId = window.setTimeout(type, 300);
    return () => clearTimeout(timerId);
  }, [queueIdx, focused]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = input.trim();
      if (!q) return;
      router.push(`/search?q=${encodeURIComponent(q)}&city=${encodeURIComponent(city)}`);
    },
    [input, city, router]
  );

  const handleExampleClick = (q: string) => {
    setInput(q);
    router.push(`/search?q=${encodeURIComponent(q)}&city=${encodeURIComponent(city)}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* City selector with built-in geolocation */}
      <CitySelector value={city} onChange={setCity} className="justify-center" />

      {/* Search bar */}
      <form onSubmit={handleSubmit}>
        <div
          className={clsx(
            "relative flex items-center rounded-xl border transition-all duration-300",
            focused
              ? "border-primary/60 shadow-glow-blue bg-card"
              : "border-border bg-card/60"
          )}
        >
          <Search
            size={18}
            className={clsx(
              "ml-4 shrink-0 transition-colors duration-200",
              focused ? "text-primary" : "text-muted"
            )}
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={focused ? "Спроси что угодно..." : placeholder || "Поиск заведений..."}
            className="flex-1 bg-transparent px-3 py-4 text-sm text-white placeholder:text-muted outline-none"
          />
          {/* typing cursor */}
          {!focused && !input && (
            <span className="cursor-blink text-primary/60 mr-1 text-lg leading-none select-none">|</span>
          )}
          <button
            type="submit"
            disabled={!input.trim()}
            className={clsx(
              "mr-2 shrink-0 flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium",
              "transition-all duration-150 cursor-pointer",
              input.trim()
                ? "bg-primary text-white hover:brightness-110 shadow-glow-blue"
                : "bg-white/5 text-dim cursor-not-allowed"
            )}
          >
            <span className="hidden sm:block">Найти</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </form>

      {/* Example chips */}
      <div className="flex flex-wrap gap-2 justify-center" id="examples">
        {EXAMPLE_QUERIES.slice(0, 4).map((q) => (
          <button
            key={q}
            onClick={() => handleExampleClick(q)}
            className="text-xs px-3 py-1.5 rounded-full glass border-border/60 text-muted hover:text-white hover:border-primary/40 transition-all duration-150 cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
