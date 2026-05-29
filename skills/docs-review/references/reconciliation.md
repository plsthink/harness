# Convention reconciliation

Loaded by `docs-review` step 2. Reconciles a project's `docs/conventions/` against the harness
globals `${CLAUDE_PLUGIN_ROOT}/conventions/`. Delta-principle: project conventions =
delta over harness, never a restatement (single-source). Requires stable **rule-ids** so an
`overrides: <rule-id>` marker can reference a harness rule across the boundary.

## The three cases

- **project rule ⊆ harness** (project restates a global rule) → **redundant** → **remove from the
  project** (apply project-side on confirm).
- **project rule ⊃ harness** ("A+B" vs global "A") → keep delta **B** in the project; if B is
  project-agnostic, **route B as a promotion candidate** — a human applies it in the harness repo
  (respects the cross-repo boundary + the manual promotion-test gate, learnings.md). Do NOT edit
  the harness repo from a target-project review.
- **conflict** (project rule contradicts a harness rule) → either mark an **explicit override**
  (`overrides: <rule-id>` — a deliberate project exception that survives future reconciliation,
  like a stance's `Rejected:`) or remove it as drift. Ask the user which.

Reconciliation changes only the *stored* set, not runtime precedence (see `conventions/INDEX.md`).
