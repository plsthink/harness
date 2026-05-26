---
name: new-skill
description: Create a new harness skill with proper structure, progressive disclosure, and bundled resources, scaffolded from the templates. Use when the user wants to create, write, or build a new skill.
---

# new-skill

Create a new skill that obeys the authoring standard. The standard is the spec — read
`${CLAUDE_PLUGIN_ROOT}/shared/authoring-standard.md` and enforce it (thin SKILL.md ~100 lines,
references one level deep, description = what + "Use when [triggers]", scripts for determinism,
shared over local).

## When to fire
- User wants to create / write / build a new skill.

## Procedure

1. **Gather requirements:** what task/domain; which use cases; needs scripts or just instructions;
   reference materials to include; where it sits in the pipeline (`Reads`/`Writes`/`Next`).
2. **Scaffold the lean shape** from `templates/skill/SKILL.md` (+ `templates/skill/reference.md`
   per reference) via `templates/scaffold.sh` — so thin-by-default is the starting point.
3. **Draft:** fill the SKILL.md (description + triggers + ordered procedure + Pipeline footer).
   Move vocabulary/formats/examples/tables into `references/x.md`, named + loaded-on-demand from
   the procedure. Cross-cutting conventions → cite `${CLAUDE_PLUGIN_ROOT}/shared/...`, never copy.
   Deterministic mechanics → `scripts/`.
4. **Review against the checklist:** description has triggers; SKILL.md within the soft ~100-line
   target; no time-sensitive info; consistent terminology; references one level deep; Pipeline
   footer present. Save a verification scenario note in `references/scenario.md`.
5. **Update the pipeline graph** if the new skill changes the chain
   (`${CLAUDE_PLUGIN_ROOT}/shared/pipeline.md`), and emit a conventions routing entry if relevant.

## Pipeline
- Reads:  `${CLAUDE_PLUGIN_ROOT}/shared/authoring-standard.md`; `templates/`
- Writes: `skills/<name>/SKILL.md` (+ `references/`, `scripts/`); maybe `${CLAUDE_PLUGIN_ROOT}/shared/pipeline.md`
- Next:   (use the new skill)
