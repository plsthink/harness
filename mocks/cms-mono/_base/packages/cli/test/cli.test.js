'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { run } = require('../index.js');

function tmpdir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'cms-cli-'));
}

test('run renders every .md under inputDir into matching .html files', () => {
  const dir = tmpdir();
  const out = path.join(dir, 'out');
  fs.writeFileSync(path.join(dir, 'a.md'), '# A');
  fs.writeFileSync(path.join(dir, 'b.md'), '# B');
  const { written } = run([dir, '--out', out]);
  assert.strictEqual(written.length, 2);
  assert.strictEqual(fs.readFileSync(path.join(out, 'a.html'), 'utf8'), '<h1>A</h1>');
  assert.strictEqual(fs.readFileSync(path.join(out, 'b.html'), 'utf8'), '<h1>B</h1>');
});

test('run skips non-.md entries in the input directory', () => {
  const dir = tmpdir();
  const out = path.join(dir, 'out');
  fs.writeFileSync(path.join(dir, 'keep.md'), '# Keep');
  fs.writeFileSync(path.join(dir, 'skip.txt'), 'ignored');
  const { written } = run([dir, '--out', out]);
  assert.strictEqual(written.length, 1);
  assert.ok(written[0].endsWith('keep.html'));
});

test('run defaults --out to ./out when the flag is absent', () => {
  const dir = tmpdir();
  fs.writeFileSync(path.join(dir, 'c.md'), '# C');
  const cwd = process.cwd();
  process.chdir(dir);
  try {
    const { written } = run([dir]);
    assert.strictEqual(written.length, 1);
    assert.strictEqual(fs.readFileSync(path.join(dir, 'out', 'c.html'), 'utf8'), '<h1>C</h1>');
  } finally {
    process.chdir(cwd);
  }
});

test('run rejects a missing positional inputDir', () => {
  assert.throws(() => run([]), /usage/);
});

test('run rejects an inputDir that does not exist', () => {
  assert.throws(() => run(['/no/such/dir']), /input directory not found/);
});
