# Deepening hint — plugin loader

The `src/loader.js` module is a textbook shallow module: its interface is
nearly as wide as its implementation, every step of the load pipeline is
its own public method, and there is no narrow "resolve a plugin by name"
abstraction. As a result, `src/index.js` (the public API) has to reassemble
the dispatch logic — `isRegistered → getRegistered → pluginFileExists →
requirePlugin → setCached` — by hand. Any future caller of the loader will
have to repeat that sequence.

## What "deepening" looks like here

Replace the wide surface with a single `getPlugin(name) -> plugin | null`
method. Move the registration-map lookup, the directory-existence check,
the require call, and the cache management behind that one interface. The
loader keeps doing the same work; it just hides the mechanism. `index.js`
shrinks accordingly — `runner.run(taskType, input)` becomes one
`loader.getPlugin(taskType)` call plus the host dispatch.

## Why this is a worthwhile refactor

- **Deletion test:** today, deleting `loader.js` would cost callers very
  little — they're already doing the work. Deepening makes the loader
  actually carry the load.
- **Seam clarity:** the registration map and the directory path layout
  become loader-internal, so changing either (e.g. switching to
  `import()`-based loading, adding a namespace prefix) does not ripple
  into `index.js`.
- **Caller simplicity:** every site that resolves a plugin (currently
  one, but the API surface invites more) collapses from a five-call
  sequence to one.

## Constraints

- Public API of `createRunner(...)` must not change: `register`, `run`,
  `list` keep their signatures and result-envelope shape.
- Tests in `test/` exercise behavior through `createRunner` only; they
  must continue to pass after the refactor.
- No new runtime dependencies; the loader stays Node-stdlib-only.
