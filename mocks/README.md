# mocks/ — harness test-project fixtures

Throwaway-but-committed target repos for exercising harness skills end-to-end against real-ish
code. The corpus is how harness behavior is regression-tested: a mock + the harness version that
passed against it travel together in git history. See stance:
`docs/stances/mock-projects-home.md`.

## Rules
- Each mock is `mocks/<name>/` with its **own** `docs/` skeleton — its `docs/` shadows the harness
  dogfood root via the nearest-`docs/` walk, so a skill run with cwd inside the mock never reads
  the harness's own `docs/`. Always `cd mocks/<name>` (or `cd` into a staged copy) before driving a
  skill against it.
- Plain files, no nested `.git`. `mocks/` is outside the dirs `docs/scripts/check-refs.sh` scans,
  so a mock's internal docs are not validated as harness product.
- A mock + the harness version that passed against it travel together in git history — the fixture
  is a regression test.
- Each fixture follows the `_base/` + `_overlays/<variant>/` layout: stage with
  `docs/scripts/stage-mock.sh` (copies `_base/` then merges the named overlay on top — the single
  source of that dotfile-inclusive merge). `_overlays/clean/` is the no-op overlay (un-onboarded
  starting state); `_overlays/onboarded/` adds the `docs/` skeleton + behavior-config block.

## Fixtures
- **url-shorten/** — dependency-free single-file-ish Node CLI URL shortener. Single-context shape.
  Use for skill exercises that don't need a multi-package surface (the bulk of them).
- **cms-mono/** — npm-workspaces monorepo with `@cms-mono/{core,server,cli}`. The **multi-package**
  counterpart: carries a root glossary, a `docs/CONTEXT-MAP.md` spine, and per-package
  `packages/<pkg>/docs/CONTEXT.md` glossaries, so it exercises the multi-package docs layout
  (and `check-refs.sh`'s `packages/*/docs` coverage) that no single-context mock can.
- **task-runner/** — single-context Node library with a plugin API. Same shape as url-shorten but
  with a deliberately shallow plugin loader in `_overlays/shallow/` for deepening exercises.

Each fixture's own `README.md` (per-mock or per-`_base/`) is the project-level entrypoint a
staged copy reads; this top-level `mocks/README.md` is the harness-maintainer view of the corpus.

## Usage

Driving a single skill manually against a mock — stage it, then invoke the skill in the staged copy
exactly as a fresh agent would:

```
cd "$(docs/scripts/stage-mock.sh <name> <variant>)"   # e.g. stage-mock.sh url-shorten clean
```

`stage-mock.sh` copies `_base/` then merges `_overlays/<variant>/` on top into a fresh scratch dir
(or a `[dest]` you pass) and prints the staged path — so the merge (dotfiles included) is identical
every run. Then drive the skill from that dir.

## Caveat
A mock has no `git remote` of its own (it lives in the harness repo), so `onboard` step 1's
`git remote -v` reports the harness remote. Treat tracker detection as manual for mocks.

A mock shares the harness's `.git` (no nested repo, by stance — never cloned out). So
execute-issue's worktree (step 2) and land+reap (step 8) cannot run isolated against a mock:
`git worktree`/branch/land/`reap-done-features.sh` would operate on the harness repo itself, keyed
on basename `harness`, landing mock commits on the harness trunk. Dogfood those git mechanics
against a real standalone repo (the harness itself); against a mock, drive only execute-issue's
inner loop in-place (steps 0,1,3–7).
