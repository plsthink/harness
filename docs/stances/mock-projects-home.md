# Mock test-project fixtures live under mocks/<name>/, each self-contained with its own docs/

**Stance:** Mock projects — throwaway-but-committed target repos used to exercise harness skills
end-to-end (onboard → think → prd → issues → tdd → diagnose …) — live under `mocks/<name>/`. Each
carries its **own** `docs/` skeleton (AGENTS.md + PROJECT/CONTEXT + conventions/INDEX), so a skill
run with cwd inside the mock resolves the mock's `docs/` via the nearest-`docs/` walk, never the
harness's. They are plain files in the harness repo (no nested `.git`), not gitignored: a durable
fixture is a regression test for the harness.

**Why:** The objective mandates testing the harness against real-ish projects, and the two-roots
invariant (PROJECT.md) makes *where* a mock lives load-bearing. A mock with no `docs/` inside this
repo is a live hazard: the nearest-`docs/` walk climbs past `mocks/<name>/` to the harness root and
silently treats the harness's own PROJECT.md as the mock's. Giving every mock its own `docs/`
shadows the harness dogfood root and removes the collision. `mocks/` sits outside the five
authored dirs `check-refs.sh` scans (`skills/ agents/ shared/ conventions/ docs/`), so a mock's
internal docs are correctly treated as a separate project, not validated as harness product.

**Rejected:** Putting mocks outside the repo (a temp dir / sibling clone) — loses them as committed
regression fixtures and contradicts the objective's "inside this repo". Gitignoring them — same
loss; the point is that the fixture and the harness version that passed against it travel together.
