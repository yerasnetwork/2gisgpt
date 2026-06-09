import { Business, City } from "./types";
import { KZ_CITIES, citySlug } from "./cities";

/* ── Types mirroring 2GIS API response ─────────────────────────── */
interface DGisPoint    { lat: number; lon: number; }
interface DGisHours    { from: string; to: string; }
interface DGisDayData  { working_hours?: DGisHours[]; is_24hours?: boolean; }
interface DGisReviews  { general_rating?: number; org_rating?: number; rating?: number;
                         general_review_count?: number; org_review_count?: number; count?: number; }
interface DGisRubric   { id: string; name: string; }
interface DGisContact  { type: string; value: string; }
interface DGisItem {
  id: string;
  name: string;
  address_name?: string;
  full_address_name?: string;
  point?: DGisPoint;
  reviews?: DGisReviews;
  schedule?: Record<string, DGisDayData>;
  rubrics?: DGisRubric[];
  contact_groups?: Array<{ contacts: DGisContact[] }>;
  distance_to?: number;
}

export interface SearchFilters {
  category?: string;
  keywords?: string[];
  minRating?: number | null;
  maxPrice?: 1 | 2 | 3 | null;
  openNow?: boolean;
  sortBy?: "rating" | "distance" | "price" | "popularity";
}

/* ── Schedule helpers ──────────────────────────────────────────── */
const DAY_KEYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function parseSchedule(
  schedule?: Record<string, DGisDayData>,
): { isOpen: boolean; openUntil?: string; openTomorrow?: boolean } {
  if (!schedule) return { isOpen: false };

  const now      = new Date();
  const curMin   = now.getHours() * 60 + now.getMinutes();
  const todayIdx = now.getDay();

  // 1) Check yesterday's midnight-crossing periods (e.g. 22:00–03:00 started yesterday)
  const yKey = DAY_KEYS[(todayIdx + 6) % 7];
  for (const p of schedule[yKey]?.working_hours ?? []) {
    const from = toMin(p.from);
    const to   = toMin(p.to);
    if (to < from && curMin < to) {
      return { isOpen: true, openUntil: p.to };
    }
  }

  // 2) Check today's periods
  const todayKey = DAY_KEYS[todayIdx];
  const todayDay = schedule[todayKey];
  if (!todayDay) return { isOpen: false };
  if (todayDay.is_24hours) return { isOpen: true, openUntil: "00:00" };

  for (const p of todayDay.working_hours ?? []) {
    const from = toMin(p.from);
    const to   = toMin(p.to);
    // For midnight-crossing periods (to < from), only the evening portion (curMin >= from)
    // belongs to today. The after-midnight portion is covered by step 1 (yesterday's check).
    const open = to > from ? curMin >= from && curMin < to : curMin >= from;
    if (open) return { isOpen: true, openUntil: p.to };
  }

  // 3) Find next opening later today
  for (const p of todayDay.working_hours ?? []) {
    const from = toMin(p.from);
    if (from > curMin) {
      return { isOpen: false, openUntil: p.from };
    }
  }

  // 4) Find first slot tomorrow
  const tmrKey = DAY_KEYS[(todayIdx + 1) % 7];
  const tmrDay = schedule[tmrKey];
  if (tmrDay?.is_24hours) return { isOpen: false, openUntil: "00:00", openTomorrow: true };
  const firstTmr = tmrDay?.working_hours?.[0];
  if (firstTmr) return { isOpen: false, openUntil: firstTmr.from, openTomorrow: true };

  return { isOpen: false };
}

/* ── Price estimation from rubric name ─────────────────────────── */
const CHEAP_KW = ["фастфуд","fast food","шаурм","донер","самса","бургер","хот-дог","пирожк","лаваш","хинкали","быстрое питание","быстрого питания","киоск","stolovaya","столовая"];
const PRICEY_KW = ["ресторан","стейк","суши","sushi","морепродукт","французск","итальянск","японск","лобстер","fine dining"];

function estimatePrice(rubrics?: DGisRubric[]): 1 | 2 | 3 {
  const cat = (rubrics?.[0]?.name ?? "").toLowerCase();
  if (CHEAP_KW.some(k => cat.includes(k))) return 1;
  if (PRICEY_KW.some(k => cat.includes(k))) return 3;
  return 2;
}

/* ── AI Score: composite of rating × log(reviews) ─────────────── */
function calcAiScore(rating: number, reviewCount: number): number {
  const score = (rating / 5) * 60 + Math.min(Math.log10(reviewCount + 1) / Math.log10(500), 1) * 40;
  return Math.round(Math.min(99, Math.max(30, score)));
}

/* ── Map raw 2GIS item → Business ─────────────────────────────── */
function mapItem(item: DGisItem, city: City): Business {
  const reviews     = item.reviews;
  const rating      = reviews?.general_rating ?? reviews?.org_rating ?? reviews?.rating ?? 4.2;
  const reviewCount = reviews?.general_review_count ?? reviews?.org_review_count ?? reviews?.count ?? 0;
  const { isOpen, openUntil, openTomorrow } = parseSchedule(item.schedule);
  const phone = item.contact_groups
    ?.flatMap(g => g.contacts)
    .find(c => c.type === "phone")?.value;

  return {
    id:          item.id,
    name:        item.name,
    category:    item.rubrics?.[0]?.name ?? "Заведение",
    address:     item.address_name ?? item.full_address_name ?? "",
    city,
    rating:      Math.round(rating * 10) / 10,
    reviewCount,
    distance:    item.distance_to ? Math.round(item.distance_to) : undefined,
    priceLevel:  estimatePrice(item.rubrics),
    isOpen,
    openUntil,
    openTomorrow,
    phone,
    tags:        item.rubrics?.slice(1).map(r => r.name) ?? [],
    aiScore:     calcAiScore(rating, reviewCount),
    twogisUrl:   `https://2gis.kz/${citySlug(city)}/firm/${item.id}`,
  };
}

/* ── Get city center coords for 2GIS point parameter ──────────── */
function cityPoint(city: City): string | undefined {
  const c = KZ_CITIES.find(k => k.name === city);
  return c ? `${c.lng},${c.lat}` : undefined;
}

/* ── Main search function ──────────────────────────────────────── */
export async function searchPlaces(
  query: string,
  city: City,
  filters: SearchFilters,
  apiKey: string,
  limit = 20,
): Promise<Business[]> {
  const url = new URL("https://catalog.api.2gis.com/3.0/items");

  const searchQ = filters.category
    ? `${filters.category} ${city}`
    : `${query} ${city}`;

  url.searchParams.set("q",          searchQ);
  url.searchParams.set("key",        apiKey);
  url.searchParams.set("fields",     "items.point,items.reviews,items.schedule,items.contact_groups,items.rubrics");
  url.searchParams.set("page_size",  String(Math.min(limit, 10)));
  url.searchParams.set("type",       "branch");
  const sortVal = filters.sortBy === "distance" ? "distance"
    : filters.sortBy === "rating" ? "rating"
    : "relevance";
  url.searchParams.set("sort", sortVal);

  const point = cityPoint(city);
  if (point) {
    url.searchParams.set("point",  point);
    url.searchParams.set("radius", "15000"); // 15 km city radius
  }

  if (filters.minRating) {
    url.searchParams.set("min_rating", String(filters.minRating));
  }

  const res = await fetch(url.toString(), { next: { revalidate: 0 } });
  if (!res.ok) throw new Error(`2GIS API ${res.status}: ${res.statusText}`);

  const data = await res.json() as { result?: { items?: DGisItem[] } };
  const items = data.result?.items ?? [];

  let businesses = items.map(item => mapItem(item, city));

  /* client-side filters the API can't do */
  if (filters.openNow)   businesses = businesses.filter(b => b.isOpen);
  if (filters.maxPrice)  businesses = businesses.filter(b => b.priceLevel <= filters.maxPrice!);

  /* sort by aiScore desc */
  businesses.sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0));

  return businesses.slice(0, limit);
}
