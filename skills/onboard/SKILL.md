---
name: onboard
description: Bootstrap a project so harness skills (and bare agents) know how to work it — explore the repo, conduct the behavior-config interview (every key the schema requires), then write docs/AGENTS.md (with the parseable HARNESS-CONFIG block) + a thin CLAUDE.md pointer and seed the docs/ skeleton. Also maintains config — a partial re-onboard on a stale project asks only the missing key(s). Use when setting up a new project for the harness, or when skills report onboarding is incomplete. Manual invocation only.
disable-model-invocation: true
---

# onboard

PROJECT categories are closed (`${CLAUDE_PLUGIN_ROOT}/shared/project-doc.md`) and the tracker
is fixed (stance: tracker-always-local) — don't interview either. Harness skills **honor**
`docs/AGENTS.md` rather than re-encode it (stance: own-not-fork). onboard is the exempt
bootstrap skill — not self-gated (`${CLAUDE_PLUGIN_ROOT}/shared/onboarding-gate.md`).

## When to fire
- Manual: setting up a new project, or skills lack domain context.

## Procedure

1. **Explore** the repo's starting state: `git remote -v`; existing `CLAUDE.md`/`AGENTS.md`; any
   `docs/` (CONTEXT/CONTEXT-MAP/stances/work).
   Also detect a **prior ADR-style layout** to migrate (`docs/adr/NNNN-*.md`, `docs/agents/`,
   `.scratch/`, per-package `CONTEXT.md` *not* under `docs/`) — if present, step 5 runs the migration.
   **Already-onboarded?** Run
   `bash ${CLAUDE_PLUGIN_ROOT}/scripts/check-onboarded.sh "$CLAUDE_PROJECT_DIR"` (the gate's single
   source — `${CLAUDE_PLUGIN_ROOT}/shared/onboarding-gate.md`) and branch on its verdict:
   - **complete** — nothing to record; offer to revise existing answers, otherwise stop.
   - **stale** — a config block exists but is missing key(s) the script names. **Partial re-onboard:**
     interview (step 2) **only the named missing key(s)** and append their `key: value` lines inside
     the existing block, leaving the recorded answers untouched. Skip the full interview/write.
   - **absent** — no block: run the **full** flow (steps 2–3).
2. **Conduct the behavior-config interview** — settle a value for **every key the schema requires**
   (`${CLAUDE_PLUGIN_ROOT}/scripts/check-onboarded.schema` is the single source of *which* keys;
   walk its keys). Unbounded — ask what the project needs, not a fixed set. How to elicit each key
   (and defaults): [config.md](references/config.md).
3. **Confirm a draft**, then **write** (scaffold from `templates/` via `templates/scaffold.sh`):
   - `docs/AGENTS.md` (from `templates/docs/AGENTS.md`) — navigation protocol + the filled
     `<!-- HARNESS-CONFIG-START -->` block carrying **every** schema key's recorded value (this is
     what `check-onboarded.sh` reads; an incomplete block reports *stale*).
   - thin `CLAUDE.md` → `docs/AGENTS.md` pointer (never create AGENTS.md root-file if CLAUDE.md
     exists, or vice versa — edit the one present; if neither, ask which).
   - seed `docs/` skeleton: PROJECT/CONTEXT + empty `docs/conventions/INDEX.md` (delta over
     harness globals, starts empty). **If multi:** also CONTEXT-MAP + a per-package
     `packages/<pkg>/docs/CONTEXT.md` glossary stub for each package the spine routes to (so the
     spine never points at a missing file; `think` fills the terms later, as it does for root).
   - **Strip the template scaffolding** from every written file: drop the `<!-- … -->` authoring
     hints and resolve conditionals (e.g. the multi-package line in `AGENTS.md`) — the output is
     the project's own doc, not a half-filled template. **Exception — never strip the
     `<!-- HARNESS-CONFIG-START -->` / `<!-- HARNESS-CONFIG-END -->` markers**: they are the
     parseable contract `check-onboarded.sh` reads, not authoring hints. Strip only the per-key
     authoring hint comments *beside* the gloss lines; keep the markers and the `key: value` lines
     between them.
4. **Scaffold project-local Skills/Agents from the answers** (skip on a partial re-onboard that
   touched no procedure key). The rule is **scope×determinism** (PROJECT-specific *procedure* → a
   Skill; simple declarative *knob* → config — owned by the orchestrator-pivot PRD; see stance:
   conventions-not-personas):
   - **Skills for verify / test / lint — only when the procedure is NON-TRIVIAL** (a rich multi-step
     procedure). A one-line command stays the declarative `verify-method` / `test-command` config
     knob already recorded in step 3 — **no Skill**. When non-trivial, DEFER to `new-skill` with a
     **project-local target** (`.claude/skills/<name>/SKILL.md`) — don't reimplement scaffolding.
     Give each a clear verify / test / lint **purpose** in its description so the gate skill
     discovers it (resolution is by skill description, not a pinned filename; precedence over the
     config knob is owned by the gate skill — `agents/verifier.md` step 1, `skills/tdd/SKILL.md` intro).
   - **Agents — only where a distinct stance+tools is genuinely warranted** (the `new-agent`
     justification gate, not a persona label; see stance: agents-generic-floor). Most projects need
     none. When warranted, DEFER to `new-agent` with a project-local `.claude/agents/<name>.md`
     target.
   - **Human-confirm every scaffolded draft** before writing (onboard's step-3 confirm-a-draft
     posture — onboard is interactive, not a fork).
5. **Migrating an ADR-style project?** Only if step 1 found one — else skip. The explicit moves
   (per-package glossary location, ADR→stance rewrite, source-comment sweep, `.scratch`→`docs/work`)
   are in [migrate-adr.md](references/migrate-adr.md).
6. **Done:** tell the user which skills now read these, and that they can edit `docs/*` directly.

## Pipeline
- Reads:  the repo; `templates/`; `${CLAUDE_PLUGIN_ROOT}/shared/{triage-labels,project-doc,context-doc,stances-doc,onboarding-gate}.md`; `${CLAUDE_PLUGIN_ROOT}/scripts/{check-onboarded.sh,check-onboarded.schema}` (the behavior-config contract it interviews against)
- Writes: `docs/AGENTS.md` (incl. the parseable HARNESS-CONFIG block — every schema key), thin `CLAUDE.md`, `docs/{PROJECT,CONTEXT}.md` (+ `CONTEXT-MAP.md` and per-package `packages/<pkg>/docs/CONTEXT.md` if multi), `docs/conventions/INDEX.md`; via new-skill/new-agent: project-local `.claude/skills/<name>/SKILL.md` + `.claude/agents/<name>.md` (when warranted)
- Next:   new-skill (scaffold a project-local verify/test/lint Skill) | new-agent (a project-local agent) | think (start designing) | prd (if a plan already exists)
