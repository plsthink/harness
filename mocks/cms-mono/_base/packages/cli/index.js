#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { parseMarkdown, renderHTML } = require('../core');

// run(argv) -> { written: string[] }
// `cms-build <inputDir> [--out <dir>]` reads every `.md` file under <inputDir>, renders each via
// `core`, and writes a matching `.html` to <out> (default `./out`). Returns the list of paths it
// wrote. Pure with respect to its filesystem reads/writes: throws on missing/invalid argv, missing
// input directory, or a non-string write target.
function run(argv) {
  let out = 'out';
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--out') {
      out = argv[++i];
      if (typeof out !== 'string' || out.length === 0) {
        throw new Error('usage: cms-build <inputDir> [--out <dir>]');
      }
      continue;
    }
    positional.push(argv[i]);
  }
  const inputDir = positional[0];
  if (!inputDir) throw new Error('usage: cms-build <inputDir> [--out <dir>]');
  if (!fs.existsSync(inputDir) || !fs.statSync(inputDir).isDirectory()) {
    throw new Error(`cms-build: input directory not found: ${inputDir}`);
  }
  fs.mkdirSync(out, { recursive: true });
  const written = [];
  for (const entry of fs.readdirSync(inputDir)) {
    if (!entry.endsWith('.md')) continue;
    const source = fs.readFileSync(path.join(inputDir, entry), 'utf8');
    const html = renderHTML(parseMarkdown(source));
    const target = path.join(out, entry.replace(/\.md$/, '.html'));
    fs.writeFileSync(target, html);
    written.push(target);
  }
  return { written };
}

module.exports = { run };

if (require.main === module) {
  try {
    const { written } = run(process.argv.slice(2));
    for (const p of written) process.stdout.write(p + '\n');
  } catch (err) {
    process.stderr.write(err.message + '\n');
    process.exit(1);
  }
}
