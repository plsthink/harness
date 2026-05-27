# 08 — onboard-scaffolds-project-skills-agents

Status: done
Type: enhancement

## What to build
From its interview answers, onboarding scaffolds project-local Skills (lint, test, qa/verify) and
proposes project-local Agents, deferring to new-skill / new-agent for the actual scaffolding and
confirming drafts with the user. These project-local Skills are what the global verifier / tdd / run
defer to.

## Acceptance criteria
- After onboarding a project with a non-trivial verify/test/lint procedure, corresponding
  project-local Skill stubs exist, instantiated via the new-skill mechanism.
- onboarding proposes project-local Agents only where a distinct stance+tools is warranted, via
  new-agent, human-confirmed.
- The scaffolding output is valid and non-overwriting (covered where scaffold paths are exercised).
- The global verifier / tdd resolve to these project-local Skills when present.

## Blocked by
- 07

## Comments
