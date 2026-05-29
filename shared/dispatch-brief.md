# Dispatch brief — the thin pointer brief per dispatched child

Cited by: the `execute-issue` dispatch path (its per-task fresh dispatch of `builder`/`reviewer`/`verifier` —
SKILL.md steps 4–6 and `${CLAUDE_PLUGIN_ROOT}/skills/execute-issue/references/loop.md`). The single
source for the brief the Orchestrator fills ONCE per dispatched child. Product — reachable from any
project the harness drives, not dogfood-only.

## What the brief is

A **fresh** child (builder/reviewer/verifier) is dispatched as a **fresh subagent (clean context)** per task. The
brief is the thin handoff it gets: a set of **pointers to on-disk artifacts**, never a paste of
their content. The child reads the real artifacts itself.

## Why pointers only

Every slot holds a **reference** — a path or a marker naming where the truth lives. It NEVER holds a
copy of the issue text, the acceptance criteria, or the resolved config values. A pointer cannot
drift: there is exactly one issue file, one criteria block, one config marker, and the child reads
the live copy.

**A fat brief is a smell.** If the brief feels like it needs embedded content to be usable, the
issue is under-specified — fix the issue (its spec / acceptance criteria), do not fatten the brief.

## Required slots

The brief has EXACTLY these seven pointer slots — each a reference, no embedded content:

1. **Agent role** — which child this is: `builder` | `reviewer` | `verifier`.
2. **Issue reference** — the path to the issue file that is the spec (the
   `docs/work/<feature>/issues/NN-slug.md` the dispatch path read at SKILL.md step 1).
3. **Slice scope** — a pointer naming the one task/slice of that issue this child owns (the runtime
   decomposition unit from SKILL.md step 3), not a restatement of the work.
4. **Acceptance-criteria reference** — a pointer to the criteria block inside the issue file (the
   gate the reviewer/verifier checks against), not a copy of the criteria.
5. **Config-completeness marker** — a pointer to the project's recorded behavior-config (the `AGENTS.md`
   block the onboarding gate validates, `${CLAUDE_PLUGIN_ROOT}/shared/onboarding-gate.md`).
6. **Worktree path** — the absolute path of the per-issue worktree the child works in (the
   central-home path per `${CLAUDE_PLUGIN_ROOT}/shared/git-workflow.md`).
7. **Escalate-don't-ask reminder** — `stance: subagents-never-hitl` (escalate, never guess, on a blocking gap).

## Scope of this contract

This module ships ONLY the brief's shape and its seven required slots. The slots are **required**,
but the behavior that fails a dispatch on a missing or non-pointer slot — and the wiring of the brief
into the execute-issue dispatch path — are defined elsewhere, not here.
