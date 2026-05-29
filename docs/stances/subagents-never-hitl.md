# Subagents never do HITL; every input is a precondition, onboarding is the gate

**Stance:** Dispatched subagents (the `execute-issue` children — builder/reviewer/verifier — and any
skill run as a dispatched subagent) are **non-interactive**: they cannot pause for the human. All
HITL lives at the **orchestrator** (the clean main session the user drives). Therefore every input a
child needs — project config (test command, `tdd-applies`, verify method, lint, conventions) — must
be a **precondition guaranteed before dispatch**. A child hitting missing/ambiguous config
**escalates to the orchestrator** (the graded channel of stance: execute-issue-afk-autonomy), never
guesses and never asks.

**Onboarding is the hard gate** that guarantees those preconditions. Config-consuming skills
(`execute-issue`, `tdd`, `verifier`, `issues`, `prd`, `triage`) check a **config-completeness
marker at step 0** and stop with "run `onboard`" when it is absent or stale. Exempt — must run
pre-onboarding: `onboard`, `think`, `prototype`, `caveman` (`think` stays in plain interview mode,
no doc-surgery, until onboarded). Completeness + drift are detected via a **single-source schema of
required config keys** shipped in `shared/` (a missing key = incomplete *or* stale-by-addition, and
drives a **partial** re-onboard that asks only the gaps). A version int (for *semantic* drift a key
rename can't show) and a `SessionStart` advisory hook (mirroring `check-plugin-fresh.sh`) are added
**only when drift actually bites** — lean-first.

**Why:** Context isolation is the whole point of the orchestrator/child split — a clean session
yields better per-child output. A child that could HITL would either block the AFK loop or pull
human context into the child, defeating the isolation. Making config a precondition keeps every
child a pure function of (task + config). Onboarding-as-gate stops a child silently running on
wrong/absent project knowledge (running tests a project lacks, or skipping QA it needed). A schema
beats a bare version int: it names *what* drifted and enables partial re-onboard instead of a full
redo.

**Rejected:** Lazy in-child capture ("ask once on first use, then record") — impossible, the child
can't HITL; the ask moves up to the orchestrator/onboard boundary. Blanket "harness stops until
onboarded" — deadlocks (can't onboard, can't think-first); the gate is **scoped** to
config-consuming skills. A PreToolUse hard-block hook now — heavier than a step-0 check; promote
only if skills are seen forgetting the check (hooks sparingly, per stance: conventions-not-personas).

**Relationship to dispatch-fresh-not-fork:** that stance's thin brief makes "every input a
precondition" literal — strengthening this stance, which owns the non-interactivity +
onboarding-gate principle, mechanism-neutral.
