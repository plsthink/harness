# Conventions routing index — harness global

Maps a file matcher → global good-practice convention docs to load **before** editing.
The `builder`/`tdd`/editing procedures consult this first. Pure filesystem contract.

**Product dir, distinct from `shared/`**: `shared/` = references a *named skill* loads;
`conventions/` = file-type-glob-routed good-practice injected into edited code. Both
`${CLAUDE_PLUGIN_ROOT}`-reachable. Project deltas live in a project's `docs/conventions/INDEX.md`
and load additively (project wins on conflict).

**Starts empty (lean-first).** Add an entry the first time you catch opus doing a thing wrong;
scaffold each convention doc from `${CLAUDE_PLUGIN_ROOT}/templates/convention.md` via
`${CLAUDE_PLUGIN_ROOT}/templates/scaffold.sh`, saved beside this
index as `<rule-id>.md` (the Load cell lists that rule-id; consult resolves it to the sibling file)
— it gets a stable rule-id (for cross-boundary `overrides:` markers). This index is
where "drive-the-model" knowledge compounds — curated, like learnings.

| Matcher | Load (rule-ids) |
|---|---|
| _(none yet)_ | |
