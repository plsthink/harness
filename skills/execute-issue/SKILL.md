---
name: execute-issue
description: Take a ready-for-agent issue and execute it fully AFK — git worktree, runtime task decomposition, a fresh builder subagent dispatched per task, a static reviewer gate against the acceptance criteria, a conditional verifier gate that builds/runs the app when the criteria declare observable behavior, tdd inside each task, then merge-or-escalate. Use when the user wants to implement a ready-for-agent issue, run an issue autonomously, or "execute this issue".
---

# execute-issue

The owned superpowers-style execution loop (see stance:
execute-issue-afk-autonomy). Runs **fully AFK** on a `ready-for-agent` issue — the quality gate
already happened upstream (`think`→`issues`→`triage`). Dispatches `builder` + `reviewer` + a
**conditional** `verifier` second gate (when the criteria declare observable runtime behavior), runs
`tdd` inside each task, bound by `${CLAUDE_PLUGIN_ROOT}/shared/coding-discipline.md`.

## When to fire
- User wants to execute/implement a `ready-for-agent` issue autonomously.

## Procedure

0. **Onboarding gate.** Run the step-0 behavior-config check (`${CLAUDE_PLUGIN_ROOT}/shared/onboarding-gate.md`).
1. **Verify the contract.** Read `docs/work/<feature>/issues/NN-slug.md`
   (`${CLAUDE_PLUGIN_ROOT}/shared/issue-tracker.md`). Confirm `Status: ready-for-agent` + testable
   acceptance criteria. If under-specified, stop → `needs-info` (don't guess — the gate is upstream).
2. **Worktree.** Create git worktree + branch `issue-NN-slug` under the central worktree home per
   `${CLAUDE_PLUGIN_ROOT}/shared/git-workflow.md`. Work happens there.
3. **Decompose at runtime** into tasks (internal, not human-gated — the gate was upstream). The
   issue stays the spec.
4. **Per task: dispatch a fresh `builder` subagent** (clean context) briefed by the dispatch-brief
   template (`${CLAUDE_PLUGIN_ROOT}/shared/dispatch-brief.md`) — each child a **pure function of
   (brief + what it reads from disk)**, so orchestrator session length never degrades it (why
   fresh-not-fork + mechanics: stance: dispatch-fresh-not-fork, [loop.md](references/loop.md)
   "Dispatch model"; specialist preference: stance: agents-generic-floor). A dispatch whose
   required brief pointer is **missing or empty fails before the child runs** — the orchestrator
   repairs the brief (or the issue behind it) and re-dispatches; it never dispatches an under-briefed
   child and never guesses. Via the brief's config marker (dispatch-brief.md slot 5, cited above)
   the child reads the `tdd-applies` posture itself, so it never pauses to ask (stance:
   subagents-never-hitl). The builder's branching on that posture is owned by `agents/builder.md`
   step 3 (mechanics also in [loop.md](references/loop.md) "Who runs the tests").
5. **Static `reviewer` gate** against the acceptance criteria — the reviewer's test-first check is
   gated by `tdd-applies` per `agents/reviewer.md` step 3. On findings → loop back to builder.
6. **Conditional `verifier` gate.** IF the acceptance criteria declare **observable runtime
   behavior** (UI / endpoint / CLI output / app state), dispatch a fresh `verifier` subagent (like
   builder/reviewer) to build+run the app per the project's `verify-method` config (or a project-local
   verify Skill) and confirm those behaviors. **SKIP** for a doc-only / pure-refactor / config issue so it doesn't
   block on an un-runnable change. A verifier failure → loop back to builder, same channel as reviewer findings.
7. **Bounded retry (~3)** of builder→(reviewer|verifier). See [loop.md](references/loop.md) for the
   failsafe + Status merge-back rules. When a finding reveals the **spec** is wrong (not the
   implementation), take the graded **backward edge** (loop.md "Spec mutation"; stance:
   execute-issue-afk-autonomy): "done" is the frozen goal but the path is mutable — **path-level**
   (done unchanged) → orchestrator amends in its own session (no child), then re-dispatches the
   builder; **goal-level / ambiguous** → escalate via step 8. Default-to-escalate.
8. **Finish — from the main checkout, never the worktree** (cwd caveat:
   `${CLAUDE_PLUGIN_ROOT}/shared/git-workflow.md` "Land procedure"). Both paths' mechanics are in
   [loop.md](references/loop.md) "Status merge-back" (loaded at step 7): **green** → land + reap;
   **escalation** → no merge/reap, handoff doc + `Status:`+findings+handoff-path on the issue.

## Pipeline
- Reads:  `docs/work/<feature>/issues/NN-slug.md` (ready-for-agent + acceptance criteria); code
- Writes: implementation on branch `issue-NN-slug`; issue `Status:`; handoff doc on escalation
- Next:   handoff (on escalation) | (merge → done)
- Back:   think / prd / issues — path-level spec-mutation re-entry (frozen goal, mutable path); see
  [loop.md](references/loop.md) "Spec mutation (graded backward edge)"
