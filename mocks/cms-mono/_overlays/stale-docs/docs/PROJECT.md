# cms-mono — project brief

Closed 3-category brief. Keep tiny: per-entry size cap, links out for depth.

## Vision / goal
A three-package npm-workspaces monorepo: `core` parses markdown into a Block array and renders it to
HTML, `server` exposes a render-route HTTP endpoint over a markdown store via Express, `cli` walks an
input directory of `.md` files and writes the rendered `.html` alongside. Exists as a harness
multi-package mock fixture — small enough to read whole, real enough to exercise the multi-package
docs layout (root + per-package glossaries routed by `CONTEXT-MAP.md`).

## Hard constraints / non-negotiables
- Runtime dependencies: Express (server) + Node stdlib (everything else).
- npm workspaces under `packages/*`; packages wired zero-install (`server`, `cli` require `core` by
  relative path, so `npm test` is green on a fresh checkout).
- A package owns its glossary terms in `packages/<pkg>/docs/CONTEXT.md`; project-wide terms stay at
  the root `docs/CONTEXT.md`.

## External systems / integrations
- None. Markdown text in, HTML text out — either via the CLI or via a `GET /page/:slug` request.
