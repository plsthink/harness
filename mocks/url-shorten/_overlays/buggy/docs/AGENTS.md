# Agents entrypoint — url-shorten

Tool-agnostic project entrypoint. A bare agent (no harness) reads this and works the repo;
harness skills honor it rather than re-encode navigation (single-source).

## Navigation protocol (read order)
1. `docs/PROJECT.md` — vision + hard constraints + integrations.
2. `docs/CONTEXT.md` — glossary. Single context — no packages.
3. **Before editing:** consult `docs/conventions/INDEX.md` — load convention docs matching the file.
4. **On a decision:** read/append `docs/stances/<slug>.md`.
5. Work substrate: `docs/work/<feature>/` (PRD.md + issues/NN-slug.md). Always at repo root, committed.

## Config

The parseable block below records this project's behavior-config (the harness onboarding gate reads
it); keys must sit inside the START/END markers. The spine skills (tdd/issues/prd/triage/
execute-issue) gate on it at step 0.

<!-- HARNESS-CONFIG-START -->
context: single
tdd-applies: true
test-command: node --test
verify-method: node index.js
<!-- HARNESS-CONFIG-END -->

- **context:** single — no packages; glossary in `docs/CONTEXT.md`.
- **tdd-applies:** true — real Node CLI with a `node --test` suite; the red→green gate applies.
- **test-command:** `node --test` (same as `npm test`).
- **verify-method:** run the CLI — `node index.js <cmd>` against a fresh in-process store.
