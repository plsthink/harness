# Issue tracker — docs/work layout & semantics

Cited by: `prd`, `issues`, `triage`, `execute-issue`, `onboard`. The shared
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

- **Green path:** `Status: done` is committed inside the worktree and lands via the merge; then
  delete worktree+branch.
- **Escalation path:** on retry-exhaustion, do **not** merge. Write `Status:` (needs-info/
  ready-for-human) + findings + handoff-doc-path to the issue file on the **main checkout
  directly** (the kept worktree is for inspection only, never the source of truth for the failed
  status). Worktree = exclusive lock → no concurrent-edit conflict.

## Publish / fetch

Local-markdown tracker: "publish" = write the file + commit; "fetch" = read from `docs/work/`.
(A project may map these to an external tracker via its `docs/AGENTS.md` config — same file shape.)
