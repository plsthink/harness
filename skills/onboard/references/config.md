# Onboard — the 3 config choices

Loaded by `onboard` step 2. Walk these one at a time, each with a short explainer. Defaults below.

## A — Issue tracker
Where issues live; `issues`/`triage`/`prd`/`execute-issue` read+write it. Default posture: if a
`git remote` points at GitHub → propose GitHub (`gh` CLI); GitLab → GitLab (`glab` CLI); else
**local-markdown** `docs/work/<feature>/` (good for solo/no-remote — the harness default). "Other"
(Jira/Linear) → record the workflow as freeform prose. The file shape
(`${CLAUDE_PLUGIN_ROOT}/shared/issue-tracker.md`) is the same regardless; only publish/fetch differ.

## B — Triage label vocabulary
The 5 canonical state roles + 2 category roles
(`${CLAUDE_PLUGIN_ROOT}/shared/triage-labels.md`). Default: each role's string = its name. If the
tracker already uses different label names, map them so `triage` applies the right ones instead of
creating duplicates.

## C — Domain context layout
- **Single-context** — one `docs/CONTEXT.md` + `docs/stances/` at root. Most repos.
- **Multi-context** — `docs/CONTEXT-MAP.md` routing to per-package `docs/CONTEXT.md` (monorepo).
Work substrate stays at **repo root** either way; only domain docs fan out.

## What gets written
`docs/AGENTS.md` records all three under its Config section. Conventions: seed an empty
`docs/conventions/INDEX.md` (delta over `${CLAUDE_PLUGIN_ROOT}/conventions/`, fills on friction).
