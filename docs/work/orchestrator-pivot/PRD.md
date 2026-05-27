# Orchestrator pivot — PRD

<!-- Synthesised from conversation. Vocabulary from the glossary.
     No file paths / code. No Status (a per-issue field). Publish when the design has converged. -->

## Problem

Today the main session both *runs* the pipeline and *holds* every stage's tool output — reads,
greps, dead ends — so a complex task pollutes the context that drives execution, and dirtier
context means worse output. `execute-issue` already isolates the build slice (forks a builder per
task, reviewer-gates, merges AFK), but the rest of the pipeline (think → prd → issues → docs) runs
inline in the user's session.

Two further gaps surface on complex work:

- **No runtime quality gate.** The gate is `reviewer` (static, reads the diff) + tdd (unit-level).
  Nothing builds and *runs* the app to confirm observable behavior, and the procedure for doing so
  is project-specific (browser, CLI scripts, e2e harness) — knowledge the harness doesn't capture.
- **The spec is treated as frozen.** A `ready-for-agent` issue is a trusted contract; when dev/QA
  iterations reveal the issue or PRD itself was wrong, the loop can only stop and hand off. Complex
  tasks routinely need mid-flight path corrections, so this forces a human round-trip on every
  wrinkle and breaks the AFK promise.

Underlying both: the harness has no captured, per-project notion of *how to verify* or *how (or
whether) to run tests*, and no enforced point at which that knowledge must exist.

## Solution

Make the main session a pure **Orchestrator** (a session role, not a workflow engine): it reads the
tracker, dispatches config-consuming work to forks, holds no per-fork tool output, and is the sole
place HITL happens. Forks return conclusions; coordination rides the filesystem tracker
(`docs/work/`), never inter-agent messaging.

Five moving parts:

1. **Forks are preconditioned, not interactive.** A fork cannot pause for the human, so every input
   it needs (test command, `tdd-applies`, verify method, conventions) must be a precondition
   guaranteed before dispatch. A fork hitting missing/ambiguous config escalates to the Orchestrator
   rather than guessing.

2. **Onboarding is the hard gate.** A single-source schema enumerates the config keys onboarding
   must produce. Config-consuming skills (execute-issue, tdd, verifier, issues, prd, triage) run a
   step-0 check — a shared `check-onboarded` script comparing the project's recorded config against
   the schema — and stop with "run onboard" when config is absent or stale (a schema key the project
   is missing). think, prototype, onboard, and caveman are exempt and run pre-onboarding (think
   stays in plain interview mode, no doc-surgery, until onboarded).

3. **A fourth agent, `verifier`** — dynamic stance+tools (builds/runs the app), distinct from
   `reviewer`'s static read-only stance. Slots as a conditional second gate in execute-issue, after
   `reviewer`, running only when the acceptance criteria declare observable behavior. It loads the
   project's verify procedure (a project-local Skill onboarding scaffolds when the procedure is
   non-trivial; declarative knobs live in config).

4. **Frozen goal, mutable path.** execute-issue keeps the upstream human gate as the definition of
   "done" (goal), but may repair the *path* autonomously: on a path-level failure the Orchestrator
   re-enters think → prd → issues as forks, re-stamps, and re-dispatches. A goal-level divergence
   (scope change, new user-facing decision) or any ambiguity escalates to HITL — stop, do not merge,
   write findings, flip status on main, hand off.

5. **One opinionated tracker.** Drop the per-project tracker and label choices; always local
   `docs/work/` plus the canonical harness triage labels. Onboarding's (now unbounded) interview
   spends its budget on behavior config instead, and scaffolds project-local Skills/Agents from the
   answers (deferring to new-skill / new-agent).

## User stories

- As a harness user, I want to drive a single clean Orchestrator session, so that a long complex
  task doesn't accumulate stage tool-output in the context steering my work and degrade output.
- As a harness user, I want the Orchestrator to dispatch each config-consuming stage to a fork and
  receive only its conclusion, so that reads/greps/dead-ends stay isolated and every fork starts
  from clean context.
- As a harness user, I want two issues to progress concurrently (QA on one, build on another) by
  spawning independent forks coordinated through the tracker, so that I get parallelism without
  agents sharing — and re-polluting — each other's context.
- As a harness user running an issue AFK, I want a dynamic `verifier` gate that builds and runs the
  app against the acceptance criteria's observable behavior, so that I catch integration/app-level
  regressions that static review and unit tests miss.
- As a harness user, I want `verifier` to skip when the acceptance criteria declare no observable
  behavior (doc edit, pure refactor), so that the gate never blocks on un-runnable changes.
- As a harness user running an issue AFK, I want path-level spec errors fixed autonomously (the
  Orchestrator re-enters think/prd/issues and re-stamps), so that complex tasks don't stop on every
  wrinkle.
- As a harness user, I want goal-level changes and ambiguity to escalate to me, so that an AFK agent
  can never Goodhart "done" by editing its own acceptance criteria.
- As a harness user, I want onboarding to interview my project as deeply as needed and record how to
  verify, how/whether to run tests, and how to lint, so that forks have the project knowledge they
  can't pause to ask for.
- As a harness user, I want onboarding to scaffold project-local Skills/Agents (lint, test, qa) from
  its interview, so that project-specific procedure lives as composable Skills, not baked into a
  persona.
- As a harness user, I want any config-consuming skill to stop and send me to onboarding when my
  project is un-onboarded or its config is stale, so that no fork ever runs with wrong or missing
  project knowledge.
- As a harness user whose harness updated, I want stale project config detected by missing schema
  keys and a partial re-onboard that asks only the gaps, so that drift is cheap to repair.
- As a harness user, I want one tracker (local `docs/work/`) and the harness's own triage labels
  with no per-project choice, so that every project shares one substrate and skills target one
  contract with no abstraction layer.

## Implementation decisions

- **Coordination is the tracker, never messaging.** Forks return conclusions to the Orchestrator;
  cross-issue state lives in `docs/work/`. No peer SendMessage — messaging would re-pollute the
  contexts isolation exists to keep clean. Parallelism = N independent forks, each its own worktree
  (exclusive lock).
- **The Orchestrator is a role, not new machinery.** No workflow engine; the main session reads the
  tracker and dispatches. Honors the grand-engine ban.
- **Config schema is single-source** — one manifest enumerating required keys and what each gates.
  Missing key serves as both the "not onboarded" and "stale-by-addition" signal, driving partial
  re-onboard. A semantic-drift version int and a SessionStart advisory hook are deferred until that
  drift bites (lean-first).
- **The onboarding gate is a shared `check-onboarded` script** (mirrors the existing plugin-fresh
  check), called at step 0 by config-consuming skills; absent/stale config stops the skill with
  "run onboard". think/prototype/onboard/caveman are exempt.
- **`verifier` earns its slot by the stance+tools test** (dynamic: builds/runs the app, full
  Bash/Write) — not a persona. Conditional on acceptance criteria declaring observable behavior.
  Verify *procedure* is a project-local Skill `verifier` loads; declarative knobs are config.
- **tdd is config-gated** (`tdd-applies`), no longer unconditional inside execute-issue; default is
  set by onboarding, not on. tdd reads the project's test config and defers to a project test Skill.
- **Spec mutation is graded on "does done change for the human."** Path → Orchestrator amends via
  forked think/prd/issues + re-stamp; goal or ambiguity → escalate HITL. Default to escalate. Every
  autonomous amendment is auditable/revertable via the per-issue worktree + git history.
- **Project-specific procedure is a Skill, declarative knobs are config** (scope×determinism). Rich
  procedure → project-local Skill the global verifier/run/tdd defer to; simple knobs → AGENTS.md
  config block.
- **onboarding reuses new-skill / new-agent** to scaffold the project-local Skills/Agents it
  proposes (single-source; human-confirmed in onboard's existing draft step) — not a bespoke
  generator and not the rejected on-the-fly recruiter.
- **Drop tracker + labels config.** Always local `docs/work/` + harness triage labels; remove the
  choices from onboard and AGENTS.md; the pipeline's tracker contract has no abstraction layer.
- **pipeline.md gains the backward spec-mutation edge, the verifier gate, and an Orchestrator-role
  note** — the graph stays the single source of the architecture.

## Testing decisions

- **`check-onboarded` script is tested** (load-bearing dev script): absent-config stops, complete
  config passes, a config missing a schema key is treated as stale. Red→green per case.
- **scaffold paths are tested** where onboarding instantiates project-local Skills/Agents — the
  scaffold produces valid, non-overwriting output (extends existing scaffold coverage).
- **No unit tests on prompt Skills/Agents** — `verifier`, the gate prose, the onboard interview, and
  the schema manifest are prose contracts, exercised by dogfooding, not unit-tested.
- **Verifier itself is the project-level runtime test** for target projects; the harness only tests
  the dev scripts that wire it.

## Out of scope

- Peer agent-to-agent messaging / agent teams (rejected — re-pollutes isolated contexts).
- A semantic-drift config **version int** and a **SessionStart advisory** drift hook — deferred
  until drift bites.
- Promoting the onboarding gate to a PreToolUse hard-block hook — deferred unless skills are
  observed bypassing the step-0 script.
- GitHub/GitLab tracker integration and per-project label mapping (removed, not rebuilt).
- Persona/expert agents beyond the stance+tools floor (rejected pre-pivot).
- Re-onboard automation beyond schema-gap detection + partial interview (no auto-migration engine).

## Notes

Settled in the think session; grounded in and revising these stances:
`execute-issue-afk-autonomy` (frozen goal / mutable path, verifier gate, tdd config-gated),
`agents-generic-floor` (verifier as 4th agent by the stance+tools test), `forks-never-hitl` (new —
preconditions + onboarding gate), `tracker-always-local` (new — drop tracker/labels),
`conventions-not-personas` (procedure-as-Skill, knobs-as-config). Glossary gained **Orchestrator**
and `verifier`.

Build spine for `issues`: config schema → `check-onboarded` script (+ test) → step-0 gate wired
into the six config-consuming skills → tracker/labels removal → `verifier` agent → execute-issue
verifier gate → execute-issue backward spec-mutation edge → onboard rework (unbounded interview,
scaffolds project-local Skills/Agents, schema-driven partial re-onboard) → tdd config-gating →
pipeline.md graph update. Tracer-bullet ordering: the gate spine is the precondition for the rest.
