---
name: docs-review
description: Manual periodic sweep over all domain docs (PROJECT + CONTEXT + stances + the AGENTS.md entrypoint, root and per-package) plus convention reconciliation against the harness globals. Finds cross-doc problems think can't see in the moment — duplication, doc-vs-code drift, stances to merge, broken slug refs, orphaned terms, bloat. Docs-only: drift becomes a routed finding, never a code fix. Use when the user wants a docs cleanup pass, periodic doc hygiene, or convention reconciliation. Manual invocation only.
disable-model-invocation: true
---

# docs-review

The periodic cross-doc pass (`think` does inline write-time hygiene; this does the sweep `think`
can't see in-the-moment). **Report-then-apply** like `architecture`. **Docs-only** — any code drift
becomes a routed finding, never a code edit here.

## When to fire
- Manual: docs cleanup / periodic hygiene / convention reconciliation.

## Procedure

1. **Sweep the domain docs** (root + per-package): `PROJECT.md`, `CONTEXT.md`/`CONTEXT-MAP.md`,
   `docs/stances/*`, and the navigation entrypoint `docs/AGENTS.md`.
   Formats: `${CLAUDE_PLUGIN_ROOT}/shared/{project-doc,context-doc,stances-doc}.md`.
   Find: duplication (incl. the `AGENTS.md` entrypoint restating the `CONTEXT` glossary / `PROJECT`
   constraints instead of routing to them); doc↔code drift; **stances to merge/dedupe**; broken `see stance: <slug>`
   refs; orphaned/stale glossary terms (move retired ones to `_Avoid_`); PROJECT/CONTEXT bloat;
   non-linear bifurcation (see `${CLAUDE_PLUGIN_ROOT}/shared/authoring-standard.md`'s linear-reading rule);
   a per-package vision (drift — vision is a root singleton); durable reversals living as logs
   instead of `Rejected:`/hard-constraints/`_Avoid_`.
2. **Reconcile conventions** against `${CLAUDE_PLUGIN_ROOT}/conventions` — see
   [reconciliation.md](references/reconciliation.md): project rule ⊆ harness → remove from project
   (redundant); project rule ⊃ harness → keep the delta, route the project-agnostic part as a
   promotion candidate (human applies in the harness repo); conflict → mark an explicit `overrides:`
   or remove as drift.
3. **Report** all findings grouped (docs / conventions), each with a recommended action. Ask which
   to apply.
4. **Apply** the approved doc edits + project-side convention removals/overrides. Cross-repo
   promotions are **routed, not applied** (respect the manual promotion gate,
   `${CLAUDE_PLUGIN_ROOT}/shared/learnings.md`).

## Pipeline
- Reads:  `docs/PROJECT.md`, `docs/CONTEXT*.md`, `docs/AGENTS.md`, `docs/stances/*`, `docs/conventions/*`;
          `${CLAUDE_PLUGIN_ROOT}/conventions/*`; code (for drift checks)
- Writes: edits to the above domain/convention docs; a promotion-candidate list (routed to human)
- Next:   think (if a finding reopens a design question) | architecture (if drift is structural)
