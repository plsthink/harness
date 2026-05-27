# 07 — onboard-config-and-partial-reonboard

Status: done
Type: enhancement

## What to build
Rework onboarding to produce and maintain the behavior-config. Its interview is unbounded (asks as
many questions as the project needs) and writes a schema-conforming behavior-config block. On a
project with stale config, onboarding diffs the schema against the recorded config and asks only the
missing keys (partial re-onboard), rather than redoing the full interview.

## Acceptance criteria
- Running onboard on a fresh project writes a schema-complete behavior-config block
  (`check-onboarded` reports complete).
- The interview is not capped at a fixed question set; it covers the behavior-config the schema
  requires.
- Running onboard on a project missing one schema key asks only for that key and leaves existing
  answers intact.
- onboard remains runnable pre-onboarding (not self-gated).

## Blocked by
- 01
- 02

## Comments
