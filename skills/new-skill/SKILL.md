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
   **Target:** default is a **harness skill** (`skills/<name>/SKILL.md`). When the caller wants a
   **project-local Skill** (e.g. `onboard` scaffolding a project's verify/test procedure the global
   verifier/tdd defer to), pass a `.claude/skills/<name>/SKILL.md` dest instead — same template,
   same `scaffold.sh` (it refuses to overwrite either way). Pick the target from the request; don't
   write a project-local Skill into the harness's own `skills/`.
3. **Draft:** fill the SKILL.md (description + triggers + ordered procedure + Pipeline footer)
   per the rules cited above.
4. **Review:** standard cited above; no time-sensitive info; consistent terminology.
5. **Update the pipeline graph** if the new skill changes the chain
   (`${CLAUDE_PLUGIN_ROOT}/shared/pipeline.md`), and emit a conventions routing entry if relevant.

## Pipeline
- Reads:  `${CLAUDE_PLUGIN_ROOT}/shared/authoring-standard.md`; `templates/`
- Writes: `skills/<name>/SKILL.md` (harness skill) **or** project-local `.claude/skills/<name>/SKILL.md` (+ `references/`, `scripts/`); maybe `${CLAUDE_PLUGIN_ROOT}/shared/pipeline.md`
- Next:   (use the new skill)
