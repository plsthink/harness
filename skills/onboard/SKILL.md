---
name: onboard
description: Bootstrap a project so harness skills (and bare agents) know how to work it — explore the repo, settle 3 config choices, then write docs/AGENTS.md + a thin CLAUDE.md pointer and seed the docs/ skeleton. Use when setting up a new project for the harness, or when skills appear to be missing context about the tracker, labels, or domain docs. Manual invocation only.
disable-model-invocation: true
---

# onboard

The project bootstrap. Writes the tool-agnostic `docs/AGENTS.md`
entrypoint that harness skills **honor** rather than re-encode (single-source, see stance:
own-not-fork). PROJECT categories are closed (`${CLAUDE_PLUGIN_ROOT}/shared/project-doc.md`),
so don't grill "what counts as CONTEXT" — just settle 3 config choices + seed the skeleton.

## When to fire
- Manual: setting up a new project, or skills lack tracker/label/domain context.

## Procedure

1. **Explore** the repo's starting state: `git remote -v`; existing `CLAUDE.md`/`AGENTS.md`; any
   `docs/` (CONTEXT/CONTEXT-MAP/stances/work); whether a local-markdown tracker is already in use.
   Also detect a **prior ADR-style layout** to migrate (`docs/adr/NNNN-*.md`, `docs/agents/`,
   `.scratch/`, per-package `CONTEXT.md` *not* under `docs/`) — if present, step 3 runs the migration.
2. **Settle the 3 config choices** one at a time (assume the user may not know the terms — short
   explainer each). Detail + defaults: [config.md](references/config.md).
   - **Tracker** — GitHub / GitLab / local-markdown `docs/work/` / other (freeform).
   - **Labels** — map the canonical triage roles to the tracker's actual labels
     (`${CLAUDE_PLUGIN_ROOT}/shared/triage-labels.md`).
   - **Context** — single vs multi-package (rides `CONTEXT-MAP.md`).
3. **Confirm a draft**, then **write** (scaffold from `templates/`):
   - `docs/AGENTS.md` (from `templates/docs/AGENTS.md`) — navigation protocol + the 3 choices.
   - thin `CLAUDE.md` → `docs/AGENTS.md` pointer (never create AGENTS.md root-file if CLAUDE.md
     exists, or vice versa — edit the one present; if neither, ask which).
   - seed `docs/` skeleton: PROJECT/CONTEXT (+ CONTEXT-MAP if multi) + empty
     `docs/conventions/INDEX.md` (delta over harness globals, starts empty).
4. **Migrating a ADR-style project?** (only if step 1 found one — else skip.) Make these explicit,
   not silent:
   - **Per-package glossaries** go under `packages/<pkg>/docs/CONTEXT.md`, not `packages/<pkg>/CONTEXT.md`
     (`${CLAUDE_PLUGIN_ROOT}/shared/context-doc.md`); repoint `CONTEXT-MAP.md` after moving.
   - **ADR → stance** in *doc prose*: rewrite `docs/adr/NNNN-*.md` → `docs/stances/<slug>.md`
     (Stance/Why/Rejected, no numbers/Status/supersede) and flip the word `ADR`→`stance` across
     `PROJECT`/`CONTEXT` (and any domain-doc) prose. Drop superseded ADRs to git history.
   - **Source-comment `ADR-NNNN` sweep** (often ~hundreds across many files): flag it as a **tracked
     follow-up** in `docs/stances/README.md` (transitional bridge), don't silently leave the bridge
     as if permanent. Sweep lazily on a clean tree if the code is mid-refactor.
   - Move `.scratch/<slug>/` → `docs/work/<slug>/`; delete `docs/agents/` (folded into `docs/AGENTS.md`).
5. **Done:** tell the user which skills now read these, and that they can edit `docs/*` directly.

## Pipeline
- Reads:  the repo; `templates/`; `${CLAUDE_PLUGIN_ROOT}/shared/{triage-labels,project-doc,context-doc}.md`
- Writes: `docs/AGENTS.md`, thin `CLAUDE.md`, `docs/{PROJECT,CONTEXT}.md`, `docs/conventions/INDEX.md`
- Next:   think (start designing) | prd (if a plan already exists)
