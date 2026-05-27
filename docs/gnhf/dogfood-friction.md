GOAL: Improve the harness by driving one of its skills end-to-end against a real scenario and fixing the friction that surfaces. This is the highest-signal forcing function: real usage exposes real defects.

PROCEDURE: Pick a skill+fixture pairing not yet exercised since the last product change (use the mocks/ fixtures — mocks/todo-cli and mocks/slug-mono — or build a fresh minimal mock if a skill needs a scenario the existing ones can't provide; mocks each carry their own docs/ per docs/stances/mock-projects-home.md). Run the skill exactly as a fresh agent would against that fixture. Record precisely where it stumbles: an instruction that misleads, a step that leaves residue, a gate that passes something it shouldn't, a missing scaffold. Fix the smallest root cause in the harness product. Re-run to confirm the friction is gone. Distinguish a real stumble from fixture-doc drift the skill merely surfaced: if the skill runs friction-free and its lens only reveals a pre-existing inconsistency in the fixture's own docs (a stale glossary term, an entrypoint that omits an on-disk artifact), that is a coherence-class defect, not dogfood friction — out of scope for this goal, so note it for a coherence pass rather than booking it here as a skill fix.

FORCING FUNCTION: the specific observed stumble, e.g. "onboard step 3 left template <!-- --> comments in todo-cli's written docs" or "execute-issue reviewer passed a vacuous green on slug-mono". Name it concretely in your iteration summary.

HALT: when every skill has been driven against a representative fixture since the last product change and none stumbles, this goal is exhausted — report that the run's configured stop condition is met, and do not invent a stumble to keep going.

RULES — full text and rationale in docs/gnhf/_rules.md (read and follow it):
1. ONE FORCING FUNCTION PER ITERATION — name the concrete trigger in your summary.
2. HALT HONESTLY — never invent a trigger; the honest stop is the correct outcome.
3. MEASURE FRESH — product files aren't live until `claude plugin update harness@harness`.
4. Honor conventions/templates/authoring-standard; one coherent, committed change per iteration.
5. START BY READING docs/AGENTS.md and this run's notes.md before acting.
6. DOGFOOD VIA THE FITTING SKILL — follow a fitting skill's procedure instead of hand-rolling; skip only when none fits.
