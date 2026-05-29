---
name: new-agent
description: Grow the agent roster deliberately — the only sanctioned way to add an agent (no on-the-fly recruiter). Scaffolds a flat, thin agent prompt from the template, bound to a distinct stance+tools. Use when the user wants to add or create a new subagent.
---

# new-agent

The curated path to add an agent (sibling to `new-skill`). The generic agents are a stance/tool
**floor** — add a new agent only when a distinct **stance+tools** is genuinely needed, not a
persona label (see stance: agents-generic-floor).
Enforce `${CLAUDE_PLUGIN_ROOT}/shared/authoring-standard.md` (flat single `.md`, no per-agent
references/, no `model:` frontmatter, terse output, detail cited from `shared/`).

## When to fire
- User wants to add / create a new subagent.

## Procedure

1. **Justify the agent.** What distinct stance + tool set does it need that the floor lacks? If the
   need is good-practice-by-file-type, it's a **convention**, not an agent (see stance:
   conventions-not-personas) — route there instead. If it's project-specific, prefer a
   project-local `.claude/agents/*` override over a global agent.
2. **Scaffold** from `templates/agent.md` via `templates/scaffold.sh` — pass the single-line
   frontmatter keys (name, description = what + "Use when [triggers]", `tools:` least-privilege).
   Then **author the body into the file** (role one-liner, output shape, procedure): a multi-line
   procedure can't be a `scaffold.sh` KEY (single-line `sed`), so write it into the scaffolded file's
   `## Procedure` rather than passing it as KEY=VALUE.
   **Target:** the global roster (`agents/<name>.md`) or — for a project-specific agent (e.g.
   `onboard` proposing one) — a **project-local** `.claude/agents/<name>.md` dest (same template,
   same `scaffold.sh`, non-overwriting). The project-local file overrides the floor (see stance:
   agents-generic-floor).
3. **Keep it thin.** Any detail that would bloat the prompt → cite `${CLAUDE_PLUGIN_ROOT}/shared/...`.
   No `model:` frontmatter (inherit parent).
4. **Wire dispatch:** auto-dispatch is keyed to a floor ROLE NAME — a project-local agent is picked
   only when its filename overrides a floor role (`builder`/`reviewer`/`verifier` for `execute-issue`,
   `investigator` for `architecture`); a net-new name is reachable only by explicit @-mention. So for
   AFK auto-dispatch, name the file after the floor role it replaces. Note which skill(s) dispatch it
   + whether it's the floor or a project-local override.

## Pipeline
- Reads:  `${CLAUDE_PLUGIN_ROOT}/shared/authoring-standard.md`; `templates/agent.md`
- Writes: `agents/<name>.md` (global) **or** project-local `.claude/agents/<name>.md`
- Next:   (the skill that dispatches the new agent)
