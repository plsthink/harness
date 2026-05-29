# url-shorten — project brief

Closed 3-category brief. Keep tiny: per-entry size cap, links out for depth.

## Vision / goal
A dependency-free Node CLI URL shortener: take a URL, return a short deterministic slug; expand the
slug back to the URL; report basic analytics on hits. Exists as a harness mock fixture — small
enough to read whole, real enough to drive think/prd/issues/tdd/architecture/diagnose against.

## Hard constraints / non-negotiables
- Zero runtime dependencies — Node stdlib only.
- Multiple modules (`url-parse`, `shorten`, `store`, `analytics`, `index`); core ops exported for
  in-process testing.
- Storage is in-memory only — the store lives for the lifetime of one process invocation. No disk,
  no env-overridden file path.
- Slug generation is deterministic — the same canonical URL always hashes to the same slug.

## External systems / integrations
- None. The shortener does not perform HTTP; it just parses + hashes URL strings locally.
