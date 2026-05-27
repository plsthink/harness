# mattpocock-skills — influence record

Source: https://github.com/mattpocock/skills.git   Pinned: per-skill folder **tree hashes** in the
rows below — this record is the source of truth (`~/.agents/.skill-lock.json` is now v3 with empty
`skills{}`, so the lock no longer carries them)   Install: idea-only (re-authored, not vendored)

## What we took — their skill → our skill (+ pinned folder hash)
- grill-me `2a1ad170` + grill-with-docs `2c6aa707` → **think** (MERGED)
- to-prd `d6eff3e9` → **prd**
- to-issues `b38c5aa6` → **issues**
- tdd `75beb303` → **tdd**
- diagnose `43d464d0` → **diagnose**
- improve-codebase-architecture `688c17ec` → **architecture**
- triage `de4f182c` → **triage**
- handoff `7bbb60d6` → **handoff**
- zoom-out `6ecebabd` → **zoom-out**
- write-a-skill `2f252b35` → **new-skill**
- setup-matt-pocock-skills `77638955` → **onboard**
- prototype `c91bdc5d` → **prototype**

## What we dropped (why)
- consolidate-adrs — dropped: renumber/supersede core is moot once stances are
  mutable+unnumbered; hygiene splits to `think` (inline) + `docs-review` (periodic).
- review (in-progress/) — dropped: its two axes already have homes. Spec-conformance review
  is `execute-issue`'s reviewer gate (static review vs acceptance criteria), deliberately bound to
  the issue inside the AFK loop, not a loose skill; correctness/standards review is the `code-review`
  command (incl. ultra multi-agent cloud). A standalone parallel-subagent `review` would duplicate
  both against the single-source/no-duplicate-graph stance.

## Re-diff log
- 2026-05-27 @ upstream HEAD `0288510d`: all 13 pinned took-folder tree hashes still resolve in a
  depth-1 HEAD clone → every adopted skill folder is byte-identical, no changed-pinned-file delta.
  Upstream reorganized skills into category dirs (engineering/productivity/in-progress/…); tree
  hashes are path-independent so the pins stand without re-pin. New upstream skills enumerated and
  triaged: `review` rejected (above); the rest are out of harness scope (in-progress writing-*/teach,
  personal/edit-article+obsidian-vault, deprecated/*) or covered by existing infra
  (git-guardrails-claude-code/setup-pre-commit → enforcement hooks + `${CLAUDE_PLUGIN_ROOT}/shared/git-workflow.md`).
- The installer/`.skill-lock.json` consume-as-is model — dropped: it clobbers edits and has no
  home for cross-skill wiring; owning the logic is the whole point.
- CONTEXT/ADR discipline re-encoded in 3 places + per-project copied templates — dropped: collapse
  into `shared/` single-source.

## Re-diff protocol
The pins are git **tree** hashes of skill folders (content-addressed, path-independent) recorded in
the "What we took" rows above — resolve them directly, do not path-diff, and do not read them from
`~/.agents/.skill-lock.json` (v3, empty `skills{}`).
- `git clone --depth 1` upstream HEAD, then `git cat-file -t <pinned-tree>` per took-folder hash:
  resolves → folder byte-identical, no delta (holds even if upstream moved the path, as the
  category-dir reorg did); MISSING → that folder changed.
- changed "took" folder → evaluate the delta; "dropped" row → ignore (decision stands). Enumerate any
  NEW upstream skills and triage each (adopt / reject-with-reason).
- if adopting: update the "took" row + re-pin its tree hash. Log every re-diff (date + upstream HEAD)
  under "Re-diff log" above, even when it's a real reconciliation — not a solo no-delta entry.
