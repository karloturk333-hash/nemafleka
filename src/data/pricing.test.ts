import { describe, it, expect } from 'vitest';
import {
  resolveTravel,
  MIN_ORDER,
  MIN_ORDER_ZAGREB_EAST,
  SURCHARGE_BJEL_KOP,
  SURCHARGE_ZAGREB_EAST,
  TRAVEL_ZONES,
} from '../data/pricing';

describe('resolveTravel', () => {
  it('treats the local corridor as free', () => {
    expect(resolveTravel('Križevci').fee).toBe(0);
    expect(resolveTravel('Dugo Selo').fee).toBe(0);
    expect(resolveTravel('Čazma').known).toBe(true);
  });

  it('charges +15 € for Bjelovar and Koprivnica', () => {
    expect(resolveTravel('Bjelovar').fee).toBe(SURCHARGE_BJEL_KOP);
    expect(resolveTravel('Koprivnica').fee).toBe(SURCHARGE_BJEL_KOP);
    expect(resolveTravel('Bjelovar').minOrder).toBe(MIN_ORDER);
  });

  it('uses the Zagreb-east surcharge and 100 € minimum for Sesvete', () => {
    const t = resolveTravel('Sesvete');
    expect(t.fee).toBe(SURCHARGE_ZAGREB_EAST);
    expect(t.minOrder).toBe(MIN_ORDER_ZAGREB_EAST);
  });

  it('does not treat općina Dubrava near Vrbovec as Zagreb Dubrava', () => {
    expect(resolveTravel('Dubrava').fee).toBe(0);
    expect(resolveTravel('Dubrava').known).toBe(false);
    expect(resolveTravel('Donja Dubrava').fee).toBe(SURCHARGE_ZAGREB_EAST);
  });
});

describe('TRAVEL_ZONES', () => {
  it('lists free, +15, and Zagreb-east rows with the same numbers as resolveTravel', () => {
    expect(TRAVEL_ZONES).toHaveLength(3);
    expect(TRAVEL_ZONES[0]?.price).toBe('besplatno');
    expect(TRAVEL_ZONES[1]?.price).toBe(`+${SURCHARGE_BJEL_KOP} €`);
    expect(TRAVEL_ZONES[2]?.price).toBe(`+${SURCHARGE_ZAGREB_EAST} €`);
    expect(TRAVEL_ZONES[2]?.note).toContain(String(MIN_ORDER_ZAGREB_EAST));
  });
});
