# edit-task — PRD

<!-- Fixture: a faithful canonical PRD so the prd→issues→triage→execute-issue pipeline can be
     dogfooded against the mock. Vocabulary from the glossary; no file paths / code. -->

## Problem
A Task's text is fixed once added. The only way to correct a typo or reword a Task is to remove it
and re-add it, which burns its id (ids are never reused) and reorders nothing but loses the
original id the user may have memorised.

## Solution
An `edit` command that rewrites a single Task's text in place, keeping its id and done state, then
persists the Store.

## User stories
1. As a user, I want to fix the wording of a Task without removing it, so that I keep its id and its
   done state.
2. As a user, I want `edit` on an unknown id to fail loudly, so that I never silently edit nothing.
3. As a user, I want `edit` with empty text to be rejected, so that I never blank out a Task by
   accident.

## Implementation decisions
- Add `edit` to the command dispatcher alongside the existing per-Task commands.
- Edit operates on the in-memory Task array (find by id, replace text), then persists the Store —
  reusing the existing load/save round-trip.
- Only the text changes; id and done are left exactly as they were.

## Testing decisions
- Test external behavior through the public command interface plus the exported core op, not in
  isolation from the Store round-trip.
- Cover: a successful rewrite keeps id/done; unknown id throws; empty text throws. Mirror the
  existing command tests' temp-Store setup.

## Out of scope
Bulk edit, find-and-replace across Tasks, and editing the done flag (that is the `done` command).
Not this feature.

## Notes
Second work item in the mock; authored ready-for-agent (unimplemented) so execute-issue/tdd can be
dogfooded with a real RED step, unlike the already-done clear-completed item.
