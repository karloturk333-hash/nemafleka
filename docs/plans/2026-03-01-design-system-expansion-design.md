# Design System Expansion — Nema Fleka

**Date:** 2026-03-01
**Scope:** CSS only — token definitions, semantic color applies, animation timing, responsive breakpoint
**Status:** Implemented

---

## Problem

The landing page had 17 color tokens, 3 shadows, 3 radii, and 1 transition — but no scaling systems for typography, spacing, or timing. This caused:

- 20+ hardcoded font sizes with no consistent scale
- Ad-hoc spacing values (6px–96px) with no pattern
- Hardcoded semantic colors (`#c0392b`, `#FFB800`, `#25D366`) instead of tokens
- Only one transition speed (`--transition: 0.28s`) for all interaction types
- Scroll reveal entrance animations at 0.6s (too heavy; 0.4s is ideal)
- Two dead `@keyframes` (`waPulse`, `bounce`) never referenced
- Missing 480px breakpoint documented in CLAUDE.md but absent from CSS

## Solution

### New Token Groups (38 tokens added to `:root`)

| Group | Count | Examples |
|-------|-------|---------|
| Type Scale | 11 | `--text-xs: 0.65rem` → `--text-hero: clamp(2.6rem, 4.5vw, 4.4rem)` |
| Spacing Scale | 11 | `--space-1: 0.25rem` (4px) → `--space-24: 6rem` (96px) |
| Radius | 2 | `--radius-sm: 8px`, `--radius-md: 12px` |
| Semantic Colors | 6 | `--error`, `--warning`, `--success`, `--star`, `--wa-green`, `--wa-green-hover` |
| Transition Variants | 4 | `--transition-fast: 0.15s`, `--transition-slow: 0.4s`, `--transition-enter: 0.4s ease-out` |
| Z-Index Scale | 6 | `--z-base: 1` → `--z-toast: 1400` |
| Gradients | 3 | `--gradient-lime`, `--gradient-cta`, `--gradient-progress` |

### Semantic Color Applies (6 replacements)

| Old | New | Context |
|-----|-----|---------|
| `#FFB800` | `var(--star)` | Star SVG fill |
| `#c0392b` | `var(--error)` | `.calc-distance-result.error` |
| `#e67e22` | `var(--warning)` | `.calc-distance-result.out-of-range` |
| `#25D366` ×2 | `var(--wa-green)` | `.cta-wa-btn`, `.wa-float` |
| `#1ebe5a` | `var(--wa-green-hover)` | `.cta-wa-btn:hover` |

### Animation Timing

- `.reveal.in` transition: `0.6s cubic-bezier(0.4,0,0.2,1)` → `0.4s cubic-bezier(0.0,0.0,0.2,1)`
- Rationale: entrance animations should use ease-out (decelerate), not ease-in-out
- Removed `@keyframes waPulse` and `@keyframes bounce` (dead code)

### 480px Breakpoint

Added `@media (max-width: 480px)` covering:
- Hero headline: `font-size: 2.3rem`
- Trust bar: vertical stack with centered items
- Section padding: `52px 16px` (reduced from `72px 24px`)

## Implementation

Three parallel agents with git worktree isolation, each editing non-overlapping sections of `nemafleka-v5.css`:

1. **Agent 1** — `:root` block only (pure additions, zero risk)
2. **Agent 2** — 6 color replacements + 2 keyframe removals (scattered mid/end of file)
3. **Agent 3** — `.reveal.in` timing + new `@media (max-width: 480px)` block

Branches merged sequentially into `main`, then `main` merged into `feat/price-calculator-wizard`.

## What's NOT Changed

Token definitions were added but **not applied** to existing components. The 20+ hardcoded font sizes and ad-hoc spacing values remain as-is. Future work can incrementally replace them with the new scale variables.
