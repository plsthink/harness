# Agents are a generic stance/tool floor + project override, not an expert team

**Stance:** Ship 4 generic agents (investigator/builder/reviewer/verifier) as a stance+tools floor.
`execute-issue` + `architecture` prefer a project-local specialist (`.claude/agents/*`) if the
project ships one, else fall back to the floor. Grow the roster deliberately via `new-agent`. No
on-the-fly recruiter, no persona-specialized expert team.

**Why:** The real axis separating agents is stance+tools, not a domain label. `verifier` (the 4th)
earns its slot *by* that test, not against it: dynamic — builds/runs the app, full Bash/Write — a
genuinely different tool boundary and stance ("does it behave?") from `reviewer`'s static read-only
("is the diff correct?"); contrast the rejected `qa`/`ts-expert`, same tools under a label. The
floor grows only when stance+tools actually differ (via `new-agent`). A recruiter is the
agents-that-write-agents loop (bloat); an expert team is the grand engine; persona
specialization adds little on opus 4.7 and most "experts" already exist as skills. The
specialization actually wanted (global good-practice + per-project rules + un-learnable knowledge,
scoped by file/task) is delivered by the conventions layer, which composes additively where a
persona can't (see stance: conventions-not-personas).

**Rejected:** prd-lead/architect/qa/ts-expert team + recruiter + inter-agent messaging — caused
the rejected agents-that-write-agents loop and the grand engine; conventions deliver the need.
