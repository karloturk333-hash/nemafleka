import { describe, it, expect } from 'vitest';
import {
  getDiscount,
  getFuelCharge,
  computeQuote,
  buildWhatsAppPayload,
  distanceFromBase,
  type QuoteItem,
} from './calculator';

const couch: QuoteItem = { id: 'couch', name: 'Kauč', sizeLabel: '2-sjed', price: 45 };
const carpet: QuoteItem = { id: 'carpet', name: 'Tepih', sizeLabel: 'do 10 m²', price: 65 };

describe('getDiscount', () => {
  it('applies the right tier at each boundary', () => {
    expect(getDiscount(0)).toBe(0);
    expect(getDiscount(1)).toBe(0);
    expect(getDiscount(2)).toBe(10);
    expect(getDiscount(3)).toBe(15);
    expect(getDiscount(4)).toBe(15);
    expect(getDiscount(5)).toBe(20);
    expect(getDiscount(8)).toBe(20);
  });
});

describe('getFuelCharge', () => {
  it('is free within the local zone and 0.50 €/km beyond it', () => {
    expect(getFuelCharge(null)).toBe(0);
    expect(getFuelCharge(20)).toBe(0);
    expect(getFuelCharge(25)).toBe(0); // FREE_KM boundary
    expect(getFuelCharge(45)).toBe(10); // (45-25)*0.5 = 10
    expect(getFuelCharge(60)).toBe(18); // round((60-25)*0.5)=round(17.5)=18
  });
});

describe('computeQuote', () => {
  it('couch(45) + carpet(65) @45km → subtotal 110, -10%, +10 fuel = 109', () => {
    const q = computeQuote([couch, carpet], 45);
    expect(q.subtotal).toBe(110);
    expect(q.count).toBe(2);
    expect(q.discountPct).toBe(10);
    expect(q.discountedSubtotal).toBe(99); // round(110*0.9)=99
    expect(q.discountAmount).toBe(11);
    expect(q.fuel).toBe(10); // (45-25)*0.5
    expect(q.total).toBe(109);
  });

  it('empty selection totals 0', () => {
    const q = computeQuote([]);
    expect(q.subtotal).toBe(0);
    expect(q.total).toBe(0);
    expect(q.minApplied).toBe(false);
  });

  it('applies the 50 € minimum order on small selections', () => {
    const q = computeQuote([{ id: 'chair', name: 'Stolica', sizeLabel: '2 kom', price: 14 }]);
    expect(q.subtotal).toBe(14);
    expect(q.minApplied).toBe(true);
    expect(q.total).toBe(50);
  });

  it('single service above the minimum gets no discount and (within radius) no fuel', () => {
    const trosjed: QuoteItem = { id: 'couch', name: 'Kauč', sizeLabel: 'Trosjed / kauč', price: 70 };
    const q = computeQuote([trosjed], 10);
    expect(q.discountPct).toBe(0);
    expect(q.fuel).toBe(0);
    expect(q.minApplied).toBe(false);
    expect(q.total).toBe(70);
  });

  it('multi-service discount with the new prices: couch(45)+carpet(65)+mattress(45) → -15%', () => {
    const mattress: QuoteItem = { id: 'mattress', name: 'Madrac', sizeLabel: 'Bračni (160+)', price: 45 };
    const q = computeQuote([couch, carpet, mattress]);
    expect(q.subtotal).toBe(155);
    expect(q.count).toBe(3);
    expect(q.discountPct).toBe(15);
    expect(q.discountedSubtotal).toBe(132); // round(155*0.85)=131.75→132
    expect(q.discountAmount).toBe(23);
    expect(q.minApplied).toBe(false);
    expect(q.total).toBe(132);
  });
});

describe('buildWhatsAppPayload', () => {
  it('targets the WhatsApp number and includes line items, discount, and total', () => {
    const q = computeQuote([couch, carpet], 45);
    const url = buildWhatsAppPayload(q);
    expect(url.startsWith('https://wa.me/385953765343?text=')).toBe(true);
    const body = decodeURIComponent(url.split('text=')[1]!);
    expect(body).toContain('Kauč');
    expect(body).toContain('Tepih');
    expect(body).toContain('Popust');
    expect(body).toContain('Ukupno');
    expect(body).toContain('109');
    // diacritics survive round-trip
    expect(body).toContain('čišćenje');
  });
});

describe('distanceFromBase', () => {
  it('returns ~0 at the base and a positive distance elsewhere', () => {
    expect(distanceFromBase(45.8833, 16.4167)).toBeLessThan(1);
    const d = distanceFromBase(45.8989, 16.8484); // Bjelovar
    expect(d).toBeGreaterThan(25);
    expect(d).toBeLessThan(45);
  });
});
