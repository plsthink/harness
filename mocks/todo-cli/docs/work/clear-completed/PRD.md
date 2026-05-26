# clear-completed — PRD

<!-- Fixture: a faithful canonical PRD so the prd→issues→triage→execute-issue pipeline can be
     dogfooded against the mock. Vocabulary from the glossary; no file paths / code. -->

## Problem
Completed Tasks accumulate in the list and there is no bulk way to drop them — the user must remove
each done Task one id at a time, which gets tedious once many Tasks are finished.

## Solution
A single `clear` command that drops every done Task from the Store in one shot, leaving the
not-done Tasks untouched.

## User stories
1. As a user, I want to remove all my completed Tasks at once, so that the list shows only what's
   still outstanding.
2. As a user, I want a `clear` with no done Tasks present to be a harmless no-op, so that I can run
   it safely without checking first.
3. As a user, I want my not-done Tasks left exactly as they were after a `clear`, so that I never
   lose outstanding work.
4. As a user, I want `clear` to report how many Tasks it removed, so that I get confirmation the
   bulk delete did what I expected.

## Implementation decisions
- Add `clear` to the command dispatcher alongside the existing per-Task removal command.
- Removal operates on the in-memory Task array (drop where done is true), then persists the Store —
  reusing the existing load/save round-trip rather than a new persistence path.
- Task ids are never reused, so surviving Tasks keep their ids; `clear` does not renumber.

## Testing decisions
- Test external behavior through the public command interface, not the array filter in isolation.
- Cover: mixed done/not-done leaves only not-done; empty-of-done is a no-op; an empty Store is a
  no-op; the removed-count report is correct. Mirror the existing command tests' temp-Store setup.

## Out of scope
Per-status filtering of the list view, undo of a clear, and archiving removed Tasks. Not this
feature.

## Notes
First completed work item in the mock; demonstrates the full pipeline against real code.
