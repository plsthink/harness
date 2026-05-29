# Stance format (ex-ADR)

Cited by: `think`, `architecture`, `onboard`, `docs-review` (think/architecture record a stance, onboard reshapes migrated ADRs into this format, docs-review is the periodic sweep that checks docs against this spec; consumers cite the project's `docs/stances/*`, not this format spec). A stance is a decision
recorded as **current truth**, not a log.

## Format

- One stance per file: `docs/stances/<slug>.md`. Referenced by **stable slug**:
  `see stance: <slug>`. Slug = the permanent id; content is editable.
- Each stance = current truth, **edited in place**. **No `Status:`, no `Superseded-by:`.**
- **Rationale lives in the file** — a stance without its why is just an order.
- **History lives in git** (`git log -p` / `git blame` on the slug file) — no in-file changelog
  (that re-introduces the supersede-chain cruft we're escaping).

Field layout (`${CLAUDE_PLUGIN_ROOT}/templates/docs/stance.md` scaffolds it):
```
# <stance title>

**Stance:** <positive declarative truth>
**Why:** <rationale>
**Rejected:** <alternative> — <consequence>   (durable reversals only; optional)
```

## Durable reversals

"Tried X, broke Y, don't go back" = a forward-looking constraint, not a log entry. Capture as a
`Rejected: X — caused Y` line in the stance, or promote to PROJECT hard-constraints / CONTEXT
`_Avoid_`. `docs-review` enforces this.

## Write gate (used by `think`) — AND of three

Offer a stance only when a decision is **hard-to-reverse AND surprising AND carries a real
trade-off** — all three. Prevents stance-explosion. Renames, build-order, and routine choices are
NOT stances. `docs-review` prunes/merges what slips through.

## Maintenance (no dedicated consolidate skill)

- `think` keeps stances clean **incrementally** at write-time (edit the one stance the current
  work touches).
- `docs-review` does the **periodic** cross-doc pass: dedupe, merge overlapping stances, propagate
  slug refs, move retired terms to CONTEXT `_Avoid_`, prune bloat.
