# Onboard — the behavior-config interview

Loaded by `onboard` step 2. The interview's JOB is to record a value for **every key the schema
requires**. The schema — `${CLAUDE_PLUGIN_ROOT}/scripts/check-onboarded.schema` — is the SINGLE
SOURCE of *which* keys to ask: walk its key lines and elicit a value for each. So **adding a schema
key later automatically extends the interview** — no edit here is needed beyond (optionally) a
how-to-elicit note for the new key. The interview is **unbounded**: ask as many questions as the
project needs to settle each key; it is not a fixed cap.

The recorded answers land in the `<!-- HARNESS-CONFIG-START -->`/`<!-- HARNESS-CONFIG-END -->` block
in `docs/AGENTS.md` (one `key: value` line per schema key), which `check-onboarded.sh` reads.

Eliciting here **only records values**. Deciding **Skill vs knob** for each procedure key — and
deferring any scaffolding to `new-skill`/`new-agent` — is SKILL.md step 4 (scope×determinism; see
stance: conventions-not-personas).

## How to elicit each current key

Walk this with a short explainer per key — assume the user may not know the terms.

### context — single vs multi-package layout
- **single** — one `docs/CONTEXT.md` + `docs/stances/` at root. Most repos.
- **packages** (multi-package) — `docs/CONTEXT-MAP.md` routing to per-package
  `packages/<pkg>/docs/CONTEXT.md` (monorepo).
Work substrate stays at **repo root** either way; only domain docs fan out. Default: single unless
the repo already has multiple packages.

### tdd-applies — the project's test-first posture (true | false)
Ask whether changes should go red→green test-first. Default reasoning: a repo with an app or unit
suite → likely **true**; a prose/docs/config repo with no runtime suite → **false**. Confirm with
the user rather than guessing silently.

### test-command — how this project's tests run
Record the **command/procedure** that runs the tests — detect from the repo (e.g. `package.json`
scripts, a `Makefile` target, `pyproject.toml`/pytest, `go test`, a `*.test.sh` convention) and
confirm with the user.

### verify-method — how to confirm observable behavior
Record the **command/procedure** that builds/runs the app to confirm a change actually works: a dev
server + browser, a CLI invocation, an e2e harness, etc. For a project with **no runtime app**
(prose/docs/config), record a check/lint command (e.g. a reference-integrity or lint script).

## What else gets written
Conventions: seed an empty `docs/conventions/INDEX.md` (delta over `${CLAUDE_PLUGIN_ROOT}/conventions/`,
fills on friction).
