# 01 — max-length

Status: done
Type:   enhancement

## What to build
A `--max-length` cap that flows end to end. Tracer-bullet vertical slice: `cli` argv flag-parse →
`core` slugify cap → stdout. `core`'s slugify gains an optional second argument: when it is a
positive number, the finished Slug is cut to that many characters and any resulting trailing dash is
trimmed. The `cli` Invocation extracts `--max-length N` from argv, passes the cap to slugify, and
prints the bounded Slug; without the flag both packages behave exactly as today.

## Acceptance criteria
- `slugify(text, max)` caps the finished Slug to `max` characters and trims any resulting trailing
  dash, so the output is always a valid Slug — e.g. `slugify('Hello World', 6)` returns `hello`
  (`hello-` capped then edge-trimmed).
- `slugify(text)` and `slugify(text, n)` with `n` ≥ the Slug length return the Slug unchanged (the
  cap is a ceiling, not padding); slugify still throws `TypeError` on non-string text.
- `run(['--max-length', '6', 'Hello', 'World'])` returns `hello`; `run(['Hello', 'World'])` still
  returns `hello-world`.
- `run` given `--max-length` with a missing or non-numeric value throws a usage error, like empty
  input does.
- A `node --test` case in **each** package (`core` and `cli`) covers the bullets above, and
  `npm test` reports green from a fresh zero-install checkout.

## Blocked by
None.

## Comments
- _(AI) Authored as a harness multi-package mock fixture work item — a concrete ready-for-agent
  contract for dogfooding execute-issue/tdd against a monorepo. Fits the zero-dep / zero-install /
  npm-workspaces constraints; the slice deliberately cuts both `core` and `cli`._
- _(AI) Status:done reflects the feature shipping implemented as fixture content (`slugify(text,
  max)` cap in `core` + `--max-length` argv parse in `cli`, with a per-package `node --test` case
  each) — fixture intent, not a record that a skill was driven against it. `npm test` is green from a
  fresh zero-install checkout. The first skill actually run to completion against slug-mono was the
  isSlug + `--check` tdd slice; see `docs/work/learnings/tdd.md` and the mocks/README note._
