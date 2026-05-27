# 03 — worktree-home

Status: ready-for-agent   <!-- see triage-labels.md state roles -->
Type: enhancement       <!-- bug|enhancement -->

## What to build
The execution loop creates per-issue worktrees in a central, harness-owned home outside the target
project tree, so no scan path or parent dir is polluted. Add the worktree-path section to the
product git-workflow module: worktrees live under a central harness home, namespaced per project by
the repo-root basename, then per issue branch; the location sits outside the project tree and its
parent, needs no gitignore entry, and is immune to the nearest-docs walk and the tree-scanning hooks.
Note that basename collision between two same-named repos is deferred (lean-first), with a finer key
added only if it bites.

Update the execution loop's worktree-creation step to create the worktree at this central home, and
adjust any worktree-cleanup wording in the loop's failsafe reference and the shared issue-tracker so
the removal path matches the new location.

## Acceptance criteria
- The product git-workflow module has a worktree-path section specifying the central harness home
  namespaced per project by repo-root basename, then per issue branch, with the rationale (outside
  the project tree and parent; immune to the nearest-docs walk and tree-scanning hooks; no gitignore)
  and the deferred-collision note.
- The execution loop's worktree-creation step creates the worktree under the central home (not inside
  the project tree, not a sibling of it) and cites the product module.
- Worktree-cleanup wording in the loop failsafe reference and the shared issue-tracker is consistent
  with the new location.
- Creating a worktree per the documented procedure leaves the target project's tree and its parent
  dir unmodified (nothing added to the project's status, no gitignore entry needed).
- The reference-integrity check passes; citations to the product module resolve.

## Blocked by
- 01 — the product git-workflow module is created there; this slice adds a section to it.

## Comments
<!-- AI-disclaimer on every agent comment -->
