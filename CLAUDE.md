# LocalAI — CLAUDE.md

AI-powered local search for restaurants, cafes and businesses in Kazakhstan (Almaty, Astana, Atyrau and 30+ cities). Uses 2GIS Catalog API for business data and Claude API for intent extraction and streaming summaries.

## Stack
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** with custom CSS variables design system
- **Claude API** (`claude-haiku-4-5-20251001`) — intent extraction + streaming summary
- **2GIS Catalog API v3** — real business data

## Project structure
```
src/
  app/
    page.tsx              # Landing page
    search/page.tsx       # Search results (streaming SSE consumer)
    api/search/route.ts   # SSE streaming route — main backend
  components/
    landing/              # Hero, Features, HowItWorks, ExampleCards, CtaBanner, Footer, Navbar
    search/               # SearchBar, AIResponse (streaming), BusinessCard, ResultsList, EmptyState
    ui/                   # Badge, Button, CitySelector (with GPS), PriceLevel, StarRating, Spinner
  lib/
    types.ts              # Business, SearchResult, SearchRequest, City
    twogis.ts             # 2GIS API wrapper: searchPlaces(), parseSchedule(), estimatePrice()
    cities.ts             # KZ_CITIES[35], nearestCity(lat,lng) via Haversine
    mockData.ts           # Fallback mock data used when API keys are absent
  hooks/
    useGeolocation.ts     # Browser geolocation hook → nearestCity()
```

## Environment variables
```
ANTHROPIC_API_KEY=   # https://console.anthropic.com
TWOGIS_API_KEY=      # https://dev.2gis.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
Copy `.env.example` → `.env.local` and fill in the keys.  
Without keys the app shows mock data with a warning banner — it still runs and looks correct.

## SSE stream protocol (POST /api/search)
The route sends Server-Sent Events in this order:
```
data: {"type":"warn","message":"..."}        ← optional warning
data: {"type":"businesses","data":[...]}     ← Business[] array (rendered immediately)
data: {"type":"delta","text":"word "}        ← Claude summary, word by word
data: {"type":"done","ms":1234}              ← total processing time
```
The frontend consumes with `fetch` + `ReadableStream` reader.

## API pipeline (with keys)
1. **Claude Haiku** — extract `{ category, minRating, maxPrice, openNow, sortBy }` from query
2. **2GIS `/3.0/items`** — search with extracted params + city coordinates for radius filter
3. Sort by composite `aiScore = rating × log(reviews)`, send `businesses` event
4. **Claude Haiku streaming** — write 2–4 sentence summary in Russian, piped word-by-word

## Dev commands
```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

## Design system
All design tokens are CSS variables in `src/app/globals.css` (`:root`).  
Tailwind references them via `tailwind.config.ts` color/shadow extensions.

Key utilities: `.gradient-text`, `.glass`, `.glass-bright`, `.glow-blue`, `.card-hover`, `.skeleton`, `.cursor-blink`, `.bg-grid`, `.orb`

## Cities
`src/lib/cities.ts` has 35 KZ cities with lat/lng.  
`CitySelector` component (`src/components/ui/CitySelector.tsx`) has:
- Dropdown with search filter
- "Рядом со мной" button — uses `useGeolocation` hook → `nearestCity()` → sets city automatically

## Conventions
- All UI text is in Russian
- `Business.priceLevel` is `1|2|3` (₸ / ₸₸ / ₸₸₸), estimated from 2GIS rubric name
- `Business.aiScore` is `0–100`, calculated as `rating × log(reviewCount)`
- Mock data is in `src/lib/mockData.ts` and used as fallback in both the API route and the frontend
- The frontend never crashes — if API fails it shows mock data + a warning banner
