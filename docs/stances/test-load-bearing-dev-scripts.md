# Load-bearing dev scripts earn a pinned, auto-running self-test

**Stance:** Once a script is wired into a blocking hook it is *load-bearing* and earns a pinned
self-test (`docs/scripts/<name>.test.sh`) beside it. The test is itself path-gated into the same
`PostToolUse` hook — editing the script (or its test) triggers its regression test in the same
turn — while unrelated edits stay fast and silent. To stay testable a script takes an optional
`ROOT`/fixture arg so the test runs against throwaway fixtures, never the real tree. Covered so far:
`check-refs.sh`, `templates/scaffold.sh`, and the two caveman hooks.

**Why:** A blocking checker fails *asymmetrically* — a silent detection regression either spams
false-positives (blocks every edit) or goes blind (guard disabled), and neither surfaces until much
later. A pinned test only guards if it actually runs, so dead-on-disk tests are worthless; the
path-gate is what keeps the guard live. A script can be **product** (ships, runs at runtime — e.g.
`scaffold.sh`, the caveman hooks) while its test is **dogfood-only** (never ships): the two-roots
split is about where a file is needed *at runtime*, and a regression test is only ever a harness-repo
dev concern. Widest case: the caveman hooks ship to every project, and their break vector is the
`<!-- RULESET-START/END -->` single-source-of-truth contract in `skills/caveman/SKILL.md`, so that
test's path-gate includes the SKILL.md source, not just the hook files.

The trigger is *blocking*: a **non-blocking advisory** hook (e.g. the `SessionStart`
`check-plugin-fresh.sh`, which always exits 0 and only prints a reminder) is not load-bearing — a
regression there at worst drops one advisory line back to the manual status quo, no asymmetric blast
radius — so it earns no pinned test until it gains teeth.

**Rejected:** Speculative linting of authoring-standard invariants (footer/size) — deferred until
that drift recurs (lean-first); testing existing load-bearing tooling is the uncontradicted concern.
