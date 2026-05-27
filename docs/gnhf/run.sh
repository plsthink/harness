#!/usr/bin/env bash
# Launch a gnhf self-improvement flow against this repo.
# Each flow = one objective file in this dir plus a default --stop-when condition (below).
# Pass your own --stop-when in the extra args to override the default for a run.
#
# Usage:
#   docs/gnhf/run.sh <flow> [extra gnhf args...]
#   docs/gnhf/run.sh <flow> --dry-run                       # print the gnhf command, do not run
#   docs/gnhf/run.sh <flow> --stop-when "my own condition"  # override the default condition
#
# Flows:
#   dogfood     fix friction surfaced by driving a skill against a mocks/ fixture
#   upstream    pull a deliberate upstream divergence (docs/integrations re-diff)
#   capability  cover a repeatable task no current skill+pipeline handles
#   coherence   reconcile one concrete internal inconsistency
#   umbrella    unattended: runs the four above as ordered phases
#
# Extra args pass straight to gnhf, e.g. --worktree, --max-tokens 4000000, --agent codex.
set -euo pipefail

dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

declare -A flows=(
  [dogfood]=dogfood-friction.md
  [upstream]=upstream-integration.md
  [capability]=capability-expansion.md
  [coherence]=coherence-audit.md
  [umbrella]=self-improve-umbrella.md
)

# Default --stop-when condition per flow. This is the single source of the canonical condition
# string; gnhf injects it into the agent at runtime. The prompt files describe the halt only in
# prose (no verbatim string), so there is nothing here to keep in sync.
declare -A conds=(
  [dogfood]="every harness skill has been driven against a representative fixture since the last product change and none stumbles"
  [upstream]="every integration source is re-diffed current and every remaining upstream delta is deliberately rejected"
  [capability]="the pipeline covers every repeatable in-scope task and remaining gaps are deliberately deferred"
  [coherence]="check-refs and the dev-script self-tests pass and no genuine internal inconsistency remains"
  [umbrella]="a full cycle through all four phases produced no change"
)

usage() {
  echo "usage: ${BASH_SOURCE[0]} <flow> [extra gnhf args...]" >&2
  echo "flows: ${!flows[*]}" >&2
  exit 2
}

[ $# -ge 1 ] || usage
flow="$1"; shift
prompt_file="${flows[$flow]:-}"
[ -n "$prompt_file" ] || { echo "unknown flow: $flow" >&2; usage; }

prompt_path="$dir/$prompt_file"
[ -f "$prompt_path" ] || { echo "missing prompt file: $prompt_path" >&2; exit 1; }

# Sift extra args: pull out --dry-run, and detect a caller-supplied --stop-when (which wins
# over the default for this run).
dry=0
has_stop_when=0
args=()
for a in "$@"; do
  case "$a" in
    --dry-run|-n) dry=1 ;;
    --stop-when|--stop-when=*) has_stop_when=1; args+=("$a") ;;
    *) args+=("$a") ;;
  esac
done

cmd=(gnhf --current-branch)
if [ "$has_stop_when" -eq 0 ]; then
  cmd+=(--stop-when "${conds[$flow]}")
fi
cmd+=("$(cat "$prompt_path")")
[ ${#args[@]} -gt 0 ] && cmd+=("${args[@]}")

if [ "$dry" -eq 1 ]; then
  if [ "$has_stop_when" -eq 0 ]; then
    printf 'gnhf --current-branch --stop-when %q <%s> %s\n' "${conds[$flow]}" "$prompt_file" "${args[*]:-}"
  else
    printf 'gnhf --current-branch <%s> %s\n' "$prompt_file" "${args[*]:-}"
  fi
  exit 0
fi

exec "${cmd[@]}"
