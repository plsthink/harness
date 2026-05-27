# Git workflow — the product git discipline

Cited by: `execute-issue`, the `builder` agent, and any commit-making skill. The single source for
the commit grammar (and, in later slices, the land procedure and worktree-path rule). Product —
reachable from any project the harness drives, not dogfood-only. Enforced deterministically by the
commit-message hook (`${CLAUDE_PLUGIN_ROOT}/hooks/commit-msg-guard.js` →
`${CLAUDE_PLUGIN_ROOT}/scripts/commit-msg-validate.sh`).

## Commit grammar

Every commit follows:

```
<type>(<scope>): <subject>
```

The scope (with its parentheses) is OPTIONAL; a bare `<type>: <subject>` is valid.

### Canonical type set

Only these (portable to any project — never invent one):

`feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `perf`, `build`, `ci`, `revert`.

### Artifact → type map

- new skill or agent → `feat`
- PRD, issues, or a stance (planning artifacts) → `docs`
- tooling and scaffolding → `chore`

### Scope grammar

OPTIONAL, parenthesized, a lowercase area/domain token matching `[a-z][a-z0-9-]*` — the durable
part of the system the change touches (e.g. `auth`, `client`, `execute-issue`, `hooks`). Omittable:
a bare `feat: …` is valid, so you are never forced to invent a domain. Validated by FORMAT (a
lowercase token starting with a letter), never by membership in any list. NEVER a prd or issue
number: planning artifacts are deletable, and a number in permanent history would dangle once the
artifact is gone — so an all-numeric scope like `(123)` or `(01)` is rejected by the format rule.

### Subject rules

- present tense (`add`, not `added`)
- no leading capital
- ≤72 characters

### Spec-amendment variant

An autonomous backward-edge amendment is a `fix`-typed commit whose subject begins with the marker
`amend spec`, e.g.:

```
fix(execute-issue): amend spec — split the rebase step
```

Greppable across history via `git log --grep "amend spec"`. It carries NO issue trailer — that
would be a dangling reference to a deletable issue.

### One commit per task

The builder authors ONE clean conventional commit per task. The harness does not squash or
interactive-rebase after the fact, so each task's commit must already be meaningful: the commits
land verbatim on the linear trunk.

## Land procedure

Issue branches land LINEARLY with NO merge commit: rebase the issue branch onto its base, then
fast-forward only.

Run from the **main checkout, NEVER from inside the worktree** — running the land from the worktree
self-merges to a no-op, and removing the worktree then deletes your cwd mid-command.

Full order:

1. ensure the base is current
2. rebase the issue branch onto the base
3. fast-forward the base to the branch
4. verify green
5. remove the worktree
6. delete the branch

### No squash

Squash is rejected: it would collapse the separate spec-amendment commits (the `amend spec`
fix-commits) and break their revertable-as-distinct-units guarantee that the execute-issue autonomy
stance depends on. The builder's one-clean-commit-per-task (above) is what keeps the linear trunk
meaningful without squashing.
