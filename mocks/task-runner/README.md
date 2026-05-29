# task-runner — mock fixture (base + overlays)

A single-context Node library with a plugin API, used as a target for
exercising harness skills end-to-end. The base library ships the
buildable source; overlays merge on top of a staged copy to produce a
per-scenario pre-state.

## Layout

- `_base/` — buildable Node library (zero deps; `node --test` suite).
- `_overlays/clean/` — no-op overlay; staged copy is `_base/` only. Use
  when you want to drive a skill against an un-`docs/`-shadowed copy
  (e.g. exercising the `onboard` skill itself).
- `_overlays/onboarded/` — adds the `docs/` skeleton (AGENTS.md +
  PROJECT.md + CONTEXT.md + conventions/INDEX.md) with a complete
  harness behavior-config block. Default starting state for any skill
  that assumes a project has already been onboarded.
- `_overlays/buggy/` — onboarded ∪ a planted async-handler bug in
  `src/host.js` plus a failing repro test. Drives bug-loop scenarios.
- `_overlays/shallow/` — onboarded ∪ a textbook shallow `src/loader.js`
  (wide interface, thin implementation), a deepening hint at `HINT.md`,
  and a tweaked `src/index.js` that has to reassemble the dispatch by
  hand. Drives deepening scenarios.
- `_overlays/stale-docs/` — onboarded ∪ planted staleness items in the
  mock's own docs (`MANIFEST.md` lists them). Drives doc-maintenance
  scenarios.

## Staging

Stage a scenario by copying `_base/` into a working directory, then
recursively merging `_overlays/<name>/` on top. Overlay files either add
new paths or replace base paths with the same name. No build step at the
mock level.

## Test entry point

After staging, `node --test` (or `npm test`) inside the working
directory runs the staged library's suite. The base + onboarded
combination passes 12+ tests cleanly; the buggy combination
intentionally has at least one failing test (the repro); the shallow
combination passes its replacement test suite under the wide loader
surface.
