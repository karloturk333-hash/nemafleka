# /goal — optimization loop ledger

State for the autonomous `/goal` loop. The loop reads `dry_rounds` first and stops at 2.
This file is loop bookkeeping for the dev branch only — delete it before merging to `main`.

```yaml
dry_rounds: 0
rounds_total: 1
branch: claude/repo-optimization-e15l37
```

## Round log

### Round 1 — PRODUCTIVE (dry_rounds 0 → 0)
Dimensions audited: Performance, Accessibility, SEO, Code-quality/bundle.
40 candidates found → 8 survived adversarial verify → 7 applied (1 was a no-op).

**Applied:**
- `7cdce1b` a11y — focus-visible outline on `.ba-tab` before/after tabs (`components.css`).
- `8308a4d` seo — BreadcrumbList JSON-LD on `/podrucje-pokrivenosti` (`jsonld.ts`, page).
- `35b0dd7` refactor — removed dead exports `getService`, `telLink`, `formatEur`,
  `REDIRECT_TOWNS`; made `haversineKm` file-private (`calculator.ts`, `services.ts`,
  `links.ts`, `format.ts`, `towns.ts`).

**Rejected by skeptics (do not retry — reasons logged):**
- perf: `defer` on island scripts (no-op — Astro emits ES modules, already deferred).
- perf: drop "unused" Manrope/Grotesk 600 + Space Mono 700 weights (they ARE used).
- perf: `contain: layout` / `dns-prefetch` Nominatim / inline Leaflet CSS (placebos).
- perf: repurpose split image as OG / delete hero-slide-1 (it's the OG image) — needs owner.
- seo: footer link to coverage page (already present — no change needed).

**Verify gate:** `npm run build` ✓ · `npm test` 9/9 ✓ · responsive-check 0 overflow ✓ ·
Playwright E2E + axe 7/7 ✓ (incl. no-aggregateRating guard).

**Note for future rounds:** the rejected hero-slide / OG-image cleanup is the one carryover
worth an owner decision; everything else this round is closed.
