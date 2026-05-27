---
name: onboard
description: Bootstrap a project so harness skills (and bare agents) know how to work it — explore the repo, conduct the behavior-config interview (every key the schema requires), then write docs/AGENTS.md (with the parseable HARNESS-CONFIG block) + a thin CLAUDE.md pointer and seed the docs/ skeleton. Also maintains config — a partial re-onboard on a stale project asks only the missing key(s). Use when setting up a new project for the harness, or when skills report onboarding is incomplete. Manual invocation only.
disable-model-invocation: true
---

# onboard

The project bootstrap — and the maintainer of the project's
behavior-config. Writes the tool-agnostic `docs/AGENTS.md` entrypoint that harness skills **honor**
rather than re-encode (single-source, see stance: own-not-fork), including the parseable
`<!-- HARNESS-CONFIG-START -->` block that `check-onboarded.sh` reads. PROJECT categories are closed
(`${CLAUDE_PLUGIN_ROOT}/shared/project-doc.md`), so don't grill "what counts as CONTEXT" — conduct
the behavior-config interview + seed the skeleton. The tracker is always local `docs/work/` with the
canonical harness labels (see stance: tracker-always-local) — not a choice to settle. onboard itself
is the exempt bootstrap skill — it is **not** self-gated (`${CLAUDE_PLUGIN_ROOT}/shared/onboarding-gate.md`).

## When to fire
- Manual: setting up a new project, or skills lack domain context.

## Procedure

1. **Explore** the repo's starting state: `git remote -v`; existing `CLAUDE.md`/`AGENTS.md`; any
   `docs/` (CONTEXT/CONTEXT-MAP/stances/work).
   Also detect a **prior ADR-style layout** to migrate (`docs/adr/NNNN-*.md`, `docs/agents/`,
   `.scratch/`, per-package `CONTEXT.md` *not* under `docs/`) — if present, step 4 runs the migration.
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
   (and defaults): [config.md](references/config.md). On a partial re-onboard, ask only the missing
   key(s) from step 1.
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
     Give each a clear verify / test / lint **purpose** in its description so the global resolvers
     discover it (resolution is by skill description, not a pinned filename): `verifier` prefers a
     project-local verify Skill over `verify-method`, `tdd` prefers a project test Skill over
     `test-command`; a lint Skill if lint is its own non-trivial procedure.
   - **Agents — only where a distinct stance+tools is genuinely warranted** (the `new-agent`
     justification gate, not a persona label; see stance: agents-generic-floor). Most projects need
     none. When warranted, DEFER to `new-agent` with a project-local `.claude/agents/<name>.md`
     target.
   - **Human-confirm every scaffolded draft** before writing (onboard's step-3 confirm-a-draft
     posture — onboard is interactive, not a fork).
5. **Migrating a ADR-style project?** (only if step 1 found one — else skip.) Make these explicit,
   not silent:
   - **Per-package glossaries** go under `packages/<pkg>/docs/CONTEXT.md`, not `packages/<pkg>/CONTEXT.md`
     (`${CLAUDE_PLUGIN_ROOT}/shared/context-doc.md`); repoint `CONTEXT-MAP.md` after moving.
   - **ADR → stance** in *doc prose*: rewrite `docs/adr/NNNN-*.md` → `docs/stances/<slug>.md`
     (`${CLAUDE_PLUGIN_ROOT}/shared/stances-doc.md`; drop the ADR numbers/Status/supersede) and flip the word `ADR`→`stance` across
     `PROJECT`/`CONTEXT` (and any domain-doc) prose. Drop superseded ADRs to git history.
   - **Source-comment `ADR-NNNN` sweep** (often ~hundreds across many files): flag it as a **tracked
     follow-up** in `docs/stances/README.md` (transitional bridge), don't silently leave the bridge
     as if permanent. Sweep lazily on a clean tree if the code is mid-refactor.
   - Move `.scratch/<slug>/` → `docs/work/<slug>/`; delete `docs/agents/` (folded into `docs/AGENTS.md`).
6. **Done:** tell the user which skills now read these, and that they can edit `docs/*` directly.

## Pipeline
- Reads:  the repo; `templates/`; `${CLAUDE_PLUGIN_ROOT}/shared/{triage-labels,project-doc,context-doc,stances-doc,onboarding-gate}.md`; `${CLAUDE_PLUGIN_ROOT}/scripts/{check-onboarded.sh,check-onboarded.schema}` (the behavior-config contract it interviews against)
- Writes: `docs/AGENTS.md` (incl. the parseable HARNESS-CONFIG block — every schema key), thin `CLAUDE.md`, `docs/{PROJECT,CONTEXT}.md` (+ `CONTEXT-MAP.md` and per-package `packages/<pkg>/docs/CONTEXT.md` if multi), `docs/conventions/INDEX.md`; via new-skill/new-agent: project-local `.claude/skills/<name>/SKILL.md` + `.claude/agents/<name>.md` (when warranted)
- Next:   new-skill (scaffold a project-local verify/test/lint Skill) | new-agent (a project-local agent) | think (start designing) | prd (if a plan already exists)
