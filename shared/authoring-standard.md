# Authoring standard — every skill, agent, and shared module

Cited by: `new-skill`, `new-agent`. A skill reference, **not** a glob-routed
convention — it's "how the scaffolders work," not good-practice about edited code. The harness is
only lean if each unit is. Hard rules:

## Skills

- **Thin entry file.** `SKILL.md` stays short — **soft target ~100 lines.** Holds only: the
  `description`, when-to-fire triggers, the *procedure* (ordered steps), and the `Pipeline`
  footer (below). Nothing else.
- **Detail lives in `references/`.** Vocabulary, formats, templates, examples, long rationale,
  decision tables → bundled reference files, **loaded only when the step that needs them runs**
  (e.g. `tdd` loads `references/mocking.md` only when a mocking question arises). The entry file
  *names* the reference and says when to read it; it does not inline the content.
- **One level deep.** No deepening *chain*: `SKILL.md → references/x.md` and stop — a reference must
  not pull in a *further required* reading layer. Lateral sibling cross-links within one skill's own
  references are fine (branch-routing or shared-vocab, e.g. prototype `LOGIC.md`↔`UI.md`, architecture
  refs → `LANGUAGE.md`); they add no depth.
- **Scripts for determinism.** Anything mechanical (loops, scaffolding, validation) → an
  executable in `scripts/`, not prose the model re-derives each run.
- **Shared over local.** Cross-cutting conventions live once in `shared/` and are referenced by
  path (`${CLAUDE_PLUGIN_ROOT}/shared/...`); never copied into a skill.
- **Cite a canonical fact, never restate it.** A count ("six state roles"), a checklist, or a
  canonical list has one home; everywhere else — including a doc's own header — points to it, never
  hardcodes a copy. A restated fact drifts silently when its source grows (the list gains an item;
  the tally and every copy go stale with no error). `check-refs` resolves links, not prose tallies,
  so nothing catches this but the rule.
- **Own refs by relative path.** A skill cites its OWN bundled files relatively:
  `[x.md](references/x.md)`. Cross-product plugin resources (`shared/`, `conventions/`, `hooks/`)
  use the `${CLAUDE_PLUGIN_ROOT}` form.
- **Linear — one-pass reading.** A unit reads A→Z in a single forward pass: a passage must not
  depend on information introduced only later, nor force a re-read of an earlier passage with
  knowledge gained later. Test — a violation lets you **name the specific later location** the
  passage depends on; if you can't name it, it is not a defect (reordering for taste is not a
  violation). Sanctioned cross-file cites (cite-don't-restate, one-level-deep) are **not**
  bifurcation — this rule scopes to ordering *within one reading unit*. Applies to any reading
  unit, docs included; the doc surface cites this rule via `docs-review`'s lens.

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
`Reads`/`Writes` scope to inter-stage **project state** — `docs/work` artifacts, `docs/`
domain docs, code, conversation: what flows between pipeline stages. They do *not* enumerate
the cross-cutting `shared/` conventions a skill is bound by, nor its own `references/`/`scripts/`
(internal machinery, loaded on demand) — listing those would repeat the same boilerplate in
every footer and is not a footer omission.

## Shared modules

- **`Cited by:` header.** Every `shared/` module doc opens with `Cited by: ` + the
  comma-separated literal citers (the `skills/` and `agents/` that reference it via
  `${CLAUDE_PLUGIN_ROOT}/shared/<doc>`), e.g. ``Cited by: `new-skill`, `new-agent`.``. It is a
  reverse-pointer for impact analysis — when you edit a shared doc, it names who to re-check.
- **Keep it true.** The list must match the actual citers across both `skills/` and `agents/`
  (`grep -rl` the doc path); a skill that stops citing the doc drops off, a new citer is added.
  **Count brace-set cites:** a `shared/{a,b,c}.md` reference cites *each* member, but a literal
  `grep -rl "shared/a"` misses it (the string is `shared/{a,...`) — expand the set when deriving
  citers, or a brace-only citer (e.g. `docs-review`) silently drops from every header.
  Derivable, so hand-maintained now — add a checker only if accuracy drift recurs (lean-first).

## Agents

- **Flat single `.md` file** under `agents/`. Claude Code does not discover nested
  `agents/<name>/` dirs. No per-agent `references/` — detail that would bloat the prompt lives in
  `shared/`, cited by path.
- Same thin-entry discipline: thin instruction, detail cited from `shared/`.
- **No `model:` frontmatter** — inherit the parent model.
- Output **terse structured, no persona**.

## Enforcement

The ~100-line target is a **soft target, not a lint** (lean-first). `reviewer` flags a fat
`SKILL.md` under review as a finding (`docs-review` sweeps domain docs + conventions, not the skill
instruction surface). No lint script until fat-file drift actually recurs. `new-skill`/`new-agent`
scaffold the lean shape from `templates/` so thin-by-default is the starting point.
