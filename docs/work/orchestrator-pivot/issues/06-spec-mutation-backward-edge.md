# 06 — spec-mutation-backward-edge

Status: done
Type: enhancement

## What to build
Give execute-issue the graded backward edge. On a **path-level** failure (the issue/PRD's *how* is
wrong but "done" is unchanged for the human), the Orchestrator re-enters think/prd/issues as forks
to amend the spec, re-stamps `ready-for-agent`, and re-dispatches — autonomously. On a **goal-level**
divergence (scope change, new user-facing decision) or any ambiguity, it escalates HITL: stop, do
not merge, write findings, flip status on main, hand off. Amendments are recorded and revertable via
the per-issue worktree + git.

## Acceptance criteria
- A simulated path-level failure causes an autonomous spec amendment + re-stamp + re-dispatch, with
  the amendment recorded.
- A simulated goal-level divergence (or ambiguous case) escalates: stops, does not merge, writes
  findings, flips status on main, emits a handoff.
- The classification follows "does done change for the human", with default-to-escalate on ambiguity.
- Every autonomous amendment is auditable and revertable from git history.

## Blocked by
- 04

## Comments
