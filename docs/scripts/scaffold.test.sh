#!/usr/bin/env bash
# Regression test for templates/scaffold.sh — the load-bearing template instantiator used by
# new-skill, new-agent, onboard, prd, and architecture. Unlike check-refs (dev-only), the script
# under test SHIPS to every target project, so a silent regression in its placeholder substitution
# or its guard rails (overwrite-refusal, missing-template error) would corrupt scaffolded skills/
# agents/docs everywhere. This test is harness-repo dev tooling and does NOT ship
# (see stances: repo-dev-tooling-home, test-load-bearing-dev-scripts). Run on demand: bash <this file>.
# Exit 0 = all cases pass; exit 1 = a case failed.
#
# Scope note: scaffold substitutes keys sequentially with sed, so a value that itself contains a
# literal {{LATER_KEY}} token would be re-substituted. That ordering is NOT pinned here: model-
# authored values never carry placeholder tokens, and the only order-independent fixes add a perl/
# awk dependency that would regress the shipped script's portability (lean-first: no fix until the
# friction recurs). Pin the contract that matters, not the hypothetical. The substitution KEY is
# likewise interpolated raw into the sed LHS, so a key with regex metacharacters would over-match —
# unfixed for the same reason: every template token is upper-snake [A-Z0-9_] and KEY=VALUE keys are
# scaffold-internal, never free text.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SC="$(cd "$HERE/../.." && pwd)/templates/scaffold.sh"
fails=0

pass() { printf 'ok    %s\n' "$1"; }
fail() { printf 'FAIL  %s: %s\n' "$1" "$2" >&2; fails=1; }

# 1) Basic substitution: every {{KEY}} given a value is replaced; none of those tokens remain.
d="$(mktemp -d)"
bash "$SC" skill/SKILL.md "$d/out.md" SKILL_NAME=demo WHAT_IT_DOES='Does X.' TRIGGERS='user wants X' >/dev/null 2>&1
if grep -q '^name: demo$' "$d/out.md" && grep -q 'Does X. Use when user wants X.' "$d/out.md" \
   && ! grep -q '{{SKILL_NAME}}\|{{WHAT_IT_DOES}}\|{{TRIGGERS}}' "$d/out.md"; then
  pass "basic substitution"
else
  fail "basic substitution" "expected tokens replaced; got $(grep -c '{{' "$d/out.md") braces left"
fi
rm -rf "$d"

# 2) Special chars in a value (& / \) survive sed-replacement-side escaping, no corruption.
d="$(mktemp -d)"
bash "$SC" docs/PROJECT.md "$d/out.md" PROJECT_NAME='a/b & c\d' >/dev/null 2>&1
if grep -qF 'a/b & c\d' "$d/out.md"; then
  pass "special chars escaped"
else
  fail "special chars escaped" "value mangled: $(head -1 "$d/out.md")"
fi
rm -rf "$d"

# 3) Tokens with no KEY=VALUE are left verbatim for the invoking skill to fill (model-authored).
d="$(mktemp -d)"
bash "$SC" skill/SKILL.md "$d/out.md" SKILL_NAME=demo >/dev/null 2>&1
if grep -qF '{{ONE_LINE_PURPOSE}}' "$d/out.md"; then
  pass "unsubstituted tokens preserved"
else
  fail "unsubstituted tokens preserved" "leftover token was stripped"
fi
rm -rf "$d"

# 4) Refuses to overwrite an existing dest (exit 1), leaving the original untouched.
d="$(mktemp -d)"
printf 'ORIGINAL\n' > "$d/out.md"
if bash "$SC" skill/SKILL.md "$d/out.md" SKILL_NAME=demo >/dev/null 2>&1; then
  fail "refuse overwrite" "exited 0 instead of erroring"
elif ! grep -qx 'ORIGINAL' "$d/out.md"; then
  fail "refuse overwrite" "clobbered the existing file"
else
  pass "refuse overwrite"
fi
rm -rf "$d"

# 5) Missing template errors out (exit 1) and writes nothing.
d="$(mktemp -d)"
if bash "$SC" nope/missing.md "$d/out.md" >/dev/null 2>&1; then
  fail "missing template errors" "exited 0 for a nonexistent template"
elif [ -e "$d/out.md" ]; then
  fail "missing template errors" "created a dest file from a missing template"
else
  pass "missing template errors"
fi
rm -rf "$d"

# 6) Creates nested parent dirs of the dest path.
d="$(mktemp -d)"
bash "$SC" docs/stance.md "$d/deep/nested/out.md" STANCE_TITLE='t' >/dev/null 2>&1
if [ -f "$d/deep/nested/out.md" ]; then
  pass "creates nested dest dirs"
else
  fail "creates nested dest dirs" "dest not created under new parent dirs"
fi
rm -rf "$d"

if [ "$fails" -ne 0 ]; then echo "scaffold.test: FAILURES" >&2; exit 1; fi
echo "scaffold.test: all cases pass"
