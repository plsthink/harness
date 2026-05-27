---
name: execute-issue
description: Take a ready-for-agent issue and execute it fully AFK — git worktree, runtime task decomposition, a fresh builder subagent dispatched per task, a static reviewer gate against the acceptance criteria, a conditional verifier gate that builds/runs the app when the criteria declare observable behavior, tdd inside each task, then merge-or-escalate. Use when the user wants to implement a ready-for-agent issue, run an issue autonomously, or "execute this issue".
---

# execute-issue

The owned superpowers-style execution loop (see stance:
execute-issue-afk-autonomy). Runs **fully AFK** on a `ready-for-agent` issue — the quality gate
already happened upstream (`think`→`issues`→`triage`); step 7 takes a graded backward edge to amend
a wrong spec. Dispatches `builder` + `reviewer` + a
**conditional** `verifier` second gate (when the criteria declare observable runtime behavior), runs
`tdd` inside each task, bound by `${CLAUDE_PLUGIN_ROOT}/shared/coding-discipline.md`.

## When to fire
- User wants to execute/implement a `ready-for-agent` issue autonomously.

## Procedure

0. **Onboarding gate.** Run the step-0 behavior-config check (`${CLAUDE_PLUGIN_ROOT}/shared/onboarding-gate.md`);
   on absent/stale, STOP and tell the user to run `/onboard`.
1. **Verify the contract.** Read `docs/work/<feature>/issues/NN-slug.md`
   (`${CLAUDE_PLUGIN_ROOT}/shared/issue-tracker.md`). Confirm `Status: ready-for-agent` + testable
   acceptance criteria. If under-specified, stop → `needs-info` (don't guess — the gate is upstream).
2. **Worktree.** Create git worktree + branch `issue-NN-slug` under the central worktree home per
   `${CLAUDE_PLUGIN_ROOT}/shared/git-workflow.md` (NOT inside the project tree, NOT a sibling of it —
   the module owns the path). Exclusive lock → no concurrent-edit conflict. Work happens there.
3. **Decompose at runtime** into tasks (internal, not human-gated — the gate was upstream). The
   issue stays the spec.
4. **Per task: dispatch a fresh `builder` subagent** (clean context) briefed by the dispatch-brief
   template (`${CLAUDE_PLUGIN_ROOT}/shared/dispatch-brief.md`). Sibling independence and the absence
   of cross-task drift now come from **clean per-child contexts** (each child shares nothing), not
   from sharing a parent point; the child is a **pure function of (thin brief + what it
   reads from disk)**, so orchestrator session length does not affect child output. Prefers a
   **project-local specialist agent** if the project ships one, else the floor. A dispatch whose
   required brief pointer is **missing or empty fails before the child runs** — the orchestrator
   repairs the brief (or the issue behind it) and re-dispatches; it never dispatches an under-briefed
   child and never guesses. execute-issue resolved `tdd-applies` at step 0 (the project's
   HARNESS-CONFIG posture) and **states it in the brief** (the child never pauses to ask — see
   stance: subagents-never-hitl). When `tdd-applies` is **true**, the builder runs `tdd` (red→green) for
   the task's behavior. When **false**, the builder implements WITHOUT a forced red-green gate and is
   **not** failed for lacking a prior failing test (it still runs the project's `test-command` tests
   if any exist).
5. **Static `reviewer` gate** against the acceptance criteria. The test-first check (tdd-guard
   fallback) applies **only when `tdd-applies` is on**; when off, the reviewer does not fail the
   change for lacking a prior red test. On findings → loop back to builder.
6. **Conditional `verifier` gate.** IF the acceptance criteria declare **observable runtime
   behavior** (UI / endpoint / CLI output / app state), dispatch a fresh `verifier` subagent (like
   builder/reviewer) to build+run the app per the project's `verify-method` config (or a project-local
   verify Skill) and confirm those behaviors. **SKIP** for a doc-only / pure-refactor / config issue
   (no observable runtime behavior) so it doesn't block on an un-runnable change. A verifier failure
   → loop back to builder, same channel as reviewer findings.
7. **Bounded retry (~3)** of builder→(reviewer|verifier). See [loop.md](references/loop.md) for the
   failsafe + Status merge-back rules. When a finding reveals the **spec** is wrong (not the
   implementation), take the graded **backward edge** (see loop.md "Spec mutation"; stance:
   execute-issue-afk-autonomy): "done" is the frozen goal but the path is mutable — **path-level**
   (done unchanged) → the orchestrator amends **inline** (`think`/`prd`/`issues` run in the
   orchestrator session, not as a child subagent), **writes the amendment to the issue file** (the one
   source — reviewer/verifier read the issue from disk, so no amendment is carried as a sidecar delta
   in any brief), re-stamps `ready-for-agent`, and **re-dispatches via the same brief** (bounded to ≈
   one amend cycle); **goal-level / ambiguous** → escalate via step 8. Default-to-escalate.
8. **Finish:** green → `Status: done` committed in the worktree, then **land** per
   `${CLAUDE_PLUGIN_ROOT}/shared/git-workflow.md` (rebase the issue branch onto its base then
   fast-forward only — single source, run from the main checkout), remove the central-home worktree
   (location per the module) + delete the branch. Then **reap** (GREEN PATH ONLY): from the main
   checkout (same cwd rule as the land — never from inside the worktree), invoke
   `${CLAUDE_PLUGIN_ROOT}/scripts/reap-done-features.sh "$CLAUDE_PROJECT_DIR"` (the main-checkout
   root). It hard-deletes every feature dir whose issue set is non-empty and all-`done` and reports
   each on stdout; if it reported any deletion, make ONE `docs`-typed commit scoped to the feature
   slug — never an issue/PRD number — e.g. `docs(<feature>): reap done feature dir`. The contract is
   in `${CLAUDE_PLUGIN_ROOT}/shared/issue-tracker.md` "Reap (done-feature cleanup)".
   Escalation → see loop.md (do NOT merge; emit a handoff doc, then write `Status:`+findings+handoff-path
   to the issue on the main checkout; keep the central-home worktree for inspection only). **No reap
   on the escalation path** — it writes a non-`done` status and does not land, so a feature with a
   stuck issue is never reaped.

## Pipeline
- Reads:  `docs/work/<feature>/issues/NN-slug.md` (ready-for-agent + acceptance criteria); code
- Writes: implementation on branch `issue-NN-slug`; issue `Status:`; handoff doc on escalation
- Next:   handoff (on escalation) | (merge → done)
- Back:   think / prd / issues — path-level spec-mutation re-entry (frozen goal, mutable path); see
  [loop.md](references/loop.md) "Spec mutation (graded backward edge)"
