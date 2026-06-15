// Calculator constants, ONE place. Drives the engine, the coverage copy, and the JSON-LD.
// NOTE: values marked [POTVRDITI] await Karlo's confirmation (see .redesign/design/content-inputs.md).
export const VRBOVEC = { lat: 45.8833, lng: 16.4167 } as const;

export const FREE_KM = 20; // besplatan dolazak unutar ovog radijusa [POTVRDITI]
export const FUEL_RATE = 0.5; // €/km izvan FREE_KM [POTVRDITI]

// Applied to subtotal by number of distinct selected services (most generous first).
export const DISCOUNT_TIERS = [
  { minServices: 5, pct: 20 },
  { minServices: 3, pct: 15 },
  { minServices: 2, pct: 10 },
] as const;
