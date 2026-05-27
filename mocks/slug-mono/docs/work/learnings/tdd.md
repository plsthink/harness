# tdd — learnings (slug-mono)

- Multi-package vertical tracer: the one tracer test belongs in the consuming package's suite
  (`packages/cli/test`, the seam that cuts both packages); the new core op's contract tests belong
  in `packages/core/test`. Routing the tracer to the consumer proves the cross-package wiring (cli →
  core) in a single RED→GREEN, which a core-only tracer would not.
- For a tiny pure predicate (`isSlug`), the tracer's minimal code implements the whole op, so the
  later per-case core tests pass on write rather than going RED — the inherent tracer-vs-incremental
  tension for sub-function features; the incremental tests still stand as regression coverage.
