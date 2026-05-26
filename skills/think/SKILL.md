---
name: think
description: Interview the user relentlessly about a plan or design, one question at a time, down each branch of the decision tree, recommending an answer per question — and when domain docs exist, sharpen terminology and update them inline. Use when the user wants to stress-test a plan, get grilled on a design, says "grill me" / "think this through", or wants a plan challenged against the project's language and decisions.
---

# think

Relentless design interview. Plain mode when no domain docs exist; adds inline doc-surgery
(PROJECT + CONTEXT + stances) when they do. Merge of grill-me + grill-with-docs. Writes no file of
its own beyond the domain docs it edits.

## When to fire
- User wants a plan/design stress-tested, says "grill me", or asks to challenge a plan against the
  project's documented language/decisions.

## Procedure

1. **Interview, one question at a time.** Walk down each branch of the design tree, resolving
   dependencies between decisions one by one. For each question, **provide your recommended
   answer**. Wait for feedback before the next question.
2. **Explore instead of asking** when a question is answerable from the codebase — read the code,
   don't ask the user.
3. **Detect domain docs.** Look for `docs/CONTEXT.md` (+ `CONTEXT-MAP.md` for multi-package),
   `docs/PROJECT.md`, `docs/stances/`. If none exist, stay in plain interview mode.
4. **If docs exist → doc-surgery inline.** When a term, claim, or decision surfaces, apply
   [doc-surgery.md](references/doc-surgery.md): challenge against the glossary, sharpen fuzzy
   terms, stress-test with concrete scenarios, cross-check claims vs code, and **update the doc
   right there** (don't batch). Formats:
   `${CLAUDE_PLUGIN_ROOT}/shared/context-doc.md`, `${CLAUDE_PLUGIN_ROOT}/shared/project-doc.md`,
   `${CLAUDE_PLUGIN_ROOT}/shared/stances-doc.md`.
5. **Offer a stance only on the AND-of-three gate** (hard-to-reverse AND surprising AND real
   trade-off). See `${CLAUDE_PLUGIN_ROOT}/shared/stances-doc.md`. Skip if any is missing.
6. **Capture test before writing a domain doc:** "will a fresh agent in 3 months need this to
   avoid a mistake?" No → it stays in the conversation/PRD, not the docs.

## Pipeline
- Reads:  conversation; `docs/PROJECT.md`, `docs/CONTEXT.md` (+ `CONTEXT-MAP.md` for multi), `docs/stances/<slug>.md`; code
- Writes: `docs/CONTEXT.md` (+ per-package `packages/<pkg>/docs/CONTEXT.md` if multi), `docs/PROJECT.md`, `docs/stances/<slug>.md` (inline, on resolution)
- Next:   prd (synthesize the agreed design) | architecture (if a deepening surfaced)
