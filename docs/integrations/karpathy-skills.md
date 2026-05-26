# karpathy-skills — influence record

Source: https://github.com/forrestchang/andrej-karpathy-skills   Pinned: 2c606141936f1eeef17fa3043a72095b4765b9c2 (v1.0.0)
Install: idea-only (folded, not vendored)

## What we took
- The **4 behavioral rules** (think-before-coding, simplicity, surgical changes, goal-driven
  verification) → `${CLAUDE_PLUGIN_ROOT}/shared/coding-discipline.md`, owned distillation.

## What we dropped (why)
- The standalone plugin/skill packaging — dropped: it's an always-cited reference, not an
  intent-triggered skill; lives in `shared/` and is cited by tdd/diagnose/architecture/execute-issue.

## Re-diff protocol
- fetch upstream, diff `2c606141..HEAD` on the guidelines content.
- changed rule → evaluate against `shared/coding-discipline.md`; re-pin if adopted.
