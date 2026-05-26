# todo-cli — project brief

Closed 3-category brief. Keep tiny: per-entry size cap, links out for depth.

## Vision / goal
A dependency-free single-file command-line todo list. Add, list, complete, and remove tasks
persisted as JSON. Exists as a harness mock fixture — small enough to read whole, real enough to
drive think/prd/issues/tdd/diagnose against.

## Hard constraints / non-negotiables
- Zero runtime dependencies — Node stdlib only.
- Single source file (`todo.js`); core ops exported for in-process testing.
- Storage path is `$TODO_FILE` else `~/.todo-cli.json` — tests override via env, never the real file.

## External systems / integrations
- None. Storage is a local JSON file owned by the CLI.
