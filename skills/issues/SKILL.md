---
name: issues
description: Break a plan, spec, or PRD into independently-grabbable issues using tracer-bullet vertical slices, published to the project tracker in dependency order. Use when the user wants to convert a plan or PRD into implementation tickets, or break work down into issues.
---

# issues

PRD/plan → `docs/work/<feature>/issues/NN-slug.md` tracer-bullet slices. Each slice cuts ALL layers
end-to-end (not a horizontal layer slice); many thin > few thick. Never edits the parent PRD.

## When to fire
- User wants a plan/PRD broken into issues or implementation tickets.

## Procedure

1. **Gather context.** Work from the conversation/PRD. If passed an issue ref (number/URL/path),
   fetch and read its full body + comments.
2. **Explore the codebase** (if not already). Titles/descriptions use the **domain glossary**
   vocabulary; respect stances in the touched area.
3. **Draft vertical slices.** Each = a narrow but COMPLETE path through every layer (schema, API,
   UI, tests), demoable on its own. Tag each **HITL** (needs human: arch decision / design review)
   or **AFK** (implementable + mergeable unattended) — prefer AFK. See
   [slicing.md](references/slicing.md).
4. **Quiz the user.** Present a numbered breakdown: Title / Type (HITL|AFK) / Blocked-by / user
   stories covered. Ask: granularity right? deps correct? merge or split any? HITL/AFK correct?
   Iterate until approved.
5. **Run the "thought-enough" checklist** (`${CLAUDE_PLUGIN_ROOT}/shared/triage-labels.md`) before
   stamping `ready-for-agent` — the upstream AFK gate.
6. **Publish in dependency order** (blockers first, so "Blocked by" can cite real ids). Scaffold
   each from `templates/work/issue.md`; fill What-to-build / Acceptance criteria / Blocked-by.
   Layout + Status/Type semantics: `${CLAUDE_PLUGIN_ROOT}/shared/issue-tracker.md`.

**No file paths/code snippets** (same prototype-snippet exception as `prd`). Read this skill's
learnings in `docs/work/learnings/issues.md` per the convention (`${CLAUDE_PLUGIN_ROOT}/shared/learnings.md`).

## Pipeline
- Reads:  `docs/work/<feature>/PRD.md`; conversation; code; `docs/work/learnings/issues.md`
- Writes: `docs/work/<feature>/issues/NN-slug.md` (Status/Type); `docs/work/learnings/issues.md`
- Next:   triage (if states need review) | execute-issue (for a ready-for-agent slice)
