# Learnings — compounding convention

Cited by: `tdd`, `issues`, `docs-review`, `diagnose`. Lightweight, curated —
**not** an autonomous "skills that write skills" loop (rejected as bloat-prone). Learnings =
intake; conventions = curated output.

## Convention (read-before / append-after)

A heavy skill, when it runs:
1. **Reads** `docs/work/learnings/<skill>.md` (if present) before starting — applies prior notes.
2. **Appends** a curated one-line note after, only when something genuinely re-usable was learned.

Storage is **project-local episodic intake only** — `docs/work/learnings/<skill>.md`. **No global
per-skill learnings file** (global durable knowledge = deliberately-authored conventions).

## Anti-explosion

- **Size cap** per file; prune on overflow.
- **Promotion pass** lifts durable learnings into conventions/stances, then prunes the raw note.

## Promotion ladder

```
raw learning (project docs/work/learnings/<skill>.md)
  → project convention (project docs/conventions/)        [within-project promotion]
  → harness global convention (top-level conventions/)    [cross-project promotion]
```

Cross-project promotion is **manual now** (an assist-skill later, once enough projects exist),
gated by the **promotion test** — promote to harness only if the rule is:
1. project-agnostic,
2. validated in >1 project or clearly universal,
3. something opus gets wrong/random without it.
