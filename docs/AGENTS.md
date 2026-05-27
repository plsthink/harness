# Agents entrypoint — harness

Project entrypoint. The harness dogfoods its own doc model: a bare agent reads
this and works the repo; harness skills honor it rather than re-encode navigation.

## Navigation protocol (read order)
1. `docs/PROJECT.md` — vision + hard constraints.
2. `docs/CONTEXT.md` — the shared-term glossary. Single context — **no packages**.
3. **Architecture map:** `${CLAUDE_PLUGIN_ROOT}/shared/pipeline.md` — the skill-chain graph IS the
   harness's architecture (the product's domain is the pipeline; single-source, no duplicate graph).
4. **Before editing:** consult conventions matching the file — `${CLAUDE_PLUGIN_ROOT}/conventions/INDEX.md`
   (global) + `docs/conventions/INDEX.md` (project; wins on conflict). Both start empty.
5. **On a decision:** read/append `docs/stances/<slug>.md`.
6. **Provenance:** `docs/integrations/<src>.md` — upstream influence records (re-diff protocol).
7. Work substrate: `docs/work/<feature>/` — per-feature PRD + issues + learnings.
8. Authoring a skill/agent: `${CLAUDE_PLUGIN_ROOT}/shared/authoring-standard.md`.

## Config

The parseable block below is what `${CLAUDE_PLUGIN_ROOT}/scripts/check-onboarded.sh` reads (keys
must sit inside the START/END markers); the human-readable gloss follows each key.

<!-- HARNESS-CONFIG-START -->
context: single
tdd-applies: false
test-command: bash docs/scripts/<name>.test.sh
verify-method: bash docs/scripts/check-refs.sh
<!-- HARNESS-CONFIG-END -->

- **context:** single — no packages; the glossary lives in `docs/CONTEXT.md`.
- **tdd-applies:** false — the harness is prose/skill authoring with no app or unit-test suite;
  its only tests are targeted dev-script self-tests written ad hoc (the reviewer's test-first check
  still applies per slice). A blanket red→green-per-task gate would be wrong for doc/skill slices.
- **test-command:** the dev-script self-tests (`bash docs/scripts/<name>.test.sh`) — run on demand,
  also auto-run via the PostToolUse path-gate in `.claude/settings.json`.
- **verify-method:** no runtime app — verification is `bash docs/scripts/check-refs.sh` (reference
  integrity) plus dogfooding the skills.
