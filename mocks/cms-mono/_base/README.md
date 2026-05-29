# cms-mono

A tiny markdown CMS, packaged as an npm-workspaces monorepo. Exists as a harness multi-package mock
fixture — small enough to read whole, real enough to exercise the harness's multi-package context
fan-out (root glossary + `docs/CONTEXT-MAP.md` + per-package `packages/<pkg>/docs/CONTEXT.md`).

## Packages

- **`@cms-mono/core`** — pure markdown parsing + HTML rendering.
- **`@cms-mono/server`** — render-route HTTP server: `GET /page/:slug` reads markdown from a store,
  parses via `core`, returns HTML.
- **`@cms-mono/cli`** — `cms-build <inputDir>` reads every `.md` file under a directory, renders each
  via `core`, writes the matching `.html` to `--out` (default `./out`).

## Run tests

```
npm test
```

(Zero install required — packages reference each other by relative path, so a fresh checkout runs
`npm test` green without `npm install`.)
