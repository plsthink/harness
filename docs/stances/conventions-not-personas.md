# Scoped instructions are conventions, picked by scope×determinism — not personas

**Stance:** Inject scoped reusable instructions via the conventions layer: `CLAUDE.md` for
always-true terse rules, **skills** for intent-triggered workflows, **glob-routed convention docs**
for file-type advisory rules, **PreToolUse hooks** for hard invariants (sparingly), **project
domain docs** for un-learnable external knowledge, **agents** for distinct stance/tools. The
mechanism is chosen by scope×determinism, never by inventing a persona.

**Why:** Conventions compose **additively** — editing a `.tsx` file loads react + typescript +
project rules at once, scoped by matcher; a persona can't compose like that. Conventions live once
(`conventions/` global, `docs/conventions/` project), are glob-routed by a small INDEX the editing
agent consults before editing, and start empty (add an entry the first time opus gets something
wrong). Project conventions are a **delta** over harness globals (single-source); `docs-review`
reconciles the boundary.

**Rejected:** Persona-based specialization for good-practice — caused non-composable, duplicated
rules; the scope×determinism table picks the mechanism instead.
