GOAL: Improve the harness by reconciling one concrete internal inconsistency or trimming one concrete redundancy. This is the self-limiting goal — its forcing function runs out, and when it does the correct move is to halt, not to manufacture marginal churn. The halt discipline here is the strictest of all the prompts.

PROCEDURE: Run docs/scripts/check-refs.sh and the dev-script self-tests. Read the product surface for ONE real defect: a dangling or malformed cite, a term used two ways versus the docs/CONTEXT.md glossary, a duplicated spec that violates cite-don't-restate, or a stale stance that contradicts current behavior. Fix the root cause. Re-run the checks.

FORCING FUNCTION: the specific defect, e.g. "skill X cites shared/Y.md with a bare backtick, violating authoring-standard's plugin-root-cite rule" or "diagnose's Reads footer names a glossary path that no longer exists". Name the file and the defect in your iteration summary.

HALT — the expected, correct outcome once the surface is clean: check-refs passes, the self-tests pass, and you find no genuine contradiction. Report that the run's configured stop condition is met. EXPLICITLY DO NOT homogenize a member that differs from its siblings when that difference is intentional-by-design: a divergent member is a defect only if it contradicts a recorded decision (a stance) or a stated single-source. Documented layering, justified deviations, and supersets are not defects. Halting beats churning.

RULES (mandatory):
1. ONE FORCING FUNCTION PER ITERATION — name the concrete trigger in your iteration summary. Make no change you cannot tie to a named trigger; marginal homogenization is not a trigger.
2. HALT HONESTLY — the moment an honest search finds no defensible trigger, report that the stop condition is met. Halting is the correct outcome; never invent a trigger to keep going.
3. MEASURE FRESH — product-file changes (skills/ agents/ hooks/ shared/ conventions/ templates/) are not live in a session until you run `claude plugin update harness@harness`; measure only on a session started after that. docs/, .claude/settings.json, CLAUDE.md, README.md are live immediately.
4. Honor the latest harness conventions, templates, and ${CLAUDE_PLUGIN_ROOT}/shared/authoring-standard.md; keep instructions minimal and precise; record decisions as stances under docs/stances/. One coherent, committed change per iteration.
5. Start by reading docs/AGENTS.md, and this run's notes.md — including any non-defects earlier iterations already judged intentional-by-design, so you do not re-flag them.
