# superpowers — influence record

Source: (superpowers execution-loop pattern)   Pinned: idea-only, no commit pinned
Install: **idea-only, no install**

## What we took
- The **worktree + subagent-per-task execution loop** → `execute-issue`: git worktree
  per issue, a fresh subagent dispatched per task (a thin pointer-brief, not a context-inheriting
  fork — see stance: dispatch-fresh-not-fork), two-stage review against acceptance criteria, AFK
  with bounded retry.

## What we dropped (why)
- Installing superpowers as a package — dropped: we take the idea, not the install.
- Agent-teams / inter-agent messaging for the loop — dropped: fresh dispatched subagents
  suffice for a linear loop; teams env stays on but unused here.

## Re-diff protocol
- No pinned source; this is a pattern, not a tracked dependency. Re-evaluate only if the upstream
  loop design materially changes and we hear of it. No mechanical diff.
