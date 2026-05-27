GOAL: Improve the harness by covering a repeatable task it cannot yet do well — add or extend a skill or agent. Higher variance than the other goals, so the bar for a real gap is high.

PROCEDURE: Identify a concrete, repeatable task a user or agent would want, that no current skill plus the pipeline handles — ideally a gap surfaced by real usage, not a speculative "nice to have". State why the existing skills (see ${CLAUDE_PLUGIN_ROOT}/shared/pipeline.md for the skill-chain graph) don't cover it. Design the thinnest skill or agent that does, using the new-skill / new-agent skills so it is scaffolded from the templates and honors ${CLAUDE_PLUGIN_ROOT}/shared/authoring-standard.md. Wire it into the pipeline graph (its Reads/Writes/Next) so it interconnects via filesystem contracts, not code coupling. Prove it by dogfooding it once against a mocks/ fixture.

FORCING FUNCTION: the named uncovered task, e.g. "no skill turns a failing production incident into a regression issue" or "no skill exists to retire a dead skill cleanly". Name the task and why current skills miss it in your iteration summary.

HALT: when the pipeline covers the repeatable tasks in scope and the remaining gaps are deliberately deferred (record the deferral as a stance or learning so a later iteration does not re-litigate it), this goal is exhausted — report that the run's configured stop condition is met, and do not build a skill for a task already covered by composing existing skills.

RULES (mandatory):
1. ONE FORCING FUNCTION PER ITERATION — name the concrete trigger in your iteration summary. Make no change you cannot tie to a named trigger; marginal homogenization is not a trigger.
2. HALT HONESTLY — the moment an honest search finds no defensible trigger, report that the stop condition is met. Halting is the correct outcome; never invent a trigger to keep going.
3. MEASURE FRESH — product-file changes (skills/ agents/ hooks/ shared/ conventions/ templates/) are not live in a session until you run `claude plugin update harness@harness`; measure only on a session started after that. docs/, .claude/settings.json, CLAUDE.md, README.md are live immediately.
4. Honor the latest harness conventions, templates, and ${CLAUDE_PLUGIN_ROOT}/shared/authoring-standard.md; keep instructions minimal and precise; record decisions as stances under docs/stances/. One coherent, committed change per iteration.
5. Start by reading docs/AGENTS.md, and this run's notes.md for what earlier iterations already built or deferred.
