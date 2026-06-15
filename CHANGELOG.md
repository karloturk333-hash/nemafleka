# Changelog

## 2.0.0 — Redizajn "Deep clean" (grana `redesign/astro`)

Potpuni redizajn + refactor. **Još nije na `main` — preview za pregled.**

### Migracija
- Ručno pisani statički HTML/CSS/JS (1 home + 5 gradskih stranica) → **Astro** (statički, Vercel).
- Jedan izvor istine (`src/data`) za usluge/cijene/mjesta → nema više neslaganja cijena.
- 5 tankih gradskih stranica → jedan `/podrucje-pokrivenosti` hub; stari URL-ovi 301-redirect.

### Sadržaj / povjerenje (pošteno)
- Uklonjeno: lažni `aggregateRating` (4.9/500), "500+ klijenata", "98%", izmišljene recenzije,
  mrtav Google link. Razlog: Google manual-action + EU/HR pravni rizik.
- Dodano: pravi before/after kao dokaz, garancija, "Tko smo" (founder), "novi smo" framing.
- Impressum: pošten disclaimer (obrt u postupku registracije), bez izmišljenog OIB-a.
- Jedan email (bila su dva), dosljedna lokalna priča (bez Zagreb-splita).

### Dizajn / UX
- "Deep clean" sustav: navy ink + lime, Space Grotesk / Manrope / Space Mono, pristupačni tokeni.
- Popravljen pokvareni trust bar, CSS/HTML neslaganja, preopterećenje CTA-ova.
- Sticky mobilni CTA (Pozovi · WhatsApp) umjesto sudarajućih plutajućih gumba.

### Pristupačnost (WCAG 2.1 AA)
- Pravi radio/checkbox inputi (umjesto lažnih ARIA), fokus-trap mobilni meni s `inert`,
  `aria-valuetext` na slideru, AA kontrast (`--lime-text`), native `<details>` FAQ.
- Lighthouse a11y: 81/84 → **99**.

### Performanse / SEO
- Astro `<Image>` responsive hero (mobilni LCP 4.8s → 2.9s), inline CSS, lazy + rekomprimirani
  slider, manje font težina. Mrtvih ~5MB PNG-ova izbačeno.
- `vercel.json`: redirecti + immutable cache + security headeri. Sitemap + robots.
- Lighthouse (localhost): mobile 93/99/100/100 · desktop 98/99/100/100.

### Testovi
- 7 vitest (kalkulator engine, TDD) + 6 Playwright/axe (kalkulator→WhatsApp, mobilni meni,
  slider tipkovnica, nema aggregateRating, axe 0 serious/critical). Svi zeleni.

### Checklist za objavu (deploy)
1. Vlasnik popunjava `[POTVRDITI]` (cijene, impressum/OIB, radijus, founder, email/telefoni).
2. Pokrenuti `npm test` i `npm run test:e2e` — sve zeleno.
3. Lighthouse na Vercel preview-u (≥90) — potrebno isključiti Deployment Protection ili dati bypass token.
4. Provjeriti redirecte starih URL-ova (301 → /podrucje-pokrivenosti).
5. Odluka o mergeu `redesign/astro` → `main`.

### Round 2 (popravci nakon pregleda)
- Popravljen "Vizualni dokaz": before/after widget se urušio na 0px (margin-inline:auto na grid
  itemu). Sada ima sliku i klizač na mobitelu i desktopu.
- Popravljen mobilni izbornik: panel je bio proziran/urušen (nav `backdrop-filter` ga je činio
  containing blockom za fixed elemente). Sada je pun, neproziran. **Dodan Playwright test koji to čuva.**
- Kalkulator: na "Dalje/Natrag" scrolla se u vidokrug (mobilni UX).
- Donji CTA bar zamijenjen jednim plutajućim WhatsApp gumbom (dolje desno), maknut "Pozovi".
- "Kako radimo" prepisan jasnije (manje "1-2-3-4", jasni brojevi, jednostavan jezik, telefon CTA).
- Hamburger pomaknut desno; hero kvačice posložene (ne više stisnute).
- Kontakt ikone u završnom CTA-u centrirane.
- Maknute AI-crtice (— – −) iz cijelog teksta.
- Dodan pravi logo (lime grafit na navy mrlji) u nav i footer.
- Cijene potvrđene = kalkulatorski (viši) set.

### Preostali TODO
- [ ] Lighthouse na živom Vercel preview-u: trenutno blokira Deployment Protection (401) —
      isključiti zaštitu ili dati bypass token pa izmjeriti pravi mobilni perf.
- [ ] Cross-browser provjera (WebKit/Firefox) — zasad verificiran Chromium.
- [ ] `[POTVRDITI]`: impressum/OIB status, founder foto+priča, točan radijus, potvrda email/telefona.
