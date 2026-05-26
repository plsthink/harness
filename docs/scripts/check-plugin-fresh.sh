#!/usr/bin/env bash
# check-plugin-fresh.sh — harness-repo dogfood guard (see docs/stances/repo-dev-tooling-home.md).
#
# The objective mandates measuring product changes on a fresh session AFTER
# `claude plugin update harness@harness`. But the installed plugin is a git clone
# pinned to a SHA (see docs/stances/measure-product-changes-via-plugin-update.md), so a
# new session silently reads STALE product files (skills/agents/shared/conventions/hooks)
# until the cache is re-copied. Iterations 13 and 16 both caught this drift by hand.
#
# Wired to a SessionStart hook (.claude/settings.json): on a fresh/resumed session it
# compares the repo HEAD against the installed plugin's pinned SHA and, if they differ,
# prints a one-line reminder (which SessionStart surfaces as context). Silent when fresh.
# Advisory only — never blocks; every failure path exits 0 so a missing/odd environment
# (no git, plugin not installed) degrades to the manual status quo rather than nagging.
set -uo pipefail

repo="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}"
[ -n "$repo" ] || exit 0

head=$(git -C "$repo" rev-parse HEAD 2>/dev/null) || exit 0

installed="${HOME}/.claude/plugins/installed_plugins.json"
[ -f "$installed" ] || exit 0

# Pull the harness@harness block's gitCommitSha (only plugin installed from this repo).
cache=$(grep -o '"gitCommitSha"[^,}]*' "$installed" | head -1 | grep -oE '[0-9a-f]{7,40}')
[ -n "$cache" ] || exit 0

# Compare on the shorter length (cache SHA may be abbreviated).
n=${#cache}
if [ "${head:0:$n}" != "$cache" ]; then
  printf '⚠ harness plugin cache is STALE: cache=%s repo HEAD=%s. Product changes (skills/agents/shared/conventions/hooks) are NOT loaded this session — run: claude plugin update harness@harness\n' \
    "${cache:0:12}" "${head:0:12}"
fi
exit 0
