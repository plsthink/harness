# Prototype rules (both branches)

Loaded by `prototype` step 2.

1. **Throwaway from day one, clearly marked.** Locate it next to where it'll be used (context
   obvious) but name it so a casual reader sees it's a prototype, not production. For throwaway UI
   routes, obey the project's existing routing convention; don't invent new top-level structure.
2. **One command to run.** Whatever the project's task runner supports (`pnpm <name>`, `python
   <path>`, `bun <path>`). The user starts it without thinking.
3. **No persistence by default.** State in memory — persistence is the thing being checked, not a
   dependency. If the question is about a DB, hit a scratch DB / local file named "PROTOTYPE — wipe me".
4. **Skip the polish.** No tests, no error handling beyond runnable, no abstractions. Learn fast,
   then delete.
5. **Surface the state.** After every action (logic) or variant switch (UI), print/render the full
   relevant state so the user sees what changed.
6. **Delete or absorb when done.** Either delete it or fold the validated decision into real code —
   don't leave it rotting in the repo.
