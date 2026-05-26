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

## Config (the 3 choices)
- **Tracker:** {{TRACKER}}            <!-- e.g. local-markdown docs/work/ -->
- **Labels:** {{LABELS}}              <!-- triage category + state roles -->
- **Context:** {{CONTEXT_MODE}}       <!-- single | multi-package -->
