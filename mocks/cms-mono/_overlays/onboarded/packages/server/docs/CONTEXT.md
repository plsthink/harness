# server glossary

Glossary only — terms + definitions. No implementation detail.

**createServer** — `server`'s factory: takes `{ store }` and returns a Node `http.Server` exposing
one route, `GET /page/:slug`. The route resolves the markdown for the slug via `store.get`, parses
it through `core.parseMarkdown`, and returns the `core.renderHTML` output as `text/html`. A nullish
`store.get` result is a 404; any other path is a 404; any other method is 405.
_Avoid_: app, makeApp, buildServer

**Store** — The injected page source: an object with `get(slug) -> string | null | undefined`.
`server` does not own the storage shape — any object that satisfies `get` is a valid `Store`.
_Avoid_: db, repository, backend
