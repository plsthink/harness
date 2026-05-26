# mocks/ — harness test-project fixtures

Throwaway-but-committed target repos for exercising harness skills end-to-end against real-ish
code. See stance: `docs/stances/mock-projects-home.md`.

## Rules
- Each mock is `mocks/<name>/` with its **own** `docs/` skeleton — its `docs/` shadows the harness
  dogfood root via the nearest-`docs/` walk, so a skill run with cwd inside the mock never reads
  the harness's own `docs/`. Always `cd mocks/<name>` before driving a skill against it.
- Plain files, no nested `.git`. `mocks/` is outside the dirs `docs/scripts/check-refs.sh` scans,
  so a mock's internal docs are not validated as harness product.
- A mock + the harness version that passed against it travel together in git history — the fixture
  is a regression test.

## Fixtures
- **todo-cli/** — dependency-free single-file Nodejs todo CLI (`todo.js` + own `docs/` skeleton).
  Use it to drive think/prd/issues/tdd/diagnose; to re-test the `onboard` skill, copy it to a
  throwaway dir and strip its `docs/` first.
- **slug-mono/** — dependency-free npm-workspaces monorepo (`packages/core` + `packages/cli`). The
  **multi-package** counterpart to todo-cli: it carries a root glossary, a `docs/CONTEXT-MAP.md`
  spine, and per-package `packages/<pkg>/docs/CONTEXT.md` glossaries, so it exercises the
  multi-package docs layout (and `check-refs.sh`'s `packages/*/docs` coverage) that a
  single mock cannot. Carries a completed `docs/work/max-length/` item (Status: done) whose slice cut
  both packages, dogfooding the prd/issues/execute-issue pipeline against a monorepo end to end.

## Caveat
A mock has no `git remote` of its own (it lives in the harness repo), so `onboard` step 1's
`git remote -v` reports the harness remote. Treat tracker detection as manual for mocks.
