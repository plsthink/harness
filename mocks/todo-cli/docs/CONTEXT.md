# todo-cli glossary

Glossary only — terms + definitions. No implementation detail.

**Task** — A single todo item: `{ id, text, done }`. `id` is monotonic per store, never reused.
_Avoid_: item, entry, todo (the record is a "task")

**Store** — The JSON file holding the task array, resolved from `$TODO_FILE` or `~/.todo-cli.json`.
_Avoid_: db, database, file
