# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing landing site for **Nema Fleka**, a deep-cleaning service (couches, carpets, mattresses, cars) around Vrbovec, Croatia. Live at **nemafleka.com** (Astro static build, deployed on Vercel with the real domain attached). Copy is in Croatian.

## Commands

```bash
npm run dev        # local dev server
npm run build      # static build to dist/
npm run preview    # preview the build
npm test           # vitest unit tests (calculator engine)
npm run test:watch # vitest in watch mode
npm run test:e2e   # playwright E2E + axe-core a11y (needs a server)
npm run typecheck  # astro check
```

Run a single unit test: `npx vitest run src/lib/calculator.test.ts` (or `-t "<name>"` to filter).

E2E runs against a static server of `dist/` on `http://localhost:8088` by default; override with `BASE_URL`. Build first, then serve `dist/`.

## Architecture

Astro, `output: 'static'`, zero JS except interactive **islands**. `inlineStylesheets: 'always'` — CSS is inlined into the HTML at build, so there is no external stylesheet request.

### Single source of truth for data (`src/data/`)
Pricing, sizes, discounts, services, towns, business identity, and FAQ live **only** here. The calculator, the price list (cjenik), the coverage map, and the JSON-LD all read the same data, so numbers cannot drift apart (a real past bug: home 45€ vs city 40€). Change a price in `src/data/` and it changes everywhere.

- `services.ts` / `pricing.ts` — prices, sizes, discount tiers, travel model. The travel/minimum-order model: local zone (`FREE_KM` around Vrbovec) is free, beyond it the surcharge is per-km (`PER_KM_FEE`), with a `MIN_ORDER` floor.
- `towns.ts` — coverage towns + coordinates.
- `business.ts` — identity/impressum. The obrt is not yet registered → impressum carries an honest "u postupku registracije" disclaimer and **no invented OIB**.

### Logic (`src/lib/`)
- `calculator.ts` — pure pricing engine, unit-tested in `calculator.test.ts`. Keep it pure (no DOM); the island wires it to UI.
- `jsonld.ts`, `format.ts`, `links.ts` (e.g. `waLink()` for WhatsApp).

### Components (`src/components/`)
- `primitives/` — Button, Eyebrow, SectionHeader, Icon.
- `sections/` — static page sections (Hero, Services, Timeline, About, FaqList, ContactCTA, Nav, Footer, …).
- `islands/` — the only client-side JS: `CalculatorWizard`, `BeforeAfter` (slider), `Coverage` (Leaflet map), `MobileNav`.

`pages/` has `index.astro` and `podrucje-pokrivenosti.astro`, composed in `layouts/BaseLayout.astro` (head, self-hosted fonts, JSON-LD).

### Styling (`src/styles/`)
- `tokens.css` — design tokens (the design system). Palette is **ink (navy) + lime accent**; lime is energy-on-dark / CTA-fill-with-ink only. Token comments encode the AA-contrast rules — respect them when touching colors. Page bg is `--paper` (warm off-white); light cards are pure `#fff`; dark sections use `--ink-800`.
- `global.css`, `components.css` — most light cards/surfaces are hardcoded `#fff` rather than a token.

## Conventions that bite

- **No fake trust signals.** No invented reviews, ratings, or client counters (Google + EU/HR legal risk). Trust is built with real before/after photos, the guarantee, the local story, and the "answer in 30 min" promise.
- **Accessibility is a gate.** Color tokens are chosen for AA contrast (see comments in `tokens.css`); E2E includes axe-core. Don't introduce colors/contrasts that fail.
- Items needing the owner's confirmation are marked `[POTVRDITI]` in code (impressum details, founder photo/story, phone/email).
- Legacy root files (`nemafleka-v5.*`, `dubinsko-ciscenje-*.html`) are the pre-Astro hand-written site. `vercel.json` 301-redirects the old `/dubinsko-ciscenje-*` URLs to `/podrucje-pokrivenosti`.

## Deploy
Vercel auto-detects Astro. `vercel.json` holds the 301 redirects, immutable cache for `/_astro` and `/images`, and security headers.
