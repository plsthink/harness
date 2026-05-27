# execute-issue — failsafe & Status merge-back

Loaded by `execute-issue` steps 7–8.

## Dispatch model
- **Fresh dispatched subagents** via the dispatch-brief template
  (`${CLAUDE_PLUGIN_ROOT}/shared/dispatch-brief.md`): each task dispatches a child with a **clean
  context**, briefed only by the thin pointer-brief. The child is a **pure function of (brief +
  what it reads from disk)** — no lossy recap AND no cross-task drift, because siblings share nothing
  (clean per-child contexts), not because they branch off a shared parent point. The loop does
  **not** rely on any context-inheritance env flag; orchestrator session length is irrelevant to
  child quality.
  `verifier` is dispatched the same way as builder/reviewer (conditional second gate) — still no
  inter-agent messaging.
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
    spec from disk. The child never HITLs (see stance: subagents-never-hitl) — the Orchestrator, not the
    child, owns the rewrite.
  - **Goal-level (answer: YES — a scope change or a new user-facing decision) OR any AMBIGUITY:
    ESCALATE HITL** via the **existing escalation path** (AFK failsafe, above): stop, do **NOT**
    merge, write findings, flip `Status:` on the **main checkout**, emit a handoff doc. This reuses —
    never weakens — that path. Default-to-escalate: if you cannot cleanly answer "no, done is
    unchanged," treat it as goal-level and escalate.
- **Bounded (no autonomous thrash).** The backward edge is bounded like the retry: **≈ one amend
  cycle.** If an amended spec still fails on re-dispatch (the re-dispatched builder→gate loop exhausts
  again on the *same* spec-level fault), **escalate** rather than re-amend repeatedly. One autonomous
  amend, then the next failure is a HITL escalation.
- **Recording / revertability.** Each amendment is a **distinct, labeled git commit** editing
  `docs/work/<feature>/` (the issue and/or PRD) **inside the per-issue worktree** (the worktree is an
  exclusive lock → no concurrent-edit conflict). Label it distinctly — an **`amend-spec:` commit** —
  kept **separate from the implementation commits**, so the audit trail is clean. The original
  `ready-for-agent` spec and every `amend-spec:` amendment then live in the commit graph: the whole
  backward edge is **auditable and revertable from git history**.

## Who runs the tests
The `builder` agent has **Bash** (scoped) and runs the project's `test-command` itself (never a
hardcoded runner). When `tdd-applies` is on it owns a real red→green loop per task (decision:
session-5 dogfood; was write-only, couldn't self-verify); when off there is no red-green expectation
— it still confirms behavior via the project's tests if any exist. The `reviewer` independently
re-runs those tests at the gate (Bash read-only); its static test-first check is **gated by
`tdd-applies`** (inert when off — see the tdd-guard section). The `verifier` builds/runs the whole
**app** for the issue's observable behavior (a different axis from unit tests — integration/app-level,
per the project `verify-method`, independent of `tdd-applies`). The parent need not run tests, but
may spot-check.

## Status merge-back
- **Green path:** `Status: done` is committed inside the worktree, then the branch **lands** per the
  rebase-plus-fast-forward land procedure in `${CLAUDE_PLUGIN_ROOT}/shared/git-workflow.md` (single
  source — no merge commit). Run the land + cleanup **from the main checkout, never from inside the
  worktree** (running it from the worktree self-merges to a no-op and `git worktree remove
  <central-home worktree>` — its location is defined in `${CLAUDE_PLUGIN_ROOT}/shared/git-workflow.md` —
  then deletes your cwd mid-command). After the land, still **from the main checkout** (same cwd
  rule), invoke the reaper `${CLAUDE_PLUGIN_ROOT}/scripts/reap-done-features.sh "$CLAUDE_PROJECT_DIR"`;
  if it reports a deleted dir, record it in ONE `docs`-typed commit scoped to the feature slug (never
  an issue/PRD number) — contract in `${CLAUDE_PLUGIN_ROOT}/shared/issue-tracker.md` "Reap
  (done-feature cleanup)". Reap is green-path-only.
- **Escalation path:** write `Status:` + findings + handoff-doc-path to the issue file on the
  **main checkout directly**. The kept worktree (in the central home, per
  `${CLAUDE_PLUGIN_ROOT}/shared/git-workflow.md`) is for **inspection only** — never the source of
  truth for the failed status. (Worktree = exclusive lock, so no concurrent-edit conflict.) **No
  reap here** — escalation writes a non-`done` status and does not land, so a feature with a stuck
  issue keeps its full spec.

## tdd-guard interaction (settled session 5)
The red-green / test-first expectation is gated by the project's `tdd-applies` HARNESS-CONFIG key.
**When off**, no red-green is expected and the reviewer's test-first check is **inert** (a behavior
is not flagged for lacking a prior red test); the builder/verifier still confirm behavior via the
project's `test-command` / `verify-method`. **When on**, the below applies:
tdd-guard is an optional, per-project `PreToolUse` hook on Write|Edit; it is **not installed by the
harness**. Whether it fires inside dispatched subagents is moot for correctness: the builder runs its
own tests (Bash, above) and the `reviewer` test-first gate (step 5) re-checks that a failing test
preceded each behavior. A project that wants *enforced* test-first adds tdd-guard to its own
`.claude/settings.json` as hardening on top of — not a replacement for — the reviewer gate.
