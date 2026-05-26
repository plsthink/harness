# PROJECT brief format

Cited by: `think`, `onboard`, `docs-review` (the writers + the periodic doc sweep that checks docs against this spec; consumers cite the project's `docs/PROJECT.md`, not this format spec).
`PROJECT.md` is a brief with a **closed** category list — never freeform. Bloat control is
structural (closed categories + per-entry size cap + links out), not willpower.

## The 3 categories (closed)

1. **Vision / goal** — ≤3 sentences.
2. **Hard constraints / non-negotiables** — bullets.
3. **External systems / integrations** — name + one line + link out to
   `docs/integrations/<sys>.md` for deep detail.

**Dropped on purpose:** team conventions → `CLAUDE.md` (always-on rules); vocabulary → the
glossary. Don't restate either here.

## No split

The closed-3-category cap + per-entry size cap + links-out already keep it tiny. Splitting a
capped-tiny doc into load-on-demand topic files is over-engineering — don't.

## Monorepo fan-out (asymmetric — matches doc locality)

- **Vision is a singleton at root.** `docs-review` flags a per-package vision as drift.
- **Integrations live in the package that owns them.**
- Per-package `PROJECT.md` is **sparse** — created only when a package has its own
  constraints/integrations. Rides the existing `CONTEXT-MAP.md` spine.

## Durable reversals

A "tried X, broke Y, don't go back" that is project-wide belongs here as a hard constraint (or in
a stance's `Rejected:` line, or CONTEXT `_Avoid_`). `docs-review` enforces placement.
