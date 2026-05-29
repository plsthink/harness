#!/usr/bin/env bash
# Regression test for docs/scripts/stage-mock.sh — the deterministic mock-fixture stager every
# dogfood run depends on. The merge semantics are correctness-critical: a regression that dropped
# dotfiles (the `clean` overlay is ONLY `.keep`/`.gitkeep`) or stopped the overlay replacing a
# same-named base file would silently stage the wrong pre-state, and the skill driven against it
# would measure the wrong thing. Harness-repo dev tooling; does NOT ship (stances:
# repo-dev-tooling-home, test-load-bearing-dev-scripts). Run on demand: bash <this file>.
# Exit 0 = all cases pass; exit 1 = a case failed.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SM="$HERE/stage-mock.sh"
fails=0
pass() { printf 'ok    %s\n' "$1"; }
fail() { printf 'FAIL  %s: %s\n' "$1" "$2" >&2; fails=1; }

# 1) base+overlay merge into an explicit dest: a base file and an overlay-added file both land.
d="$(mktemp -d)"; rmdir "$d"            # pass a not-yet-existing dest (script must mkdir it)
out="$(bash "$SM" url-shorten clean "$d" 2>/dev/null)" \
  && [ "$out" = "$d" ] && [ -f "$d/shorten.js" ] \
  && pass "stages base into explicit dest, prints the path" \
  || fail "explicit dest" "out=$out shorten.js=$( [ -f "$d/shorten.js" ] && echo y || echo n )"

# 2) DOTFILE inclusion — the trap this script exists to kill: clean overlay's .gitkeep must survive.
[ -f "$d/.gitkeep" ] \
  && pass "dotfile-only overlay file (.gitkeep) is merged, not dropped" \
  || fail "dotfile merge" ".gitkeep missing from staged clean overlay"

# 3) overlay REPLACES a same-named base file: buggy/shorten.js (the subarray(0,15) plant) wins.
d2="$(mktemp -d)"
bash "$SM" url-shorten buggy "$d2" >/dev/null 2>&1
if grep -q 'subarray(0, 15)' "$d2/shorten.js" && ! grep -q 'subarray(0, 16)' "$d2/shorten.js"; then
  pass "overlay replaces same-named base file (buggy shorten.js wins)"
else
  fail "overlay replace" "staged shorten.js is not the buggy overlay's copy"
fi

# 4) default dest (mktemp) is used when none is given, and is a real staged dir.
out3="$(bash "$SM" cms-mono onboarded 2>/dev/null)"
[ -n "$out3" ] && [ -d "$out3" ] && [ -f "$out3/docs/CONTEXT-MAP.md" ] \
  && pass "default mktemp dest is created and staged" \
  || fail "default dest" "out3=$out3"

# 5) bad mock name -> exit 1, message on stderr, nothing on stdout.
if o="$(bash "$SM" nope clean 2>/dev/null)"; then fail "bad name" "expected nonzero exit"; \
  elif [ -n "$o" ]; then fail "bad name" "stdout not empty on error: $o"; \
  else pass "unknown mock name fails (exit 1, no stdout)"; fi

# 6) bad overlay -> exit 1.
bash "$SM" url-shorten nope >/dev/null 2>&1 && fail "bad overlay" "expected nonzero exit" \
  || pass "unknown overlay fails (exit 1)"

# 7) non-empty dest -> refuse (don't stage over existing content).
d4="$(mktemp -d)"; : > "$d4/sentinel"
bash "$SM" url-shorten clean "$d4" >/dev/null 2>&1 && fail "non-empty dest" "expected refusal" \
  || { [ -f "$d4/sentinel" ] && pass "refuses a non-empty dest (leaves it untouched)" || fail "non-empty dest" "sentinel clobbered"; }

# 8) too few args -> usage error, exit 1.
bash "$SM" url-shorten >/dev/null 2>&1 && fail "arity" "expected nonzero exit" \
  || pass "missing <overlay> arg fails with usage"

exit "$fails"
