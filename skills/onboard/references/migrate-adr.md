# Onboard — migrating an ADR-style project

Loaded by `onboard` step 5 **only when step 1 detected a prior ADR-style layout** (`docs/adr/NNNN-*.md`,
`docs/agents/`, `.scratch/`, per-package `CONTEXT.md` *not* under `docs/`). Make these moves
explicit, not silent.

- **Per-package glossaries** go under `packages/<pkg>/docs/CONTEXT.md`, not `packages/<pkg>/CONTEXT.md`
  (`${CLAUDE_PLUGIN_ROOT}/shared/context-doc.md`); repoint `CONTEXT-MAP.md` after moving.
- **ADR → stance** in *doc prose*: rewrite `docs/adr/NNNN-*.md` → `docs/stances/<slug>.md`
  (`${CLAUDE_PLUGIN_ROOT}/shared/stances-doc.md`; drop the ADR numbers/Status/supersede) and flip
  the word `ADR`→`stance` across `PROJECT`/`CONTEXT` (and any domain-doc) prose. Drop superseded
  ADRs to git history.
- **Source-comment `ADR-NNNN` sweep** (often ~hundreds across many files): flag it as a **tracked
  follow-up** in `docs/stances/README.md` (transitional bridge), don't silently leave the bridge
  as if permanent. Sweep lazily on a clean tree if the code is mid-refactor.
- Move `.scratch/<slug>/` → `docs/work/<slug>/`; delete `docs/agents/` (folded into `docs/AGENTS.md`).
