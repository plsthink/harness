# Writing an agent brief

An agent brief is a `ready-for-agent` issue filled to the quality bar an AFK agent can run from
unattended — the contract it works from, not the original report or discussion (those are context).
The brief **is** the issue body, shaped per `${CLAUDE_PLUGIN_ROOT}/shared/issue-tracker.md`.

## Principles

### Durability over precision

The issue may sit in `ready-for-agent` for days or weeks while the codebase changes. Write the brief
so it stays useful as files are renamed, moved, or refactored.

- **Do** describe interfaces, types, and behavioral contracts; name specific types, function
  signatures, or config shapes the agent should look for or modify.
- **Don't** reference file paths or line numbers — they go stale.
- **Don't** assume the current implementation structure will remain the same.

### Behavioral, not procedural

Describe **what** the system should do, not **how** to implement it — the agent explores the
codebase fresh and makes its own implementation decisions.

- **Good:** "The `SkillConfig` type should accept an optional `schedule` field of type `CronExpression`"
- **Bad:** "Open src/types/skill.ts and add a schedule field on line 42"
- **Good:** "When a user runs `/triage` with no arguments, they should see a summary of issues needing attention"
- **Bad:** "Add a switch statement in the main handler function"

### Complete, testable acceptance criteria

The agent needs to know when it's done. Every brief needs concrete acceptance criteria, one
independently-verifiable bar per line.

- **Good:** "Running `gh issue list --label needs-triage` returns issues that have been through initial classification"
- **Bad:** "Triage should work correctly"

### Explicit scope boundaries

State what is **out of scope** — what must NOT change — so the agent doesn't gold-plate or assume
adjacent features are in play. The canonical shape has no dedicated section for this; put it in
`## What to build`.

## Filling the canonical sections

- **`Type:`** — `bug` | `enhancement`.
- **`## What to build`** — the behavioral spec, in three beats: **now** (for a bug, the broken
  behavior; for an enhancement, the status quo it builds on), **should** (the target behavior,
  including edge cases and error conditions), and the **key interfaces** (types/signatures/config
  shapes to look for or modify, named — never by path/line). Close with the scope boundaries.
- **`## Acceptance criteria`** — the testable contract (see the principle above).
- **`## Blocked by`** — blocking issue ids in dependency order, per the canonical shape.

## Examples

### Good agent brief (bug)

```markdown
# 07 — skill-description-truncation

Status: ready-for-agent
Type:   bug

## What to build
**Now:** when a skill description exceeds 1024 characters it is truncated at exactly 1024 chars
regardless of word boundaries, producing descriptions that end mid-word (e.g. "Use when the user
wants to confi").
**Should:** truncation breaks at the last word boundary before 1024 chars and appends "..." to mark
truncation.
**Key interfaces:** `SkillMetadata.description` needs no type change, but the validation/processing
logic that populates it must respect word boundaries — touch whatever reads SKILL.md frontmatter and
extracts the description.
**Out of scope:** the 1024-char limit itself; multi-line description support.

## Acceptance criteria
- [ ] Descriptions under 1024 chars are unchanged
- [ ] Descriptions over 1024 chars truncate at the last word boundary before 1024 chars
- [ ] Truncated descriptions end with "..."
- [ ] Total length including "..." does not exceed 1024 chars

## Blocked by
- None — can start immediately
```

### Good agent brief (enhancement)

```markdown
# 12 — out-of-scope-kb

Status: ready-for-agent
Type:   enhancement

## What to build
**Now:** when a feature request is rejected it is closed with a `wontfix` label and a comment; there
is no persistent record of the decision, so future similar requests force the maintainer to recall
or search the prior discussion.
**Should:** rejected feature requests are documented in `.out-of-scope/<concept>.md` files capturing
the decision, reasoning, and links to all issues that requested the feature; triage checks these for
matches against new issues.
**Key interfaces:** the `.out-of-scope/` markdown file format — each file has a `# Concept Name`
heading, a `**Decision:**` line, a `**Reason:**` line, and a `**Prior requests:**` list of issue
links; the triage flow reads all `.out-of-scope/*.md` early and matches incoming issues by concept
similarity.
**Out of scope:** automated matching (a human confirms the match); reopening rejected features; bug
reports (only enhancement rejections are recorded).

## Acceptance criteria
- [ ] Closing a feature as wontfix creates/updates a file in `.out-of-scope/`
- [ ] The file includes the decision, reasoning, and link to the closed issue
- [ ] A matching existing file gets the new issue appended to its "Prior requests" list rather than
      a duplicate
- [ ] During triage, existing `.out-of-scope/` files are checked and surfaced when a new issue
      matches a prior rejection

## Blocked by
- None — can start immediately
```

### Bad agent brief

```markdown
# 19 — fix-triage

Status: ready-for-agent
Type:

## What to build
The triage thing is broken. Look at the main file and fix it — the function around
src/triage/handler.ts line 150 has the issue, and src/types.ts line 42.
```

This is bad because:
- No `Type`
- Vague spec ("the triage thing is broken") — no current-vs-desired behavior
- References file paths and line numbers that go stale
- No acceptance criteria, so the agent can't tell when it's done
- No scope boundaries
