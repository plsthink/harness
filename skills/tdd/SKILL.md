---
name: tdd
description: Test-driven development with a red-green-refactor loop, one test → one implementation at a time (vertical tracer bullets, never all-tests-then-all-code). Tests verify behavior through public interfaces. Use when the user wants to build a feature or fix a bug test-first, mentions "red-green-refactor", or wants integration-style tests.
---

# tdd

Vertical TDD: plan → one tracer test → minimal code → incremental one-test-one-code loop → refactor
only when green. Tests verify **behavior through public interfaces**, never implementation detail.
Bound by `${CLAUDE_PLUGIN_ROOT}/shared/coding-discipline.md` (think-first, minimal diff,
goal-driven verification).

## When to fire
- User wants to build a feature or fix a bug test-first / red-green-refactor / integration tests.

## Procedure

1. **Plan.** Confirm the interface changes needed + which behaviors to test (prioritize — you
   can't test everything). Design interfaces for testability and hunt deep modules
   (`${CLAUDE_PLUGIN_ROOT}/shared/deep-modules.md`); for surface/return-vs-side-effect/DI guidance
   read [interface-design.md](references/interface-design.md). List behaviors (not impl steps).
   **Get user approval on the plan** when interactive. Running AFK inside `execute-issue`, the
   `ready-for-agent` issue's acceptance criteria *are* the approved plan (the gate is upstream —
   stance: execute-issue-afk-autonomy); don't block on an absent user. Respect stances in the
   touched area, and consult the conventions INDEX before editing — load convention docs matching
   the files you'll touch (`${CLAUDE_PLUGIN_ROOT}/conventions/INDEX.md` global + project
   `docs/conventions/INDEX.md`; project wins), as `builder` does.
2. **Tracer bullet.** Write ONE test for ONE behavior → it fails (RED) → minimal code → passes
   (GREEN). Proves the path end-to-end. **RED must be observed, not assumed:** confirm the new test
   actually ran and failed for the behavior — coding-discipline rule 4's observed-verification bar
   (bound above), which names the failure modes to rule out. What makes a
   good vs bad test: [tests.md](references/tests.md). Mocking questions (boundaries only):
   [mocking.md](references/mocking.md).
3. **Incremental loop.** For each remaining behavior: RED (next test) → GREEN (minimal code).
   One test at a time; only enough code to pass; don't anticipate future tests. **Never write all
   tests then all code** (horizontal slicing → tests of imagined behavior).
4. **Refactor only when green.** Look for [refactor candidates](references/refactoring.md)
   (duplication, shallow modules, feature envy). Run tests after each step. Never refactor while RED.

Read/append this skill's learnings in `docs/work/learnings/tdd.md` per the convention (`${CLAUDE_PLUGIN_ROOT}/shared/learnings.md`).
A missing seam needed for a test is itself a finding — report it, don't fabricate one.

## Pipeline
- Reads:  `docs/work/<feature>/issues/NN-slug.md` (acceptance criteria); code; `docs/stances/*`;
          `docs/work/learnings/tdd.md`
- Writes: tests + implementation; `docs/work/learnings/tdd.md`
- Next:   handoff (compact for another agent) | diagnose (if a hard bug surfaces)
