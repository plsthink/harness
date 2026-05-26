---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up. Use when the user wants to hand off work, end a session with continuity, or says "write a handoff".
argument-hint: "What will the next session be used for?"
---

# handoff

Write a handoff doc so a fresh agent can continue. Save to the **OS temp dir, never the workspace**.

## When to fire
- User wants to hand off / pause work with continuity, or says "handoff".

## Procedure

1. Summarize the current conversation: goal, state, what's done, what's next, open questions.
2. Add a **"suggested skills"** section pointing at the skills the next agent should invoke
   (consult `${CLAUDE_PLUGIN_ROOT}/shared/pipeline.md` for the chain).
3. **Reference artifacts by path/URL** (PRDs, plans, stances, issues, commits, diffs) — do not
   duplicate their content.
4. **Redact secrets** (API keys, passwords, PII).
5. If args were passed, treat them as the next session's focus and tailor the doc.
6. Write to `$TMPDIR` (fallback `/tmp`); tell the user the absolute path.

## Pipeline
- Reads:  conversation; referenced artifacts (by path)
- Writes: handoff doc in OS temp dir
- Next:   (whatever the suggested-skills section points to)
