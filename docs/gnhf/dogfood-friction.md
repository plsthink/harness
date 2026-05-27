GOAL: Improve the harness by driving one of its skills end-to-end against a real scenario and fixing the friction that surfaces. This is the highest-signal forcing function: real usage exposes real defects.

PROCEDURE: Pick a skill+fixture pairing not yet exercised since the last product change (use the mocks/ fixtures — mocks/todo-cli and mocks/slug-mono — or build a fresh minimal mock if a skill needs a scenario the existing ones can't provide; mocks each carry their own docs/ per docs/stances/mock-projects-home.md). Run the skill exactly as a fresh agent would against that fixture. Record precisely where it stumbles: an instruction that misleads, a step that leaves residue, a gate that passes something it shouldn't, a missing scaffold. Fix the smallest root cause in the harness product. Re-run to confirm the friction is gone.

FORCING FUNCTION: the specific observed stumble, e.g. "onboard step 3 left template <!-- --> comments in todo-cli's written docs" or "execute-issue reviewer passed a vacuous green on slug-mono". Name it concretely in your iteration summary.

HALT: when every skill has been driven against a representative fixture since the last product change and none stumbles, this goal is exhausted — report that the run's configured stop condition is met, and do not invent a stumble to keep going.

RULES (mandatory):
1. ONE FORCING FUNCTION PER ITERATION — name the concrete trigger in your iteration summary. Make no change you cannot tie to a named trigger; marginal homogenization is not a trigger.
2. HALT HONESTLY — the moment an honest search finds no defensible trigger, report that the stop condition is met. Halting is the correct outcome; never invent a trigger to keep going.
3. MEASURE FRESH — product-file changes (skills/ agents/ hooks/ shared/ conventions/ templates/) are not live in a session until you run `claude plugin update harness@harness`; measure only on a session started after that. docs/, .claude/settings.json, CLAUDE.md, README.md are live immediately.
4. Honor the latest harness conventions, templates, and ${CLAUDE_PLUGIN_ROOT}/shared/authoring-standard.md; keep instructions minimal and precise; record decisions as stances under docs/stances/. One coherent, committed change per iteration.
5. Start by reading docs/AGENTS.md, and this run's notes.md for what earlier iterations already did.
