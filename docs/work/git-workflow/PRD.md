# git-workflow — PRD

<!-- Synthesised from conversation. Vocabulary from the glossary.
     No file paths / code. No Status (a per-issue field). Publish when the design has converged. -->

## Problem
The harness's autonomous execution loop lands each issue branch with a no-fast-forward merge, so
every issue adds a merge-bubble commit to the trunk. The history is noisy and the real change graph
is obscured. Separately, commit messages across the harness (and every target project it drives)
are ad-hoc and inconsistent — past-tense, capitalized, no shared grammar, no machine-readable link
to the sub-package or the issue that motivated the change. There is also no defined home for the
per-issue worktrees the loop creates, leaving placement to chance and risking collisions with the
project tree the harness scans. The user wants a clean, linear, conventional history and a
predictable worktree home, applied as **product** behavior across all projects, not just this repo.

## Solution
Adopt a single product git-workflow discipline, sourced once and reachable from any project:

- **Linear landing.** Issue branches land by rebasing onto their base and fast-forwarding — no
  merge commit. The audit trail of spec-amendment commits survives as distinct, revertable commits
  on the linear trunk.
- **Conventional commits.** Every commit follows `<type>(<scope>): <subject>` with a canonical type
  set and an OPTIONAL scope naming the area/domain of the change (auth, client, …) — never a prd or
  issue number, which are deletable and would dangle in permanent history. Present tense, no leading
  capital. A spec-amendment is a recognizable, greppable variant.
- **Discoverable by getting blocked.** The enforcement hook is universal (every agent commit, any
  project), but the grammar spec is only loaded when a skill cites it — so the hook's block message
  is itself self-teaching (full grammar + a correct example + the rejected message), the sole
  discovery surface for an agent that never invoked a harness skill.
- **Worktree home.** The loop creates per-issue worktrees in a central harness-owned location
  outside the target project tree, so no scan path or parent dir is polluted.
- **Deterministic enforcement.** A product hook intercepts commits as they are made and blocks a
  malformed message with a corrective reason, so the agent self-corrects in the same turn.
- **Pipeline skills commit their output.** The artifact-producing skills (think, prd, issues)
  commit what they publish, so the execution loop can be invoked in a fresh session against a clean
  tree and its worktree inherits a fully-committed spec substrate.

This is recorded by two stances (linear landing; out-of-tree worktree home) and one product module
that is the single source for the procedure and grammar, cited by the execution loop, the builder
agent, and any commit-making skill.

## User stories
- As a maintainer reading the trunk, I want each issue to land as a fast-forward with no merge
  bubble, so that the history is linear and the change graph is readable at a glance.
- As a maintainer auditing an autonomous run, I want every spec-amendment commit preserved as a
  distinct, revertable commit on the trunk, so that the backward-edge audit trail the execution loop
  promises is not collapsed by the landing strategy.
- As an agent landing a branch, I want one unambiguous land procedure (rebase onto base, then
  fast-forward, run from the main checkout), so that I never produce a merge bubble or self-merge
  from inside the worktree.
- As a developer scanning the log, I want every commit to start with a conventional type, so that I
  can filter features, fixes, refactors, and chores deterministically.
- As a developer, I want the scope to name the area/domain of the change (auth, client, …), so that
  a commit is attributable to a durable part of the system, not an ephemeral ticket.
- As a maintainer who deletes PRDs and issues when work is done, I want commits to reference NO prd
  or issue number, so that history never carries a dangling reference to a deleted planning artifact.
- As a developer making a small change with no obvious area, I want the scope to be optional, so that
  a bare `feat: …` is valid and I am not forced to invent a domain.
- As a reader, I want commit subjects in present tense with no leading capital and a bounded length,
  so that the log is uniform and skimmable.
- As a maintainer, I want a spec-amendment commit to be recognizable and greppable, so that I can
  list every autonomous backward-edge amendment across history with one query.
- As an agent making commits, I want a hook that rejects a malformed message with the specific
  reason, so that I fix the message in the same turn instead of polluting history.
- As an agent that never invoked a harness skill, I want the hook's block message to state the full
  grammar and a correct example, so that I can comply without having read the spec beforehand.
- As a maintainer of a target project, I want the commit discipline enforced there too without
  installing anything per project, so that the convention travels with the harness automatically.
- As a builder working a task, I want to author one clean conventional commit per task, so that the
  commits that land verbatim on the linear trunk are already meaningful.
- As the execution loop, I want a predictable, project-scoped worktree home outside the project
  tree, so that worktrees never collide with the nearest-docs walk or the tree-scanning hooks.
- As a maintainer of two repos with the same name, I want the worktree home keyed per project, so
  that their worktrees do not collide (a coarser key is acceptable until that collision actually
  bites).
- As a contributor reading the docs, I want one product module as the single source for the
  worktree path, the land procedure, and the commit grammar, so that no skill restates the rule.
- As a maintainer, I want each pipeline skill (think, prd, issues) to commit the artifacts it
  publishes, so that there are no uncommitted spec changes lingering after a planning step.
- As an operator starting the execution loop in a fresh session, I want the spec substrate already
  committed, so that the worktree inherits the PRD and issue files and there are no pending changes
  to reconcile.
- As a fresh agent months from now, I want the linear-landing and worktree-home decisions recorded
  as stances with rationale, so that I do not reintroduce merge bubbles or in-tree worktrees by
  defaulting to git conventions.

## Implementation decisions
- **One product module is the single source.** A new product module holds the worktree path rule,
  the rebase + fast-forward land procedure, and the commit grammar (type set + scope grammar +
  amendment variant + per-task granularity). It is cited by path from the execution loop, the
  builder agent, and the loop's failsafe reference — never restated. It is product (reachable from
  any project), not dogfood.
- **Land procedure replaces the merge.** The execution loop's land step rebases the issue branch
  onto its base then fast-forwards, run from the main checkout, never from inside the worktree. The
  no-fast-forward merge is retired. Order: ensure base current → rebase issue branch → fast-forward
  → verify green → remove worktree → delete branch.
- **No squash.** Squash is explicitly rejected: it would collapse the separate spec-amendment
  commits and break the revertable-as-distinct-units guarantee the execution loop's autonomy stance
  depends on. The builder compensates by authoring one clean conventional commit per task, since the
  environment cannot run interactive rebase to tidy commits after the fact.
- **Commit grammar.** A type, an optional parenthesized scope, then a subject. Type is from the
  canonical set only (feat, fix, refactor, docs, chore, test, perf, build, ci, revert) — portable to
  any project. The module carries a small map from harness artifact kinds to canonical types (a new
  skill or agent is a feat; planning artifacts such as a PRD, issues, or a stance are docs; tooling
  and scaffolding are chores). Scope is an OPTIONAL lowercase area/domain token (auth, client,
  execute-issue, hooks) — omittable, so a bare `feat: …` is valid — and is NEVER a prd or issue
  number, since those are deletable and a number in permanent history would dangle once the planning
  artifact is gone. The hook validates the scope's format (a lowercase token), not its membership in
  any list. Subject is present tense, no leading capital, bounded length (≤72).
- **Pipeline skills commit their output.** think (its stances, at session end), prd (the PRD), and
  issues (the slice breakdown) each end by committing what they published — one commit per skill run
  — using a `docs`-typed conventional message with an optional domain scope or none and the feature
  named in the subject (no prd/issue number). This leaves a clean tree so the execution loop starts
  from a fully-committed substrate its worktree inherits. The commits are agent-issued, so the
  enforcement hook governs them like any other.
- **Spec-amendment variant.** An autonomous backward-edge amendment is a fix-typed commit whose
  subject carries an `amend spec` marker, grepped via the subject (`git log --grep "amend spec"`).
  No issue trailer — that would be a dangling reference to a deletable issue. This preserves the
  distinct-and-greppable requirement of the execution-loop autonomy stance while staying inside the
  canonical type set.
- **Worktree home.** The loop creates each worktree under a central harness-owned home, namespaced
  per project by the repo-root basename, then per issue branch. Outside the project tree and its
  parent — no gitignore entry, immune to the nearest-docs walk and the tree-scanning hooks. Basename
  collision between two same-named repos is deferred (lean-first); a finer key is added only if it
  bites.
- **Enforcement is a product hook.** A pre-action hook intercepts a commit as it is issued,
  extracts the message, and validates it against the grammar; on a violation it blocks with the
  specific corrective reason so the agent self-corrects in the same turn. It ships with the plugin so
  it reaches every target project with no per-project install. It governs agent-issued commits (the
  harness's scope), not human command-line commits. A glob-routed convention is the wrong mechanism
  here because a commit is not a file edit and would not trigger it.
- **The block message is the discovery surface.** Because the hook is universal but the grammar spec
  is only loaded when a skill cites it, the block message must be self-contained: it states the full
  grammar (type set, optional-domain scope rule, subject rules), gives a correct example, and echoes
  the rejected message. An agent that never invoked a harness skill thus learns the rule reactively
  at commit time, paying one blocked attempt. There is no proactive channel: the plugin cannot inject
  context into arbitrary project sessions except via its skills (which already cite the module) or a
  CLAUDE.md it does not own.
- **The validator is a distinct, testable module.** The message-validation logic is isolable from
  the hook plumbing: message text in, pass-or-block-with-reason out. It is the deep module of this
  feature.

## Testing decisions
- **The commit-message validator earns a pinned self-test.** It is a load-bearing blocking hook, so
  per the load-bearing-dev-scripts stance it gets a pinned self-test that runs when the validator (or
  its test) is edited. The test drives the validator with message fixtures and asserts pass for
  conforming messages (with a domain scope and with no scope) and block-with-reason for each
  violation class: bad or missing type, malformed scope, leading capital, past tense, over-length
  subject; plus accept for the spec-amendment variant. Test behavior through the validator's public
  input and output, never its internals; it takes fixture input so it never touches the real tree.
- **No test for the prose modules.** The product module, the execution-loop procedure edits, and the
  builder agent edit are prose dogfooded by running the loop; they get no unit test. The worktree
  path stays inline procedure rather than a separate script, so it earns no self-test (chosen over
  extracting it into a tested deriver).
- **Reference integrity still gates.** All doc edits remain subject to the repo's reference-integrity
  check; new citations to the product module must resolve.

## Out of scope
- Rewriting existing history (the mixed past-tense/capitalized commits already on the trunk stay as
  they are; the convention applies going forward).
- Enforcing the convention on human command-line commits (the hook governs agent-issued commits; a
  per-project git commit-msg hook was rejected for its per-project install friction).
- A finer worktree-home key than the repo-root basename (deferred until a same-name collision bites).
- Autosquash or fixup-commit cleanup of builder commits (rejected: plain rebase plus fast-forward
  with one clean commit per task, no interactive rebase in this environment).
- Changes to the upstream sources of the execution loop beyond what the land-procedure edit requires.
- The PRD/issue deletion-on-done model itself (a separate future session). This PRD only assumes it:
  the no-prd/issue-number scope rule is chosen so history stays clean once that deletion lands.

## Notes
- Decisions and rationale were settled in the preceding think session and recorded as two stances:
  linear landing via rebase plus fast-forward (not merge, not squash), and the out-of-tree worktree
  home. Both passed the hard-to-reverse / surprising / real-trade-off gate.
- The commit-grammar and type-set choices are spec, not stances, and live in the product module.
- Scope semantics were reversed mid-design: an earlier `feat(prd-name-N)` form (issue number in the
  scope) was dropped in favor of an optional area/domain scope with no prd/issue number, so deleting
  a PRD/issue later leaves no dangling reference in permanent history.
- Example subjects under the settled grammar: `feat(auth): add token refresh`, `fix: correct login
  redirect` (no scope), `docs: add git-workflow PRD`, `fix(execute-issue): amend spec — split the
  rebase step`.
- Discoverability rests entirely on the hook's self-teaching block message — there is no proactive
  channel to inform a non-skill agent of the grammar before its first commit.
