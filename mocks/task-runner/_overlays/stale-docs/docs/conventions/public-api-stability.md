# convention: public-api-stability

**Applies:** src/index.js
**Rule:** The exported `createRunner` and its returned-object surface
(`register`, `run`, `list`) are the only stable seam. Adding a method is
allowed; changing or removing one requires a project-brief edit.
**Why:** Callers (and tests) bind to the public API; the loader and host
are internal and may be reshaped freely as long as the public surface holds.
