#!/usr/bin/env node
// harness caveman — SessionStart hook.
// Emits the lite ruleset once per session, read from the skill's SKILL.md (single source of
// truth). Owned re-author of JuliusBrussee/caveman's caveman-activate.js; lite-only, no flag
// file, no statusline, no multi-level filtering. See docs/integrations/caveman.md.

const fs = require('fs');
const path = require('path');

// __dirname = <plugin_root>/hooks ; ruleset lives in <plugin_root>/skills/caveman/SKILL.md
const skillPath = path.join(__dirname, '..', 'skills', 'caveman', 'SKILL.md');

const FALLBACK = 'CAVEMAN MODE ACTIVE (lite). Respond terse: drop articles/filler/pleasantries/' +
  'hedging, fragments OK, technical terms exact. Write normal for code/commits/security/' +
  'irreversible-action confirmations. Off: "stop caveman".';

let ruleset = '';
try {
  const body = fs.readFileSync(skillPath, 'utf8');
  const m = body.match(/<!-- RULESET-START[\s\S]*?-->\s*([\s\S]*?)\s*<!-- RULESET-END -->/);
  if (m) ruleset = m[1].trim();
} catch (e) { /* fall back below */ }

process.stdout.write(ruleset || FALLBACK);
