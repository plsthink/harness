---
name: architecture
description: Find deepening opportunities in a codebase — refactors that turn shallow modules into deep ones for testability and AI-navigability — informed by the domain glossary and recorded stances. Reports candidates first, then grills the chosen one. Use when the user wants to improve architecture, find refactoring opportunities, consolidate tightly-coupled modules, or make a codebase more testable.
---

# architecture

Surface architectural friction and propose **deepening opportunities**. Report-then-apply: present
candidates, let the user pick, then grill the chosen one with inline doc side-effects. Uses the
shared vocabulary `${CLAUDE_PLUGIN_ROOT}/shared/deep-modules.md`; fuller architecture vocab +
deletion test in [LANGUAGE.md](references/LANGUAGE.md). Use these terms exactly — don't drift to
"component/service/boundary".

## When to fire
- User wants to improve architecture, find refactors, consolidate coupling, or improve testability.

## Procedure

1. **Explore.** Read the domain glossary + stances in the area first (don't re-litigate them;
   multi-package: the per-package `packages/<pkg>/docs/CONTEXT.md` for the area via the
   `CONTEXT-MAP.md` spine, plus root). Use
   the `investigator` agent (or `Explore`) to walk the codebase noting **friction**: concept
   understanding scattered across many small modules, shallow modules, pure functions extracted
   only for testability while real bugs hide in how they're called, coupling leaking across seams,
   hard-to-test interfaces. Apply the **deletion test** to suspected-shallow modules.
2. **Present candidates as a self-contained HTML report** in the OS temp dir (never the repo) —
   Tailwind + Mermaid via CDN, before/after per candidate, strength badge (Strong / Worth exploring
   / Speculative), Top-recommendation section. Full scaffold: [HTML-REPORT.md](references/HTML-REPORT.md).
   Use glossary vocab for the domain + LANGUAGE vocab for architecture. **Do not propose interfaces
   yet.** Ask: "which would you like to explore?"
3. **Grill the chosen candidate.** Walk the design tree (constraints, deepened-module shape, what
   sits behind the seam, surviving tests). Categorise dependencies + testing strategy via
   [DEEPENING.md](references/DEEPENING.md); design the interface twice via parallel subagents per
   [INTERFACE-DESIGN.md](references/INTERFACE-DESIGN.md). **Inline doc side-effects:** new concept →
   add to `CONTEXT.md` (multi-package: route a package-specific concept to the per-package
   `packages/<pkg>/docs/CONTEXT.md` the `CONTEXT-MAP.md` spine points to, project-wide to root);
   fuzzy term sharpened → update it; user rejects with a load-bearing reason →
   offer a stance so future reviews don't re-suggest it (`${CLAUDE_PLUGIN_ROOT}/shared/stances-doc.md`,
   AND-of-three gate). A candidate contradicting a stance → flag only when friction warrants reopening.

## Pipeline
- Reads:  code; `docs/CONTEXT.md` (+ `CONTEXT-MAP.md` for multi), `docs/stances/*`; diagnose findings (if handed off)
- Writes: HTML report (temp dir); inline `docs/CONTEXT.md` (+ per-package `packages/<pkg>/docs/CONTEXT.md` if multi) / `docs/stances/*` edits
- Next:   tdd (implement the approved deepening)
