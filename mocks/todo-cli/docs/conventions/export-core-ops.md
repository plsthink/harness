# convention: export-core-ops

**Applies:** todo.js
**Rule:** A new core operation must be added to `module.exports` (and dispatched in `run()`). Tests import core ops directly.
**Why:** Core ops are exported for in-process testing; an op defined but not exported fails the suite with "not a function".
