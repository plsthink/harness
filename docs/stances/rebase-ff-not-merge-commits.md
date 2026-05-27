# Issue branches land via rebase + fast-forward, never a merge commit

**Stance:** An `issue-NN-slug` branch lands on its base by **rebasing onto the base then merging
`--ff-only`** — a linear history with no merge bubble. The previous `git merge --no-ff` is retired.
Run it from the main checkout (never inside the worktree): `cd` main → `git fetch`/ensure base
current → rebase the issue branch onto base → `git merge --ff-only issue-NN-slug` → verify green →
`git worktree remove` → `git branch -d`. Every builder + `amend-spec` commit survives as a distinct,
revertable commit on the linear trunk.

**Why:** `--no-ff` merge bubbles pollute the trunk with one noise commit per issue and obscure the
real change graph. Rebase+ff gives a readable linear history AND keeps the
`execute-issue-afk-autonomy` auditability guarantee intact — the `amend-spec` commits stay separate
and revertable as individual commits (a squash merge would have collapsed them, forcing that stance
to weaken; rebase+ff does not). Because this environment cannot run interactive rebase, the burden
shifts left: the builder must author **one clean conventional commit per task** so the commits that
land verbatim on the trunk are already meaningful (per the product git-workflow module the
follow-up PRD introduces).

**Rejected:** Squash merge — one commit per issue is the cleanest trunk but collapses the separate
`amend-spec` commits, breaking the "revertable as distinct units" guarantee of
`execute-issue-afk-autonomy`. `--no-ff` merge — the retired status quo; merge bubbles are the
pollution this stance removes.
