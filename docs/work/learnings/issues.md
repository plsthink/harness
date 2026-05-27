# issues — learnings

- **Self-gating skills need a dogfood-onboard slice in the same breath.** When a slice wires a
  precondition gate into config-consuming skills, the harness repo itself runs those skills — so the
  gate-live slice must also write the harness's own config block, or it self-breaks the toolchain.
  (orchestrator-pivot slice 03 bundled "write dogfood config" + "wire the gate" for exactly this.)

- **A script a skill calls at runtime in OTHER projects is product — it ships under
  `${CLAUDE_PLUGIN_ROOT}`, never `docs/`.** `docs/` is dogfood-only (harness-repo nearest-`docs/`
  walk), so a runtime-in-another-project dependency placed there silently limits itself to the
  harness repo. Slice 01 put `check-onboarded.sh` in `docs/scripts/` ("no callers yet"), which only
  surfaced as wrong in slice 03 when the step-0 gate (running in target projects) needed it — a
  path-level miss the orchestrator corrected by relocating the script + schema to a top-level
  `scripts/` product root, keeping only its dogfood `.test.sh` under `docs/scripts/`. When slicing,
  decide a new script's resolution root by *where it runs*, not where it's first authored.
