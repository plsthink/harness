# harness glossary

Glossary only — terms shared across the harness. No implementation detail (see
`${CLAUDE_PLUGIN_ROOT}/shared/context-doc.md` for the format).

**Skill** — a workflow triggered by intent, packaged as `skills/<name>/` with a thin `SKILL.md` +
on-demand `references/`. The bulk of the harness.
_Avoid_: command, macro

**Agent** — a subagent dispatched for a distinct stance+tools (investigator/builder/reviewer).
Flat single `.md` under `agents/`, terse output, no persona, inherits the parent model.
_Avoid_: persona, expert, role-player

**Convention** — glob-routed good-practice loaded before editing a matching file (`conventions/`
global, `docs/conventions/` project). Drives/corrects the model deterministically.
_Avoid_: rule (ambiguous), lint

**Stance** — a recorded decision as current truth, slugged + mutable, rationale in-file + history
in git (ex-ADR). Gate: hard-to-reverse AND surprising AND real trade-off.
_Avoid_: ADR, decision record, supersede

**Learning** — a project-local episodic note a heavy skill reads-before / appends-after; intake
that may be promoted up to a convention.
_Avoid_: memory, retro

**Reference** — a detail file loaded on demand by exactly one skill (or a `shared/` module cited by
many). One level deep — references never chain.
_Avoid_: doc (ambiguous)

**Pipeline** — the skill-chain graph (`${CLAUDE_PLUGIN_ROOT}/shared/pipeline.md`); the contract is the `Next:` footer on
each `SKILL.md` plus the `docs/work/` file substrate.
_Avoid_: workflow engine, orchestrator

**Product vs dogfood** — `shared/`+`conventions/` are *product* (cited via `${CLAUDE_PLUGIN_ROOT}`,
reachable from any project); `docs/` is *dogfood* (nearest-`docs/` walk, harness-repo-only).
_Avoid_: global vs local (imprecise)
