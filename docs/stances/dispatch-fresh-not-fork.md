# Dispatch fresh subagents with a thin pointer-brief, not context-inheriting forks

**Stance:** `execute-issue` dispatches each builder/reviewer/verifier as a **fresh subagent**
(clean context), briefed by a **thin pointer-template** that *references* on-disk artifacts (the slots of
`${CLAUDE_PLUGIN_ROOT}/shared/dispatch-brief.md`) — it
**never copies their content**. This replaces the
prior context-inheriting fork (`CLAUDE_CODE_FORK_SUBAGENT`). Because each child's context is now
`(thin brief + what it reads from disk)` and independent of parent size, **the orchestrator session
may grow long without degrading children**. Spec amendments (the backward edge) are authored
**inline by the orchestrator** and **written back to the issue file**, then re-dispatched via the
same thin brief — no fork, no second source of truth.

**Why:** The fork model claimed "full fidelity, no lossy recap," but subagents-never-hitl already
requires each child to be **a pure function of (task + config)**, every input a precondition
guaranteed before dispatch. If that holds, inheritance buys nothing — all the child needs is on
disk (PROJECT.md's filesystem-contract constraint). If inheritance is load-bearing, it is a
**contract leak**: the child secretly depends on un-written parent conversation state — fragile and
invisible. Context-inheritance is the conversational form of the code-coupling PROJECT.md forbids;
fresh dispatch **forces** the issue/brief to be complete, and the template is that precondition
*serialized and policed* (a missing pointer fails dispatch → orchestrator fixes the brief, not the
child). The fork's cost also compounds: "orchestrator holds no per-fork output" is a discipline, not
a mechanism — it still accrues decomposition + per-task summaries + its own reasoning, so late-task
forks inherit a heavier parent. Fresh dispatch removes parent size as a quality variable entirely.
Amendments live in the **issue file** because `reviewer`/`verifier` are separate fresh subagents
that read the issue from disk; an amendment carried only in the builder's brief would have builder
and reviewer gating **different specs** — silent divergence. Fat-brief smell — dispatch-brief.md.

**Rejected:** Context-inheriting forks (the prior model) — coupling + compounding parent bloat,
above. Keep a fork only for the backward-edge amend — keeps a dual spawn model alive for one edge;
the amend is interactive/HITL-bearing with no sibling-isolation benefit, so the orchestrator runs it
inline. Amendment as a sidecar delta in the spawn brief — two sources of truth; reviewer/verifier
read the stale issue → silent spec divergence.

**Relationship to subagents-never-hitl:** that stance owns the non-interactivity + onboarding-gate
principle; this stance owns the spawn mechanism (fresh dispatch via the thin brief, replacing the
prior context-inheriting fork).
