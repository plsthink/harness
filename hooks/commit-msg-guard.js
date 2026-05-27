#!/usr/bin/env node
// harness commit-msg-guard — PreToolUse(Bash) hook.
// Intercepts `git commit` Bash commands, extracts the inline message, and validates it against the
// product commit grammar via ${CLAUDE_PLUGIN_ROOT}/scripts/commit-msg-validate.sh. On a violation
// it exits 2 and emits the validator's self-teaching reason on stderr so the agent self-corrects in
// the same turn. The validator's block message is the sole discovery surface for a cold agent.
//
// Degrades SAFELY: if the command is not a git commit, or a message cannot be confidently
// extracted (e.g. -F -, heredoc, unusual quoting), it exits 0 (allow). Never blocks non-commit Bash.

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// __dirname = <plugin_root>/hooks ; validator lives in <plugin_root>/scripts/.
const validator = path.join(__dirname, '..', 'scripts', 'commit-msg-validate.sh');

function allow() { process.exit(0); }

// Read hook JSON from stdin.
let raw = '';
try { raw = fs.readFileSync(0, 'utf8'); } catch (e) { allow(); }

let cmd = '';
try {
  const j = JSON.parse(raw);
  cmd = (j && j.tool_input && j.tool_input.command) || '';
} catch (e) { allow(); }

if (!cmd || typeof cmd !== 'string') allow();

// Only act on git commit invocations.
if (!/\bgit\b[^\n]*\bcommit\b/.test(cmd)) allow();

// Extract the first -m / --message inline subject (the header we validate). Handles double- and
// single-quoted forms and -m"msg"/-m=msg. We do NOT try to handle -F/-F-/heredoc — allow those.
function extractMessage(c) {
  // -m "msg" | -m 'msg' | --message "msg" | --message='msg'
  const patterns = [
    /(?:^|\s)(?:-m|--message)[=\s]+"((?:[^"\\]|\\.)*)"/,
    /(?:^|\s)(?:-m|--message)[=\s]+'([^']*)'/,
    /(?:^|\s)-m"((?:[^"\\]|\\.)*)"/,
    /(?:^|\s)-m'([^']*)'/,
  ];
  for (const re of patterns) {
    const m = c.match(re);
    if (m) return m[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }
  return null;
}

// If the commit reads its message from a file/stdin, we cannot confidently see it — allow.
if (/(?:^|\s)(?:-F|--file)\b/.test(cmd)) allow();

const message = extractMessage(cmd);
if (message === null) allow();   // no inline message we can confidently extract -> allow.

const res = spawnSync('bash', [validator, message], { encoding: 'utf8' });

// If the validator itself failed to run (missing, etc.), degrade safely rather than block.
if (res.error || typeof res.status !== 'number') allow();

if (res.status === 0) allow();

// Violation: surface the validator's self-teaching reason and block.
if (res.stderr) process.stderr.write(res.stderr);
process.exit(2);
