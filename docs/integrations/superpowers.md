# superpowers — influence record

Source: (superpowers execution-loop pattern)   Pinned: idea-only, no commit pinned
Install: **idea-only, no install**

## What we took
- The **worktree + subagent-per-task execution loop** → `execute-issue`: git worktree
  per issue, fresh forked subagent per task, two-stage review against acceptance criteria, AFK
  with bounded retry.

## What we dropped (why)
- Installing superpowers as a package — dropped: we take the idea, not the install.
- Agent-teams / inter-agent messaging for the loop — dropped: forked subagents from parent context
  suffice for a linear loop; teams env stays on but unused here.

## Re-diff protocol
- No pinned source; this is a pattern, not a tracked dependency. Re-evaluate only if the upstream
  loop design materially changes and we hear of it. No mechanical diff.
