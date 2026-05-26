# caveman — influence record

Source: https://github.com/JuliusBrussee/caveman   Pinned: 655b7d9c5431f822264b7732e9901c5578ac84cf
Install: idea-only (mechanism re-authored, plugin not vendored)

## What we took
- The **2-hook persistence mechanism** → owned thin caveman skill + 2 hooks:
  - SessionStart hook (`src/hooks/caveman-activate.js`) injects the ruleset once.
  - UserPromptSubmit hook (`src/hooks/caveman-mode-tracker.js`) re-injects the active-mode
    reminder every turn → deterministic, no drift (Matt's hookless SKILL drifts on long sessions).
- The **cavecrew agent pattern** → owned `agents/` (investigator/builder/reviewer), terse
  structured output, **no caveman-compression persona**.
- **Plugin mechanics reference:** hooks declared inline in `.claude-plugin/plugin.json`;
  `${CLAUDE_PLUGIN_ROOT}` expands in hook command strings.

## What we dropped (why)
- All compression skills (caveman-compress/review/commit/stats/help) — dropped: overlap the
  reviewer agent / a commit rule in CLAUDE.md / niche.
- MCP shrink server + statusline — dropped: niche, not worth the surface.
- Multi-level filtering (full/ultra/wenyan, `getDefaultMode`) — dropped: hardcode `lite`.

## Re-diff protocol
- fetch upstream, diff `655b7d9c..HEAD` on `src/hooks/*` (the took rows).
- changed hook in a "took" row → evaluate; compression/MCP changes → ignore (decision stands).
- if adopting: update the took row + re-pin.
