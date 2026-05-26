# Decisions are mutable slugged stances, not numbered ADRs

**Stance:** Record decisions as `docs/stances/<slug>.md` — one per file, referenced by stable
slug, edited in place as current truth. No `Status:`, no `Superseded-by:`, no sequential numbers.
Rationale lives in the file; history lives in git. Write gate = hard-to-reverse AND surprising AND
real trade-off (all three).

**Why:** Sequential numbered ADRs with supersede chains created busywork — `consolidate-adrs`
existed largely to renumber and clean up supersede framing. A slug is a permanent id whose content
can change, so editing-in-place needs no renumber and no supersede log. The AND-of-three gate
prevents stance-explosion; the cleanup that remains splits to `think` (inline) + `docs-review`
(periodic), eliminating the dedicated consolidate skill.

**Rejected:** In-file changelogs / supersede chains — caused exactly the renumber cruft we're
escaping; durable reversals become a `Rejected:` line instead.
