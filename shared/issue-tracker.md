# Issue tracker — docs/work layout & semantics

Cited by: `prd`, `issues`, `triage`, `execute-issue`. The shared
state every pipeline skill reads/writes. File substrate is the single source of truth.

## Layout (always at repo root, committed)

```
docs/work/<feature>/
  PRD.md
  issues/NN-slug.md      # NN = zero-padded order; slug = stable kebab id
docs/work/learnings/<skill>.md
.out-of-scope/<concept>.md   # repo-root rejected-enhancement KB (one file per concept, not per issue)
```
`.out-of-scope/` is a **repo-root** dir (sibling of `docs/`, project-wide — not per-feature):
`triage` writes/reads it on the `wontfix`-enhancement path (`triage-labels.md`, `OUT-OF-SCOPE.md`).
Work substrate stays at **repo root even in a monorepo** (only domain docs fan out per-package).
Committed to the target project's git — the substrate *is* the spec; worktrees inherit it.

## Issue file shape

```
# NN — slug

Status: <state>     # see triage-labels.md state roles
Type:   <category>  # bug | enhancement

## What to build        — tracer-bullet vertical slice (cuts all layers, demoable)
## Acceptance criteria   — the contract execute-issue checks against
## Blocked by            — issue numbers, dependency order
## Comments              — AI-disclaimer on every agent comment
```
`issues` writes these in dependency order; never edits the parent PRD.

## Status semantics

- `Status:`/`Type:` are machine-read lines (see `triage-labels.md` for roles + state machine).
- **`ready-for-agent`** = trusted contract: the human gate (`think`→`issues`→`triage`) is done, so
  `execute-issue` runs fully AFK. Stamping it requires the "thought-enough" checklist.

## Status merge-back (execute-issue)

- **Green path:** `Status: done` is committed inside the worktree, then the branch lands per
  `${CLAUDE_PLUGIN_ROOT}/shared/git-workflow.md` "Land procedure".
- **Escalation path:** on retry-exhaustion, do **not** merge. Write `Status:` (needs-info/
  ready-for-human) + findings + handoff-doc-path to the issue file on the **main checkout
  directly** (the kept worktree is for inspection only, never the source of truth for the failed
  status). Worktree = exclusive lock → no concurrent-edit conflict.

## Reap (done-feature cleanup)

The reaper (`${CLAUDE_PLUGIN_ROOT}/scripts/reap-done-features.sh`) sweeps spent feature dirs so the
tracker shows only live work.

- **Trigger:** `execute-issue`'s **green path only**, after the land completes.
- **Guard (present AND all-done):** a feature dir is reaped only when its issue set is **non-empty**
  AND **every** issue reads `Status: done`. An empty issue set is never reaped — that is work not yet
  broken down, not finished work (the load-bearing vacuous-done guard).
- **Concurrency:** sibling issues land serially via rebase-plus-fast-forward (see
  `${CLAUDE_PLUGIN_ROOT}/shared/git-workflow.md`), so only the **last** sibling to land observes
  every sibling as `done` — that lander reaps. Race-free by construction; no locking.
- **Action:** hard-delete the whole `docs/work/<feature>/` dir (PRD + issues together); git history
  is the archive. Recorded as ONE `docs`-typed commit scoped to the feature slug, never an issue/PRD
  number.
- **No pre-delete reference check** (see PRD `docs/work/reap-done-features/`): the commit grammar
  already forbids durable refs to deletable artifacts, so a surviving inbound link is an invariant
  violation, not an expected case. `docs/scripts/check-refs.sh` (auto-run by the path-gated
  PostToolUse hook) is the loud safety net — a dangling ref turns it red and the reap is reverted.

## Publish / fetch

The tracker is always local `docs/work/` (see stance: tracker-always-local): "publish" = write the
file + commit; "fetch" = read from `docs/work/`.
