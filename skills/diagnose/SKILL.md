---
name: diagnose
description: Disciplined diagnosis loop for hard bugs and performance regressions — reproduce, minimise, hypothesise, instrument, fix, regression-test. Use when the user says "diagnose this" / "debug this", reports a bug, says something is broken/throwing/failing, or describes a performance regression.
---

# diagnose

A discipline for hard bugs. Skip phases only when explicitly justified. Bound by
`${CLAUDE_PLUGIN_ROOT}/shared/coding-discipline.md` (one variable at a time, goal-driven
verification). Use the domain glossary for a clear model; respect stances in the touched area.

## When to fire
- "diagnose/debug this", a reported bug, something broken/throwing/failing, a perf regression.

## Procedure

1. **Build a feedback loop (this IS the skill).** Get a fast, deterministic, agent-runnable
   pass/fail signal for the bug — then bisection/hypothesis-testing/instrumentation just consume
   it. Be aggressive; iterate on the loop (faster, sharper, more deterministic). For the ranked
   menu of construction methods + the non-deterministic and HITL handling, read
   [feedback-loop.md](references/feedback-loop.md) (HITL last resort:
   [hitl-loop.template.sh](scripts/hitl-loop.template.sh)). **Do not proceed without a loop you believe in.**
2. **Reproduce.** Run the loop; confirm it produces the **user's** symptom (not a nearby one),
   reproducibly, and capture the exact symptom for later verification.
3. **Hypothesise.** Generate **3–5 ranked falsifiable hypotheses** before testing any. Each states
   its prediction ("if X is the cause, changing Y makes it disappear"). **Show the ranked list to
   the user** before testing (cheap checkpoint; proceed if they're AFK).
4. **Instrument.** Each probe maps to one prediction; change **one variable at a time**. Prefer
   debugger/REPL > targeted boundary logs > never "log everything". Tag every debug log
   `[DEBUG-xxxx]` for single-grep cleanup. Perf: measure a baseline first, then bisect.
5. **Fix + regression test.** Write the regression test **before** the fix — **only if a correct
   seam exists** (exercises the real bug pattern at the call site). **No correct seam = that is the
   finding** (`${CLAUDE_PLUGIN_ROOT}/shared/deep-modules.md`); flag it. Before writing the fix,
   consult the conventions INDEX (`${CLAUDE_PLUGIN_ROOT}/conventions/INDEX.md` global + project
   `docs/conventions/INDEX.md`; project wins), as `builder`/`tdd` do. Then: failing test → fix →
   passing → re-run the Phase-1 loop on the original scenario.
6. **Cleanup + post-mortem.** Original no longer reproduces; regression test passes (or absent-seam
   documented); all `[DEBUG-]` removed; throwaways deleted; correct hypothesis stated in the
   commit. Then ask **what would have prevented this** — if architectural, hand to `architecture`.

Read/append this skill's learnings in `docs/work/learnings/diagnose.md` per the convention
(`${CLAUDE_PLUGIN_ROOT}/shared/learnings.md`) — read prior post-mortems before hypothesising, and
append the step-6 "what would have prevented this" insight when it is reusable beyond this bug.

## Pipeline
- Reads:  the bug report; code; `docs/CONTEXT.md` (+ `CONTEXT-MAP.md` for multi), `docs/stances/*`; `docs/work/learnings/diagnose.md`
- Writes: a regression test + fix; a post-mortem note in the commit; `docs/work/learnings/diagnose.md`
- Next:   architecture (if the root cause is architectural) | tdd (if the fix grows into a feature)
