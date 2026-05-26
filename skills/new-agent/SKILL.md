---
name: new-agent
description: Grow the agent roster deliberately — the only sanctioned way to add an agent (no on-the-fly recruiter). Scaffolds a flat, thin agent prompt from the template, bound to a distinct stance+tools. Use when the user wants to add or create a new subagent.
---

# new-agent

The curated path to add an agent (sibling to `new-skill`). The 3 generic agents
(investigator/builder/reviewer) are a stance/tool **floor** — add a new agent only when a distinct
**stance+tools** is genuinely needed, not a persona label (see stance: agents-generic-floor).
Enforce `${CLAUDE_PLUGIN_ROOT}/shared/authoring-standard.md` (flat single `.md`, no per-agent
references/, no `model:` frontmatter, terse output, detail cited from `shared/`).

## When to fire
- User wants to add / create a new subagent.

## Procedure

1. **Justify the agent.** What distinct stance + tool set does it need that the floor lacks? If the
   need is good-practice-by-file-type, it's a **convention**, not an agent (see stance:
   conventions-not-personas) — route there instead. If it's project-specific, prefer a
   project-local `.claude/agents/*` override over a global agent.
2. **Scaffold** from `templates/agent.md` via `templates/scaffold.sh`: name, description (what +
   "Use when [triggers]"), `tools:` (least-privilege), role one-liner, output shape, thin procedure.
3. **Keep it thin.** Any detail that would bloat the prompt → cite `${CLAUDE_PLUGIN_ROOT}/shared/...`.
   No `model:` frontmatter (inherit parent).
4. **Wire dispatch:** note which skill(s) dispatch it (e.g. `execute-issue`, `architecture`) and
   how it's selected (floor vs project-local override).

## Pipeline
- Reads:  `${CLAUDE_PLUGIN_ROOT}/shared/authoring-standard.md`; `templates/agent.md`
- Writes: `agents/<name>.md`
- Next:   (the skill that dispatches the new agent)
