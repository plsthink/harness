# Harness-repo dev tooling lives under docs/scripts/

**Stance:** Scripts that validate or maintain the harness's *own* authored files (e.g.
`docs/scripts/check-refs.sh`, the reference-integrity checker) live under `docs/scripts/` — the
dogfood root — never in `shared/` or a skill's `scripts/`, and never ship. They wire into the
harness repo's own `.claude/settings.json` as `PostToolUse` hooks (exit 2 so the editing agent
self-corrects in the same turn), **not** into `plugin.json` — which ships product hooks like
caveman to every target project.

**Why:** The two-roots constraint (PROJECT.md) only forbids `docs/` from holding things needed
*at runtime in another project*; a dev-time validator is exactly the opposite, so `docs/` is its
home and the shipped plugin stays lean. Hooking it in the repo's own `.claude/settings.json`
dogfoods the same convention the harness documents for target projects (a project-specific guard
belongs in that project's settings — see `skills/execute-issue/references/loop.md`).
check-refs scans the *full* authored surface (`skills/`, `agents/`, `shared/`, `conventions/`,
`docs/`, root `CLAUDE.md`/`README.md`) because dangling-ref drift historically recurred in `docs/`
and `conventions/INDEX.md`, not just the product dirs; `templates/` (placeholder tokens) and
generated paths (`.gnhf/`, `.git/`) are excluded. Beyond dangling refs it also flags *malformed*
cites that resolve but break a hard rule: a bare-backtick `shared/<name>.md`/`conventions/<name>.md`
must use the `${CLAUDE_PLUGIN_ROOT}/` form — that drift recurred (fixed by hand twice, in product
then dogfood docs), clearing the lean-first bar the single-occurrence case once failed.

**Rejected:** Putting it in `shared/` as a generic product feature — no second consumer exists, so
that's speculative generality. Promote only if a real plugin-authoring consumer appears.
