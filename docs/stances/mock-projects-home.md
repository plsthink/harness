# Mock test-project fixtures live under mocks/<name>/, each self-contained with its own docs/

**Stance:** Mock projects — throwaway-but-committed target repos used to exercise harness skills
end-to-end (onboard → think → prd → issues → tdd → diagnose …) — live under `mocks/<name>/`. Each
carries its **own** `docs/` skeleton (AGENTS.md + PROJECT/CONTEXT + conventions/INDEX), so a skill
run with cwd inside the mock resolves the mock's `docs/` via the nearest-`docs/` walk, never the
harness's. They are plain files in the harness repo (no nested `.git`), not gitignored: a durable
fixture is a regression test for the harness.
Each mock follows a `_base/` + `_overlays/<variant>/` layout (overlays merge onto a staged copy
of the base) so the same fixture supplies multiple per-scenario pre-states without duplicating the
base.

**Why:** The objective mandates testing the harness against real-ish projects, and the two-roots
invariant (PROJECT.md) makes *where* a mock lives load-bearing. A mock with no `docs/` inside this
repo is a live hazard: the nearest-`docs/` walk climbs past `mocks/<name>/` to the harness root and
silently treats the harness's own PROJECT.md as the mock's. Giving every mock its own `docs/`
shadows the harness dogfood root and removes the collision. `mocks/` sits outside the authored
dirs `check-refs.sh` scans (`skills/ agents/ shared/ conventions/ docs/`, plus a monorepo's
`packages/*/docs`), so a mock's internal docs are correctly treated as a separate project, not
validated as harness product. A fixture only regresses if something checks it: that check happens
when a skill is dogfooded against a *staged copy* (the overlay merged onto `_base/`, where
`check-refs.sh` runs against a real `docs/` root), or on demand by pointing it at the specific
subroot — `check-refs.sh mocks/<name>/_base`, and each `_overlays/<variant>`. `check-refs.sh` treats
a root with no authored markdown as clean (exit 0, not a block), so a code-only or mid-construction
fixture is never falsely blocked.

**Multi-package:** Mocks come in two shapes so the harness's single and multi-package docs paths
both get a fixture. `url-shorten/` and `task-runner/` are single-context (flat `docs/`);
`cms-mono/` is a multi-package npm-workspaces monorepo carrying a root glossary, a
`docs/CONTEXT-MAP.md` spine, and per-package `packages/<pkg>/docs/CONTEXT.md` glossaries — the
per-package fan-out `${CLAUDE_PLUGIN_ROOT}/shared/context-doc.md` defines, which no single mock can
exercise. `check-refs.sh` scans `packages/*/docs` precisely so this fan-out is validated like the
root `docs/`.

**Rejected:** Putting mocks outside the repo (a temp dir / sibling clone) — loses them as committed
regression fixtures and contradicts the objective's "inside this repo". Gitignoring them — same
loss; the point is that the fixture and the harness version that passed against it travel together.
An auto-firing path-gated `PostToolUse` hook that ran `check-refs.sh` on a mock's root — the
`_base/`+`_overlays/<variant>/` layout nests each mock's docs *below* `mocks/<name>/`, so the hook
scanned a root with no authored markdown and was a silent no-op; removed rather than deepened
(scanning an overlay in isolation would risk false-blocking a doc that resolves only after the
overlay merges onto `_base/`).
