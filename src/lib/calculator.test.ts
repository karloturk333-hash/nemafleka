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
const carpet: QuoteItem = { id: 'carpet', name: 'Tepih', sizeLabel: 'do 10 m²', price: 70 };

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
  it('is free within the radius and €0.5/km beyond it', () => {
    expect(getFuelCharge(0)).toBe(0);
    expect(getFuelCharge(20)).toBe(0);
    expect(getFuelCharge(30)).toBe(5); // (30-20)*0.5
    expect(getFuelCharge(45)).toBe(13); // (45-20)*0.5 = 12.5 -> 13
    expect(getFuelCharge(null)).toBe(0);
  });
});

describe('computeQuote', () => {
  it('couch(45) + carpet(70) @30km → subtotal 115, -10%, +5 fuel = 109', () => {
    const q = computeQuote([couch, carpet], 30);
    expect(q.subtotal).toBe(115);
    expect(q.count).toBe(2);
    expect(q.discountPct).toBe(10);
    expect(q.discountedSubtotal).toBe(104); // round(115*0.9)=104
    expect(q.discountAmount).toBe(11);
    expect(q.fuel).toBe(5);
    expect(q.total).toBe(109);
  });

  it('empty selection totals 0', () => {
    const q = computeQuote([]);
    expect(q.subtotal).toBe(0);
    expect(q.total).toBe(0);
  });

  it('single service gets no discount and (within radius) no fuel', () => {
    const q = computeQuote([couch], 10);
    expect(q.discountPct).toBe(0);
    expect(q.fuel).toBe(0);
    expect(q.total).toBe(45);
  });
});

describe('buildWhatsAppPayload', () => {
  it('targets the WhatsApp number and includes line items, discount, and total', () => {
    const q = computeQuote([couch, carpet], 30);
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
