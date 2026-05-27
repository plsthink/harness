# gnhf prompt library

Reusable objective prompts for running [gnhf](https://github.com/kunchenguid/gnhf) against this
repo. Each file is a **paste-ready, self-contained** gnhf objective (gnhf consumes one prompt string
per run and does not compose files at runtime, so the shared rules are inlined into every prompt).

gnhf loops fresh agent sessions, each reading `notes.md` (accumulated from the run's prior
iterations) for cross-iteration memory. The agent emits gnhf's built-in structured result
(`success` / `summary` / `key_changes_made` / `key_learnings`); there is no user-supplied output
schema. The loop ends via `--stop-when <condition>`: gnhf stops after an iteration whose reported
output meets the natural-language condition.

## When to reach for which

| Prompt | Goal | Forcing function (what generates work) |
| --- | --- | --- |
| [dogfood-friction.md](dogfood-friction.md) | Fix friction surfaced by using a skill | A concrete stumble while driving a skill against a `mocks/` fixture |
| [upstream-integration.md](upstream-integration.md) | Pull deliberate upstream divergences | An unreconciled upstream delta in a `docs/integrations/<src>.md` re-diff |
| [capability-expansion.md](capability-expansion.md) | Cover a task the harness can't do | A repeatable task no current skill+pipeline handles |
| [coherence-audit.md](coherence-audit.md) | Reconcile internal inconsistency | A specific defect (dangling cite, glossary drift, duplicated spec, stale stance) |
| [self-improve-umbrella.md](self-improve-umbrella.md) | Unattended self-improvement | Runs the four above as ordered phases; halts when a full cycle is dry |

Run a single goal interactively; run the umbrella for long unattended sessions. The launcher pairs
each flow with a default `--stop-when` condition. That string lives in **one place** — `run.sh`;
gnhf injects it into the agent at runtime, and the prompt files describe their halt only in prose
(no verbatim string), so there is nothing to keep in sync:

```
docs/gnhf/run.sh <flow> [extra gnhf args...]   # flow: dogfood|upstream|capability|coherence|umbrella
docs/gnhf/run.sh dogfood                        # fix friction surfaced by dogfooding a skill
docs/gnhf/run.sh umbrella --worktree            # unattended, in an isolated worktree
docs/gnhf/run.sh coherence --dry-run            # print the gnhf command without running it
docs/gnhf/run.sh dogfood --stop-when "..."      # override the default stop condition
```

Each invocation expands to `gnhf --current-branch --stop-when "<default condition>"
"$(cat <prompt>)"`, with any extra args passed straight through to gnhf (e.g. `--max-tokens`,
`--agent codex`). Pass your own `--stop-when` to override the default for that run.

## The shared discipline

These prompts split self-improvement by **forcing function** — each goal carries its own external
pressure that generates real work — and make halting honest rather than optional. Every prompt
inlines the same rules:

1. **One forcing function per iteration.** The agent names its concrete trigger in the iteration
   `summary`. A change that cannot be tied to a named trigger is not made; marginal homogenization
   is not a trigger.
2. **Halt honestly.** The moment an honest search finds no defensible trigger, the agent reports
   that the run's `--stop-when` condition is met. Halting is the correct outcome — never invent a
   trigger to keep going.
3. **Measure against a fresh plugin cache.** Product-file changes (`skills/`, `agents/`, `hooks/`,
   `shared/`, `conventions/`, `templates/`) are invisible to a running session until
   `claude plugin update harness@harness`. Dogfood files (`docs/`, the repo's `.claude/settings.json`,
   `CLAUDE.md`, `README.md`) are live immediately. See
   [../stances/measure-product-changes-via-plugin-update.md](../stances/measure-product-changes-via-plugin-update.md).
4. **One coherent change per iteration, committed.** Honor the latest harness conventions, templates,
   and `${CLAUDE_PLUGIN_ROOT}/shared/authoring-standard.md`; keep instructions minimal and precise;
   record decisions as stances.

## Umbrella phase order

`dogfood → upstream → capability → coherence`. Dogfood leads (cheapest discovery, fixtures ready,
surfaces the gaps that seed later phases); upstream precedes capability (integrate external before
building internal, so capability does not reinvent upstream); coherence is last because it operates
on the churn the prior phases produce and is self-limiting — the natural terminator. The umbrella's
`--stop-when` fires when a full cycle through all four phases produces no change.
