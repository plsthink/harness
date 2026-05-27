# Forks never do HITL; every fork input is a precondition, onboarding is the gate

**Stance:** Forks (the `execute-issue` subagents — builder/reviewer/verifier — and any skill run in
a fork) are **non-interactive**: they cannot pause for the human. All HITL lives at the
**orchestrator** (the clean main session the user drives). Therefore every input a fork needs —
project config (test command, `tdd-applies`, verify method, lint, conventions) — must be a
**precondition guaranteed before dispatch**. A fork hitting missing/ambiguous config **escalates to
the orchestrator** (the graded channel of stance: execute-issue-afk-autonomy), never guesses and
never asks.

**Onboarding is the hard gate** that guarantees those preconditions. Config-consuming skills
(`execute-issue`, `tdd`, `verifier`, `issues`, `prd`, `triage`) check a **config-completeness
marker at step 0** and stop with "run `onboard`" when it is absent or stale. Exempt — must run
pre-onboarding: `onboard`, `think`, `prototype`, `caveman` (`think` stays in plain interview mode,
no doc-surgery, until onboarded). Completeness + drift are detected via a **single-source schema of
required config keys** shipped in `shared/` (a missing key = incomplete *or* stale-by-addition, and
drives a **partial** re-onboard that asks only the gaps). A version int (for *semantic* drift a key
rename can't show) and a `SessionStart` advisory hook (mirroring `check-plugin-fresh.sh`) are added
**only when drift actually bites** — lean-first.

**Why:** Context isolation is the whole point of the orchestrator/fork split — a clean session
yields better per-fork output. A fork that could HITL would either block the AFK loop or pull human
context into the child, defeating the isolation. Making config a precondition keeps every fork a
pure function of (task + config). Onboarding-as-gate stops a fork silently running on wrong/absent
project knowledge (running tests a project lacks, or skipping QA it needed). A schema beats a bare
version int: it names *what* drifted and enables partial re-onboard instead of a full redo.

**Rejected:** Lazy in-fork capture ("ask once on first use, then record") — impossible, the fork
can't HITL; the ask moves up to the orchestrator/onboard boundary. Blanket "harness stops until
onboarded" — deadlocks (can't onboard, can't think-first); the gate is **scoped** to
config-consuming skills. A PreToolUse hard-block hook now — heavier than a step-0 check; promote
only if skills are seen forgetting the check (hooks sparingly, per stance: conventions-not-personas).
