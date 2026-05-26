# slug-mono glossary

Glossary only — terms + definitions. No implementation detail.
Root glossary = project-wide terms; per-package glossary = package-specific.

**Slug** — The canonical URL-safe form of text: lowercase, alphanumerics separated by single
dashes, no leading/trailing dash. The project's shared output contract across every package.
_Avoid_: handle, permalink, key

**Workspace package** — A self-contained member under `packages/<name>/` with its own
`package.json` and `docs/CONTEXT.md`. Here: `core` and `cli`.
_Avoid_: module, subproject
