# execute-issue runs AFK; the quality gate is upstream at ready-for-agent

**Stance:** `execute-issue` runs fully AFK on a `ready-for-agent` issue — decomposing tasks at
runtime, forking a fresh builder subagent per task from the parent's full context, two-stage
reviewing against the issue's acceptance criteria, with bounded retries (~3). The quality gate
lives **upstream** in the human `think→issues→triage` pass that stamps `ready-for-agent`; a
stamped issue is a trusted contract. On retry-exhaustion: stop, do **not** merge, write findings +
flip `Status:` on the main checkout, emit a handoff doc.

**Why:** Moving the gate upstream is what makes AFK execution safe — tasks are internal and not
human-gated because the gate already happened. Forking each task fresh from the parent point gives
full-fidelity context with no cross-task drift (siblings fork independently). A worktree per issue
is an exclusive lock, so green-rides-the-merge while escalation writes status to main directly —
no concurrent-edit conflict. This implies `issues`/`triage` need an explicit "thought-enough"
checklist before stamping.

**Rejected:** Human-gating each decomposed task — caused the loop to stop being AFK; the gate is
the upstream promotion instead. Agent-teams/messaging for the loop — unnecessary for a linear loop.
