# Authoring standard — every skill and agent

Cited by `new-skill` + `new-agent`. A skill reference, **not** a glob-routed
convention — it's "how the scaffolders work," not good-practice about edited code. The harness is
only lean if each unit is. Hard rules:

## Skills

- **Thin entry file.** `SKILL.md` stays short — **soft target ~100 lines.** Holds only: the
  `description`, when-to-fire triggers, and the *procedure* (ordered steps). Nothing else.
- **Detail lives in `references/`.** Vocabulary, formats, templates, examples, long rationale,
  decision tables → bundled reference files, **loaded only when the step that needs them runs**
  (e.g. `tdd` loads `references/mocking.md` only when a mocking question arises). The entry file
  *names* the reference and says when to read it; it does not inline the content.
- **One level deep.** References do not chain into more references. `SKILL.md → references/x.md`
  and stop.
- **Scripts for determinism.** Anything mechanical (loops, scaffolding, validation) → an
  executable in `scripts/`, not prose the model re-derives each run.
- **Shared over local.** Cross-cutting conventions live once in `shared/` and are referenced by
  path (`${CLAUDE_PLUGIN_ROOT}/shared/...`); never copied into a skill.
- **Own refs by relative path.** A skill cites its OWN bundled files relatively:
  `[x.md](references/x.md)`. Only `shared/` files use the `${CLAUDE_PLUGIN_ROOT}` form.

## Description budget

- `description` = `<what it does>` + `Use when [triggers]`, third person, ≤ 1024 chars.
- This is the **only** part always in context (sum of all skill descriptions, governed by
  `skillListingBudgetFraction` ≈ 0.02). Keep it tight — every skill's description taxes every
  other skill. Reference-file size is paid only on use, so depth there is cheap.

## Pipeline footer

Every `SKILL.md` ends with the standard block (scaffold from `templates/skill/SKILL.md`):
```
## Pipeline
- Reads:  <files / docs/work state it consumes>
- Writes: <files / docs/work state it produces>
- Next:   <skill name(s) that typically follow>
```

## Agents

- **Flat single `.md` file** under `agents/`. Claude Code does not discover nested
  `agents/<name>/` dirs. No per-agent `references/` — detail that would bloat the prompt lives in
  `shared/`, cited by path.
- Same thin-entry discipline: thin instruction, detail cited from `shared/`.
- **No `model:` frontmatter** — inherit the parent model.
- Output **terse structured, no persona**.

## Enforcement

The ~100-line target is a **soft target, not a lint** (lean-first). `reviewer` + `docs-review`
flag a fat `SKILL.md` as a finding. No lint script until fat-file drift actually recurs. `new-skill`
/`new-agent` scaffold the lean shape from `templates/` so thin-by-default is the starting point.
