GOAL: Self-improve the harness unattended over a long gnhf session by working four goal-phases in a fixed order, advancing to the next phase only when the current one runs dry. Splitting by forcing function — rather than mixing all concerns in one open-ended objective — is what keeps the run producing real work instead of marginal churn.

PHASES (fixed order, with the reason each sits where it does):
1. DOGFOOD — drive a harness skill end-to-end against a mocks/ fixture (todo-cli, slug-mono, or a fresh minimal mock) and fix the friction that surfaces. First because it is the cheapest, highest-signal forcing function, the fixtures are ready, and it surfaces the defects and capability gaps that seed phases 2-3.
2. UPSTREAM — re-diff an integration source under docs/integrations/ and adopt-or-reject one unreconciled upstream delta, updating the provenance record. Before capability so you integrate external material before building internal and do not reinvent what upstream already offers.
3. CAPABILITY — cover a repeatable task no current skill+pipeline handles by adding/extending a skill or agent via new-skill/new-agent, wired into ${CLAUDE_PLUGIN_ROOT}/shared/pipeline.md. Builds the gaps phases 1-2 revealed.
4. COHERENCE — reconcile one concrete internal inconsistency (dangling cite, glossary drift, duplicated spec, stale stance). Last because it operates on the churn the prior phases produced and is self-limiting — the natural terminator. Do NOT homogenize a member whose difference from its siblings is intentional-by-design.

LOOP MECHANICS: Read this run's notes.md to find the current phase (the phase named in the most recent iteration; default to phase 1, dogfood, on the first iteration). Do the current phase's next unit of forcing-function work using that phase's definition above; name the concrete trigger and the current phase in your iteration summary. If the current phase has no defensible forcing function this iteration, advance the pointer to the next phase (wrapping coherence -> dogfood), note the advance in your summary, and that advance is the iteration.

HALT: when you complete a full pass through all four phases without making a single change — every phase reporting no defensible forcing function in turn — report that the run's configured stop condition is met. A dry full cycle means the repo is improved out; halting beats manufacturing marginal churn.

RULES (mandatory):
1. ONE FORCING FUNCTION PER ITERATION — name the concrete trigger AND the current phase in your iteration summary. A phase with no defensible trigger advances the pointer instead of forcing a change.
2. HALT HONESTLY — when a full four-phase cycle yields no change, report that the stop condition is met. Never disguise a dry phase as a marginal change to keep the loop alive.
3. MEASURE FRESH — product-file changes (skills/ agents/ hooks/ shared/ conventions/ templates/) are not live in a session until you run `claude plugin update harness@harness`; measure only on a session started after that. docs/, .claude/settings.json, CLAUDE.md, README.md are live immediately.
4. Honor the latest harness conventions, templates, and ${CLAUDE_PLUGIN_ROOT}/shared/authoring-standard.md; keep instructions minimal and precise; record decisions as stances under docs/stances/. One coherent, committed change per iteration.
5. Start by reading docs/AGENTS.md, and this run's notes.md for the current phase and what earlier iterations already did.
