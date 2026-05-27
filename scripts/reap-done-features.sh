#!/usr/bin/env bash
# reap-done-features.sh — the reaper: hard-delete feature dirs whose work is fully done.
#
# Scans $ROOT/docs/work/*/ for feature dirs. A feature dir QUALIFIES for reaping when its issue set
# is non-empty (issues/ exists and holds >=1 *.md) AND every issue's machine-read `Status:` line
# reads `done`. Each qualifying dir is `rm -rf`'d whole (PRD + issues together) and its path printed
# to stdout — one per line — as the report. Deleting nothing exits 0 with an empty report.
#
# The non-empty-issue-set requirement is the load-bearing vacuous-done guard: a feature with no
# issues (or an empty issues/) is never reaped. docs/work/learnings/ has no issues/ subdir, so the
# guard naturally excludes it — it is never a reap target.
#
# PRODUCT (it ships under ${CLAUDE_PLUGIN_ROOT}/scripts/): reachable from any project the harness
# drives — the same class as check-onboarded.sh and commit-msg-validate.sh. Its self-test
# (docs/scripts/reap-done-features.test.sh) is harness-repo dev tooling only (stance:
# test-load-bearing-dev-scripts: a product script may carry a dogfood-only test).
# Usage: reap-done-features.sh [ROOT]  — ROOT defaults to the repo root; pass a fixture root to test.
set -uo pipefail

ROOT="${1:-${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}}"
[ -n "$ROOT" ] && [ -d "$ROOT" ] || { echo "reap-done-features: ROOT not found: ${ROOT:-<empty>}" >&2; exit 1; }
ROOT="$(cd "$ROOT" && pwd)"

WORK="$ROOT/docs/work"
[ -d "$WORK" ] || exit 0  # no work substrate -> nothing to reap, clean success.

# A feature dir is all-done when it has >=1 *.md issue and every one reads Status: done.
all_done() {
  local feat="$1" issues="$1/issues" f tok seen=0
  [ -d "$issues" ] || return 1            # no issues/ subdir -> not a feature reap target.
  for f in "$issues"/*.md; do
    [ -e "$f" ] || continue               # no *.md matched (empty issue set) -> stays seen=0.
    seen=1
    # First whitespace-token after `Status:`, robust to trailing comment + whitespace.
    tok="$(grep -m1 -E '^[[:space:]]*Status:' "$f" | sed -E 's/^[[:space:]]*Status:[[:space:]]*//' | awk '{print $1}')"
    [ "$tok" = "done" ] || return 1
  done
  [ "$seen" -eq 1 ]                        # vacuous-done guard: empty issue set never qualifies.
}

for feat in "$WORK"/*/; do
  [ -d "$feat" ] || continue
  feat="${feat%/}"
  if all_done "$feat"; then
    rm -rf "$feat"
    echo "$feat"
  fi
done
