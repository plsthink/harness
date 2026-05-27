# gnhf prompt library

Reusable objective prompts for running [gnhf](https://github.com/kunchenguid/gnhf) against this
repo. gnhf consumes one prompt string per run and does not compose files itself — but the running
agent reads sibling files at runtime (the same way it reads `docs/AGENTS.md`), so each objective
links the shared mandatory rules ([_rules.md](_rules.md)) instead of restating them, and the
umbrella links the four phase objectives instead of re-defining them. Each file stays small and
precise; the shared text lives in exactly one place.

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
pressure that generates real work — and make halting honest rather than optional. Every objective
obeys the same mandatory rules, single-sourced in [_rules.md](_rules.md): one forcing function per
iteration, halt honestly, measure against a fresh plugin cache (product files under `skills/`,
`agents/`, `hooks/`, `shared/`, `conventions/`, `templates/` are invisible until
`claude plugin update harness@harness`; `docs/`, `.claude/settings.json`, `CLAUDE.md`, `README.md`
are live immediately — see
[../stances/measure-product-changes-via-plugin-update.md](../stances/measure-product-changes-via-plugin-update.md)),
honor the latest conventions/templates/authoring-standard, and make one coherent committed change
per iteration.

## Umbrella phase order

`dogfood → upstream → capability → coherence`. Dogfood leads (cheapest discovery, fixtures ready,
surfaces the gaps that seed later phases); upstream precedes capability (integrate external before
building internal, so capability does not reinvent upstream); coherence is last because it operates
on the churn the prior phases produce and is self-limiting — the natural terminator. The umbrella's
`--stop-when` fires when a full cycle through all four phases produces no change.
