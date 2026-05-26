# slug-mono — project brief

Closed 3-category brief. Keep tiny: per-entry size cap, links out for depth.

## Vision / goal
A two-package npm-workspaces monorepo: `core` turns arbitrary text into a Slug, `cli` wraps it as a
command. Exists as a harness multi-package mock fixture — small enough to read whole, real enough to
exercise the multi-package docs layout (root + per-package glossaries routed by `CONTEXT-MAP.md`).

## Hard constraints / non-negotiables
- Zero runtime dependencies — Node stdlib only.
- npm workspaces under `packages/*`; packages wired zero-install (`cli` requires `core` by relative
  path, so `npm test` is green on a fresh checkout with no `npm install`).
- A package owns its glossary terms in `packages/<pkg>/docs/CONTEXT.md`; project-wide terms stay at
  the root `docs/CONTEXT.md`.

## External systems / integrations
- None. Pure text in, slug out.
