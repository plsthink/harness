# Tracer-bullet slicing

Loaded by `issues` step 3. How to cut vertical slices.

## Rules
- Each slice delivers a narrow but **COMPLETE** path through every layer (schema, API, UI, tests).
- A completed slice is **demoable / verifiable on its own**.
- **Prefer many thin slices over few thick ones.**
- NOT a horizontal slice (one layer across the whole feature).

## HITL vs AFK
- **HITL** — requires human interaction: an architectural decision, a design review.
- **AFK** — can be implemented and merged without human interaction. **Prefer AFK.**

## Issue body (template `templates/work/issue.md`)
- **What to build** — end-to-end behavior of the slice, not layer-by-layer impl. No paths/code
  (prototype-snippet exception only).
- **Acceptance criteria** — the testable contract `execute-issue` checks against.
- **Blocked by** — blocking issue ids, or "None — can start immediately".

## Scenario (verification)
**Input:** a PRD with several user stories. **Expected:** a numbered slice breakdown quizzed with
the user; on approval, `issues/NN-slug.md` files published in dependency order, each a vertical
slice with testable acceptance criteria + Type, Status `ready-for-agent` for AFK slices; parent
PRD untouched.
