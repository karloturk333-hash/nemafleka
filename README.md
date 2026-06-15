# Nema Fleka — web stranica za dubinsko čišćenje

Landing stranica za uslužni biznis dubinskog čišćenja (kauči, tepisi, madraci, automobili) na
području Vrbovca i okolice (Dugo Selo → Koprivnica). Lokalni tim, poštene cijene, garancija.

🔗 **Live:** [nemafleka.com](https://nemafleka.com) · redizajn se uvodi preko Vercel preview-a.

---

## Tehnologije

- **Astro** — statički build (zero JS osim interaktivnih otoka), deploy na **Vercel**
- **TypeScript** — tipizirani podatkovni sloj + kalkulator engine
- **Vanilla islands** (bez frameworka) — kalkulator, before/after slider, Leaflet karta, mobilni meni
- **Vitest** (unit) + **Playwright / axe-core** (E2E + a11y)
- Samostalno hostani fontovi (Space Grotesk / Manrope / Space Mono)

> Napomena: prethodni README je tvrdio Next.js/React — projekt je zapravo bio ručno pisani
> statički HTML/CSS/JS. Ovaj redizajn migrira na Astro.

## Pokretanje

```bash
npm install
npm run dev        # lokalni dev server
npm run build      # statički build u dist/
npm run preview    # pregled builda
npm test           # vitest (kalkulator engine)
npm run test:e2e   # playwright (treba pokrenut server na :8088 ili BASE_URL)
```

## Struktura

```
src/
  data/        # JEDAN izvor istine: services, pricing, towns, business, faq
  lib/         # calculator.ts (čisti engine + testovi), jsonld.ts, format.ts, links.ts
  layouts/     # BaseLayout.astro (head, fontovi, JSON-LD)
  components/
    primitives/  # Button, Eyebrow, SectionHeader, Icon
    sections/    # Hero, TrustStrip, Services, PriceCard, Timeline, About, FaqList, ContactCTA, Nav, Footer
    islands/     # CalculatorWizard, BeforeAfter, Coverage (Leaflet), MobileNav
  pages/       # index.astro, podrucje-pokrivenosti.astro
  styles/      # tokens.css, global.css, components.css
public/images/ # WebP + favicons (mrtvi 5MB PNG-ovi izbačeni)
```

### Jedan izvor istine za cijene/mjesta
Cijene, veličine i popusti žive **samo** u `src/data/services.ts` + `pricing.ts`; mjesta u
`towns.ts`. Kalkulator, cjenik i karta čitaju isto → cijene se ne mogu razići (kao prije:
home 45€ vs grad 40€). Promijeniš cijenu na jednom mjestu i mijenja se svugdje.

## Politika poštenog sadržaja
Bez izmišljenih recenzija, ocjena ili brojača klijenata (Google + EU/HR pravni rizik).
Povjerenje grade: pravi before/after, garancija zadovoljstva, lokalna priča, odgovor u 30 min.
Obrt nije registriran → impressum nosi pošten disclaimer ("Obrt u postupku registracije"),
bez izmišljenog OIB-a.

## Deploy
Vercel (auto-detekcija Astro). `vercel.json`: 301 redirecti starih `/dubinsko-ciscenje-*`
URL-ova na `/podrucje-pokrivenosti`, immutable cache za `/_astro` i `/images`, security headeri.
Trenutno na grani **`redesign/astro`** (Vercel preview) — odluka o mergeu na `main` je naknadna.

## TODO prije objave (čeka potvrdu vlasnika — označeno `[POTVRDITI]` u kodu)
- [ ] Stvarni cjenik (uskladiti `src/data/services.ts`)
- [ ] Impressum: naziv obrta / OIB / status registracije (`src/data/business.ts`)
- [ ] Radijus besplatnog dolaska + €/km (`src/data/pricing.ts`, `towns.ts`)
- [ ] Founder foto + priča za "Tko smo"
- [ ] Potvrditi jedan email + brojeve telefona
