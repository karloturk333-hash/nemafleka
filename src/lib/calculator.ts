// Pure pricing engine, no DOM, fully unit-testable. The UI island wraps this.
import { DISCOUNT_TIERS, FREE_KM, TRAVEL_FEE, MIN_ORDER, VRBOVEC } from '../data/pricing';
import { WHATSAPP_PHONE } from '../data/business';

export interface QuoteItem {
  id: string;
  name: string;
  sizeLabel: string;
  price: number;
}

export interface Quote {
  items: QuoteItem[];
  subtotal: number;
  count: number;
  discountPct: number;
  discountAmount: number;
  discountedSubtotal: number;
  fuel: number;
  distanceKm: number | null;
  minApplied: boolean; // true when the minimum order bumped the total up
  total: number;
}

/** Multi-service discount % by number of distinct services. */
export function getDiscount(serviceCount: number): number {
  for (const tier of DISCOUNT_TIERS) {
    if (serviceCount >= tier.minServices) return tier.pct;
  }
  return 0;
}

/** Travel charge: free within the local zone (FREE_KM), else a flat surcharge. */
export function getFuelCharge(distanceKm: number | null): number {
  if (distanceKm == null || distanceKm <= FREE_KM) return 0;
  return TRAVEL_FEE;
}

/** Great-circle distance in km. */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function distanceFromBase(lat: number, lng: number): number {
  return haversineKm(VRBOVEC, { lat, lng });
}

/** Build a full quote from selected items + optional travel distance. */
export function computeQuote(
  items: QuoteItem[],
  distanceKm: number | null = null,
): Quote {
  const subtotal = items.reduce((sum, i) => sum + i.price, 0);
  const count = items.length;
  const discountPct = getDiscount(count);
  const discountedSubtotal = Math.round((subtotal * (100 - discountPct)) / 100);
  const discountAmount = subtotal - discountedSubtotal;
  const fuel = getFuelCharge(distanceKm);
  const raw = discountedSubtotal + fuel;
  const minApplied = count > 0 && raw < MIN_ORDER;
  const total = count > 0 ? Math.max(raw, MIN_ORDER) : 0;
  return {
    items, subtotal, count, discountPct, discountAmount,
    discountedSubtotal, fuel, distanceKm, minApplied, total,
  };
}

/** Pre-filled WhatsApp message (diacritics preserved via encodeURIComponent). */
export function buildWhatsAppPayload(quote: Quote, location?: string): string {
  const lines: string[] = ['Bok! Želim procjenu za dubinsko čišćenje:'];
  for (const item of quote.items) {
    lines.push(`• ${item.name} (${item.sizeLabel}): ${item.price} €`);
  }
  if (quote.discountPct > 0) {
    lines.push(
      `Popust (${quote.count} usluge, -${quote.discountPct}%): -${quote.discountAmount} €`,
    );
  }
  if (quote.fuel > 0) {
    lines.push(`Dolazak (${quote.distanceKm} km): +${quote.fuel} €`);
  }
  if (location) lines.push(`Lokacija: ${location}`);
  lines.push(`Ukupno: ~${quote.total} €`);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(lines.join('\n'))}`;
}
