# mattpocock-skills — influence record

Source: https://github.com/mattpocock/skills.git   Pinned: per-skill folder hashes below (from
`~/.agents/.skill-lock.json` v3)   Install: idea-only (re-authored, not vendored)

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
- The installer/`.skill-lock.json` consume-as-is model — dropped: it clobbers edits and has no
  home for cross-skill wiring; owning the logic is the whole point.
- CONTEXT/ADR discipline re-encoded in 3 places + per-project copied templates — dropped: collapse
  into `shared/` single-source.

## Re-diff protocol
- fetch upstream, diff `<pinned-hash>..HEAD` on the skill paths in `~/.agents/.skill-lock.json`.
- changed file in a "took" row → evaluate; in a "dropped" row → ignore (decision stands).
- if adopting: update the "took" row + re-pin the hash.
