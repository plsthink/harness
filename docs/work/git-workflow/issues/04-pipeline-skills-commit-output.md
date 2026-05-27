# 04 — pipeline-skills-commit-output

Status: done   <!-- see triage-labels.md state roles -->
Type: enhancement       <!-- bug|enhancement -->

## What to build
The artifact-producing pipeline skills commit what they publish, so the execution loop can run in a
fresh session against a clean tree and its worktree inherits a fully-committed spec substrate. Add a
final commit step to think (commit its stances at session end), prd (commit the published PRD), and
issues (one commit for the whole slice breakdown). Each commit uses a conventional `docs`-typed
message per the product git-workflow module, with an optional domain scope or none and the feature
named in the subject (no prd/issue numbers anywhere). The commits are agent-issued, so the
enforcement hook governs them.

## Acceptance criteria
- think commits its stance files at session end; prd commits the published PRD; issues makes a single
  commit for the slice breakdown it publishes.
- Each commit message is a conventional `docs` commit (optional domain scope or none, feature in the
  subject, no prd/issue number) that passes the enforcement hook unmodified.
- After a prd run and after an issues run, the working tree has no pending changes for the artifacts
  that skill produced.
- The commit step is documented in each of the three skills, citing the product git-workflow module
  rather than restating the grammar.
- The reference-integrity check passes; citations to the product module resolve.

## Blocked by
- 01 — the product git-workflow module and its grammar (the optional-domain scope) are created
  there; these commits use that grammar and must pass its enforcement hook.

## Comments
<!-- AI-disclaimer on every agent comment -->
