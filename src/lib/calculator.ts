// Pure pricing engine, no DOM, fully unit-testable. The UI island wraps this.
import { MIN_ORDER, VRBOVEC, resolveTravel, type TravelQuote } from '../data/pricing';
import { ADDON_ONLY_IDS, type ServiceId } from '../data/services';
import { waLink } from './links';

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
  travel: number;
  minOrder: number;
  minApplied: boolean;
  total: number;
  travelNote: string;
}

export function hasStandaloneService(items: QuoteItem[]): boolean {
  return items.some((i) => !ADDON_ONLY_IDS.has(i.id as ServiceId));
}

export function computeQuote(
  items: QuoteItem[],
  travel: TravelQuote | null = null,
): Quote {
  const subtotal = items.reduce((sum, i) => sum + i.price, 0);
  const count = items.length;
  const fee = travel?.fee ?? 0;
  const minOrder = travel?.minOrder ?? MIN_ORDER;
  const raw = subtotal + fee;
  const minApplied = count > 0 && raw < minOrder;
  const total = count > 0 ? Math.max(raw, minOrder) : 0;
  return {
    items,
    subtotal,
    count,
    travel: fee,
    minOrder,
    minApplied,
    total,
    travelNote: travel?.note ?? '',
  };
}

/** Pre-filled WhatsApp message from calculator state (diacritics via encodeURIComponent). */
export function buildWhatsAppPayload(quote: Quote, location?: string): string {
  const lines: Array<string | null> = [
    'Bok! Preko kalkulatora sam dobio procjenu:',
    ...quote.items.map((s) => `• ${s.sizeLabel} — ${s.price} €`),
    `Ukupno: ~${quote.total} €`,
    location ? `Lokacija: ${location}` : null,
    'Možemo li dogovoriti termin?',
  ];
  return waLink(lines.filter(Boolean).join('\n'));
}

function haversineKm(
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

export { resolveTravel };
export type { TravelQuote };
