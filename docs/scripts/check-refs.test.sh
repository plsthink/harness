#!/usr/bin/env bash
# Regression test for check-refs.sh — the load-bearing reference checker wired into the repo's
# blocking PostToolUse hook (.claude/settings.json). Pins the contract so a future edit to the
# checker's subtle parsing (brace-sets, glob cites, prose placeholders) can't silently regress
# into false-positives (blocks every edit) or false-negatives (guard disabled).
# Harness-repo dev tooling (see stances: repo-dev-tooling-home, test-load-bearing-dev-scripts).
# Run on demand: bash <this file>.
# Exit 0 = all cases pass; exit 1 = a case failed.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHECK="$HERE/check-refs.sh"
fails=0

# Run the checker against a fixture root; assert its exit code. $1=name $2=expected_exit $3=root
expect() {
  local name="$1" want="$2" root="$3" got
  bash "$CHECK" "$root" >/dev/null 2>&1; got=$?
  if [ "$got" -ne "$want" ]; then
    printf 'FAIL  %s: expected exit %s, got %s\n' "$name" "$want" "$got" >&2
    fails=1
  else
    printf 'ok    %s\n' "$name"
  fi
}

# Build a fixture root with a skills/ skill + a real shared/ target it can point at.
mkfixture() {
  local root; root="$(mktemp -d)"
  mkdir -p "$root/skills/demo/references" "$root/shared"
  : > "$root/shared/real.md"
  : > "$root/skills/demo/references/ref.md"
  printf '%s' "$root"
}

# 1) Clean repo resolves (default ROOT, no arg path).
expect "real repo clean" 0 "$(cd "$HERE/../.." && pwd)"

# 2) Valid refs of every supported shape must NOT false-positive.
root="$(mkfixture)"
mkdir -p "$root/shared/sub"; : > "$root/shared/a.md"; : > "$root/shared/b.md"
cat > "$root/skills/demo/SKILL.md" <<'EOF'
relative ok: [r](references/ref.md)
plugin cite ok: ${CLAUDE_PLUGIN_ROOT}/shared/real.md
brace set ok: ${CLAUDE_PLUGIN_ROOT}/shared/{a,b}.md
glob cite ok: ${CLAUDE_PLUGIN_ROOT}/shared/sub/*
prose placeholder ignored: ${CLAUDE_PLUGIN_ROOT}/shared/<name>.md and references/x.md
EOF
expect "valid shapes resolve" 0 "$root"
rm -rf "$root"

# 3) A dangling relative markdown link is caught.
root="$(mkfixture)"
printf 'bad: [x](references/missing.md)\n' > "$root/skills/demo/SKILL.md"
expect "dangling relative ref caught" 1 "$root"
rm -rf "$root"

# 4) A dangling plugin-root cite is caught.
root="$(mkfixture)"
printf 'bad: ${CLAUDE_PLUGIN_ROOT}/shared/ghost.md\n' > "$root/skills/demo/SKILL.md"
expect "dangling plugin-root cite caught" 1 "$root"
rm -rf "$root"

# 5) One bad member inside a brace set is caught (real.md exists, ghost.md does not).
root="$(mkfixture)"
printf 'bad: ${CLAUDE_PLUGIN_ROOT}/shared/{real,ghost}.md\n' > "$root/skills/demo/SKILL.md"
expect "dangling brace-set member caught" 1 "$root"
rm -rf "$root"

# 6) A dangling cite in the dogfood root (docs/) is caught — the historical home of ref drift.
root="$(mkfixture)"
mkdir -p "$root/docs"
printf 'nav: ${CLAUDE_PLUGIN_ROOT}/shared/ghost.md\n' > "$root/docs/AGENTS.md"
expect "dangling docs/ cite caught" 1 "$root"
rm -rf "$root"

# 7) A dangling relative link in a root entrypoint file (CLAUDE.md) is caught.
root="$(mkfixture)"
printf 'see [x](docs/missing.md)\n' > "$root/CLAUDE.md"
expect "dangling root-entrypoint link caught" 1 "$root"
rm -rf "$root"

# 8) Valid cites in docs/ and a root file must NOT false-positive.
root="$(mkfixture)"
mkdir -p "$root/docs"
printf 'ok: ${CLAUDE_PLUGIN_ROOT}/shared/real.md\n' > "$root/docs/AGENTS.md"
printf 'ok: [a](shared/real.md)\n' > "$root/README.md"
expect "valid docs/ + root cites resolve" 0 "$root"
rm -rf "$root"

# 9) A bare-backtick `shared/x.md` cite is flagged even though it RESOLVES — it breaks the
#    authoring-standard hard rule (must use the ${CLAUDE_PLUGIN_ROOT}/ form). real.md exists.
root="$(mkfixture)"
printf 'see the `shared/real.md` format spec\n' > "$root/skills/demo/SKILL.md"
expect "bare shared/x.md cite flagged" 1 "$root"
rm -rf "$root"

# 10) Bare `shared/` dir mentions and the prefixed form must NOT trip block 3.
root="$(mkfixture)"
printf 'formats live in `shared/`; cite via `${CLAUDE_PLUGIN_ROOT}/shared/real.md`\n' \
  > "$root/skills/demo/SKILL.md"
expect "bare dir + prefixed form not flagged" 0 "$root"
rm -rf "$root"

# 11) A `<name>` placeholder in a shared/ cite (docs that DESCRIBE the rule) must NOT be flagged.
root="$(mkfixture)"
printf 'rule: a bare `shared/<name>.md` must use the prefixed form\n' > "$root/skills/demo/SKILL.md"
expect "shared/<name> placeholder not flagged" 0 "$root"
rm -rf "$root"

# 12) An unfilled `{{UPPER_SNAKE}}` scaffold token surviving in a committed file is caught —
#     scaffold.sh leaves these for the invoking skill to fill; a forgotten one is residue.
root="$(mkfixture)"
mkdir -p "$root/docs/conventions"
printf '| Matcher | Load |\n|---|---|\n| {{GLOB}} | {{DOCS}} |\n' > "$root/docs/conventions/INDEX.md"
expect "unfilled scaffold token caught" 1 "$root"
rm -rf "$root"

# 13) Lowercase/spaced `{{...}}` (e.g. an HTML report example) is NOT scaffold residue.
root="$(mkfixture)"
printf '<title>Architecture review — {{repo name}}</title>\n' > "$root/skills/demo/SKILL.md"
expect "lowercase {{repo name}} example not flagged" 0 "$root"
rm -rf "$root"

# 14) A dangling cite in a monorepo per-package glossary (packages/<pkg>/docs/) is caught —
#     the per-package fan-out shared/context-doc.md defines, scanned alongside the root docs/.
root="$(mkfixture)"
mkdir -p "$root/packages/core/docs"
printf 'see [x](missing.md)\n' > "$root/packages/core/docs/CONTEXT.md"
expect "dangling per-package docs/ cite caught" 1 "$root"
rm -rf "$root"

# 15) A root with no authored markdown (a code-only / mid-construction mock) is clean (exit 0),
#     not a dangling-ref failure — so the blocking mock hook does not reject a new mock's first
#     code file written before its docs/ skeleton exists.
root="$(mktemp -d)"
: > "$root/index.js"
expect "no authored markdown is clean" 0 "$root"
rm -rf "$root"

if [ "$fails" -ne 0 ]; then echo "check-refs.test: FAILURES" >&2; exit 1; fi
echo "check-refs.test: all cases pass"
