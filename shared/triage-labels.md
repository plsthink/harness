# Triage labels — roles & state machine

Cited by: `triage`, `issues`, `onboard`. Two category roles + five state roles, mapped
to `Type:`/`Status:` lines on each issue (`issue-tracker.md`). A project's `docs/AGENTS.md` maps
these roles onto its tracker's actual labels (the label-mapping config choice).

## Category roles → `Type:`

- **bug** — something is broken vs intended behavior.
- **enhancement** — new/changed capability.

## State roles → `Status:`

- **needs-triage** — just arrived, not yet categorized.
- **needs-info** — blocked pending information from a human.
- **ready-for-agent** — fully specified contract; an AFK agent can grab it (`execute-issue`).
- **ready-for-human** — needs a human to act (judgement, access, decision).
- **wontfix** — declined; the concept moves to `.out-of-scope/<concept>.md`.
- **done** — terminal green state; acceptance criteria met + merged (set by `execute-issue` on the
  green path, or by hand when a human closes the work).

## State machine

```
needs-triage ──┬─→ needs-info ──→ (back to triage when answered)
               ├─→ ready-for-agent ──→ (execute-issue) ──→ done | back to needs-info/ready-for-human
               ├─→ ready-for-human
               └─→ wontfix → out-of-scope
```

## Triage discipline (used by `triage`)

- AI-disclaimer on every comment the agent writes.
- Gather context + check `.out-of-scope/` before recommending.
- Reproduce bugs before stamping.
- Call `think` to flesh out an under-specified issue.
- **"Thought-enough" checklist** before `ready-for-agent`: acceptance criteria are testable,
  deps listed, vertical-slice scoped, no open design questions (the upstream gate for AFK).
