# url-shorten glossary

Glossary only — terms + definitions. No implementation detail.

**Slug** — A short opaque base62 string the Shortener emits for a canonical URL. Deterministic: the
same canonical URL always produces the same slug. Default length 7 characters.
_Avoid_: hash, id, code, key (the user-facing token is a "slug")

**Store** — The in-memory `slug -> { url, hits, createdAt }` map owned by one process invocation.
No I/O; the Store does not persist across runs.
_Avoid_: db, database, cache, registry

**Shortener** — The pure function pipeline that turns a raw URL string into a Slug: parse +
normalize (lowercase host, drop default ports, strip the bare-host trailing slash), sha256 the
canonical form, base62-encode the digest prefix, truncate to the requested length.
_Avoid_: encoder, hasher, generator (the named operation is "shortening")

**Analytics** — Read-only aggregations over the Store: total slug count, total hits, the top-N
slugs ranked by hit count. Never mutates the Store.
_Avoid_: stats, metrics, report
