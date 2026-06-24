# /goal — optimization loop ledger

State for the autonomous `/goal` loop. The loop reads `dry_rounds` first and stops at 2.
This file is loop bookkeeping for the dev branch only — delete it before merging to `main`.

```yaml
dry_rounds: 0
rounds_total: 5
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

### Round 2 — PRODUCTIVE (dry_rounds 0 → 0)
Dimensions audited: Performance, Accessibility, SEO, Code-quality/bundle.
28 candidates → 10 survived adversarial verify → 6 applied (2 overruled by executor judgment).

**Applied:**
- `d3e0ad8` chore — removed orphaned hero-slide-2/3/4.webp (~134KB; only -1 is the OG image).
- `edd158c` a11y — `.calc-result` aria-live polite/atomic; `#size-opts` role=radiogroup +
  aria-labelledby (used radiogroup instead of fieldset/legend to avoid visual regression).
- `3ac9f5b` seo — og:image:width/height (800×800) + og/twitter image alt.
- `1bf9cef` refactor — deduped `.ba-widget` (redundant width override) + removed dead `.ba-stats`.

**Overruled by executor (skeptic kept, but I rejected — logged so they're not retried):**
- quality: bulk-replace hardcoded `#fff` with a new token — CONTRADICTS CLAUDE.md (which
  documents hardcoded #fff on light surfaces as the intended convention); high churn, no
  perf/a11y/SEO benefit (CSS is inlined either way). Rejected.
- quality: `.footer-made` restyle/remove — cosmetic no-op churn. Skipped.

**Rejected by skeptics (do not retry):** width/height & aspect-ratio on logo/slider imgs
(HTML attrs + parent aspect-ratio already prevent CLS — placebos); aria-current on fragment
nav (broken/incorrect semantics); gating scroll-behavior on reduced-motion (already handled in
tokens.css).

**Verify gate:** build ✓ · test 9/9 ✓ · responsive-check 0 overflow ✓ · E2E+axe 7/7 ✓.

### Round 3 — PRODUCTIVE (dry_rounds 0 → 0)
Dimensions audited: Performance, Accessibility, SEO, Code-quality/bundle.
8 candidates (territory thinning) → 5 survived → 3 applied (1 overruled, a11y/quality empty-ish).

**Applied:**
- `194c9d4` perf — import only latin + latin-ext @fontsource subsets (drop inlined
  cyrillic/greek/vietnamese @font-face); visually confirmed Croatian glyphs still render.
- `8ed97cd` seo — Service + Offer JSON-LD per offering from src/data/services.ts (real prices,
  no reviews); refactored localBusinessJsonLd to reuse AREA_SERVED.
- `4aff38f` refactor — removed dead pre-Astro CSS (.hero-trust/.ht-ic/.step-n/.mcta*).

**Overruled by executor (skeptic kept, I rejected):**
- seo: shorten coverage-page <title> to ~32 chars — would strip the local-SEO town keywords
  (Dugo Selo…Koprivnica); titles truncate by pixel width not char count. Kept descriptive title.

**Rejected by skeptics (do not retry):** sitemap priority/changefreq (false signals on a 2-page
site); consolidating BeforeAfter pairs into a shared module (component-internal, src/data is for
pricing/etc. — not worth it).

**Verify gate:** build ✓ · test 9/9 ✓ · responsive-check 0 overflow + glyph check ✓ · E2E+axe 7/7 ✓.

**Trend:** R1 applied 7, R2 applied 6, R3 applied 3. Candidates 40→28→8. Converging toward dry-up.

### Round 4 — PRODUCTIVE (dry_rounds 0 → 0)
Dimensions audited: Performance, Accessibility, SEO, Code-quality/bundle.
3 candidates → 2 survived → 1 applied (both quality dead-code, merged into one commit).
Perf/a11y/seo finders returned essentially nothing real.

**Applied:**
- `10d6b63` refactor — removed obsolete pre-island calculator CSS
  (.calc-steps/.cs/.calc-demo/.calc-tiles/.ct*/.calc-quote/.cq-*/.calc-foot) + unused
  semantic tokens --success/--warning/--star (executor also verified --success dead).

**Rejected by skeptics:** Cache-Control for HTML in vercel.json (speculative; freshness is a
deliberate choice — only hash-busted assets are immutably cached).

**Verify gate:** build ✓ · test 9/9 ✓ · responsive-check ✓ · E2E+axe 7/7 ✓.

**Trend:** applied 7 → 6 → 3 → 1; candidates 40 → 28 → 8 → 3. Next round likely DRY.

### Round 5 — PRODUCTIVE (dry_rounds 0 → 0)
Dimensions audited: Performance, Accessibility, SEO, Code-quality/bundle.
4 candidates → 3 survived → 3 applied (perf/a11y finders dry).

**Applied:**
- `e169d8c` seo — coverage-page canonical + breadcrumb now use the trailing-slash form to
  MATCH the sitemap (real sitemap↔canonical mismatch; homepage already uses slash form).
- `6dddd6e` refactor — removed unused class attrs wa-float-label, founder-novi (no CSS/JS).

**Rejected:** .footer-made (already vetoed earlier).

**Verify gate:** build ✓ · test 9/9 ✓ · responsive-check ✓ · E2E+axe 7/7 ✓.

**Trend:** applied 7 → 6 → 3 → 1 → 2; candidates 40 → 28 → 8 → 3 → 4. Still finding the
occasional real win (the canonical mismatch was genuine), so not dry yet.
