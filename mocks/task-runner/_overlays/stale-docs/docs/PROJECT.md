# task-runner — project brief

Closed 3-category brief. Keep tiny: per-entry size cap, links out for depth.

## Vision / goal
A dependency-free single-context Node library exposing a plugin task runner.
Callers register task-type plugins, then dispatch tasks against the runner;
plugins can also be discovered from a `pluginsDir` at request time. Exists as
a harness mock fixture — small enough to read whole, real enough to drive
think/architecture/tdd/diagnose against a non-CLI shape.

## Hard constraints / non-negotiables
- Zero runtime dependencies — Node stdlib only.
- Two source files (`runner.js` and `plugins.js`); callers import only the
  public entry point.
- Plugin shape is `{ name: string, run(input, ctx) -> any | Promise<any> }`.
- Result envelope is `{ ok, value | error }` — `run` never throws.

## External systems / integrations
- None. Plugin discovery is a local directory of `.js` files.
