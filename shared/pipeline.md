# Pipeline — the skill-chain graph

Cited by: `handoff`, `new-skill`. **Product, not a
dev-doc** — `${CLAUDE_PLUGIN_ROOT}`-resolvable so a `Next:` pointer or `handoff` can
read it from inside any target project. Derivable from the per-`SKILL.md` footers; hand-maintained
now, add a regen script only if drift recurs (lean-first).

Also the harness's own architecture map — `docs/AGENTS.md` routes here, not a duplicated graph.

## Graph

```
           ┌─────────── spec-mutation (path-level) ────────────┐
           │                                                   │
           ▼                                                   │
prototype ─┐                                                   │
think ─────┼─→ prd ──→ issues ──→ (triage) ──→ execute-issue ──┴→ tdd ──→ (handoff | diagnose)
           │   PRD.md   issues/NN              reviewer+verifier   red-green
           │                                   gates (worktree+fresh dispatch)
           │
diagnose ──┴─→ architecture        (bug-fix loop; hands findings to architecture)
architecture → tdd                 (implement a deepening)
docs-review                        (manual sweep over PROJECT + CONTEXT + stances + AGENTS + conventions)
think                              (inline doc hygiene during any work session)
caveman / zoom-out / new-skill / new-agent / onboard   (ad-hoc / meta / bootstrap)
```

## Stage notes

- **prototype / think** — entry points; both feed `prd`.
- **prd → issues → triage → execute-issue** — the build spine. The human quality gate is the
  `think→issues→triage` pass that stamps `ready-for-agent`; `execute-issue` then runs AFK (two-gate
  review + tdd-config gating: stance: execute-issue-afk-autonomy). The graded **spec-mutation
  backward edge** (back-arrow above) is detailed in `execute-issue`'s `references/loop.md`.
- **Orchestrator (runtime dispatcher)** — session role (glossary: `docs/CONTEXT.md`; stances:
  subagents-never-hitl, dispatch-fresh-not-fork, execute-issue-afk-autonomy).
- **tdd** — invoked inside `execute-issue` per task; also directly for hand-driven work.
- **diagnose → architecture → tdd** — the bug/deepening loop.
- **docs-review / think** — doc maintenance: `think` inline at write-time, `docs-review` periodic.
- **caveman / zoom-out / new-skill / new-agent / onboard** — ad-hoc, meta, and bootstrap; not in
  the spine. `caveman` is a comms mode, not a stage.
