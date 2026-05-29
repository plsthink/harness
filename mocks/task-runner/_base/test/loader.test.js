'use strict';

// Loader-focused tests. The loader's contract is narrow: getPlugin(name) ->
// plugin | null. These tests confirm registration, null-on-miss, and the
// directory-load path through getPlugin (no internal require leakage).

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { createLoader } = require('../src/loader.js');

function tmpdir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'task-runner-loader-'));
}

test('getPlugin returns the registered plugin', () => {
  const loader = createLoader();
  const plugin = { name: 'p', run() {} };
  loader.register('p', plugin);
  assert.equal(loader.getPlugin('p'), plugin);
});

test('getPlugin returns null for unknown names', () => {
  const loader = createLoader();
  assert.equal(loader.getPlugin('nope'), null);
});

test('getPlugin loads from pluginsDir when name is not registered', () => {
  const dir = tmpdir();
  const file = path.join(dir, 'reverse.js');
  fs.writeFileSync(
    file,
    "module.exports = { name: 'reverse', run(s) { return String(s).split('').reverse().join(''); } };\n"
  );
  const loader = createLoader({ pluginsDir: dir });
  const plugin = loader.getPlugin('reverse');
  assert.ok(plugin);
  assert.equal(plugin.name, 'reverse');
  assert.equal(plugin.run('abc'), 'cba');
});

test('getPlugin caches resolved plugins (second call returns the same object)', () => {
  const loader = createLoader();
  const plugin = { name: 'p', run() {} };
  loader.register('p', plugin);
  assert.equal(loader.getPlugin('p'), loader.getPlugin('p'));
});

test('getPlugin returns null when a directory-resident plugin fails to load', () => {
  const dir = tmpdir();
  fs.writeFileSync(path.join(dir, 'broken.js'), "throw new Error('boom');\n");
  const messages = [];
  const loader = createLoader({ pluginsDir: dir, log: (m) => messages.push(m) });
  assert.equal(loader.getPlugin('broken'), null);
  assert.ok(messages.some((m) => m.includes('failed to load plugin "broken"')));
});

test('register rejects an empty name', () => {
  const loader = createLoader();
  assert.throws(() => loader.register('', {}), /non-empty string/);
});
