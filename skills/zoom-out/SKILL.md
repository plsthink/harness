---
name: zoom-out
description: Go up a layer of abstraction and map the relevant modules and their callers using the project's domain glossary vocabulary. Use when you're unfamiliar with a section of code or need to understand how it fits the bigger picture. Manual invocation only.
disable-model-invocation: true
---

# zoom-out

Manual-only. Go up a layer: give a map of the relevant modules + callers in the project's glossary
vocabulary (`docs/CONTEXT.md`).

## When to fire
- Manual invocation only (the user says "zoom out").

## Procedure

1. Identify the area of code in question.
2. Go up one abstraction layer.
3. Map the relevant modules and their callers, using the domain glossary vocabulary (and the
   deep-modules vocab `${CLAUDE_PLUGIN_ROOT}/shared/deep-modules.md` for interface/seam framing).

## Pipeline
- Reads:  code; `docs/CONTEXT.md`
- Writes: (nothing — produces a map for the user)
- Next:   architecture (if the map reveals friction worth deepening)
