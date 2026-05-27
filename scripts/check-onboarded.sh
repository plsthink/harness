#!/usr/bin/env bash
# check-onboarded.sh — report whether a harness project has recorded a COMPLETE behavior-config.
#
# A harness project answers the behavior-config contract in a delimited, parseable block in its
# AGENTS.md (precedent: caveman's `<!-- RULESET-START/END -->` markers):
#   <!-- HARNESS-CONFIG-START -->
#   context: single
#   tdd-applies: true
#   ...
#   <!-- HARNESS-CONFIG-END -->
# The REQUIRED key set is the single-source schema beside this script (check-onboarded.schema) —
# this script reads its key list FROM the schema and diffs it against the project's recorded block,
# so adding a key to the contract is a one-line schema edit (no key list is hardcoded here).
#
# Verdicts (mechanism only — no skill calls this yet; later slices wire it into step-0):
#   complete : the config block exists and carries every schema key   -> exit 0
#   stale    : the block exists but is missing >=1 schema key (named)  -> exit 2
#   absent   : no config block (or no AGENTS.md) under ROOT            -> exit 3
# A usage/environment error (missing schema, unreadable ROOT) exits 1.
#
# PRODUCT (it ships under ${CLAUDE_PLUGIN_ROOT}/scripts/): config-consuming skills invoke this at
# step-0 in ANY onboarded project via `${CLAUDE_PLUGIN_ROOT}/scripts/check-onboarded.sh
# "$CLAUDE_PROJECT_DIR"` (see ${CLAUDE_PLUGIN_ROOT}/shared/onboarding-gate.md). Its self-test
# (docs/scripts/check-onboarded.test.sh) is harness-repo dev tooling only (stance:
# test-load-bearing-dev-scripts: a product script may carry a dogfood-only test).
# Usage: check-onboarded.sh [ROOT]  — ROOT defaults to the repo root; pass a fixture root to test.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCHEMA="$HERE/check-onboarded.schema"

ROOT="${1:-${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}}"
[ -n "$ROOT" ] && [ -d "$ROOT" ] || { echo "check-onboarded: ROOT not found: ${ROOT:-<empty>}" >&2; exit 1; }
ROOT="$(cd "$ROOT" && pwd)"

[ -f "$SCHEMA" ] || { echo "check-onboarded: schema missing: $SCHEMA" >&2; exit 1; }

# Required keys = the left-of-colon token of each non-comment, non-blank schema line.
mapfile -t required < <(grep -oE '^[a-z][a-z-]*:' "$SCHEMA" | sed 's/:$//')
[ "${#required[@]}" -gt 0 ] || { echo "check-onboarded: schema lists no keys: $SCHEMA" >&2; exit 1; }

# Locate the project's AGENTS.md (the recorded-config home). docs/AGENTS.md is the harness layout;
# fall back to a root AGENTS.md so a differently-rooted project still resolves.
agents=""
for cand in "$ROOT/docs/AGENTS.md" "$ROOT/AGENTS.md"; do
  [ -f "$cand" ] && { agents="$cand"; break; }
done

# Extract the keys recorded inside the config block, if a block exists.
block_found=0
present=""
if [ -n "$agents" ]; then
  # Pull the lines strictly between the START/END markers.
  body="$(awk '/<!-- HARNESS-CONFIG-START -->/{f=1;next} /<!-- HARNESS-CONFIG-END -->/{f=0} f' "$agents")"
  if printf '%s' "$body" | grep -q .; then
    block_found=1
    present="$(printf '%s\n' "$body" | grep -oE '^[a-z][a-z-]*:' | sed 's/:$//')"
  fi
fi

if [ "$block_found" -eq 0 ]; then
  echo "absent: no harness behavior-config block found under $ROOT"
  exit 3
fi

# Diff: which required keys are not present?
missing=()
for key in "${required[@]}"; do
  printf '%s\n' "$present" | grep -qx "$key" || missing+=("$key")
done

if [ "${#missing[@]}" -eq 0 ]; then
  echo "complete: all ${#required[@]} behavior-config keys present"
  exit 0
fi

echo "stale: config block present but missing ${#missing[@]} schema key(s): ${missing[*]}"
exit 2
