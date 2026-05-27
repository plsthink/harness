# 05 — tdd-config-gating

Status: done
Type: enhancement

## What to build
Make tdd opt-in per project. tdd reads the `tdd-applies` config and defers to the project's test
command / test Skill rather than assuming one; execute-issue skips the red-green gate for a task
when `tdd-applies` is off and enforces it when on.

## Acceptance criteria
- With `tdd-applies` off, an execute-issue task runs to completion without a red-green gate and is
  not failed for lacking a prior failing test.
- With `tdd-applies` on, the red-green gate is enforced as today.
- tdd runs the project's configured test command / defers to its test Skill, not a hardcoded runner.

## Blocked by
- 01
- 03

## Comments
