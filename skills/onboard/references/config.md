# Onboard — the behavior-config interview

Loaded by `onboard` step 2. The interview's JOB is to record a value for **every key the schema
requires**. The schema — `${CLAUDE_PLUGIN_ROOT}/scripts/check-onboarded.schema` — is the SINGLE
SOURCE of *which* keys to ask: walk its key lines and elicit a value for each. So **adding a schema
key later automatically extends the interview** — no edit here is needed beyond (optionally) a
how-to-elicit note for the new key. The interview is **unbounded**: ask as many questions as the
project needs to settle each key; it is not a fixed cap.

The tracker is always local `docs/work/` with the canonical harness triage labels (see stance:
tracker-always-local) — not a choice; the file shape is `${CLAUDE_PLUGIN_ROOT}/shared/issue-tracker.md`,
the labels are `${CLAUDE_PLUGIN_ROOT}/shared/triage-labels.md`, applied verbatim.

The recorded answers land in the `<!-- HARNESS-CONFIG-START -->`/`<!-- HARNESS-CONFIG-END -->` block
in `docs/AGENTS.md` (one `key: value` line per schema key), which `check-onboarded.sh` reads.

## How to elicit each current key

Walk this with a short explainer per key — assume the user may not know the terms.

**Then (SKILL.md step 4) decide Skill vs knob by scope×determinism** (procedure → Skill, simple
knob → config; PRD-owned, see stance: conventions-not-personas): a **NON-TRIVIAL** multi-step
verify/test/lint procedure gets scaffolded as a **project-local Skill** (via `new-skill`, target
`.claude/skills/<name>/SKILL.md` — the name the global verifier/tdd resolve to), which the global
verifier/tdd then defer to; a **one-line command stays the declarative knob** recorded below (no
Skill). A genuinely distinct **stance+tools** need → propose a **project-local Agent** (via
`new-agent`, see stance: agents-generic-floor). The *how* of scaffolding is owned by new-skill /
new-agent — here just **record the config values** and feed the non-trivial ones forward.

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
confirm with the user. A non-trivial multi-step procedure gets scaffolded as a project-local test
Skill (above), which tdd prefers at the gate; the value here stays the plain fallback command — not
a Skill ref.

### verify-method — how to confirm observable behavior
Record the **command/procedure** that builds/runs the app to confirm a change actually works: a dev
server + browser, a CLI invocation, an e2e harness, etc. For a project with **no runtime app**
(prose/docs/config), record a check/lint command (e.g. a reference-integrity or lint script). As
with test-command, a non-trivial procedure is scaffolded as a project-local verify Skill (which the
verifier prefers at the gate); the value here stays the plain fallback command — not a Skill ref.

## What else gets written
Conventions: seed an empty `docs/conventions/INDEX.md` (delta over `${CLAUDE_PLUGIN_ROOT}/conventions/`,
fills on friction).
