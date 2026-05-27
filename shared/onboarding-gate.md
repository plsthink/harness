# Onboarding gate — the step-0 behavior-config check

Cited by: `execute-issue`, `tdd`, `issues`, `prd`, `triage`, `onboard` (the first five run the gate;
`onboard` is the exempt bootstrap skill that cites it to declare it is **not** self-gated). The single source of the
config-consuming gate every spine skill runs before it does anything else.

## The check

Run, before step 1:

```
bash ${CLAUDE_PLUGIN_ROOT}/scripts/check-onboarded.sh "$CLAUDE_PROJECT_DIR"
```

It diffs the project's recorded behavior-config block (in its `AGENTS.md`) against the required-key
contract — both the script and the schema it reads are the single source: see
`${CLAUDE_PLUGIN_ROOT}/scripts/check-onboarded.sh` (and its sibling `check-onboarded.schema`).

## Verdicts

- **exit 0 (complete)** — every schema key is recorded → **proceed** to step 1.
- **exit 3 (absent)** — no config block (or no `AGENTS.md`) → **STOP**; tell the user to run
  `/onboard` before this skill can run.
- **exit 2 (stale)** — block present but missing ≥1 schema key → **STOP**; tell the user to run
  `/onboard`, naming the missing key(s) the script reported.

(An exit 1 is a usage/environment error — surface it; it is not an onboarding verdict.)

## Exempt skills

Skills that never gate (they bootstrap, prototype, or are comms-only — there is nothing to gate on
yet, or they are how onboarding itself happens): `think`, `prototype`, `onboard`, `caveman`.
