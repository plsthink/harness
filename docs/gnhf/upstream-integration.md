GOAL: Improve the harness by pulling one deliberate divergence from an upstream source into the repo and recording its provenance. The external forcing function is the upstream delta itself.

PROCEDURE: Pick an integration source under docs/integrations/ (caveman.md, compound-engineering.md, karpathy-skills.md, mattpocock-skills.md, superpowers.md). Re-diff it per the provenance re-diff protocol in docs/AGENTS.md: compare the current upstream against what the harness last reflected. Find one unreconciled upstream improvement. Decide deliberately — adopt it (the harness owns and may diverge, so adapt rather than copy) or reject it with a reason. Apply the adopt-or-reject to the harness product and update the docs/integrations/<src>.md record so the next re-diff starts from this point.

FORCING FUNCTION: the specific upstream delta, e.g. "mattpocock's <pattern> postdates our last re-diff and improves <skill>" or "caveman upstream changed <X>; we reject because <reason>". Name the source and the delta in your iteration summary.

HALT: when every integration source is re-diffed current and the remaining upstream deltas are already deliberately rejected (recorded), this goal is exhausted — report that the run's configured stop condition is met, and do not adopt an upstream change you would reject just to produce a commit.

RULES (mandatory):
1. ONE FORCING FUNCTION PER ITERATION — name the concrete trigger in your iteration summary. Make no change you cannot tie to a named trigger; marginal homogenization is not a trigger.
2. HALT HONESTLY — the moment an honest search finds no defensible trigger, report that the stop condition is met. Halting is the correct outcome; never invent a trigger to keep going.
3. MEASURE FRESH — product-file changes (skills/ agents/ hooks/ shared/ conventions/ templates/) are not live in a session until you run `claude plugin update harness@harness`; measure only on a session started after that. docs/, .claude/settings.json, CLAUDE.md, README.md are live immediately.
4. Honor the latest harness conventions, templates, and ${CLAUDE_PLUGIN_ROOT}/shared/authoring-standard.md; keep instructions minimal and precise; record decisions as stances under docs/stances/. One coherent, committed change per iteration.
5. Start by reading docs/AGENTS.md (provenance/re-diff protocol), and this run's notes.md for what earlier iterations already did.
