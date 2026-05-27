# Pipeline — the skill-chain graph

Cited by: `handoff`, `new-skill`. **Product, not a
dev-doc** — `${CLAUDE_PLUGIN_ROOT}`-resolvable so a `Next:` pointer or `handoff` can
read it from inside any target project. Derivable from the per-`SKILL.md` footers; hand-maintained
now, add a regen script only if drift recurs (lean-first).

This is also the harness's own architecture map (it dogfoods — `docs/AGENTS.md` routes here
instead of duplicating a graph).

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

- **prototype / think** — entry points. `think` is the relentless interview; `prototype` is the
  throwaway sanity-check. Both feed `prd`.
- **prd → issues → triage → execute-issue** — the build spine. The human quality gate is the
  `think→issues→triage` pass that stamps `ready-for-agent`; `execute-issue` then runs AFK. Inside
  `execute-issue` the change passes a **two-gate review** — a static `reviewer` plus a *conditional*
  dynamic `verifier` (fires only when the criteria declare observable runtime behavior); `tdd` is
  config-gated (`tdd-applies`). It also carries the graded **spec-mutation backward edge** (the
  back-arrow above): the goal `done` is frozen but the *path* is mutable, so a path-level wrong-spec
  finding re-enters `think`/`prd`/`issues` autonomously (goal-level / ambiguous → escalate). See
  `execute-issue`'s `references/loop.md` for the mechanics.
- **Orchestrator (runtime dispatcher)** — this graph is the *static* skill-chain. At runtime the
  pipeline is driven by the **Orchestrator**, a session role (not a workflow engine): it reads the
  tracker, dispatches each config-consuming stage to a fresh subagent, holds no per-child output,
  and is the sole HITL point. It is distinct from this static graph (see stances: subagents-never-hitl,
  dispatch-fresh-not-fork, execute-issue-afk-autonomy).
- **tdd** — invoked inside `execute-issue` per task; also directly for hand-driven work.
- **diagnose → architecture → tdd** — the bug/deepening loop. `diagnose` fixes; hands
  architectural findings to `architecture`; `architecture` hands an approved deepening to `tdd`.
- **docs-review / think** — doc maintenance: `think` inline at write-time, `docs-review` periodic.
- **caveman / zoom-out / new-skill / new-agent / onboard** — ad-hoc, meta, and bootstrap; not in
  the spine. `caveman` is a comms mode, not a stage.
