# Issue branches land via rebase + fast-forward, never a merge commit

**Stance:** An `issue-NN-slug` branch lands on its base by **rebasing onto the base then merging
`--ff-only`** — a linear history with no merge bubble. Procedure:
`${CLAUDE_PLUGIN_ROOT}/shared/git-workflow.md` Land procedure.

**Why:** `--no-ff` merge bubbles pollute the trunk with one noise commit per issue and obscure the
real change graph. Rebase+ff gives a readable linear history AND keeps the
`execute-issue-afk-autonomy` auditability guarantee intact — the `amend-spec` commits stay separate
and revertable as individual commits (a squash merge would have collapsed them, forcing that stance
to weaken; rebase+ff does not). Because this environment cannot run interactive rebase, the burden
shifts left to the builder's one-commit-per-task discipline (cited above).

**Rejected:** Squash merge — cleanest trunk but collapses the `amend-spec` commits (Why above).
`--no-ff` merge — the retired status quo; merge bubbles are the pollution this stance removes.
