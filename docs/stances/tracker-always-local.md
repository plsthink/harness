# Tracker is always local docs/work; labels are always the harness triage roles

**Stance:** The harness always uses the local-markdown tracker (`docs/work/`) and the canonical
harness triage labels (`${CLAUDE_PLUGIN_ROOT}/shared/triage-labels.md`). The per-project `tracker`
and `labels` choices are **removed** from `onboard` and `docs/AGENTS.md` Config. onboard's (now
unbounded) interview spends its questions on **harness-behavior config** instead — verification
method, test command, `tdd-applies`, lint — and on scaffolding project-local skills/agents (via
`new-skill`/`new-agent`) from the answers.

**Why:** A personally-owned, single-user harness never needed GitHub/GitLab tracker integration or
per-project label mapping — that was configurability nobody used. Collapsing to one substrate lets
`prd`/`issues`/`triage`/`execute-issue` target a single tracker contract with **no abstraction
layer** and one fewer drift surface (single-source). The freed interview budget goes to config that
actually changes fork behavior.

**Rejected:** GitHub/GitLab tracker + per-project label mapping (the prior "3 config choices"
model) — unused configurability; folded into the local default. Re-add a tracker abstraction only
if a real multi-tool project ever needs it (lean-first).
