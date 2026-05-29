---
name: think
description: Interview the user relentlessly about a plan or design, one question at a time, down each branch of the decision tree, recommending an answer per question — and when domain docs exist, sharpen terminology and update them inline. Use when the user wants to stress-test a plan, get grilled on a design, says "grill me" / "think this through", or wants a plan challenged against the project's language and decisions.
---

# think

Writes no file of its own beyond the domain docs it edits.

## When to fire
- User wants a plan/design stress-tested, says "grill me", or asks to challenge a plan against the
  project's documented language/decisions.

## Procedure

1. **Interview, one question at a time.** Walk down each branch of the design tree, resolving
   dependencies between decisions one by one. For each question, **provide your recommended
   answer**. Wait for feedback before the next question.
2. **Explore instead of asking** when a question is answerable from the codebase.
3. **Detect domain docs.** Look for `docs/CONTEXT.md` (+ `CONTEXT-MAP.md` for multi-package),
   `docs/PROJECT.md`, `docs/stances/`. If none exist, stay in plain interview mode.
4. **If docs exist → doc-surgery inline.** When a term, claim, or decision surfaces, apply
   [doc-surgery.md](references/doc-surgery.md) (capture-test source: `${CLAUDE_PLUGIN_ROOT}/shared/context-doc.md`).
5. **Offer a stance only on the AND-of-three Write gate** at `${CLAUDE_PLUGIN_ROOT}/shared/stances-doc.md`.
6. **Commit the domain docs at session end.** If you wrote/edited any domain doc this session, make one
   `docs`-typed commit per `${CLAUDE_PLUGIN_ROOT}/shared/git-workflow.md` (e.g. `docs(stances): record rebase-ff landing`).

## Pipeline
- Reads:  conversation; `docs/PROJECT.md`, `docs/CONTEXT.md` (+ `CONTEXT-MAP.md` for multi), `docs/stances/<slug>.md`; code
- Writes: `docs/CONTEXT.md` (+ per-package `packages/<pkg>/docs/CONTEXT.md` if multi), `docs/PROJECT.md`, `docs/stances/<slug>.md` (inline, on resolution)
- Next:   prd (synthesize the agreed design) | architecture (if a deepening surfaced)
