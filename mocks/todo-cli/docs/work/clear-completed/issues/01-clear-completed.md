# 01 — clear-completed

Status: done
Type:   enhancement

## What to build
A `clear` subcommand that drops every completed (`done: true`) task in one shot, persisting the
result. Tracer-bullet vertical slice: CLI dispatch → core op → save → output line. New core op
`clearDone(tasks)` mutates in place and returns the count removed; export it alongside the other
ops so tests drive it in-process.

## Acceptance criteria
- `clearDone(tasks)` removes exactly the `done: true` entries, leaves the rest (and their ids)
  untouched, and returns the number removed.
- `run(['clear'], file)` saves the pruned list and returns `cleared N completed`.
- When no task is done, `run(['clear'], file)` is a no-op save and returns `no completed tasks`.
- `clearDone` is exported from `todo.js`.
- A `node --test` case covers each bullet above (drives `clearDone` and `run` against a temp
  `$TODO_FILE`), and `npm test` reports it green.

## Blocked by
None.

## Comments
- _(AI) Authored as a harness mock fixture work item — a concrete ready-for-agent contract for
  exercising execute-issue/tdd against todo-cli. Fits the zero-dep / single-file constraints._
