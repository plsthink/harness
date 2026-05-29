# Planted staleness manifest

A checked-in list of every staleness item this overlay plants in the mock's own docs. When
`/docs-review` is driven against a staged copy, its findings should cover at least these items.
Lives at the overlay root (not under `docs/`) so it does not itself get reviewed.

## Planted items

1. **CONTEXT.md — wrong module name.** The glossary entry that used to be
   "Loader" was renamed to "Registry" without updating any module file. The
   actual source still ships `src/loader.js`; no `src/registry.js` exists.
   The `_Avoid_` line was also flipped (now lists "loader" as a term to
   avoid, which is exactly the term the code uses).

2. **PROJECT.md — wrong file count and wrong filenames.** The "hard
   constraints" bullet claims the library has "two source files
   (`runner.js` and `plugins.js`)". The base actually ships three files
   under `src/`: `index.js`, `host.js`, `loader.js`. Neither `runner.js`
   nor `plugins.js` exists.

3. **AGENTS.md — wrong verify-method path.** The `verify-method` key (and
   the prose bullet below the config block) cites `./lib/index.js` as the
   require target. The library exports from `./src/index.js`; there is no
   `lib/` directory.

4. **conventions/INDEX.md — dangling convention link.** The routing index
   adds a row for `src/plugins/*.js` pointing to a `legacy-handler-shape`
   convention doc. Neither the `src/plugins/` directory nor the
   `conventions/legacy-handler-shape.md` file exists.
