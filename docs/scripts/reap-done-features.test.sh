#!/usr/bin/env bash
# Regression test for reap-done-features.sh — the reaper: it hard-deletes feature dirs whose issue
# set is non-empty and fully `done`, and reports exactly those dirs. Pins the external behavior
# (what it deletes, what it reports, the vacuous-done guard) against constructed fixture roots so a
# future edit to the reaper's scanning logic can't silently regress what gets reaped.
# Harness-repo dev tooling (see stances: repo-dev-tooling-home, test-load-bearing-dev-scripts).
# Run on demand: bash <this file>.
# Exit 0 = all cases pass; exit 1 = a case failed.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REAP="$HERE/../../scripts/reap-done-features.sh"
fails=0
pass=0

# Assert a condition; on failure print a message and flag the run.
# $1=name $2=condition-already-evaluated($?=0 ok) handled by caller via ok/fail helpers below.
ok()   { printf 'ok    %s\n' "$1"; pass=$((pass + 1)); }
fail() { printf 'FAIL  %s\n' "$1" >&2; fails=1; }

# Write a feature dir with the given issue Status tokens.
# $1=root $2=feature-slug $3..=one status token per issue ("" => create issues/ with NO *.md)
mkfeature() {
  local root="$1" slug="$2"; shift 2
  local dir="$root/docs/work/$slug"
  mkdir -p "$dir/issues"
  printf '# %s\n' "$slug" > "$dir/PRD.md"
  local i=0 st
  for st in "$@"; do
    i=$((i + 1))
    # Mirror the real issue shape: a Status line with a trailing comment.
    printf '# %02d — x\n\nStatus: %s   <!-- see triage-labels.md -->\n' "$i" "$st" \
      > "$dir/issues/$(printf '%02d-x.md' "$i")"
  done
}

# Run the reaper against a root; echo its stdout report.
run_reaper() { bash "$REAP" "$1"; }

# --- Case 1: all issues done -> deleted + named in report. ----------------------------------------
root="$(mktemp -d)"
mkfeature "$root" "alpha" done done
report="$(run_reaper "$root")"; rc=$?
if [ "$rc" -eq 0 ] && [ ! -d "$root/docs/work/alpha" ] && printf '%s\n' "$report" | grep -qF "/docs/work/alpha"; then
  ok "all-done feature is deleted and named in report"
else
  fail "all-done feature should be deleted and named (rc=$rc, report=$report)"
fi
rm -rf "$root"

# --- Case 2: mixed done/non-done -> kept, not in report. ------------------------------------------
root="$(mktemp -d)"
mkfeature "$root" "beta" done ready-for-agent
report="$(run_reaper "$root")"; rc=$?
if [ "$rc" -eq 0 ] && [ -d "$root/docs/work/beta" ] && ! printf '%s\n' "$report" | grep -qF "/docs/work/beta"; then
  ok "mixed-status feature is kept and not reported"
else
  fail "mixed-status feature should be kept (rc=$rc, report=$report)"
fi
rm -rf "$root"

# --- Case 3a: empty issue set (issues/ exists, no *.md) -> kept (vacuous-done guard). -------------
root="$(mktemp -d)"
mkfeature "$root" "gamma"   # no status args -> issues/ created but no *.md
report="$(run_reaper "$root")"; rc=$?
if [ "$rc" -eq 0 ] && [ -d "$root/docs/work/gamma" ] && ! printf '%s\n' "$report" | grep -qF "/docs/work/gamma"; then
  ok "empty issue set (issues/ but no *.md) is kept"
else
  fail "empty issue set should be kept (rc=$rc, report=$report)"
fi
rm -rf "$root"

# --- Case 3b: feature dir with NO issues/ subdir -> kept. -----------------------------------------
root="$(mktemp -d)"
mkdir -p "$root/docs/work/delta"
printf '# delta\n' > "$root/docs/work/delta/PRD.md"
report="$(run_reaper "$root")"; rc=$?
if [ "$rc" -eq 0 ] && [ -d "$root/docs/work/delta" ] && ! printf '%s\n' "$report" | grep -qF "/docs/work/delta"; then
  ok "feature dir with no issues/ subdir is kept"
else
  fail "feature dir with no issues/ should be kept (rc=$rc, report=$report)"
fi
rm -rf "$root"

# --- Case 4: multiple all-done features -> all reaped in one invocation. --------------------------
root="$(mktemp -d)"
mkfeature "$root" "one" done
mkfeature "$root" "two" done done
report="$(run_reaper "$root")"; rc=$?
if [ "$rc" -eq 0 ] \
   && [ ! -d "$root/docs/work/one" ] && [ ! -d "$root/docs/work/two" ] \
   && printf '%s\n' "$report" | grep -qF "/docs/work/one" \
   && printf '%s\n' "$report" | grep -qF "/docs/work/two"; then
  ok "multiple all-done features all reaped in one invocation"
else
  fail "multiple all-done features should all be reaped (rc=$rc, report=$report)"
fi
rm -rf "$root"

# --- Case 5: nothing qualifying -> exit 0, deletes nothing, empty report. -------------------------
root="$(mktemp -d)"
mkfeature "$root" "keep" done todo
report="$(run_reaper "$root")"; rc=$?
if [ "$rc" -eq 0 ] && [ -d "$root/docs/work/keep" ] && [ -z "$report" ]; then
  ok "nothing qualifying exits 0 with empty report, deletes nothing"
else
  fail "nothing qualifying should be a clean no-op (rc=$rc, report=$report)"
fi
rm -rf "$root"

# --- Case 6: report names EXACTLY the deleted dirs — no more, no fewer. ----------------------------
root="$(mktemp -d)"
mkfeature "$root" "reapme"  done done   # qualifies
mkfeature "$root" "keepme"  done todo   # mixed -> kept
mkfeature "$root" "emptyme"             # empty issue set -> kept
report="$(run_reaper "$root")"; rc=$?
# Exactly one line, and it is reapme.
lines="$(printf '%s\n' "$report" | grep -c .)"
if [ "$rc" -eq 0 ] && [ "$lines" -eq 1 ] && printf '%s\n' "$report" | grep -qF "/docs/work/reapme" \
   && [ -d "$root/docs/work/keepme" ] && [ -d "$root/docs/work/emptyme" ] && [ ! -d "$root/docs/work/reapme" ]; then
  ok "report names exactly the deleted dirs — no more, no fewer"
else
  fail "report should name exactly the deleted dirs (rc=$rc, lines=$lines, report=$report)"
fi
rm -rf "$root"

# --- Case 7: learnings-style dir (non-issue .md, no issues/) is never reaped. ---------------------
root="$(mktemp -d)"
mkdir -p "$root/docs/work/learnings"
printf '# a learning\n\nStatus: done\n' > "$root/docs/work/learnings/2026-05-27-something.md"
report="$(run_reaper "$root")"; rc=$?
if [ "$rc" -eq 0 ] && [ -d "$root/docs/work/learnings" ] && ! printf '%s\n' "$report" | grep -qF "/docs/work/learnings"; then
  ok "learnings dir (no issues/) is never reaped"
else
  fail "learnings dir should never be reaped (rc=$rc, report=$report)"
fi
rm -rf "$root"

if [ "$fails" -ne 0 ]; then echo "reap-done-features.test: FAILURES" >&2; exit 1; fi
echo "reap-done-features.test: all $pass cases pass"
