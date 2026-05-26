---
name: execute-issue
description: Take a ready-for-agent issue and execute it fully AFK — git worktree, runtime task decomposition, a fresh forked builder subagent per task, two-stage reviewer gate against the acceptance criteria, tdd inside each task, then merge-or-escalate. Use when the user wants to implement a ready-for-agent issue, run an issue autonomously, or "execute this issue".
---

# execute-issue

The owned superpowers-style execution loop (see stance:
execute-issue-afk-autonomy). Runs **fully AFK** on a `ready-for-agent` issue — the quality gate
already happened upstream (`think`→`issues`→`triage`). Dispatches `builder` + `reviewer`, runs
`tdd` inside each task, bound by `${CLAUDE_PLUGIN_ROOT}/shared/coding-discipline.md`.

## When to fire
- User wants to execute/implement a `ready-for-agent` issue autonomously.

## Procedure

1. **Verify the contract.** Read `docs/work/<feature>/issues/NN-slug.md`
   (`${CLAUDE_PLUGIN_ROOT}/shared/issue-tracker.md`). Confirm `Status: ready-for-agent` + testable
   acceptance criteria. If under-specified, stop → `needs-info` (don't guess — the gate is upstream).
2. **Worktree.** Create git worktree + branch `issue-NN-slug` (exclusive lock → no concurrent-edit
   conflict). Work happens there.
3. **Decompose at runtime** into tasks (internal, not human-gated — the gate was upstream). The
   issue stays the spec.
4. **Per task: fork a fresh `builder`** from the parent's full context (full fidelity, no
   cross-task drift — siblings fork independently). Builder runs `tdd` (red→green) for the task's
   behavior, prefers a **project-local specialist agent** if the project ships one, else the floor.
5. **Two-stage `reviewer` gate** against the acceptance criteria, including the test-first check
   (tdd-guard fallback). On findings → loop back to builder.
6. **Bounded retry (~3)** of builder→reviewer. See [loop.md](references/loop.md) for the failsafe +
   Status merge-back rules.
7. **Finish:** green → `Status: done` committed in the worktree, merge, delete worktree+branch.
   Escalation → see loop.md (do NOT merge; write to main directly; keep worktree for inspection).

## Pipeline
- Reads:  `docs/work/<feature>/issues/NN-slug.md` (ready-for-agent + acceptance criteria); code
- Writes: implementation on branch `issue-NN-slug`; issue `Status:`; handoff doc on escalation
- Next:   handoff (on escalation) | (merge → done)
