# todo-cli

Dependency-free single-file Node todo CLI. Harness mock fixture — see `docs/PROJECT.md`.

```
node todo.js add "buy milk"   # add a task
node todo.js list             # show tasks (default when no command)
node todo.js done 1           # mark task #1 complete
node todo.js rm 1             # delete task #1
```

Store path: `$TODO_FILE`, else `~/.todo-cli.json`. Tests set `$TODO_FILE` to a temp file.

`npm test` runs the `node --test` suite in `test/` (behavior tests through the exported ops).
