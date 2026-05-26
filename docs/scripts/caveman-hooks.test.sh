#!/usr/bin/env bash
# Regression test for the two caveman hooks — hooks/caveman-activate.js (SessionStart) and
# hooks/caveman-mode-tracker.js (UserPromptSubmit). These SHIP via plugin.json and run on EVERY
# session start / EVERY user turn of EVERY target project, so their runtime blast radius is wider
# than any other product code in the repo, yet they carried no test. This test is harness-repo dev
# tooling and does NOT ship (see stances: repo-dev-tooling-home, test-load-bearing-dev-scripts).
# Run on demand: bash <this file>.
# Exit 0 = all cases pass; exit 1 = a case failed.
#
# The contract that matters: skills/caveman/SKILL.md is the SINGLE SOURCE OF TRUTH for the lite
# ruleset, and activate.js extracts the text between its <!-- RULESET-START --> / <!-- RULESET-END
# --> markers. If those markers are renamed/removed in the SKILL.md (or activate's regex drifts),
# the hook silently falls back to a stale hardcoded string — a coherence regression that ships and
# goes undetected. Case 1 pins that source<->consumer agreement with an INDEPENDENT extraction.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
ACT="$ROOT/hooks/caveman-activate.js"
TRK="$ROOT/hooks/caveman-mode-tracker.js"
SKILL="$ROOT/skills/caveman/SKILL.md"
fails=0

pass() { printf 'ok    %s\n' "$1"; }
fail() { printf 'FAIL  %s: %s\n' "$1" "$2" >&2; fails=1; }

# 1) activate.js emits exactly the SKILL.md inter-marker ruleset (not the stale fallback).
#    Extracted independently via awk so a regression in EITHER the markers or activate's regex
#    surfaces as a mismatch; identical edits to the ruleset text move together and still pass.
extracted="$(awk '/RULESET-START/{f=1;next} /RULESET-END/{f=0} f' "$SKILL")"
emitted="$(node "$ACT")"
if [ -z "$extracted" ]; then
  fail "ruleset source-of-truth" "no content between RULESET markers in SKILL.md"
elif [ "$extracted" = "$emitted" ]; then
  pass "ruleset source-of-truth"
else
  fail "ruleset source-of-truth" "activate.js output diverged from SKILL.md markers (fallback?)"
fi

# 2) activate.js emits the lite heading and never leaks marker syntax into the prompt.
if printf '%s' "$emitted" | grep -q '^## CAVEMAN MODE (lite)$' \
   && ! printf '%s' "$emitted" | grep -q 'RULESET'; then
  pass "activate emits clean ruleset"
else
  fail "activate emits clean ruleset" "missing heading or leaked marker text"
fi

# 3) tracker.js re-injects the one-line reminder on an ordinary prompt.
out="$(printf '{"prompt":"fix the auth bug"}' | node "$TRK")"
if printf '%s' "$out" | grep -q '^CAVEMAN MODE ACTIVE (lite)\.'; then
  pass "tracker reminder on normal prompt"
else
  fail "tracker reminder on normal prompt" "expected reminder, got: $out"
fi

# 4) tracker.js stays silent on the turn the user disables the mode (stateless, no flag file).
for p in "stop caveman" "please turn off caveman" "switch to normal mode"; do
  out="$(printf '{"prompt":"%s"}' "$p" | node "$TRK")"
  if [ -n "$out" ]; then
    fail "tracker silent on disable" "emitted reminder for disable prompt: '$p'"
  fi
done
[ "$fails" -eq 0 ] && pass "tracker silent on disable"

# 5) tracker.js degrades gracefully on malformed stdin (no crash, emits the reminder).
out="$(printf 'not json' | node "$TRK" 2>/dev/null)"
if [ "$?" -eq 0 ] && printf '%s' "$out" | grep -q '^CAVEMAN MODE ACTIVE'; then
  pass "tracker survives malformed stdin"
else
  fail "tracker survives malformed stdin" "crashed or emitted nothing"
fi

if [ "$fails" -ne 0 ]; then echo "caveman-hooks.test: FAILURES" >&2; exit 1; fi
echo "caveman-hooks.test: all cases pass"
