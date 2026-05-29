# execute-issue — failsafe & Status merge-back

Loaded by `execute-issue` steps 7–8.

## Dispatch model
- **Fresh dispatched subagents** via the dispatch-brief template
  (`${CLAUDE_PLUGIN_ROOT}/shared/dispatch-brief.md`): each task dispatches a child with a **clean
  context**, briefed only by the thin pointer-brief. Child = **pure function of (brief + disk)**;
  parent session length never degrades it (rationale: stance dispatch-fresh-not-fork). `verifier`
  is dispatched the same way as builder/reviewer (conditional second gate).
- **Not** agent-teams — no inter-agent messaging needed for a linear loop (teams env stays on but
  unused here).

## AFK failsafe (bounded retry)
- ~3 retries of the builder→(reviewer|verifier) loop per task: a `verifier` failure feeds the **same**
  retry channel as a reviewer finding (back to builder).
- On exhaustion: **stop, do NOT merge.** Write reviewer/verifier findings back to the issue, flip
  `Status:` to `needs-info` or `ready-for-human`, emit a handoff doc (path recorded on the issue).

## Spec mutation (graded backward edge)
The frozen-goal/mutable-path rule (see stance: execute-issue-afk-autonomy). The bounded retry above
handles a wrong *implementation*; this handles a wrong *spec*.

- **Trigger distinction.** In the builder→(reviewer|verifier) loop, separate two failure kinds:
  - (a) the implementation doesn't meet the spec → **normal retry back to the builder** (the bounded
    retry above). The backward edge does NOT fire.
  - (b) the **spec itself** is wrong — the issue (or the PRD behind it) can't be met as written, or
    meeting the acceptance criteria as written wouldn't achieve the intent. Only (b) takes the
    backward edge below.
- **Classification — "does 'done' change for the human?"** This is the whole test; default-to-escalate
  on any doubt.
  - **Path-level (answer: NO — the goal/intent stands, only the *how* is wrong; e.g. a wrong
    assumption, a missing edge case, a task that needs splitting): AUTONOMOUS.** The Orchestrator (the
    session role, not a new engine) re-enters the upstream skills **inline in its own session** (not as
    a child) to amend the spec, then **writes the amendment back to the issue file**, re-stamps, and
    re-dispatches:
    - `issues` — amend the issue's *how* / acceptance detail (the usual case: the wrong *how* lives in
      the issue).
    - `prd` — amend a PRD-level approach (when the wrong *how* lives in the PRD, not just the issue).
    - `think` — only when the approach itself needs re-derivation (not a local fix).
    Then re-stamp `Status: ready-for-agent` on the amended issue and **re-dispatch the builder** (a
    fresh subagent) against the amended spec, via the **same dispatch-brief** — the amendment lives in
    the issue file, never as a sidecar delta in the brief, so builder/reviewer/verifier all read one
    spec from disk. The child never HITLs (see stance: subagents-never-hitl).
  - **Goal-level (answer: YES — a scope change or a new user-facing decision) OR any AMBIGUITY:
    ESCALATE HITL** via the **existing escalation path** (AFK failsafe, above). This reuses —
    never weakens — that path.
- **Bounded (no autonomous thrash).** The backward edge is bounded like the retry: **≈ one amend
  cycle.** If an amended spec still fails on re-dispatch (the re-dispatched builder→gate loop exhausts
  again on the *same* spec-level fault), **escalate** rather than re-amend repeatedly. One autonomous
  amend, then the next failure is a HITL escalation.
- **Recording / revertability.** Each amendment is a **distinct git commit** editing
  `docs/work/<feature>/` (the issue and/or PRD) **inside the per-issue worktree** (the worktree is an
  exclusive lock → no concurrent-edit conflict), carrying the spec-amendment marker from
  `${CLAUDE_PLUGIN_ROOT}/shared/git-workflow.md` "Spec-amendment variant" (the `amend spec` subject
  prefix and its `git log --grep` guarantee) and kept **separate from the implementation commits**,
  so the audit trail is clean. The original `ready-for-agent` spec and every amendment then live in
  the commit graph: the whole backward edge is **auditable and revertable from git history**.

## Who runs the tests
The `builder` agent has **Bash** (scoped) and runs the project's `test-command` itself (never a
hardcoded runner). When `tdd-applies` is on it owns a real red→green loop per task (was
write-only, couldn't self-verify); when off there is no red-green expectation
— it still confirms behavior via the project's tests if any exist. The `reviewer` independently
re-runs those tests at the gate (Bash read-only); its static test-first check is **gated by
`tdd-applies`** (inert when off — see the tdd-guard section). The `verifier` builds/runs the whole
**app** for the issue's observable behavior (a different axis from unit tests — integration/app-level,
per the project `verify-method`, independent of `tdd-applies`). The parent need not run tests, but
may spot-check.

## Status merge-back
Both paths' state-persistence semantics are canonical in
`${CLAUDE_PLUGIN_ROOT}/shared/issue-tracker.md` "Status merge-back" (green = `done` committed
in-worktree then lands; escalation = non-`done` written on the **main checkout**, kept worktree
inspection-only); the land procedure + the cwd caveat are
`${CLAUDE_PLUGIN_ROOT}/shared/git-workflow.md` "Land procedure". This adds only the execute-issue
sequencing on top:
- **Green path:** land per git-workflow.md, then — still **from the main checkout, never the
  worktree** (cwd caveat cited above) — invoke the reaper
  `${CLAUDE_PLUGIN_ROOT}/scripts/reap-done-features.sh "$CLAUDE_PROJECT_DIR"`; on a reported
  deletion, record it per `${CLAUDE_PLUGIN_ROOT}/shared/issue-tracker.md` "Reap" (green-path-only).
- **Escalation path:** write the non-`done` `Status:` + findings + handoff-doc-path on the main
  checkout per issue-tracker.md.

## tdd-guard interaction
Scope: only when `tdd-applies` is on (when off, see "Who runs the tests" above).
tdd-guard is an optional, per-project `PreToolUse` hook on Write|Edit; it is **not installed by the
harness**. Whether it fires inside dispatched subagents is moot for correctness: the builder runs its
own tests (Bash, above) and the `reviewer` test-first gate (step 5) re-checks that a failing test
preceded each behavior. A project that wants *enforced* test-first adds tdd-guard to its own
`.claude/settings.json` as hardening on top of — not a replacement for — the reviewer gate.
