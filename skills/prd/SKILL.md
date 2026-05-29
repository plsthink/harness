---
name: prd
description: Turn the current conversation and codebase understanding into a PRD and publish it to the project issue tracker. Synthesizes what is already known — does not interview. Use when the user wants to create a PRD from the current context, or the design from a think session is settled and ready to write up.
---

# prd

**Do not interview** — that's `think`'s job.

## When to fire
- User wants a PRD from the current context, or a `think` session has converged.

## Procedure

0. **Onboarding gate.** Run the step-0 behavior-config check (`${CLAUDE_PLUGIN_ROOT}/shared/onboarding-gate.md`).
1. **Explore the repo** to ground the current state (if not already done). Use the project's
   **domain glossary vocabulary** throughout (`docs/CONTEXT.md`; multi-package fan-out:
   `${CLAUDE_PLUGIN_ROOT}/shared/context-doc.md`), and respect stances in the touched area (`docs/stances/*`).
2. **Sketch the modules** to build/modify. Hunt **deep modules** (`${CLAUDE_PLUGIN_ROOT}/shared/deep-modules.md`).
   **Confirm with the user** that the modules match expectations and **which** modules they want tests for.
3. **Write the PRD** from `templates/work/PRD.md` (scaffold via `templates/scaffold.sh`); fill the
   closed sections per [prd-content.md](references/prd-content.md).
4. **Publish** the PRD to `docs/work/<feature>/PRD.md` (`${CLAUDE_PLUGIN_ROOT}/shared/issue-tracker.md`).
   A PRD carries no `Status:` (that's a per-issue field); a converged design lets `issues` stamp its
   slices `ready-for-agent` without extra triage. Then **commit the PRD**: one `docs`-typed commit
   per `${CLAUDE_PLUGIN_ROOT}/shared/git-workflow.md` (e.g. `docs: add git-workflow PRD`).

## Pipeline
- Reads:  conversation; code; `docs/CONTEXT.md` (+ `CONTEXT-MAP.md` for multi), `docs/stances/*`; prototype output (if any)
- Writes: `docs/work/<feature>/PRD.md`
- Next:   issues (break the PRD into tracer-bullet slices)
