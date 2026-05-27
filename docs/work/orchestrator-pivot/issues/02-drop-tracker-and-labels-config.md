# 02 — drop-tracker-and-labels-config

Status: done
Type: enhancement

## What to build
Make local `docs/work/` plus the canonical harness triage labels the only tracker, removing the
per-project tracker and label-mapping choices everywhere they appear: the shared triage-labels and
issue-tracker contracts, the project AGENTS.md template onboarding writes, onboarding's interview
prose, and the harness's own AGENTS.md config section.

## Acceptance criteria
- No skill, shared contract, template, or AGENTS.md references a per-project tracker choice or a
  label-mapping choice; all describe the single local `docs/work/` substrate + harness labels.
- The harness's own AGENTS.md no longer lists tracker/labels as config choices.
- The project AGENTS.md template carries no tracker/labels choice.
- Existing pipeline skills (prd/issues/triage/execute-issue) still resolve the tracker, with no
  abstraction layer remaining.

## Blocked by
- None — can start immediately.

## Comments
