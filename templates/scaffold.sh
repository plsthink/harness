#!/usr/bin/env bash
# Instantiate a template skeleton with placeholder substitution.
# Usage: scaffold.sh <template-rel-path> <dest-path> [KEY=VALUE ...]
#   <template-rel-path>  path under templates/ (e.g. skill/SKILL.md)
#   KEY=VALUE            replaces {{KEY}} in the copy
# Unsubstituted {{TOKENS}} are left in place for the invoking skill to fill (model-authored).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
tpl="$ROOT/$1"; dest="$2"; shift 2
[ -f "$tpl" ] || { echo "scaffold: no template: $tpl" >&2; exit 1; }
[ -e "$dest" ] && { echo "scaffold: dest exists, refusing overwrite: $dest" >&2; exit 1; }

mkdir -p "$(dirname "$dest")"
cp "$tpl" "$dest"
for kv in "$@"; do
  key="${kv%%=*}"; val="${kv#*=}"
  # escape sed-special chars in replacement
  esc=$(printf '%s' "$val" | sed -e 's/[&/\]/\\&/g')
  sed -i "s/{{${key}}}/${esc}/g" "$dest"
done
echo "scaffold: wrote $dest"
