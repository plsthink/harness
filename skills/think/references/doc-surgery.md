# Inline doc-surgery

Loaded by `think` step 4 when domain docs exist and a term/claim/decision surfaces. The moves
(from grill-with-docs). One level deep — formats live in `shared/`, cited from the SKILL.

## The moves (apply mid-interview, capture as they happen)

- **Challenge against the glossary.** If a term conflicts with `CONTEXT.md`, call it out:
  "Your glossary defines 'cancellation' as X, but you mean Y — which is it?"
- **Sharpen fuzzy language.** Propose a precise canonical term: "You say 'account' — Customer or
  User? Those differ."
- **Discuss concrete scenarios.** Stress-test domain relationships with specific edge-case
  scenarios that force precise boundaries between concepts.
- **Cross-reference with code.** If the user states how something works, check the code agrees;
  surface contradictions: "Your code cancels whole Orders, but you said partial is possible."
- **Update inline, don't batch.** When a term resolves, edit `CONTEXT.md` right there. When a
  durable cross-session decision is made and passes the AND-of-three gate, write the stance there.

## Placement rules

- Vocabulary → `CONTEXT.md` glossary (format: `${CLAUDE_PLUGIN_ROOT}/shared/context-doc.md`). No implementation detail. **Multi-package:** route a package-specific term to the per-package `packages/<pkg>/docs/CONTEXT.md` the `CONTEXT-MAP.md` spine points to, project-wide terms to root (scope split per that format spec).
- Vision / hard constraints / integrations → `PROJECT.md` (format: `${CLAUDE_PLUGIN_ROOT}/shared/project-doc.md`).
- A hard-to-reverse AND surprising AND traded-off decision → a stance (format:
  `${CLAUDE_PLUGIN_ROOT}/shared/stances-doc.md`). Durable reversal → a `Rejected:` line, not a new doc.
- Anything not durable+cross-session → leave it in the conversation; it is not a domain doc.
