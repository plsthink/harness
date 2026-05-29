'use strict';

// Loader tests against the SHALLOW surface — every step of the load
// pipeline is poked individually. These tests will need to be rewritten
// once the loader is deepened behind a narrow getPlugin(name) interface.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { createLoader } = require('../src/loader.js');

function tmpdir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'task-runner-loader-'));
}

test('registered plugin is reachable via isRegistered + getRegistered', () => {
  const loader = createLoader();
  const plugin = { name: 'p', run() {} };
  loader.register('p', plugin);
  assert.equal(loader.isRegistered('p'), true);
  assert.equal(loader.getRegistered('p'), plugin);
});

test('unregistered name reports false from isRegistered', () => {
  const loader = createLoader();
  assert.equal(loader.isRegistered('nope'), false);
});

test('pluginFileExists reports presence of a file under pluginsDir', () => {
  const dir = tmpdir();
  fs.writeFileSync(path.join(dir, 'reverse.js'), "module.exports = { name: 'reverse', run: (s) => s };\n");
  const loader = createLoader({ pluginsDir: dir });
  assert.equal(loader.pluginFileExists('reverse'), true);
  assert.equal(loader.pluginFileExists('absent'), false);
});

test('requirePlugin loads a plugin file when present', () => {
  const dir = tmpdir();
  fs.writeFileSync(
    path.join(dir, 'reverse.js'),
    "module.exports = { name: 'reverse', run: (s) => String(s).split('').reverse().join('') };\n"
  );
  const loader = createLoader({ pluginsDir: dir });
  const plugin = loader.requirePlugin('reverse');
  assert.equal(plugin.name, 'reverse');
  assert.equal(plugin.run('abc'), 'cba');
});

test('cache slots round-trip via setCached + hasCached + getCached', () => {
  const loader = createLoader();
  const plugin = { name: 'p', run() {} };
  assert.equal(loader.hasCached('p'), false);
  loader.setCached('p', plugin);
  assert.equal(loader.hasCached('p'), true);
  assert.equal(loader.getCached('p'), plugin);
});
