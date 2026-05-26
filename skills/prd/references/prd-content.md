# PRD section content rules

Loaded by `prd` step 3 when filling the template. What each section must / must-not hold.

- **Problem** — the problem from the user's perspective.
- **Solution** — the solution from the user's perspective.
- **User Stories** — a LONG numbered list, `As an <actor>, I want <feature>, so that <benefit>`.
  Extensive; cover all aspects of the feature.
- **Implementation Decisions** — modules to build/modify + their interfaces; technical
  clarifications; architectural decisions; schema changes; API contracts; specific interactions.
  **No file paths or code snippets** (go stale). Exception: a prototype snippet encoding a decision
  more precisely than prose — trimmed to the decision-rich bit, noted as prototype-derived.
- **Testing Decisions** — what makes a good test (test external behavior, not implementation
  detail); which modules will be tested; prior art (similar tests in the codebase).
- **Out of Scope** — what this PRD does not cover.
- **Notes** — anything else.

## Scenario (verification)
**Input:** a converged design in conversation. **Expected:** `docs/work/<feature>/PRD.md` with all
sections filled in glossary vocab, an extensive user-story list, and no file paths/code (a PRD
carries no `Status:` — that's a per-issue field); the user was asked which modules to test before writing.
