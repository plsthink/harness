#!/usr/bin/env bash
# Reference-integrity check for the harness's own authored markdown.
# Validates that every cross-file reference resolves:
#   - relative markdown links   [text](references/x.md) / [text](sibling.md)
#   - plugin-root cites         ${CLAUDE_PLUGIN_ROOT}/shared/x.md  (incl. {a,b} brace sets)
# and flags malformed cites that resolve but break the authoring-standard hard rule:
#   - bare-backtick `shared/x.md` / `conventions/x.md` must use the ${CLAUDE_PLUGIN_ROOT}/ form
# and flags unfilled scaffold residue:
#   - `{{UPPER_SNAKE}}` template tokens left in a committed (non-template) file
# Covers the full authored surface: the product dirs (skills/, agents/, shared/, conventions/),
# the dogfood root (docs/ — where dangling-ref drift historically recurred), and the root
# entrypoints (CLAUDE.md, README.md). Excludes generated/orchestrator paths and templates/
# (its {{TOKENS}}/<...> are placeholders, never real targets).
# Harness-repo dev tooling (see stance: repo-dev-tooling-home), not shipped to target projects.
# Exit 0 = all references resolve; exit 1 = at least one dangling reference.
# Usage: check-refs.sh [ROOT]  — ROOT defaults to the repo root; pass a fixture root to test.
set -euo pipefail

ROOT="${1:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
ROOT="$(cd "$ROOT" && pwd)"
cd "$ROOT"

# Scan only the authored dirs/files that exist under ROOT (fixtures may carry a subset).
scan_dirs=()
for d in skills agents shared conventions docs; do [ -d "$d" ] && scan_dirs+=("$d"); done
scan_files=()
for f in CLAUDE.md README.md; do [ -f "$f" ] && scan_files+=("$f"); done
[ "${#scan_dirs[@]}" -gt 0 ] || [ "${#scan_files[@]}" -gt 0 ] \
  || { echo "check-refs: no authored markdown under $ROOT" >&2; exit 1; }

fail=0
report() { printf '%s\n' "$1" >&2; fail=1; }

# A target is a prose placeholder (not a real path) when it contains a `...` ellipsis,
# `<...>` angle metasyntax, `{{...}}` template token, or is the bare authoring example.
is_placeholder() {
  case "$1" in
    *...*|*'<'*|*'>'*|*'{{'*|references/x.md) return 0 ;;
    *) return 1 ;;
  esac
}

# Expand a single {a,b,c} brace set in $1 into newline-separated candidates (one level — all
# current cites use at most one set). No brace -> echoes the input unchanged.
expand_braces() {
  local s="$1" pre post body item
  if [[ "$s" == *'{'*'}'* ]]; then
    pre="${s%%\{*}"; post="${s#*\}}"; body="${s#*\{}"; body="${body%%\}*}"
    # `\n` terminator so `read` also yields the final member (else the last is dropped).
    while IFS= read -r item; do printf '%s%s%s\n' "$pre" "$item" "$post"; done \
      < <(printf '%s\n' "$body" | tr ',' '\n')
  else
    printf '%s\n' "$s"
  fi
}

while IFS= read -r f; do
  dir="$(dirname "$f")"
  lineno=0
  while IFS= read -r line; do
    lineno=$((lineno + 1))

    # 1) relative markdown links ending in .md, excluding URLs and absolute/root cites
    while IFS= read -r tgt; do
      [ -n "$tgt" ] || continue
      case "$tgt" in http*|/*|\$*) continue ;; esac
      is_placeholder "$tgt" && continue
      [ -f "$dir/$tgt" ] || report "$f:$lineno: dangling relative ref -> $tgt"
    done < <(grep -oE '\]\([^)]+\.md\)' <<<"$line" | sed -E 's/^\]\(//; s/\)$//')

    # 2) ${CLAUDE_PLUGIN_ROOT}/... cites (strip trailing punctuation/backticks)
    while IFS= read -r cite; do
      [ -n "$cite" ] || continue
      rel="${cite#\$\{CLAUDE_PLUGIN_ROOT\}/}"
      rel="${rel%%[\`.,\;:\ ]}"
      [ "$rel" = "$cite" ] && continue   # bare ${CLAUDE_PLUGIN_ROOT} with no /path
      rel="${rel%/\*}"                   # `dir/*` glob -> verify the directory
      is_placeholder "$rel" && continue
      while IFS= read -r cand; do
        [ -e "$ROOT/$cand" ] || report "$f:$lineno: dangling plugin-root cite -> \${CLAUDE_PLUGIN_ROOT}/$cand"
      done < <(expand_braces "$rel")
    done < <(grep -oE '\$\{CLAUDE_PLUGIN_ROOT\}/[^ `)]*' <<<"$line")

    # 3) bare-backtick `shared/x.md` / `conventions/x.md` file-cites: the authoring-standard
    #    hard rule is product files cite these via the ${CLAUDE_PLUGIN_ROOT}/ form. The leading
    #    backtick anchor skips the prefixed form (`${CLAUDE_PLUGIN_ROOT}/shared/x.md`) and bare
    #    dir mentions (`shared/`), so only the malformed specific-file cite is flagged.
    while IFS= read -r bad; do
      [ -n "$bad" ] || continue
      is_placeholder "$bad" && continue
      report "$f:$lineno: bare shared/conventions cite -> $bad (use \${CLAUDE_PLUGIN_ROOT}/$bad)"
    done < <(grep -oE '`(shared|conventions)/[a-z0-9-]+\.md`' <<<"$line" | tr -d '`')

    # 4) unfilled scaffold residue: templates/ is excluded from the scan, so a `{{UPPER_SNAKE}}`
    #    token surviving in any scanned file is a scaffold.sh placeholder the invoking skill
    #    forgot to fill (scaffold.sh's KEY=VALUE tokens are always upper-snake). Lowercase/spaced
    #    `{{...}}` — e.g. a `{{repo name}}` example inside an HTML report block — is left alone.
    while IFS= read -r tok; do
      [ -n "$tok" ] || continue
      report "$f:$lineno: unfilled scaffold token -> $tok (fill it in, or drop the placeholder row)"
    done < <(grep -oE '\{\{[A-Z][A-Z0-9_]*\}\}' <<<"$line")

  done < "$f"
done < <(
  { [ "${#scan_dirs[@]}" -gt 0 ] && find "${scan_dirs[@]}" -name '*.md' -type f
    [ "${#scan_files[@]}" -gt 0 ] && printf '%s\n' "${scan_files[@]}"
  } | sort -u
)

if [ "$fail" -ne 0 ]; then
  echo "check-refs: dangling references found" >&2
  exit 1
fi
echo "check-refs: all references resolve"
