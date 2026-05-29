# task-runner glossary

Glossary only — terms + definitions. No implementation detail.

**Runner** — The public object returned by `createRunner(...)`. Exposes
`register(name, plugin)`, `run(taskType, input)`, `list()`. The only seam
callers depend on.
_Avoid_: engine, driver, executor

**Plugin** — A `{ name, run }` object handling one task type. `run(input, ctx)`
returns a value (or a Promise) on success and throws on failure; the host
turns either into a result envelope.
_Avoid_: handler, module, extension (the `run` function is a "plugin handler"
inside the host, but the externally-registered object is a "plugin")

**Task type** — The string key a caller passes to `runner.run(taskType, input)`
to select a plugin. Matched against the plugin's registered `name`.
_Avoid_: command, action, event

**Loader** — Internal module that resolves a task type to a plugin. Narrow
interface (`getPlugin(name) -> plugin | null`); hides the registration map
and the directory-load mechanism. Not public.
_Avoid_: registry, finder

**Host** — Internal module that validates plugin shape, invokes the plugin
handler, and wraps the outcome in `{ ok, value | error }`. Not public.
_Avoid_: dispatcher, invoker

**Result envelope** — The `{ ok: boolean, value?, error? }` object every
`runner.run(...)` resolves to. Callers branch on `ok`; never on exceptions.
_Avoid_: response, outcome (envelope is the term of art here)
