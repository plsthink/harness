# url-shorten

Dependency-free Node CLI URL shortener. Hash-based slug generation, in-memory
storage, and an `analytics` subcommand. Harness mock fixture.

## Modules
- `url-parse.js` — URL validation + normalization
- `shorten.js` — deterministic base62 slug from URL (sha256 prefix)
- `store.js` — in-memory `slug -> { url, hits, createdAt }` map
- `analytics.js` — aggregates over the store
- `index.js` — CLI entrypoint and command dispatch

## Use
The store is in-process: each CLI invocation starts empty. Tests drive the
exported ops in-process; see `test/`.
