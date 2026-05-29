# Measure product changes against a freshly-updated plugin cache

**Stance:** A change to a *product* file (`skills/`, `agents/`, `hooks/`, `shared/`,
`conventions/`, `templates/` — anything resolved via `${CLAUDE_PLUGIN_ROOT}`) is **not** live in a
running session until `claude plugin update harness@harness` re-copies the worktree to the plugin
cache. Measure such a change only on a session started *after* that update. A change to a *dogfood*
file (`docs/`, the repo's own `.claude/settings.json`, `CLAUDE.md`, `README.md`) is live
immediately — verify it by running its script/hook or re-reading directly, no update needed.

**Why:** The plugin cache is a real git clone pinned to a SHA, not a symlink to the worktree, so
worktree edits to product files are invisible to a session loading from cache — silently, with no
error. (This cache drifted ~7 commits stale mid-run before anyone noticed.) The boundary is exactly
the two-roots split: `${CLAUDE_PLUGIN_ROOT}` → cache (needs update); nearest-`docs/` walk → worktree
(live). Knowing which side a file is on tells you whether measurement costs a plugin-update step.

A `SessionStart` hook (`docs/scripts/check-plugin-fresh.sh`) prints an advisory when stale — detection
only; the dogfooded update step stays manual.

**Rejected:** Symlinking the cache to the worktree to skip updates — defeats the pinned-SHA model
real target projects use, so the harness would no longer dogfood the actual install path.
