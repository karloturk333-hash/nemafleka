# claude.md — Nema Fleka

> **Read this file first. Every session. No exceptions.**

---

## Project Context

- **Project name:** Nema Fleka (nemafleka.com)
- **Description:** Professional deep cleaning service landing page — carpets, couches, mattresses, cars. Based in Vrbovec, Croatia, covering Vrbovec + 35km radius (includes Zagreb).
- **Language:** Croatian (lang="hr", dir="ltr"). All UI copy, labels, aria-labels, and meta descriptions MUST be in Croatian.
- **Tech stack:** Vanilla HTML5 + CSS3 + JavaScript (no frameworks, no build tools)
- **External dependencies:**
  - Google Fonts: `Nunito` (400–1000) + `Space Mono` (400, 700)
  - Leaflet.js 1.9.4 (coverage map)
  - CARTO dark tiles for map: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
- **File structure:**
  - `nemafleka-v5.html` — single-page landing (all sections)
  - `nemafleka-v5.css` — all styles, design tokens in `:root`
  - `nemafleka-v5.js` — all interactivity (IIFE pattern, `'use strict'`)
  - `images/` — all local image assets (logo, before/after photos, carousel photos)
  - `docs/plans/` — implementation plans (session planning docs)
  - `vercel.json` — Vercel deployment config (rewrites all routes to `nemafleka-v5.html`)
- **Architecture:** Single-page, section-based landing page. No routing. No SPA framework. Vanilla only.

---

## Design System — Tokens

All values live in `:root` in the CSS. **Never hardcode colors — always use CSS variables.**

### Colors

```
--navy:        #181A6E     /* primary brand — deep authoritative navy */
--navy-dark:   #0D0E45     /* darkest — nav bg, hero bg, footer bg, dark sections */
--navy-mid:    #232599     /* hover states on navy elements */
--navy-light:  #3033CC     /* accent highlights, blob glows */
--lime:        #C8FF3E     /* primary accent — CTAs, highlights, active states */
--lime-dark:   #A8D920     /* hover state for lime buttons */
--lime-dim:    #8BBF18     /* darker lime for subtle accents */
--lime-pale:   rgba(200,255,62,0.12)  /* subtle lime backgrounds (trust icons, badges) */
--white:       #FFFFFF
--off-white:   #F4F6F0     /* page background for light sections */
--surface:     #ECEEF8     /* card-like surfaces, FAQ icons */
--card:        #FFFFFF     /* card backgrounds */
--text-main:   #0D0E45     /* headings, primary text (matches navy-dark) */
--text-body:   #3D4060     /* body paragraphs */
--text-muted:  #7A7FA8     /* secondary/helper text */
--border:      rgba(24,26,110,0.10)
```

### Shadows

```
--shadow-sm:   0 2px 12px rgba(24,26,110,0.08)
--shadow-md:   0 8px 32px rgba(24,26,110,0.12)
--shadow-lg:   0 24px 64px rgba(24,26,110,0.16)
```

### Semantic Colors

```
--error:          #c0392b
--warning:        #e67e22
--success:        #22c55e
--star:           #FFB800
--wa-green:       #25D366
--wa-green-hover: #1ebe5a
```

### Radii

```
--radius-sm:   8px         /* skip links, tooltips, minor rounding */
--radius-md:   12px        /* feature icon box, distance result */
--radius:      14px        /* default cards, inputs */
--radius-lg:   22px        /* larger cards, modals */
--radius-xl:   32px        /* hero carousel, large panels */
```

### Transitions

```
--transition:        0.28s cubic-bezier(0.4,0,0.2,1)   /* global easing — default */
--transition-fast:   0.15s cubic-bezier(0.4,0,0.2,1)   /* hover on small elements */
--transition-normal: var(--transition)                   /* alias */
--transition-slow:   0.4s cubic-bezier(0.4,0,0.2,1)    /* modals, drawers */
--transition-enter:  0.4s cubic-bezier(0.0,0.0,0.2,1)  /* entrance ease-out */
```

### Type Scale

```
--text-xs:          0.65rem                           /* ~10px — tiny labels */
--text-sm:          0.75rem                           /* ~12px — captions */
--text-base:        0.9rem                            /* ~14px — primary body */
--text-md:          1rem                              /* 16px — card titles */
--text-lg:          1.2rem                            /* ~19px — sub-headings */
--text-xl:          1.5rem                            /* 24px — display text */
--text-2xl:         2rem                              /* 32px — large counters */
--text-3xl:         2.8rem                            /* ~45px — price display */
--text-hero:        clamp(2.6rem, 4.5vw, 4.4rem)     /* H1 */
--text-section:     clamp(1.8rem, 3.5vw, 2.8rem)     /* H2 section titles */
--text-footer-cta:  clamp(1.6rem, 3vw, 2.4rem)       /* footer CTA headline */
```

### Spacing Scale (4px base)

```
--space-1:   0.25rem   /* 4px */
--space-2:   0.5rem    /* 8px */
--space-3:   0.75rem   /* 12px */
--space-4:   1rem      /* 16px */
--space-5:   1.25rem   /* 20px */
--space-6:   1.5rem    /* 24px */
--space-8:   2rem      /* 32px */
--space-10:  2.5rem    /* 40px */
--space-12:  3rem      /* 48px */
--space-16:  4rem      /* 64px */
--space-24:  6rem      /* 96px */
```

### Z-Index Scale

```
--z-base:   1       --z-above:  10      --z-float:  100
--z-nav:    1000    --z-modal:  1200    --z-toast:  1400
```

### Gradients

```
--gradient-lime:     linear-gradient(90deg, var(--lime), var(--lime-dark))
--gradient-cta:      linear-gradient(135deg, var(--lime) 0%, #d9ff6e 50%, var(--lime-dark) 100%)
--gradient-progress: linear-gradient(90deg, var(--lime), var(--lime-dark))
```

### Typography

```
Primary font:    'Nunito', system-ui, sans-serif
Mono font:       'Space Mono', monospace  (used for: labels, badges, marquee, eyebrows)
Base size:        16px (html)
Line height:      1.6 (body default)

Headings:
  - font-weight: 900
  - letter-spacing: -0.03em
  - line-height: 1.05–1.1
  - Hero headline: clamp(2.6rem, 5vw, 5rem)
  - Section titles: clamp(1.8rem, 3.5vw, 2.8rem)

Body text:
  - font-weight: 600
  - font-size: 0.9rem–1.1rem
  - line-height: 1.6–1.75

Labels/Badges/Chips:
  - font-family: 'Space Mono' or Nunito at 800 weight
  - font-size: 0.6rem–0.72rem
  - letter-spacing: 0.15em–0.3em
  - text-transform: uppercase

CTAs/Buttons:
  - font-weight: 900
  - font-size: 0.85rem–1rem
  - border-radius: 50px (always pill-shaped)
  - padding: 14px 28px to 16px 32px
```

### Logo

- File: `Original_on_transparent.png`
- Style: Graffiti/street-art lettering — "NEMA FLEKA" in lime green with navy shadow, plus a vacuum cleaner illustration
- Background: transparent
- Nav size: height 48px–54px, width auto
- Footer size: height 44px, width auto
- **Fix needed:** Logo `src` paths currently use local Windows paths (`C:\Users\Karlo\Downloads\...`) — must be changed to relative paths for production.

---

## Component Patterns & Conventions

### Buttons

| Type | Class | Usage |
|------|-------|-------|
| Primary CTA | `.btn-primary` | Lime bg, navy-dark text, pill shape, hover lifts + glow |
| Ghost (hero) | `.btn-ghost-hero` | Transparent, white border, turns lime on hover |
| Nav CTA | `.btn-nav-cta` | Small lime pill in navbar |
| Mobile CTA | `.m-cta` | Full-width lime pill in mobile menu |

**All buttons:** pill-shaped (`border-radius: 50px`), `font-weight: 900`, hover: `translateY(-2px/-3px)` + `box-shadow` glow.

### Cards

- Background: `var(--card)` (#FFFFFF)
- Border: `1.5px solid var(--border)`
- Border-radius: `var(--radius)` (14px) or `var(--radius-lg)` (22px) for larger cards
- Shadow on hover: `var(--shadow-md)`
- Transition: all `var(--transition)`

### Chips / Badges

- Two variants: `.chip-light` (light bg sections) and `.chip-dark` (dark bg sections)
- Light: `rgba(24,26,110,0.07)` bg, navy text, thin navy border
- Dark: `rgba(200,255,62,0.10)` bg, lime text, thin lime border
- Always: 50px radius, uppercase, 800 weight, 0.18em letter-spacing, ~0.7rem

### Sections

- Standard section: `padding: 96px 48px`
- Container max-width: `1160px`, centered
- Section title pattern: chip → h2 (`.section-title`) → p (`.section-sub`)
- Dark sections (hero, nav, footer, CTA): `background: var(--navy-dark)`
- Light sections (services, FAQ, trust): `background: var(--off-white)` or white

### Scroll Reveal

- Class: `.reveal` — add to any element that should animate in on scroll
- Triggers: IntersectionObserver at `threshold: 0.12`, `rootMargin: '0px 0px -48px 0px'`
- When visible: adds `.in` class, unobserves
- Animation pattern: fade-up (`opacity: 0 → 1`, `translateY(24px) → 0`)

---

## Page Sections (in order)

1. **Navbar** — fixed, dark, logo left, links right, hamburger on mobile, lime CTA pill
2. **Scroll progress bar** — fixed top, lime gradient, 3px
3. **Hero** — split grid (copy left, carousel right), dark bg, blobs, noise grain texture
4. **Trust bar** — white strip with proof points (icons + stats)
5. **Marquee** — lime bg, Space Mono, auto-scrolling service keywords
6. **Services** (`.services-grid`) — 4-column card grid
7. **Before/After slider** — interactive drag comparison widget
8. **How it works** (`.timeline`) — 4-step horizontal timeline
9. **Why us** (`.why-grid`) — feature grid with icons
10. **Testimonials** — review cards with star ratings
11. **Coverage map** — Leaflet map, dark tiles, lime circle (35km radius), city dot markers
12. **FAQ** — two-column: sticky sidebar left, accordion right
13. **CTA / Contact form** — dark section, form with validation
14. **Footer** — 4-column grid (brand, nav, contact info, working hours), dark bg
15. **Floating WhatsApp button** — fixed bottom-right, green pulse, discount badge

---

## Accessibility Requirements

This project has **strong a11y foundations**. Maintain them:

- `lang="hr"` and `dir="ltr"` on `<html>`
- Skip link: `.skip-link` → `#main-content`
- All images: meaningful `alt` text
- All interactive elements: `aria-label`, `aria-expanded`, `aria-controls`, `aria-selected`
- Focus visible: `3px solid var(--lime)`, `outline-offset: 3px`
- `role="navigation"`, `role="dialog"`, `role="progressbar"` used correctly
- Decorative elements: `aria-hidden="true"`
- `@media (prefers-reduced-motion: reduce)` — kills all animations
- Keyboard: FAQ accordion, carousel, before/after slider all keyboard-navigable
- Mobile menu: Escape key closes, focus trap, body scroll lock

**Do not break these.** Any new component must meet the same standard.

---

## JavaScript Patterns

- Everything in `'use strict'` mode
- IIFEs for scoped modules (before/after slider, map)
- Combined scroll handler for performance (progress + nav + back-to-top in one listener)
- `{ passive: true }` on scroll/touch listeners (except when `preventDefault()` needed)
- `requestAnimationFrame` for drag/animation loops
- `IntersectionObserver` for scroll reveal + counter animations
- Counter animation: `easeOutCubic`, locale `'hr'` for number formatting
- Hero carousel: auto-advance (5s), progress bar fill, pause on hover, touch swipe support

---

## Responsive Breakpoints

```
960px  — tablet: hero goes single-column, timeline 2-col, footer 2-col
768px  — mobile: hamburger menu visible, nav-links hidden, sections padding shrinks
600px  — small mobile: before/after handle smaller, map height reduced
480px  — extra-small: hero headline 2.3rem, trust bar stacks vertical, section padding 52px 16px
```

---

## Business Context

- **Owners:** Karlo (095 376 5343) & Ivan (091 618 4796)
- **WhatsApp:** wa.me/385953765343
- **Service area:** Vrbovec center + 35km (covers Zagreb, Bjelovar, Velika Gorica, Križevci, Ivanić-Grad, Čazma, Sesvete, etc.)
- **Working hours:** Mon–Fri 08–20, Sat 09–18, Sun by appointment
- **Rating:** 4.9/5, 500+ satisfied clients
- **Key selling points:** eco-friendly, fast confirmation (60s), money-back guarantee, 10% discount on first service via WhatsApp
- **Map center:** Vrbovec [45.8833, 16.4167]

---

## Do's

- Use CSS custom properties for ALL colors, shadows, radii
- Keep pill-shaped buttons (`border-radius: 50px`)
- Maintain the lime-on-navy contrast pattern for dark sections
- Use `var(--transition)` for all transitions
- Add `.reveal` class to new section content for scroll animations
- Use `Space Mono` for small labels/badges, `Nunito` for everything else
- Keep mobile-first responsive breakpoints: 960px → 768px → 480px
- Maintain Croatian copy throughout
- Use IIFEs or block scoping for new JS modules

## Don'ts

- Don't introduce a CSS framework (no Tailwind, no Bootstrap)
- Don't introduce a JS framework (no React, no Vue)
- Don't use colors outside the defined palette without updating `:root`
- Don't use `font-family` directly — always reference the established fonts
- Don't remove `aria-*` attributes or accessibility features
- Don't add `!important` unless overriding a third-party library
- Don't break the single-file-per-concern structure (HTML/CSS/JS separate)
- Don't use inline styles (exception: logo img sizing in nav/footer)

---

## Known Issues / TODOs

- [x] **Logo paths:** Fixed — now uses `images/Original on transparent.png` (relative)
- [x] **Image assets:** Now using real photos from `images/` — carousel and before/after slider have local images
- [ ] **Email obfuscation:** Uses Cloudflare email protection (`__cf_email__`) — verify on final hosting
- [ ] **Contact form:** Needs backend integration (currently frontend-only)
- [x] **Design tokens:** Expanded from 24 to 62 tokens (type scale, spacing, semantic colors, transitions, z-index, gradients)
- [x] **Dead keyframes:** Removed unused `waPulse` and `bounce` @keyframes
- [x] **Scroll reveal timing:** Fixed from 0.6s ease-in-out to 0.4s ease-out
- [x] **480px breakpoint:** Added (was documented but missing from CSS)
- [ ] **Token application:** Type scale and spacing tokens defined but not yet applied to existing components

---

## Workflow Ritual

### Step 0 — Always Read This File First

Before writing any code, re-read this `claude.md` in full. **After every major decision, update this file.**

### Step 1 — Load Skills Before Working

- Use the `Skill` tool to invoke skills — do NOT read skill files with the Read tool.
- Before **frontend/UI work**: invoke `frontend-design` skill
- Before **documents/PDFs**: invoke `pdf` or `docx` skill
- Skills are listed in the session's system-reminder at the start of each conversation.

## Local Development

No build step. Open directly in browser or use VS Code Live Server extension.
For screenshot testing: `node screenshot.js` (requires `puppeteer` installed globally or locally).
Deployed via Vercel — `vercel.json` rewrites all routes to `nemafleka-v5.html`.

---

### Step 2 — Screenshot Feedback Loop

After every UI change, run `node screenshot.js` and review. Attach screenshots when asking for visual feedback.

```js
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  await browser.close();
})();
```

### Step 3 — Design Inspiration Screenshots

When building new UI, use full-page screenshots as references. Be specific: layout, spacing, typography, color — not just "make it look like this." Store in `/references/`.

### Step 4 — 21st.dev Components

Check 21st.dev + shadcn/ui before building from scratch. Adapt to this project's tokens (navy/lime, Nunito, pill buttons, 14px radius). Save favorites in `/references/components/`.

---

*Last updated: 2026-03-01*
