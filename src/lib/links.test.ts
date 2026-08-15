import { describe, it, expect } from 'vitest';
import { waLink, WA_MSG } from './links';

describe('waLink', () => {
  it('keeps Croatian diacritics after encodeURIComponent', () => {
    const url = waLink(WA_MSG.hero);
    const body = decodeURIComponent(url.split('text=')[1]!);
    expect(body).toBe('Bok! Zanima me dubinsko čišćenje.');
    expect(url).toContain('%C4%8D'); // č
  });

  it('uses distinct copy per source', () => {
    expect(WA_MSG.hero).not.toBe(WA_MSG.sticky);
    expect(WA_MSG.cjenik).not.toBe(WA_MSG.sticky);
    expect(WA_MSG.faq).not.toBe(WA_MSG.car);
    expect(WA_MSG.city('Križevci')).toContain('Križevci');
  });
});
