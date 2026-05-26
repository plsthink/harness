---
name: prototype
description: Build a throwaway prototype to flesh out a design before committing. Routes between a runnable terminal app for state/logic questions, or several radically different UI variations on one route. Use when the user wants to prototype, sanity-check a data model or state machine, mock up a UI, explore design options, or says "prototype this", "let me play with it", "try a few designs".
---

# prototype

A prototype is **throwaway code that answers a question**. The question decides the shape.

## When to fire
- User wants to prototype / sanity-check a state model / mock up UI / explore design options.

## Procedure

1. **Pick a branch** by identifying the question (from the prompt, surrounding code, or by asking):
   - "Does this logic / state model feel right?" → [LOGIC.md](references/LOGIC.md): a tiny
     interactive terminal app pushing the state machine through hard-to-reason cases.
   - "What should this look like?" → [UI.md](references/UI.md): several radically different UI
     variations on one route, switchable via a URL search param + floating bar.
   Getting the branch wrong wastes the whole prototype. If genuinely ambiguous and the user is
   unreachable, default by surrounding code (backend → logic; page/component → UI) and state the
   assumption at the top.
2. **Obey the rules for both branches** (see [rules.md](references/rules.md)): throwaway + clearly
   marked, one command to run, no persistence by default, skip polish, surface full state each
   step, delete-or-absorb when done.
3. **Capture the answer durably** when done — the answer is the only thing worth keeping. Commit
   message / stance / issue / a `NOTES.md` next to the prototype, with the question it answered. If
   a snippet encodes a decision precisely, it can feed `prd`/`issues` (the prototype-snippet
   exception). Then delete or absorb.

## Pipeline
- Reads:  the design question; surrounding code
- Writes: throwaway prototype (deleted/absorbed after); a durable verdict note
- Next:   prd (fold the validated decision into a PRD) | think (if the prototype reopens questions)
