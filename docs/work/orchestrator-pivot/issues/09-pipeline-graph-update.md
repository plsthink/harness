# 09 — pipeline-graph-update

Status: done
Type: enhancement

## What to build
Update the pipeline graph to reflect the shipped reality: the backward spec-mutation edge from
execute-issue into think/prd/issues, the `verifier` second gate inside the build spine, and a note
that the runtime dispatcher is the Orchestrator role (distinct from the static graph).

## Acceptance criteria
- The graph shows the backward edge execute-issue → think/prd/issues (spec mutation).
- The graph shows `verifier` as a gate in the execute-issue stage.
- A stage note names the Orchestrator as the runtime dispatcher, distinct from the static graph,
  with no implication of a workflow engine.
- The graph remains derivable from the per-SKILL footers (single source intact).

## Blocked by
- 04
- 06

## Comments
