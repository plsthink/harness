# convention: export-store-ops

**Applies:** store.js
**Rule:** A new store operation must be returned from `createStore()` and used by `index.js` / tests via that object. Tests drive the store through its returned ops, never through internal state.
**Why:** The store factory is the only public seam; an op defined inside `createStore` but not returned is invisible to the suite and the CLI.
