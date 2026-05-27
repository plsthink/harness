#!/usr/bin/env bash
# Regression test for check-onboarded.sh — reports whether a project's AGENTS.md carries a complete
# harness behavior-config block (vs absent / stale-by-missing-key) against the single-source schema.
# Pins the contract so a future edit to the schema-diffing logic can't silently regress the
# absent/complete/stale verdict that later slices (03 step-0, 04 verifier, 05 tdd) will gate on.
# Harness-repo dev tooling (see stances: repo-dev-tooling-home, test-load-bearing-dev-scripts).
# Run on demand: bash <this file>.
# Exit 0 = all cases pass; exit 1 = a case failed.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHECK="$HERE/../../scripts/check-onboarded.sh"
SCHEMA="$HERE/../../scripts/check-onboarded.schema"
fails=0

# Run the checker against a fixture root; assert exit code AND that stdout contains a substring.
# $1=name $2=want_exit $3=want_substr $4=root
expect() {
  local name="$1" want="$2" substr="$3" root="$4" got out
  out=$(bash "$CHECK" "$root" 2>&1); got=$?
  if [ "$got" -ne "$want" ]; then
    printf 'FAIL  %s: expected exit %s, got %s\n' "$name" "$want" "$got" >&2
    fails=1
  elif [ -n "$substr" ] && ! printf '%s' "$out" | grep -qF -- "$substr"; then
    printf 'FAIL  %s: output missing %q\n      got: %s\n' "$name" "$substr" "$out" >&2
    fails=1
  else
    printf 'ok    %s\n' "$name"
  fi
}

# Build a project fixture root whose docs/AGENTS.md carries the given config-block body ($1).
# An empty body means: emit an AGENTS.md with no config block at all (absent).
mkfixture() {
  local body="$1" root
  root="$(mktemp -d)"
  mkdir -p "$root/docs"
  if [ -n "$body" ]; then
    {
      printf '# project\n\n## Config\n'
      printf '<!-- HARNESS-CONFIG-START -->\n'
      printf '%s\n' "$body"
      printf '<!-- HARNESS-CONFIG-END -->\n'
    } > "$root/docs/AGENTS.md"
  else
    printf '# project\n\nno config here\n' > "$root/docs/AGENTS.md"
  fi
  printf '%s' "$root"
}

# A config body listing EVERY schema key (read live from the schema so this stays in lockstep).
full_body() {
  local k
  while IFS= read -r k; do printf '%s: x\n' "$k"; done < <(grep -oE '^[a-z][a-z-]*:' "$SCHEMA" | sed 's/:$//')
}

# 1) No config block at all -> absent (distinct nonzero exit, says "absent").
root="$(mkfixture "")"
expect "absent when no config block" 3 "absent" "$root"
rm -rf "$root"

# 2) All schema keys present -> complete (exit 0, says "complete").
root="$(mkfixture "$(full_body)")"
expect "complete when all keys present" 0 "complete" "$root"
rm -rf "$root"

# 3) Config block present but one schema key missing -> stale, naming the missing key.
#    Drop the first schema key from a full body.
missing_key="$(grep -oE '^[a-z][a-z-]*:' "$SCHEMA" | sed 's/:$//' | head -1)"
stale_body="$(full_body | grep -v "^${missing_key}:")"
root="$(mkfixture "$stale_body")"
expect "stale when a key is missing" 2 "stale" "$root"
expect "stale names the missing key" 2 "$missing_key" "$root"
rm -rf "$root"

if [ "$fails" -ne 0 ]; then echo "check-onboarded.test: FAILURES" >&2; exit 1; fi
echo "check-onboarded.test: all cases pass"
