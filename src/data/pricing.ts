// Calculator constants, ONE place. Drives the engine, the coverage copy, and the JSON-LD.
// Travel + minimum-order model from Karlo's market research (cjenik, 2026-06-15):
// local zone is free; beyond it the travel surcharge is per-km; a minimum order applies.
export const VRBOVEC = { lat: 45.8833, lng: 16.4167 } as const;

export const FREE_KM = 25; // besplatan dolazak u lokalnoj zoni oko Vrbovca
export const PER_KM_FEE = 0.5; // putni dodatak po kilometru izvan lokalne zone (EUR/km)
export const MIN_ORDER = 50; // minimalna narudžba po dolasku (EUR)

// Multi-service launch discount, applied to the subtotal (most generous tier first).
export const DISCOUNT_TIERS = [
  { minServices: 5, pct: 20 },
  { minServices: 3, pct: 15 },
  { minServices: 2, pct: 10 },
] as const;
