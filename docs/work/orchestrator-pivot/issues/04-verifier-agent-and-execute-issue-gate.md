# 04 — verifier-agent-and-execute-issue-gate

Status: done
Type: enhancement

## What to build
Add the `verifier` agent (dynamic stance+tools — builds and runs the app — authored via new-agent)
and wire it into execute-issue as a conditional second gate after `reviewer`: it runs only when the
issue's acceptance criteria declare observable runtime behavior, loading the project's verify
procedure (the verify-method config / a project-local verify Skill); otherwise it is skipped. A
verifier failure feeds the existing bounded-retry / escalation channel.

## Acceptance criteria
- A `verifier` agent exists with a dynamic run-the-app stance+tools, distinct from `reviewer`'s
  static read-only stance.
- In execute-issue, an issue whose criteria declare observable behavior triggers `verifier` after
  `reviewer` passes; a doc-only / pure-refactor issue skips it.
- `verifier` resolves how to verify from the project's verify config / verify Skill, not hardcoded.
- A verifier failure routes into the same bounded-retry / escalation path as a reviewer failure.

## Blocked by
- 01
- 03

## Comments
