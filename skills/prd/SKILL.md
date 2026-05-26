---
name: prd
description: Turn the current conversation and codebase understanding into a PRD and publish it to the project issue tracker. Synthesizes what is already known — does not interview. Use when the user wants to create a PRD from the current context, or the design from a think session is settled and ready to write up.
---

# prd

Synthesize conversation + codebase understanding → a PRD at `docs/work/<feature>/PRD.md`. **Do not
interview** — that was `think`'s job; synthesize what you already know.

## When to fire
- User wants a PRD from the current context, or a `think` session has converged.

## Procedure

1. **Explore the repo** to ground the current state (if not already done). Use the project's
   **domain glossary vocabulary** throughout (`docs/CONTEXT.md`), and
   respect stances in the area you're touching (`docs/stances/*`).
2. **Sketch the modules** to build/modify. Hunt **deep modules** — small interface, deep
   implementation, testable in isolation — using
   `${CLAUDE_PLUGIN_ROOT}/shared/deep-modules.md` (incl. the deletion test). **Confirm with the
   user** that the modules match expectations and **which** modules they want tests for.
3. **Write the PRD** from `templates/work/PRD.md` (scaffold via `templates/scaffold.sh`), filling
   the closed sections: Problem, Solution, long User Stories (`As an <actor>, I want <feature>, so
   that <benefit>` — extensive), Implementation Decisions, Testing Decisions, Out of Scope, Notes.
   See [prd-content.md](references/prd-content.md) for what each section must/must-not hold.
4. **Publish** the PRD to `docs/work/<feature>/PRD.md` (`${CLAUDE_PLUGIN_ROOT}/shared/issue-tracker.md`).
   A PRD carries no `Status:` (that's a per-issue field); a converged design lets `issues` stamp its
   slices `ready-for-agent` without extra triage.

**No file paths or code snippets** in the PRD (they go stale). Exception: a prototype-produced
snippet that encodes a decision more precisely than prose (state machine / reducer / schema / type
shape) — inline the decision-rich bit and note it came from a prototype.

## Pipeline
- Reads:  conversation; code; `docs/CONTEXT.md`, `docs/stances/*`; prototype output (if any)
- Writes: `docs/work/<feature>/PRD.md`
- Next:   issues (break the PRD into tracer-bullet slices)
