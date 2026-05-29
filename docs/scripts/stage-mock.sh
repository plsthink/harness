#!/usr/bin/env bash
# stage-mock.sh — stage a harness mock fixture for dogfooding: copy mocks/<name>/_base/ then merge
# the named _overlays/<variant>/ on top, into a scratch dir. The SINGLE SOURCE of the (correct,
# dotfile-inclusive) base+overlay merge that mocks/README.md documents and every dogfood run repeats
# by hand — so a `cp overlay/*` that silently drops a dotfile overlay (e.g. the `clean` variant's
# `.keep`/`.gitkeep`) cannot recur. Harness-repo dev tooling (stance: repo-dev-tooling-home); never
# ships. Its self-test (docs/scripts/stage-mock.test.sh) is dogfood-only.
#
# Usage: stage-mock.sh <name> <overlay> [dest]
#   <name>     a dir under mocks/                       (e.g. url-shorten | cms-mono | task-runner)
#   <overlay>  a dir under mocks/<name>/_overlays/      (e.g. clean | onboarded | buggy | shallow | stale-docs)
#   [dest]     scratch dir to stage into; created if absent, must be EMPTY if it exists.
#              Defaults to a fresh `mktemp -d`. The staged path is the ONLY thing printed to stdout.
# So a caller can `cd "$(stage-mock.sh url-shorten clean)"` and drive a skill as a fresh agent.
# Exit 0 = staged; exit 1 = bad args / missing mock or overlay / non-empty dest.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"            # repo root: docs/scripts/ -> ../../
MOCKS="$ROOT/mocks"

die() { echo "stage-mock: $1" >&2; exit 1; }

[ $# -ge 2 ] || die "usage: stage-mock.sh <name> <overlay> [dest]"
name="$1"; overlay="$2"; dest="${3:-}"

base="$MOCKS/$name/_base"
ov="$MOCKS/$name/_overlays/$overlay"
[ -d "$base" ] || die "no such mock base: mocks/$name/_base (check <name>)"
[ -d "$ov" ]   || die "no such overlay: mocks/$name/_overlays/$overlay (check <overlay>)"

if [ -z "$dest" ]; then
  dest="$(mktemp -d)"
else
  mkdir -p "$dest"
  [ -z "$(ls -A "$dest")" ] || die "dest not empty: $dest"
fi
dest="$(cd "$dest" && pwd)"

# `src/.` copies directory CONTENTS including dotfiles, merging into dest; the overlay then replaces
# any same-named base file. `cp -a src/*` would skip dotfiles — the trap this script exists to kill.
cp -a "$base/." "$dest/"
cp -a "$ov/." "$dest/"

echo "$dest"
