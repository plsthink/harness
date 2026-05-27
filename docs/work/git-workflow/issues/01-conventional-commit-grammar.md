# 01 — conventional-commit-grammar

Status: done   <!-- see triage-labels.md state roles -->
Type: enhancement       <!-- bug|enhancement -->

## What to build
Conventional-commit grammar defined once and enforced deterministically across every project the
harness drives. Create the product git-workflow module with its commit-grammar section: the
canonical type set (feat, fix, refactor, docs, chore, test, perf, build, ci, revert) with a small
map from harness artifact kinds to those types (a new skill or agent is a feat; a PRD, issues, or a
stance is docs; tooling and scaffolding are chores); the scope grammar (an OPTIONAL lowercase
area/domain token — e.g. auth, client, execute-issue, hooks — omittable so a bare `feat: …` is
valid, and NEVER a prd or issue number, since those are deletable and would dangle in permanent
history); the subject rules (present tense, no leading capital, bounded length ≤72); the
spec-amendment variant (a fix-typed commit identified by an `amend spec` marker in the subject,
greppable via the subject, with NO issue trailer); and the one-clean-conventional-commit-per-task
expectation for the builder.

Build a commit-message validator and ship it as a product pre-action hook that intercepts a commit
as it is issued, extracts the message, validates it against the grammar, and on a violation blocks
with a **self-contained corrective message** — the message itself states the full grammar (type set,
scope rule, subject rules), gives a correct example, and echoes the rejected message — so that even
an agent that never loaded a harness skill learns the rule reactively and self-corrects in the same
turn (this block message is the sole discovery surface for the universal hook). The validator
checks scope *format* (lowercase token) only, never membership against a list. The validator and
hook live in the product resolution root (reachable from any project), never under the dogfood docs
root; the validator's pinned self-test lives under the dogfood scripts root and is path-gated to run
when the validator or its test is edited. Wire the hook into the plugin manifest so it reaches every
target project with no per-project install. Update the builder agent to cite the grammar and the
one-commit-per-task expectation.

## Acceptance criteria
- The product git-workflow module exists in the product resolution root with a commit-grammar
  section covering: canonical type set, artifact→type map, the optional-domain scope rule (no
  prd/issue numbers), subject rules, the spec-amendment variant, and one-commit-per-task.
- A commit whose message conforms to the grammar passes the hook unmodified — including a bare type
  with no scope (`feat: …`) and a domain-scoped commit (`feat(auth): …`).
- A commit whose message violates the grammar is blocked, and the block message is self-contained:
  it states the full grammar, gives a correct example, echoes the rejected message, and names the
  specific violation (unknown/missing type, malformed scope, leading capital, past tense,
  over-length subject).
- A spec-amendment-variant message (`fix(<scope>): amend spec — …`, no issue trailer) passes and is
  greppable by the `amend spec` subject marker.
- The validator checks scope format (lowercase token) only, not membership against any list.
- The validator and its hook resolve from the product root (not the dogfood docs root); the
  validator's self-test resides under the dogfood scripts root and is path-gated into the repo's own
  settings so editing the validator or its test runs the test in the same turn.
- The self-test drives the validator with fixtures and asserts pass for a conforming message (with
  and without a scope), block-with-reason for each violation class above, and accept for the
  amendment variant; it runs against fixtures, never the real tree, and passes.
- The hook is registered in the plugin manifest as a product pre-action hook on commit.
- The builder agent cites the product module's grammar and the one-commit-per-task expectation.
- The reference-integrity check passes; every new citation to the product module resolves.

## Blocked by
- None — can start immediately.

## Comments
<!-- AI-disclaimer on every agent comment -->
