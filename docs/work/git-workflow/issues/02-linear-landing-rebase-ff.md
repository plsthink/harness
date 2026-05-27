# 02 — linear-landing-rebase-ff

Status: done   <!-- see triage-labels.md state roles -->
Type: enhancement       <!-- bug|enhancement -->

## What to build
Issue branches land on their base linearly, with no merge commit. Add the land-procedure section to
the product git-workflow module: rebase the issue branch onto its base, then fast-forward only, run
from the main checkout and never from inside the worktree; order is ensure-base-current → rebase →
fast-forward → verify green → remove worktree → delete branch. Retire the no-fast-forward merge.
State that squash is rejected because it would collapse the separate spec-amendment commits and break
their revertable-as-distinct-units guarantee.

Update every consumer that currently prescribes or describes the merge: the execution loop's land
step, the loop's failsafe reference's status-merge-back section, and the shared issue-tracker
status-merge-back section — each must drop the no-fast-forward merge and the "lands via the merge"
wording and instead cite the product module's rebase-plus-fast-forward procedure as the single
source.

## Acceptance criteria
- The product git-workflow module has a land-procedure section: rebase onto base then fast-forward
  only, run from the main checkout, with the full order and the explicit no-squash rationale.
- The execution loop's land step, the loop failsafe reference, and the shared issue-tracker
  status-merge-back section no longer prescribe a no-fast-forward merge or say "lands via the merge";
  they cite the product module's land procedure instead (single source, not restated).
- Following the documented procedure, an issue branch lands as a fast-forward producing no merge
  commit, and the spec-amendment commits remain as distinct, individually revertable commits on the
  linear trunk.
- No consumer still references the retired merge strategy anywhere in the touched files.
- The reference-integrity check passes; citations to the product module resolve.

## Blocked by
- 01 — the product git-workflow module is created there; this slice adds a section to it.

## Comments
<!-- AI-disclaimer on every agent comment -->
