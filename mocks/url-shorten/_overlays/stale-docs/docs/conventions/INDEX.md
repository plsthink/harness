# Conventions routing index

Maps a file matcher → convention docs to load **before** editing. Pure filesystem
contract; editing procedures consult this first. Starts empty — add an entry the first time you catch
the model doing a thing wrong (lean-first).

| Matcher | Load |
|---|---|
| `store.js` | export-store-ops |
| `todo.js` | export-store-ops |
