# Load-bearing dev scripts earn a pinned, auto-running self-test

**Stance:** Once a script is wired into a blocking hook it is *load-bearing* and earns a pinned
self-test (`docs/scripts/<name>.test.sh`) beside it. The test is itself path-gated into the same
`PostToolUse` hook — editing the script (or its test) triggers its regression test in the same
turn — while unrelated edits stay fast and silent. To stay testable a script takes an optional
`ROOT`/fixture arg so the test runs against throwaway fixtures, never the real tree. Covered so far:
the path-gated self-test entries in the `PostToolUse` hook of `.claude/settings.json`.

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

**Rejected:** Speculative linting of authoring-standard invariants — the footer/size soft target,
and the `Cited by:` header (mechanical and genuinely buildable, unlike the semantic case below, yet
on the same gate). Deferred until that drift *recurs* (lean-first); testing existing load-bearing
tooling is the uncontradicted concern. The Cited-by lint is the most-retempted (re-derived nearly
every iteration): its lone near-miss was a brace-set blind spot in the *manual* sweep — a brace-only
citer like `docs-review` carries no literal `shared/<doc>` substring — patched by the brace-aware
note in `authoring-standard.md`, a methodology artifact, not recurring drift, so the gate stays
untripped. Control = the brace-aware manual citer sweep, not a script.

**Rejected (stronger ground):** A *duplicated-fact* checker — flagging a restated count, checklist,
or canonical list (the `authoring-standard.md` "cite a canonical fact, never restate it" rule). This
drift class has *already* recurred and been hand-fixed repeatedly, so the usual "defer until it
recurs" gate is spent — yet it still earns no checker, because the signal is **semantic, not
mechanical**: "this prose restates a list defined elsewhere" is a judgment, unlike `check-refs`'s
link resolution, so any linter would be guess-prone (false-positive on legitimate prose, blind on
paraphrase). The chosen control is the encoded rule + a manual grep-the-bare-concept sweep, not a
script. Recorded here so future iterations stop re-deriving the same answer.
