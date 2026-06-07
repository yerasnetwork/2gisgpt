export type City = string; // любой город Казахстана

export interface Business {
  id: string;
  name: string;
  category: string;
  address: string;
  city: City;
  rating: number;       // 0–5
  reviewCount: number;
  distance?: number;    // metres
  priceLevel: 1 | 2 | 3; // ₸ | ₸₸ | ₸₸₸
  isOpen: boolean;
  openUntil?: string;   // e.g. "23:00"
  phone?: string;
  photos?: string[];
  tags?: string[];
  aiScore?: number;     // 0–100, AI relevance score
  aiReason?: string;    // AI explanation why ranked here
  twogisUrl?: string;   // link to real 2GIS page with reviews
}

export interface SearchResult {
  query: string;
  city: City;
  aiSummary: string;
  businesses: Business[];
  processingMs?: number;
}

export interface SearchRequest {
  query: string;
  city: City;
}
