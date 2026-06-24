---
description: Autonomous, repeating optimization loop for the Nema Fleka site — runs until 2 consecutive dry rounds.
---

Run a repeating optimization loop on this repo (Nema Fleka, Astro static site). Improve
**Performance/CWV, Accessibility, SEO/structured-data, and Code-quality/bundle**, round after
round, until STOP. Burn tokens — thoroughness over frugality. Use the **Workflow** tool each
round (heavy multi-agent orchestration is opted in).

## Ledger
Keep state in `.goal/progress.md` on the branch. Per round record: round #, dimensions audited,
findings applied (+ commit SHAs), findings rejected (+ why), and a `dry_rounds` counter. Commit
it so future `/goal` runs resume.

## STOP — check FIRST
- If `dry_rounds >= 2`: STOP, print "🎯 GOAL MET — 2 consecutive dry rounds" + a final
  cross-round summary, change nothing.
- Also stop (say why): 12 rounds reached; OR verify gate can't go green after 3 fix attempts.
- A round is DRY when it applies zero net improvements. Increment `dry_rounds` on a dry round;
  reset to 0 on a productive one.

## Each round (one Workflow)
1. **Branch guard:** be on `claude/repo-optimization-e15l37`; never push elsewhere.
2. **Fan-out find:** parallel finders, ≥1 per dimension, each returning concrete file-level
   candidates with impact + risk. Use `parallel()`/`pipeline()`, not one agent.
3. **Dedup + rank** by impact ÷ risk; drop anything the ledger already tried.
4. **Adversarial verify:** spawn skeptic(s) to *refute* each top candidate (breaks build?
   regresses design? violates CLAUDE.md? fails AA contrast? placebo?). Keep only survivors.
5. **Apply** survivors as small coherent changes, one at a time.
6. **Verify gate (must pass before ANY push):** `npm run build`; `npm test`; the
   `responsive-check` skill (0 overflow, type ramp intact, shaders paint); Playwright E2E +
   axe-core (serve `dist/` on :8088; if the bundled browser is missing use system Chromium at
   `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` via a throwaway config). Fix or revert
   until green — never push red.
7. **Commit + push** each verified change (atomic, descriptive, repo commit trailers; retry
   push on network error 2/4/8/16s).
8. **Ledger update:** append results, set/reset `dry_rounds`, commit the ledger.
9. **Continue** to the next round (or resume from the ledger on the next `/goal`).

## Guardrails (from CLAUDE.md — violating one fails the round)
- No fake trust signals: no invented reviews/ratings/counters/OIB; keep impressum honest; leave
  `[POTVRDITI]` for the owner.
- Accessibility is a gate: keep AA contrast per `tokens.css`; axe-core stays clean.
- Single source of truth: prices/sizes/towns/business only in `src/data/`.
- Preserve the look: ink-navy + lime accent, the `whatamesh` shader, the tokens.
- No new heavy runtime deps without flagging it first. Copy stays Croatian.

## Output each round
Summarize: found / applied (+SHAs) / rejected (+why) / current `dry_rounds`. Keep going until
STOP fires.
