#!/usr/bin/env node
// harness caveman — UserPromptSubmit hook.
// Re-injects a one-line active-mode reminder every turn so the mode doesn't drift on long
// sessions (the heavy plugin's only real advantage, kept owned). Stateless + lite-only: skips the
// reminder on the turn the user disables caveman. Owned re-author of caveman-mode-tracker.js;
// dropped: flag file, stats, /caveman <level> selection, independent commit/review/compress modes.

let input = '';
process.stdin.on('data', c => { input += c; });
process.stdin.on('end', () => {
  let prompt = '';
  try { prompt = (JSON.parse(input).prompt || '').toLowerCase(); } catch (e) {}

  // Respect an inline disable this turn (stateless — no flag file to clear).
  if (/\b(stop|disable|turn off|deactivate)\b[^.]*\bcaveman\b/.test(prompt) ||
      /\bnormal mode\b/.test(prompt)) {
    process.stdout.write('');
    return;
  }

  process.stdout.write('CAVEMAN MODE ACTIVE (lite). Drop articles/filler/pleasantries/hedging. ' +
    'Fragments OK. Code/commits/security: write normal.');
});
