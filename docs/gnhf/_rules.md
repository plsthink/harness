# gnhf shared rules

The mandatory rules every gnhf objective in this directory obeys. Each objective links here and
keeps only the rule headers inline; the running agent reads this file at runtime, the same way it
reads docs/AGENTS.md. This is not a runnable flow — run.sh maps flows to the objective files, not to
this one.

1. ONE FORCING FUNCTION PER ITERATION — name the concrete trigger in your iteration summary. Make
   no change you cannot tie to a named trigger; marginal homogenization is not a trigger.
2. HALT HONESTLY — the moment an honest search finds no defensible trigger, report that the run's
   configured stop condition is met. Halting is the correct outcome; never invent a trigger to keep
   going.
3. MEASURE FRESH — product-file changes (skills/ agents/ hooks/ shared/ conventions/ templates/) are
   not live in a session until you run `claude plugin update harness@harness`; measure only on a
   session started after that. docs/, .claude/settings.json, CLAUDE.md, README.md are live
   immediately. See ../stances/measure-product-changes-via-plugin-update.md.
4. Honor the latest harness conventions, templates, and ${CLAUDE_PLUGIN_ROOT}/shared/authoring-standard.md;
   keep instructions minimal and precise; record decisions as stances under docs/stances/. One
   coherent, committed change per iteration.
5. START BY READING docs/AGENTS.md and this run's notes.md before acting — AGENTS.md for the
   navigation and provenance/re-diff protocol, notes.md for what earlier iterations already did,
   deferred, or judged intentional-by-design (so you neither repeat nor re-litigate them).
6. DOGFOOD VIA THE FITTING SKILL — when a harness skill's lens fits this iteration's work, do the
   work by following that skill's SKILL.md procedure (read and execute it as a bare agent would —
   gnhf may run a non-Claude agent with no slash command, so this means *follow the procedure*, not
   *invoke /skill*), not by hand-rolling around it. Driving the skill is higher-signal and is itself
   the dogfooding the harness improves from — the run proved a skill's structured lens catches drift
   that ad-hoc manual reading misses. Skip only when no skill fits (e.g. an upstream re-diff has
   none); never force a skill onto work it does not fit — that is ritual, not dogfooding.
