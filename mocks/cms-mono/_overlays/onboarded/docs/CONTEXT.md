# cms-mono glossary

Glossary only — terms + definitions. No implementation detail.
Root glossary = project-wide terms; per-package glossary = package-specific.

**Block** — A parsed markdown unit emitted by `core.parseMarkdown` and consumed by `core.renderHTML`.
Three variants: `{ type: 'heading', level, text }`, `{ type: 'paragraph', text }`,
`{ type: 'code', text }`. The shared output contract across every package.
_Avoid_: token, node, element

**Page** — A single markdown source addressed by a slug: stored as one `.md` file (CLI input) or one
entry in a `server` store, rendered to one HTML fragment.
_Avoid_: document, post, entry

**Slug** — The URL-safe identifier the `server` route `GET /page/:slug` matches: `[A-Za-z0-9_-]+`.
The store's key shape; the CLI mirrors it via the input file's basename.
_Avoid_: handle, permalink, key
