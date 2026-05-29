# Agents entrypoint — {{PROJECT_NAME}}

Tool-agnostic project entrypoint. A bare agent (no harness) reads this and works the repo;
harness skills honor it rather than re-encode navigation (single-source).

## Navigation protocol (read order)
1. `docs/PROJECT.md` — vision + hard constraints + integrations.
2. `docs/CONTEXT.md` — glossary. Single context — no packages.
   <!-- multi-package only: replace the 2nd sentence with "then `docs/CONTEXT-MAP.md` routes to per-package glossaries." -->

3. **Before editing:** consult `docs/conventions/INDEX.md` — load convention docs matching the file.
4. **On a decision:** read/append `docs/stances/<slug>.md`.
5. Work substrate: `docs/work/<feature>/` (PRD.md + issues/NN-slug.md). Always at repo root, committed.

## Config

The parseable block below is what `${CLAUDE_PLUGIN_ROOT}/scripts/check-onboarded.sh` reads (keys
must sit inside the START/END markers); the human-readable gloss follows each key.
<!-- Keep the START/END markers (the parseable contract); strip only the authoring hint comments. -->

<!-- HARNESS-CONFIG-START -->
context: {{CONTEXT_MODE}}
tdd-applies: {{TDD_APPLIES}}
test-command: {{TEST_COMMAND}}
verify-method: {{VERIFY_METHOD}}
<!-- HARNESS-CONFIG-END -->

- **context:** {{CONTEXT_MODE}}       <!-- single | packages -->
- **tdd-applies:** {{TDD_APPLIES}}    <!-- true | false: project's test-first posture -->
- **test-command:** {{TEST_COMMAND}}  <!-- the command/procedure that runs tests; tdd prefers a project-local test Skill if present, else this -->
- **verify-method:** {{VERIFY_METHOD}} <!-- the command/procedure that builds/runs the app for observable-behavior checks; the verifier prefers a project-local verify Skill if present, else this -->

