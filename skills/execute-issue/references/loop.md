# execute-issue — failsafe & Status merge-back

Loaded by `execute-issue` steps 6–7.

## Dispatch model
- **Forked subagents** (`CLAUDE_CODE_FORK_SUBAGENT`, already on): each task forks fresh from the
  parent's full context → full fidelity (no lossy recap) AND no cross-task drift (siblings fork
  independently from the parent point).
- **Not** agent-teams — no inter-agent messaging needed for a linear loop (teams env stays on but
  unused here).

## AFK failsafe (bounded retry)
- ~3 retries of the builder→reviewer loop per task.
- On exhaustion: **stop, do NOT merge.** Write reviewer findings back to the issue, flip `Status:`
  to `needs-info` or `ready-for-human`, emit a handoff doc (path recorded on the issue).

## Who runs the tests
The `builder` agent has **Bash** (scoped) and runs the test runner itself → it owns a real
red→green loop per task (decision: session-5 dogfood; was write-only, couldn't self-verify). The
`reviewer` independently re-runs at the gate (Bash read-only) as the test-first check. The parent
need not run tests, but may spot-check.

## Status merge-back
- **Green path:** `Status: done` is committed inside the worktree and lands via the merge. Run the
  merge + cleanup **from the main checkout, never from inside the worktree** (running `git merge`
  from the worktree self-merges to a no-op and `git worktree remove` then deletes your cwd
  mid-command). Order: `cd` to main → `git merge --no-ff issue-NN-slug` → verify tests green on main
  → `git worktree remove <path>` → `git branch -d issue-NN-slug`.
- **Escalation path:** write `Status:` + findings + handoff-doc-path to the issue file on the
  **main checkout directly**. The kept worktree is for **inspection only** — never the source of
  truth for the failed status. (Worktree = exclusive lock, so no concurrent-edit conflict.)

## tdd-guard interaction (settled session 5)
tdd-guard is an optional, per-project `PreToolUse` hook on Write|Edit; it is **not installed by the
harness**. Whether it fires inside forked subagents is moot for correctness: the builder runs its
own tests (Bash, above) and the `reviewer` test-first gate (step 5) re-checks that a failing test
preceded each behavior. A project that wants *enforced* test-first adds tdd-guard to its own
`.claude/settings.json` as hardening on top of — not a replacement for — the reviewer gate.
