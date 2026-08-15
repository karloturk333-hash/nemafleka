import { describe, it, expect } from 'vitest';
import {
  computeQuote,
  buildWhatsAppPayload,
  distanceFromBase,
  hasStandaloneService,
  type QuoteItem,
} from './calculator';
import { resolveTravel, MIN_ORDER } from '../data/pricing';
import { waLink, WA_MSG } from './links';

const kutna: QuoteItem = { id: 'couch', name: 'Kauč', sizeLabel: 'Kutna garnitura', price: 90 };
const tepih: QuoteItem = { id: 'carpet', name: 'Tepih', sizeLabel: 'Tepih do 6 m²', price: 60 };
const stolica: QuoteItem = { id: 'chair', name: 'Stolica', sizeLabel: '1 stolica', price: 15 };
const tabure: QuoteItem = { id: 'ottoman', name: 'Tabure', sizeLabel: '1 tabure', price: 15 };
const fotelja: QuoteItem = { id: 'armchair', name: 'Fotelja', sizeLabel: '1 fotelja', price: 30 };

describe('computeQuote', () => {
  it('kutna 90 + tepih 60 totals 150 with no percentage discount', () => {
    const q = computeQuote([kutna, tepih]);
    expect(q.subtotal).toBe(150);
    expect(q.total).toBe(150);
    expect(q.minApplied).toBe(false);
    expect(q.travel).toBe(0);
  });

  it('empty selection totals 0', () => {
    const q = computeQuote([]);
    expect(q.subtotal).toBe(0);
    expect(q.total).toBe(0);
    expect(q.minApplied).toBe(false);
  });

  it('applies the 60 € minimum order on small selections', () => {
    const q = computeQuote([fotelja]);
    expect(q.subtotal).toBe(30);
    expect(q.minApplied).toBe(true);
    expect(q.total).toBe(MIN_ORDER);
  });

  it('adds Bjelovar travel on top of the subtotal', () => {
    const q = computeQuote([kutna], resolveTravel('Bjelovar'));
    expect(q.travel).toBe(15);
    expect(q.total).toBe(105);
  });

  it('uses the 100 € minimum for Sesvete', () => {
    const q = computeQuote([fotelja], resolveTravel('Sesvete'));
    expect(q.travel).toBe(20);
    expect(q.minOrder).toBe(100);
    expect(q.total).toBe(100);
  });
});

describe('hasStandaloneService', () => {
  it('rejects chair or ottoman as the only service', () => {
    expect(hasStandaloneService([stolica])).toBe(false);
    expect(hasStandaloneService([tabure, stolica])).toBe(false);
    expect(hasStandaloneService([stolica, kutna])).toBe(true);
    expect(hasStandaloneService([kutna])).toBe(true);
  });
});

describe('resolveTravel', () => {
  it('treats the local corridor as free', () => {
    expect(resolveTravel('Križevci').fee).toBe(0);
    expect(resolveTravel('Dugo Selo').fee).toBe(0);
    expect(resolveTravel('Čazma').known).toBe(true);
  });

  it('charges +15 € for Bjelovar and Koprivnica', () => {
    expect(resolveTravel('Bjelovar').fee).toBe(15);
    expect(resolveTravel('Koprivnica').fee).toBe(15);
  });

  it('does not treat općina Dubrava near Vrbovec as Zagreb Dubrava', () => {
    expect(resolveTravel('Dubrava').fee).toBe(0);
    expect(resolveTravel('Dubrava').known).toBe(false);
    expect(resolveTravel('Donja Dubrava').fee).toBe(20);
  });
});

describe('buildWhatsAppPayload', () => {
  it('uses the calculator message format with items, total, location and newlines', () => {
    const q = computeQuote([kutna, tepih]);
    const url = buildWhatsAppPayload(q, 'Križevci');
    expect(url.startsWith('https://wa.me/385953765343?text=')).toBe(true);
    const body = decodeURIComponent(url.split('text=')[1]!);
    expect(body).toBe(
      [
        'Bok! Preko kalkulatora sam dobio procjenu:',
        '• Kutna garnitura — 90 €',
        '• Tepih do 6 m² — 60 €',
        'Ukupno: ~150 €',
        'Lokacija: Križevci',
        'Možemo li dogovoriti termin?',
      ].join('\n'),
    );
    expect(body).toContain('procjenu');
    expect(body).toContain('Možemo');
    expect(body).toContain('\n');
    expect(body).not.toContain('<br');
  });

  it('omits location when it is empty', () => {
    const q = computeQuote([kutna]);
    const body = decodeURIComponent(buildWhatsAppPayload(q).split('text=')[1]!);
    expect(body).not.toContain('Lokacija:');
  });
});

describe('waLink', () => {
  it('keeps Croatian diacritics after encodeURIComponent', () => {
    const url = waLink(WA_MSG.hero);
    const body = decodeURIComponent(url.split('text=')[1]!);
    expect(body).toBe('Bok! Zanima me dubinsko čišćenje.');
    expect(url).toContain('%C4%8D'); // č
  });

  it('uses distinct copy per source', () => {
    expect(WA_MSG.hero).not.toBe(WA_MSG.sticky);
    expect(WA_MSG.faq).not.toBe(WA_MSG.car);
    expect(WA_MSG.city('Križevci')).toContain('Križevci');
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
