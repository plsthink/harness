# 01 — edit-task

Status: done
Type:   enhancement

## What to build
An `edit` subcommand that rewrites a single Task's text in place, persisting the result.
Tracer-bullet vertical slice: CLI dispatch → core op → save → output line. New core op
`edit(tasks, id, text)` mutates in place (text only) and is exported alongside the other ops so
tests drive it in-process.

## Acceptance criteria
- `edit(tasks, id, text)` sets the matching Task's `text`, leaves its `id` and `done` flag
  untouched, and returns nothing.
- `edit(tasks, id, text)` throws `edit: no task #N` on an unknown id (mirroring `done`/`rm`) and
  `edit: text required` on empty text (mirroring `add`).
- `run(['edit', '2', 'buy', 'oat', 'milk'], file)` saves the change and returns `edited #2`; the new
  text is the argv words after the id joined with spaces (mirrors `add`).
- `edit` is exported from `todo.js`.
- A `node --test` case covers each bullet above (drives `edit` and `run` against a temp
  `$TODO_FILE`), and `npm test` reports it green.

## Blocked by
None.

## Comments
- _(AI) Authored as a harness mock fixture work item — a concrete ready-for-agent contract for
  exercising execute-issue/tdd against todo-cli. Left UNIMPLEMENTED on purpose (todo.js has no
  `edit` op yet) so the tdd red→green gate has a real RED step, unlike the already-done
  clear-completed item. Fits the zero-dep / single-file constraints._
- _(AI) Driven to green via the `tdd` skill (gnhf dogfood, phase 1): onboarding gate clean →
  criteria-as-plan → tracer `run(['edit',...])` observed RED (`unknown command: edit`) → minimal
  `edit` op + dispatch → GREEN → incremental core-op + error-guard tests. Suite 11→14 green. The
  tdd loop ran friction-free against todo-cli — no harness-skill defect surfaced; this issue+suite
  now stand as the committed green regression pair for that flow._
