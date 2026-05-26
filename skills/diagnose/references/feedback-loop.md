# Building the feedback loop

Loaded by `diagnose` step 1 — the heart of the skill. A fast deterministic pass/fail signal is 90%
of the fix.

## Construction methods (try in roughly this order)
1. **Failing test** at whatever seam reaches the bug (unit/integration/e2e).
2. **Curl / HTTP script** against a running dev server.
3. **CLI invocation** with a fixture input, diffing stdout vs a known-good snapshot.
4. **Headless browser** (Playwright/Puppeteer) — drives UI, asserts on DOM/console/network.
5. **Replay a captured trace** — save a real request/payload/event log, replay it in isolation.
6. **Throwaway harness** — minimal subset (one service, mocked deps) hitting the bug path in one call.
7. **Property / fuzz loop** — for "sometimes wrong", run 1000 random inputs.
8. **Bisection harness** — automate "boot at state X, check, repeat" for `git bisect run`.
9. **Differential loop** — same input through old vs new (or two configs), diff outputs.
10. **HITL bash script** — last resort; drive the human with `scripts/hitl-loop.template.sh` so the
    loop stays structured; captured output feeds back.

## Iterate on the loop
Treat it as a product: faster (cache setup, narrow scope), sharper (assert the specific symptom,
not "didn't crash"), more deterministic (pin time, seed RNG, isolate fs, freeze network). A 2s
deterministic loop is a superpower; a 30s flaky one is barely a loop.

## Non-deterministic bugs
Goal = a higher reproduction rate, not a clean repro. Loop the trigger 100×, parallelise, add
stress, narrow timing windows, inject sleeps. Raise the rate until debuggable.

## When you genuinely cannot build a loop
Stop and say so. List what you tried. Ask for: (a) access to the env that reproduces it, (b) a
captured artifact (HAR/log/core dump/timed screen recording), or (c) permission for temporary
instrumentation. **Do not hypothesise without a loop.**
