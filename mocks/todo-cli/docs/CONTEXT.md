# todo-cli glossary

Glossary only — terms + definitions. No implementation detail.

**Task** — A single todo item: `{ id, text, done }`. `id` is monotonic per store, never reused.
_Avoid_: item, entry, todo (the record is a "task")

**Store** — The JSON file holding the task array, resolved from `$TODO_FILE` or `~/.todo-cli.json`.
_Avoid_: db, database, file

**Core op** — An exported operation that mutates the in-memory Task array (`add`, `done`, `remove`,
`edit`, `clearDone`); `run` dispatches each mutating CLI command to one, then persists the result
to the Store (read-only `list` takes no core op). Exported so tests drive ops in-process.
_Avoid_: command (the CLI verb `run` dispatches *to* a core op), method, action
