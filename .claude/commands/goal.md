---
description: Autonomous, repeating optimization loop for the Nema Fleka site — runs until 2 consecutive dry rounds.
---

You are running an autonomous, repeating optimization loop on this repo (Nema Fleka — an
Astro static marketing site). Improve the site across **Performance/CWV, Accessibility,
SEO/structured-data, and Code-quality/bundle**, round after round, until the STOP condition.
Burn tokens generously — thoroughness beats frugality. This is explicitly opted into heavy
multi-agent orchestration: use the **Workflow** tool each round.

## State / ledger
Keep a ledger at `.goal/progress.md` on the working branch (create if missing). Per round
record: round number, dimensions audited, findings applied (with commit SHAs), findings
rejected (+ why), and a `dry_rounds` counter. Commit the ledger so state survives container
restarts and future `/goal` runs resume from it.

## STOP condition — check FIRST, before any work
- If the ledger shows `dry_rounds >= 2`: STOP. Print "🎯 GOAL MET — 2 consecutive dry rounds"
  and a final cross-round summary. Make no changes.
- Safety caps (also stop, and say why): 12 total rounds reached; OR the verify gate cannot be
  returned to green after 3 consecutive fix attempts.
- A round is **DRY** when it applies zero net improvements (nothing survived verification).
  Increment `dry_rounds` on a dry round; reset to 0 on any productive round.

## Each round (one heavy Workflow)
1. **Branch guard:** confirm you are on `claude/repo-optimization-e15l37`. Never commit or
   push anywhere else.
2. **Fan-out find:** launch parallel finder agents, ≥1 per dimension (Performance,
   Accessibility, SEO, Code-quality/bundle). Each returns a structured list of concrete,
   file-level candidates with expected impact + risk. Use `parallel()`/`pipeline()` — not a
   single agent.
3. **Dedup + rank:** merge findings, drop anything the ledger says was already tried/rejected,
   rank by impact ÷ risk.
4. **Adversarial verify:** for each top candidate spawn skeptic agent(s) prompted to *refute*
   it — could it break the build, regress the design, violate a CLAUDE.md rule, fail AA
   contrast, or be a placebo? Drop whatever the skeptics kill. Keep only survivors.
5. **Apply** survivors as the smallest coherent changes, one at a time.
6. **Verify gate (must pass before ANY push):**
   - `npm run build`
   - `npm test`
   - the `responsive-check` skill (0 horizontal overflow, type ramp intact, shaders paint)
   - Playwright E2E + axe-core, no regressions. Serve `dist/` on :8088 first; if the bundled
     Playwright browser is missing, run via the system Chromium at
     `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` using a throwaway root-level config.
   If the gate fails, fix or revert until green. **Never push red.**
7. **Commit + push** each verified change to the branch — atomic commits, descriptive
   messages, the repo's commit trailers. Retry push on network error (2s/4s/8s/16s backoff).
8. **Ledger update:** append the round's results, set/reset `dry_rounds`, commit the ledger.
9. **Continue** to the next round. If looping internally, go straight to the next round; if
   fired by `/loop`, the next invocation resumes from the ledger.

## Hard guardrails (from CLAUDE.md — a violation fails the round)
- **No fake trust signals:** no invented reviews, ratings, client counters, or OIB. Keep the
  "u postupku registracije" impressum honest; leave `[POTVRDITI]` items for the owner.
- **Accessibility is a gate:** keep AA contrast per the comments in `tokens.css`; axe-core
  must stay clean.
- **Single source of truth:** pricing/sizes/discounts/towns/business live only in `src/data/`
  — never hardcode those numbers elsewhere.
- **Preserve the look:** ink-navy + lime-accent system, the animated `whatamesh` shader
  background, the design tokens. Perf wins must not flatten the design.
- **No new heavy runtime dependencies** without calling it out in the round summary first.
- **Copy stays Croatian** and on-brand.

## Output each round
A short summary: what was found, what was applied (+ SHAs), what was rejected and why, and the
current `dry_rounds`. Then keep going until the STOP condition fires.
