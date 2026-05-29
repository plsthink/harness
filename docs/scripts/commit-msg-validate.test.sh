#!/usr/bin/env bash
# Regression test for commit-msg-validate.sh — pins the conventional-commit grammar the universal
# commit-msg hook enforces. Drives the validator with message fixtures (never the real git tree) and
# asserts pass for conforming messages (with and without a scope) plus the spec-amendment variant,
# and block-with-reason for each violation class (unknown/missing type, malformed scope, leading
# capital, past tense, over-length subject).
# Harness-repo dev tooling (see stances: repo-dev-tooling-home, test-load-bearing-dev-scripts).
# Run on demand: bash <this file>.
# Exit 0 = all cases pass; exit 1 = a case failed.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VALIDATE="$HERE/../../scripts/commit-msg-validate.sh"
fails=0

# Feed a fixture message to the validator; assert exit code AND (for blocks) a stderr substring.
# $1=name $2=want_exit $3=want_substr (empty to skip) $4=message
expect() {
  local name="$1" want="$2" substr="$3" msg="$4" got out
  out=$(printf '%s' "$msg" | bash "$VALIDATE" 2>&1); got=$?
  if [ "$got" -ne "$want" ]; then
    printf 'FAIL  %s: expected exit %s, got %s\n      out: %s\n' "$name" "$want" "$got" "$out" >&2
    fails=1
  elif [ -n "$substr" ] && ! printf '%s' "$out" | grep -qF -- "$substr"; then
    printf 'FAIL  %s: output missing %q\n      got: %s\n' "$name" "$substr" "$out" >&2
    fails=1
  else
    printf 'ok    %s\n' "$name"
  fi
}

# --- PASS cases (exit 0) ---
expect "domain-scoped feat passes"        0 "" "feat(auth): add token refresh"
expect "bare type (no scope) passes"      0 "" "fix: correct login redirect"
expect "spec-amendment variant passes"    0 "" "fix(execute-issue): amend spec — split the rebase step"
expect "docs-typed planning artifact"     0 "" "docs: add git-workflow PRD"
# Present-tense verbs that merely end in 'ed' must NOT be flagged (denylist, not blanket ed$).
expect "embed (present) passes"           0 "" "feat: embed config"
expect "speed (present) passes"           0 "" "feat: speed up parser"
# Trailing whitespace/CR git strips before storing must NOT count toward the 72-char limit: a
# 72-char subject plus trailing blanks or a CRLF terminator is a valid commit git would accept.
expect "72-char subject + trailing spaces" 0 "" "feat: $(printf 'x%.0s' {1..72})  "
expect "72-char subject + trailing CR"     0 "" "feat: $(printf 'x%.0s' {1..72})$(printf '\r')"

# --- BLOCK cases (exit 2), one per violation class, asserting the named reason ---
expect "unknown type blocked"             2 "unknown or missing type"   "frobnicate(auth): do a thing"
expect "missing type blocked"             2 "unknown or missing type"   "just a freeform message"
expect "numeric scope blocked"            2 "malformed scope"           "feat(123): add a thing"
expect "uppercase scope blocked"          2 "malformed scope"           "feat(Auth): add a thing"
expect "leading capital blocked"          2 "leading capital"           "feat(auth): Add token refresh"
expect "past tense blocked"               2 "past tense"                "feat(auth): added token refresh"
expect "over-length subject blocked"      2 "over-length subject"       "feat(auth): $(printf 'x%.0s' {1..80})"
# An all-whitespace subject collapses to empty after the trailing-trim and is caught as empty.
expect "whitespace-only subject blocked"   2 "empty subject"             "feat:    "

# --- BLOCK message is self-contained: states grammar + example + echoes the rejected message ---
out=$(printf '%s' "feat(123): nope" | bash "$VALIDATE" 2>&1) || true
for needle in \
  "feat fix refactor docs chore test perf build ci revert" \
  "feat(auth): add token refresh" \
  "feat(123): nope" \
  '${CLAUDE_PLUGIN_ROOT}/shared/git-workflow.md'; do
  if ! printf '%s' "$out" | grep -qF -- "$needle"; then
    printf 'FAIL  block message self-contained: missing %q\n' "$needle" >&2
    fails=1
  fi
done
[ "$fails" -eq 0 ] && printf 'ok    block message is self-contained\n'

if [ "$fails" -ne 0 ]; then echo "commit-msg-validate.test: FAILURES" >&2; exit 1; fi
echo "commit-msg-validate.test: all cases pass"
