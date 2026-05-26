# CONTEXT glossary format

Cited by: `think`, `onboard` (the doc's writers; consumers cite the project's `docs/CONTEXT.md`, not this format spec).
`CONTEXT.md` is a **glossary only** — the proven-lean contract. Do not broaden it into "any
project context"; a freeform bucket is the context-rot vector (grows until nobody reads it).

## Format

Per term:
```
**Term** — 1–2 sentence definition.
_Avoid_: alias, alias   (terms NOT to use — drift / retired vocabulary)
```
Optionally a one-line example of the term used correctly. **No implementation detail.**

## Scope & fan-out

- **Root `docs/CONTEXT.md`** = terms shared across the whole project.
- **Per-package `packages/<pkg>/docs/CONTEXT.md`** = package-specific terms (real fan-out).
- `docs/CONTEXT-MAP.md` is the navigation spine routing root → per-package.

## Read order

root CONTEXT → CONTEXT-MAP → per-package CONTEXT → stances.

## Capture test (used by `think`)

Write a term only when durable + cross-session: *"will a fresh agent in 3 months need this to
avoid a mistake?"* No → stays in the PRD / conversation, not the glossary.

## Hygiene

- `think` updates the glossary **immediately** when a term is resolved during a session.
- Retired terms move to another term's `_Avoid_:` line (not deleted silently).
- `docs-review` prunes orphaned/stale terms on its periodic pass.
