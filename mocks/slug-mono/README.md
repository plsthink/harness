# slug-mono

A dependency-free npm-workspaces monorepo and harness **multi-package** mock fixture.

- `packages/core` — `slugify(text, max?)`: text → Slug (pure, throws on non-string; optional `max` caps the Slug).
- `packages/cli` — `slug [--max-length N] <text...>`: parses argv, calls `core`, prints the Slug.

```sh
npm test                          # node --test auto-discovers both packages (9 tests, no install needed)
node packages/cli "Hello World"             # -> hello-world
node packages/cli --max-length 6 "Hello World"  # -> hello
```

## Why this fixture exists
todo-cli is single-context; this is the **multi-package** counterpart. It exercises the docs layout
that no single-context mock can: a root `docs/CONTEXT.md` of project-wide terms, a
`docs/CONTEXT-MAP.md` spine, and per-package `docs/CONTEXT.md` glossaries under each package. Use it
to drive think/docs-review/onboard against a monorepo.
