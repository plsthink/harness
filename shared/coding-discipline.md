# Coding discipline — the 4 rules

Cited by: `tdd`, `diagnose`, `execute-issue`, and the `builder` + `verifier` agents. Owned distillation of the
karpathy guidelines. An always-cited reference, **not** a glob-routed convention.

## The 4 rules

1. **Think before coding.** State the assumptions and the plan first. Surface what you're unsure
   of. Don't start editing until the approach is clear and (where it matters) approved.
2. **Simplicity.** Prefer the smallest design that works. No speculative abstraction, no
   premature generality. Complexity must earn its place.
3. **Surgical changes.** Touch only what the task needs. Don't refactor adjacent code, rename
   unrelated things, or reformat untouched lines. Minimal, reviewable diffs.
4. **Goal-driven verification.** Define what "done/correct" means as a checkable criterion
   *before* building, then verify against it — don't declare success on vibes. A check counts only
   if you *observed* it exercise the goal: a test that never ran (a "0 tests" green — no file
   discovered) or that failed/passed for an unrelated reason (a wiring/import error, not the
   behavior) is a false signal, not verification.

## Application

- `tdd`: rule 1 = the planning step; rule 4 = the failing-test-first contract.
- `diagnose`: rule 4 = the deterministic reproduction loop; rule 3 = one variable at a time.
- `execute-issue`: builder subagents are bound by rule 3 (minimal diff) + rule 4 (acceptance
  criteria), not by a file-count rule.
