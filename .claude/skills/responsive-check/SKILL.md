---
name: responsive-check
description: Build the Nema Fleka site, serve dist/, and inspect both pages (/ and /podrucje-pokrivenosti) across the 4 reference viewports (Pixel 393x851, iPhone 13 Pro 390x844, iPad 768x1024, desktop 1440x900) with a real Chromium so the WebGL hero shader renders. Reports horizontal overflow and the computed font-size of the key type ramp, and writes full-page screenshots to /tmp. Use when checking or verifying responsiveness/layout/typography after CSS changes.
---

# responsive-check

A reusable responsiveness probe for the Nema Fleka Astro site.

## Usage

From the project root:

```bash
node .claude/skills/responsive-check/responsive-check.mjs
```

It will:

1. `npm run build` (static build to `dist/`).
2. Serve `dist/` over a tiny static HTTP server (default port `8099`, override with `PORT`).
3. Launch the **system** Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`
   with `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist`
   so the WebGL "whatamesh" hero shader actually paints (otherwise the hero is blank).
4. For each page x viewport:
   - take a **full-page** screenshot to `/tmp/rc-<page>-<viewport>.png`
   - log horizontal overflow = `documentElement.scrollWidth - clientWidth`
   - log the computed `font-size` of `.hero-h1`, `.hero-sub`, `.section-h2`, `.section-sub`, `.calc-q`

Pages probed: `/` and `/podrucje-pokrivenosti/`.
Viewports: pixel 393x851, iphone13 390x844, tablet 768x1024, desktop 1440x900.

## Pass criteria

- **Horizontal overflow must be `0px` on every page x viewport.** Any positive value
  means something is wider than the viewport (the script exits non-zero and prints `FAIL`).
- **Type scales down on mobile.** The fluid (`clamp()`) ramp should report a *smaller*
  `font-size` at 390-393px than at 1440px for `.hero-h1`, `.hero-sub`, `.section-sub`,
  `.calc-q`. On desktop the hero H1 should reach its full ~5rem (80px) size.
- Tap targets stay >= 44px and WebGL canvases are not clipped (inspect screenshots).

## Notes

- Requires `playwright` (already a dev dependency) and the system Chromium path above.
- Run a `npm run build` is performed by the script; no need to pre-build.
- Screenshots are left in `/tmp` for visual review.
