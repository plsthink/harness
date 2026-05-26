# Pipeline — the skill-chain graph

Cited by: `handoff`, `new-skill`. **Product, not a
dev-doc** — `${CLAUDE_PLUGIN_ROOT}`-resolvable so a `Next:` pointer / `onboard` / `handoff` can
read it from inside any target project. Derivable from the per-`SKILL.md` footers; hand-maintained
now, add a regen script only if drift recurs (lean-first).

This is also the harness's own architecture map (it dogfoods — `docs/AGENTS.md` routes here
instead of duplicating a graph).

## Graph

```
prototype ─┐
think ─────┼─→ prd ──→ issues ──→ (triage) ──→ execute-issue ──→ tdd ──→ (handoff | diagnose)
           │   PRD.md   issues/NN              worktree+subagents  red-green
           │
diagnose ──┴─→ architecture        (bug-fix loop; hands findings to architecture)
architecture → tdd                 (implement a deepening)
docs-review                        (manual sweep over PROJECT + CONTEXT + stances + conventions)
think                              (inline doc hygiene during any work session)
caveman / zoom-out / new-skill / new-agent / onboard   (ad-hoc / meta / bootstrap)
```

## Stage notes

- **prototype / think** — entry points. `think` is the relentless interview; `prototype` is the
  throwaway sanity-check. Both feed `prd`.
- **prd → issues → triage → execute-issue** — the build spine. The human quality gate is the
  `think→issues→triage` pass that stamps `ready-for-agent`; `execute-issue` then runs AFK.
- **tdd** — invoked inside `execute-issue` per task; also directly for hand-driven work.
- **diagnose → architecture → tdd** — the bug/deepening loop. `diagnose` fixes; hands
  architectural findings to `architecture`; `architecture` hands an approved deepening to `tdd`.
- **docs-review / think** — doc maintenance: `think` inline at write-time, `docs-review` periodic.
- **caveman / zoom-out / new-skill / new-agent / onboard** — ad-hoc, meta, and bootstrap; not in
  the spine. `caveman` is a comms mode, not a stage.
