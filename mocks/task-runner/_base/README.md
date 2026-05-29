# task-runner — base library

The buildable Node library for the task-runner mock. Source-only; no docs/
skeleton ships in `_base/`. Overlays add docs (onboarded, buggy, shallow,
stale-docs) or replace source files (buggy, shallow).

## Public API

```js
const { createRunner } = require('./src/index.js');
const runner = createRunner({ pluginsDir: '/path/to/plugins' });
runner.register('greet', { name: 'greet', run: (who) => 'hi ' + who });
await runner.run('greet', 'world'); // { ok: true, value: 'hi world' }
```

## Modules

- `src/index.js` — public API: `createRunner({ pluginsDir, services, log })`.
- `src/host.js` — plugin host: validates plugin shape, dispatches handlers,
  wraps outcomes in `{ ok, value | error }`.
- `src/loader.js` — plugin loader: narrow `getPlugin(name) -> plugin | null`;
  hides discovery + require.

## Tests

`node --test` (zero external deps). The suite drives behavior through the
public surface plus a focused loader test that exercises the directory-load
path against a tmpdir.
