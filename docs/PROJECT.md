# harness — project brief

## Vision / goal
A personally-owned, multi-project Claude Code harness: a git-versioned plugin bundling skills,
agents, hooks, and shared filesystem-contract conventions, distributed via its own marketplace.
Own + diverge from upstream (Matt Pocock / caveman / karpathy) deliberately, so divergence is
legitimate and there is one place to extend and interconnect.

## Hard constraints / non-negotiables
- **Interconnect via filesystem contracts, not code coupling.** Skills chain through shared docs,
  `docs/work/` state files, and explicit `Next:` pointers — never code imports.
- **Single source for every shared convention.** Conventions live once in `shared/` (named-skill
  references) or `conventions/` (glob-routed good-practice), cited by path; never copied.
- **Progressive disclosure is the core discipline.** Thin `SKILL.md` (~100-line soft target);
  heavy detail in `references/` loaded on demand. Applies at the project level too (CLAUDE.md →
  AGENTS.md → detail).
- **Lean first, abstract on friction.** Port 1:1, get it loading, then add layers as real friction
  appears. No grand engine; tooling only after the friction it solves recurs.
- **Projects are self-sufficient.** A no-harness agent can work any target repo from its committed
  `docs/`; harness skills are accelerant + enforcer, never a requirement.
- **Two resolution roots, never colliding:** `shared/`+`conventions/` = product
  (`${CLAUDE_PLUGIN_ROOT}`, reachable from any project); `docs/` = dogfood (nearest-`docs/` walk,
  harness-repo-only). Nothing a skill needs at runtime-in-another-project may live under `docs/`.

## External systems / integrations
- **Claude Code plugin system** — marketplace + plugin manifest; `${CLAUDE_PLUGIN_ROOT}` expansion.
- Upstream influences (provenance, idea/vendor sources) — see `docs/integrations/`.
