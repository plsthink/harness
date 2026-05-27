# 10 — reconcile-verify-method-resolution

Status: done
Type: enhancement

## What to build
Reconcile the two coexisting framings of how `verifier` resolves a project's verify procedure, so
the contract reads one way across the schema, the agent, and onboarding. Today `verifier` resolves
"prefer a project-local verify Skill if the project ships one, **else** the `verify-method` config
value", while `scripts/check-onboarded.schema` annotates `verify-method` as possibly being itself
"a project verify-Skill ref" — two models that both reach the Skill but describe the knob
differently. Settle on the agent's **prefer-Skill-else-command** model (a project-local verify Skill
wins by discovery; `verify-method` is the plain command/procedure fallback, not a Skill pointer) and
align the schema annotation, `agents/verifier.md`, and `skills/onboard/references/config.md` to it.
The same check applies to the `test-command` / project test-Skill pair (slice 05) — align it
identically if it carries the same dual framing.

## Acceptance criteria
- `scripts/check-onboarded.schema`'s `verify-method` (and `test-command`) annotation describes a
  plain command/procedure, with the project-local Skill resolved by preference at the gate — not a
  "Skill ref" alternative baked into the config value.
- `agents/verifier.md`, `skills/tdd/SKILL.md`, and `skills/onboard/references/config.md` all state
  the same single resolution model (prefer project-local Skill by discovery, else the config
  command); no file implies a second model.
- `check-onboarded` still reports the harness repo complete (its own `verify-method` /
  `test-command` values stay valid under the chosen framing).
- `bash docs/scripts/check-refs.sh` stays green; no behavior change to the verifier/tdd gates
  themselves — this is a contract-wording reconciliation only.

## Blocked by
- None — orchestrator-pivot slices 04/05/07 are merged; this is a post-completion cleanup.

## Comments
- Surfaced by reviewer-08 during the orchestrator-pivot run as a non-blocking cross-slice wording
  drift; deferred to this follow-up rather than reaching back into merged slices mid-feature.
  _(agent-authored)_
