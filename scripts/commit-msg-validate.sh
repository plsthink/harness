#!/usr/bin/env bash
# commit-msg-validate.sh — validate a conventional-commit message against the product grammar.
#
# Message text in (stdin, or "$1" if given) -> pass (exit 0) or block-with-reason (exit 2).
# This is the DEEP, testable module of the commit-discipline feature: the message-validation logic
# is isolated from the hook plumbing (text in, pass-or-block-with-reason out).
#
# Grammar (single source: ${CLAUDE_PLUGIN_ROOT}/shared/git-workflow.md):
#   header   = <type>(\(<scope>\))?: <subject>
#   type     = one of the canonical set (git-workflow.md, above) — enforced by the case below
#   scope    = OPTIONAL lowercase area/domain token [a-z][a-z0-9-]* — never a prd/issue number
#   subject  = present tense, no leading capital, <=72 chars
#
# PRODUCT (ships under ${CLAUDE_PLUGIN_ROOT}/scripts/): the commit-msg hook invokes it; it reaches
# every target project. Its pinned self-test (docs/scripts/commit-msg-validate.test.sh) is
# harness-repo dev tooling only (stance: test-load-bearing-dev-scripts).
#
# On ANY violation, a SELF-CONTAINED, self-teaching block message goes to stderr — it is the sole
# discovery surface for an agent that never loaded a harness skill.
# Usage: commit-msg-validate.sh ["<message>"]  — message also read from stdin.
set -euo pipefail

# Read the message: prefer "$1" if given, else stdin. We validate the HEADER (first line).
if [ "$#" -ge 1 ]; then
  msg="$1"
else
  msg="$(cat)"
fi
header="${msg%%$'\n'*}"
header="${header%$'\r'}"   # strip a trailing CR (CRLF input) — git ignores it before storing

# Block: print the violation + the full grammar + a correct example + the rejected message, then
# exit 2. This block is intentionally complete so a cold agent can comply without the spec loaded.
block() {
  local reason="$1"
  cat >&2 <<EOF
commit-msg blocked: $reason

Rejected message:
  $header

Conventional-commit grammar (\${CLAUDE_PLUGIN_ROOT}/shared/git-workflow.md):
  <type>(<scope>): <subject>     — the (scope) is OPTIONAL; a bare "<type>: <subject>" is valid.

  type    one of: feat fix refactor docs chore test perf build ci revert
  scope   OPTIONAL lowercase area/domain token [a-z][a-z0-9-]* (e.g. auth, client, hooks).
          NEVER a prd or issue number — those are deletable and would dangle in history.
  subject present tense, no leading capital, <=72 chars.

  Spec-amendment variant: a fix-typed commit whose subject begins "amend spec" (no issue trailer).

Correct example:
  feat(auth): add token refresh
EOF
  exit 2
}

# Parse: <type>(optional (scope)): <subject>. Capture type, the optional parenthesised scope, and
# the subject. Reject anything that does not match the header shape at all.
header_re='^([a-zA-Z]+)(\(([^)]*)\))?: (.*)$'
if [[ "$header" =~ $header_re ]]; then
  type="${BASH_REMATCH[1]}"
  has_scope="${BASH_REMATCH[2]}"   # includes the parens if a scope group was present
  scope="${BASH_REMATCH[3]}"
  subject="${BASH_REMATCH[4]}"
else
  block "unknown or missing type (header must be '<type>(<scope>)?: <subject>')"
fi

# type must be in the canonical set.
case "$type" in
  feat|fix|refactor|docs|chore|test|perf|build|ci|revert) ;;
  *) block "unknown or missing type: '$type'" ;;
esac

# if a scope is present, it must match [a-z][a-z0-9-]* (rejects all-numeric prd/issue numbers and
# uppercase scopes).
if [ -n "$has_scope" ]; then
  if ! [[ "$scope" =~ ^[a-z][a-z0-9-]*$ ]]; then
    block "malformed scope: '($scope)' — scope must be a lowercase area/domain token, never a number"
  fi
fi

# Trim trailing whitespace: git strips it before storing, so it must not count toward the length
# limit, and an all-whitespace subject collapses to empty (caught just below) — matching git.
subject="${subject%"${subject##*[![:space:]]}"}"

# subject must be non-empty.
[ -n "$subject" ] || block "empty subject"

# subject first char must not be an uppercase A-Z.
first="${subject:0:1}"
if [[ "$first" =~ [A-Z] ]]; then
  block "leading capital: subject must not start with an uppercase letter"
fi

# subject <=72 chars.
if [ "${#subject}" -gt 72 ]; then
  block "over-length subject: ${#subject} chars (limit 72)"
fi

# Best-effort past-tense check: present tense is not mechanically decidable, and a blanket `ed$`
# rule false-positives on legitimate present verbs (embed, speed, exceed, proceed, spread, feed,
# breed, need, seed, heed, bleed, shed) — and for a BLOCKING hook a false positive (cannot commit
# at all) is worse than a missed past-tense. So match the first subject word, case-insensitively,
# against a curated DENYLIST of common past-tense commit verbs; flag only on a hit.
first_word="${subject%% *}"
case "$(printf '%s' "$first_word" | tr '[:upper:]' '[:lower:]')" in
  added|fixed|removed|updated|changed|refactored|renamed|deleted|created|implemented|merged|\
  reverted|bumped|moved|introduced|improved|replaced|dropped|wrote|made)
    block "likely past tense (use present tense): first word '$first_word'" ;;
esac

exit 0
