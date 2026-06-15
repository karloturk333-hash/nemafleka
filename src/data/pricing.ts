// Calculator constants, ONE place. Drives the engine, the coverage copy, and the JSON-LD.
// Travel + minimum-order model from Karlo's market research (cjenik, 2026-06-15):
// local zone is free; nearby towns outside it pay a flat surcharge; a minimum order applies.
export const VRBOVEC = { lat: 45.8833, lng: 16.4167 } as const;

export const FREE_KM = 25; // besplatan dolazak u lokalnoj zoni oko Vrbovca
export const TRAVEL_FEE = 5; // fiksni putni dodatak izvan lokalne zone (EUR)
export const MIN_ORDER = 40; // minimalna narudžba po dolasku (EUR)

// Multi-service launch discount, applied to the subtotal (most generous tier first).
export const DISCOUNT_TIERS = [
  { minServices: 5, pct: 20 },
  { minServices: 3, pct: 15 },
  { minServices: 2, pct: 10 },
] as const;
