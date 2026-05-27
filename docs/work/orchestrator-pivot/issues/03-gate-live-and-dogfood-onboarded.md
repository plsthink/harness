# 03 — gate-live-and-dogfood-onboarded

Status: done
Type: enhancement

## What to build
Bring the onboarding gate live. Write the harness repo's own behavior-config block (conforming to
the schema) into its AGENTS.md, then wire a step-0 check into every config-consuming skill
(execute-issue, tdd, issues, prd, triage) so each calls `check-onboarded` and stops with a "run
onboard" instruction when config is absent or stale. The exempt skills (think, prototype, onboard,
caveman) gain no gate and keep running pre-onboarding (think stays in plain interview mode).

## Acceptance criteria
- The harness repo's AGENTS.md carries a schema-complete behavior-config block; `check-onboarded`
  reports it complete.
- Each config-consuming skill, run in an un-onboarded project, stops at step 0 and directs the user
  to onboard; run in the onboarded harness repo, it proceeds.
- think / prototype / onboard / caveman run unchanged with no config present.
- A project with stale config (missing a schema key) is stopped the same as un-onboarded.

## Blocked by
- 01
- 02

## Comments
