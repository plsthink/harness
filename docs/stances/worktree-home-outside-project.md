# Issue worktrees live outside the project tree, in a central harness home

**Stance:** `execute-issue` creates per-issue worktrees under a central harness home,
`~/.harness/worktrees/<project-slug>/issue-NN-slug` (`project-slug` = the repo-root basename), never
inside the target project tree and never as a sibling of it. One tidy location the harness owns; the
target repo and its parent dir stay pristine. This is **product** behavior (it runs in any target
project) so the rule lives in the product git-workflow module (the follow-up PRD introduces it),
not under `docs/`.

**Why:** A worktree placed inside the repo would be walked by the nearest-`docs/` resolution and
traversed by tree-scanning hooks (`check-refs.sh`, the mock `PostToolUse` gate) — the exact hazard
`mock-projects-home` exists to neutralize — and would need a gitignore entry to keep `git status`
clean. A sibling dir avoids the tree but clutters the parent, assumes the parent is writable, and
collides when two repos share a name. A central home dodges all three: out of every scan path, no
gitignore, and the only project that touches it is the one running. Basename collision between two
same-named repos is a deferred concern (lean-first) — add a path-hash to the slug only if it bites.

**Rejected:** In-repo `.worktrees/` — sits inside the nearest-`docs/` walk + hook-scan surface, the
hazard `mock-projects-home` removes; needs gitignoring. Sibling `<repo>.worktrees/` — clutters the
parent, needs a writable parent, name-collides.
