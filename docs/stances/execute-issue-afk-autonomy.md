# execute-issue runs AFK; the quality gate is upstream at ready-for-agent

**Stance:** `execute-issue` runs fully AFK on a `ready-for-agent` issue — decomposing tasks at
runtime, dispatching a **fresh subagent** builder per task with a thin pointer-brief (see stance:
dispatch-fresh-not-fork), then a **two-gate review**: `reviewer` (static, against acceptance
criteria) and, when the criteria declare observable behavior, `verifier` (dynamic — builds/runs the
app via the project's verify config). tdd runs inside each task **only when the project's
`tdd-applies` config is on**. Bounded retries (~3).

The issue's **goal is frozen, its path is mutable.** The upstream human `think→issues→triage` gate
defined "done"; the agent may not edit that. But on a **path-level** failure — wrong assumption,
missing edge case, a task needs splitting, anything that doesn't change what "done" means to the
human — the **orchestrator re-enters `think→prd→issues` inline** (it owns HITL; these are
interactive amend-skills with no sibling-isolation benefit), **writes the amendment back to the
issue file**, re-stamps, and re-dispatches — no fork, one source of truth (see stance:
dispatch-fresh-not-fork). On a **goal-level** divergence (scope change, new user-facing decision) **or
ambiguity**: escalate HITL — stop, do **not** merge, write findings + flip `Status:` on the main
checkout, emit a handoff doc.

**Why:** Freezing the *goal* (not the whole spec) keeps AFK both safe and useful: the human still
owns "done," so the agent can't Goodhart the bar by editing acceptance criteria — but it repairs
the *path* without a human round-trip on every wrinkle, which complex tasks always have. The
**orchestrator**, not a child, does the rewrite (children never HITL — see stance: subagents-never-hitl),
so every child reads one amended spec (fresh-dispatch mechanics: stance: dispatch-fresh-not-fork).
A worktree per issue is an exclusive lock, so green-rides-the-merge while escalation writes status
to main directly — no concurrent-edit conflict, and every autonomous amendment is
auditable/revertable via git, which licenses the autonomy. The `verifier` gate catches
integration/app-level behavior tdd and `reviewer` can't; conditional, because many changes have no
runnable behavior. This implies
`issues`/`triage` need an explicit "thought-enough" checklist before stamping.

**Rejected:** Frozen *whole* spec (stop+handoff on every spec wrinkle) — defeats AFK on
complex/exploratory work. Autonomous *goal* rewrite (agent edits its own acceptance criteria) —
reopens the Goodhart hole. Human-gating each decomposed task — stops being AFK. Agent-teams/
messaging for the loop — re-pollutes the very contexts isolation is meant to keep clean (see
stance: subagents-never-hitl).
