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

## Config (the 3 choices)
- **Tracker:** local-markdown `docs/work/`.
- **Labels:** the triage roles (`${CLAUDE_PLUGIN_ROOT}/shared/triage-labels.md`).
- **Context:** single (no packages).
