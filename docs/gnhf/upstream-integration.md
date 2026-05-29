GOAL: Improve the harness by pulling one deliberate divergence from an upstream source into the repo and recording its provenance. The external forcing function is the upstream delta itself.

PROCEDURE: Pick an integration source under docs/integrations/ (caveman.md, compound-engineering.md, karpathy-skills.md, mattpocock-skills.md, superpowers.md). Re-diff it per the provenance re-diff protocol in docs/AGENTS.md: compare the current upstream against what the harness last reflected. Find one unreconciled upstream improvement. Decide deliberately — adopt it (the harness owns and may diverge, so adapt rather than copy) or reject it with a reason. Apply the adopt-or-reject to the harness product and update the docs/integrations/<src>.md record so the next re-diff starts from this point.

FORCING FUNCTION: the specific upstream delta, e.g. "mattpocock's <pattern> postdates our last re-diff and improves <skill>" or "caveman upstream changed <X>; we reject because <reason>". Name the source and the delta in your iteration summary.

HALT: once every integration source has been re-diffed to current and any surviving upstream delta is a deliberate, recorded rejection, this goal is exhausted — report that the run's configured stop condition is met, and do not adopt an upstream change you would reject just to produce a commit.

RULES — full text and rationale in docs/gnhf/_rules.md (read and follow it):
1. ONE FORCING FUNCTION PER ITERATION — name the concrete trigger in your summary.
2. HALT HONESTLY — never invent a trigger; the honest stop is the correct outcome.
3. MEASURE FRESH — product files aren't live until `claude plugin update harness@harness`.
4. Honor conventions/templates/authoring-standard; one coherent, committed change per iteration.
5. START BY READING docs/AGENTS.md (provenance/re-diff protocol) and this run's notes.md before acting.
6. DOGFOOD VIA THE FITTING SKILL — follow a fitting skill's procedure instead of hand-rolling; skip only when none fits.
