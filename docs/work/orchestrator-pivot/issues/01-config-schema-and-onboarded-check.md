# 01 — config-schema-and-onboarded-check

Status: done
Type: enhancement

## What to build
Establish the single-source config schema — the enumerated set of behavior-config keys onboarding
must produce, each annotated with what it gates — and a `check-onboarded` dev script that, given a
project, reads its recorded behavior-config and reports whether it is **absent**, **complete**, or
**stale** (present but missing one or more schema keys). The script is the mechanism every
config-consuming skill will call at step 0; this slice delivers it standalone, with no callers yet.

## Acceptance criteria
- A single-source schema lists the required behavior-config keys and what each gates; adding a key
  is the only edit needed to expand the contract.
- `check-onboarded` reports "absent" when a project has no behavior-config, "complete" when all
  schema keys are present, and "stale" when config exists but a schema key is missing — naming the
  missing key(s).
- The script is covered by tests exercising absent / complete / stale-missing-key, each observed
  red→green.
- No skill calls the script yet (mechanism only).

## Blocked by
- None — can start immediately.

## Comments
