# Agents entrypoint — cms-mono

Tool-agnostic project entrypoint. A bare agent (no harness) reads this and works the repo;
harness skills honor it rather than re-encode navigation (single-source).

## Navigation protocol (read order)
1. `docs/PROJECT.md` — vision + hard constraints + integrations.
2. `docs/CONTEXT.md` — glossary; then `docs/CONTEXT-MAP.md` routes to per-package glossaries.
3. **Before editing:** consult `docs/conventions/INDEX.md` — load convention docs matching the file.
4. **On a decision:** read/append `docs/stances/<slug>.md`.
5. Work substrate: `docs/work/<feature>/` (PRD.md + issues/NN-slug.md); per-skill learnings sit
   alongside at `docs/work/learnings/<skill>.md` (a skill-keyed sibling, not inside a feature dir).
   Always at repo root, committed.

## Config

The parseable block below records this project's behavior-config (the harness onboarding gate reads
it); keys must sit inside the START/END markers. The spine skills (tdd/issues/prd/triage/
execute-issue) gate on it at step 0.

<!-- HARNESS-CONFIG-START -->
context: packages
tdd-applies: true
test-command: node --test
verify-method: node packages/cli/index.js
<!-- HARNESS-CONFIG-END -->

- **context:** packages — multi-package; `docs/CONTEXT-MAP.md` routes to per-package glossaries.
- **tdd-applies:** true — real Node workspaces with a `node --test` suite; the red→green gate applies.
- **test-command:** `node --test` (discovers every `packages/*/test` from the root; same as `npm test`).
- **verify-method:** run the build CLI — `node packages/cli/index.js <inputDir> [--out <dir>]`.
