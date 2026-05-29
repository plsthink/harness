# cms-mono glossary

Glossary only — terms + definitions. No implementation detail.
Root glossary = project-wide terms; per-package glossary = package-specific.

**Block** — A parsed markdown unit emitted by `core.parseMarkdown` and consumed by `core.renderHTML`.
Three variants: `{ type: 'heading', level, text }`, `{ type: 'paragraph', text }`,
`{ type: 'code', text }`. The shared output contract across every package.
_Avoid_: token, node, element

**Page** — A single markdown source addressed by a permalink: stored as one `.markdown` file (CLI
input) or one entry in a `server` store, rendered to one HTML fragment.
_Avoid_: document, post, entry

**Permalink** — The URL-safe identifier the `server` route `GET /page/:permalink` matches:
`[A-Za-z0-9_-]+`. The store's key shape; the CLI mirrors it via the input file's basename.
_Avoid_: handle, key
