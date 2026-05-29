'use strict';

// Behavior tests for the public runner API. Drives the runner through its
// own surface — register a plugin, run it, assert the result envelope shape.

const { test } = require('node:test');
const assert = require('node:assert/strict');

const { createRunner } = require('../src/index.js');

test('run dispatches a registered plugin and wraps the return value in {ok, value}', async () => {
  const runner = createRunner();
  runner.register('upper', {
    name: 'upper',
    run(input) {
      return String(input).toUpperCase();
    },
  });
  const result = await runner.run('upper', 'hello');
  assert.deepEqual(result, { ok: true, value: 'HELLO' });
});

test('run returns {ok: false, error} when no plugin is registered for the task type', async () => {
  const runner = createRunner();
  const result = await runner.run('missing', null);
  assert.equal(result.ok, false);
  assert.match(result.error, /no plugin registered/);
});

test('run captures plugin exceptions into {ok: false, error}, never throws', async () => {
  const runner = createRunner();
  runner.register('boom', {
    name: 'boom',
    run() {
      throw new Error('plugin failed');
    },
  });
  const result = await runner.run('boom', null);
  assert.equal(result.ok, false);
  assert.equal(result.error, 'plugin failed');
});

test('run awaits async plugin handlers', async () => {
  const runner = createRunner();
  runner.register('async-double', {
    name: 'async-double',
    async run(input) {
      return input * 2;
    },
  });
  const result = await runner.run('async-double', 21);
  assert.deepEqual(result, { ok: true, value: 42 });
});

test('register validates plugin name', () => {
  const runner = createRunner();
  assert.throws(() => runner.register('', { name: 'x', run() {} }), /non-empty string/);
});

test('list returns the registered plugin names sorted', () => {
  const runner = createRunner();
  runner.register('beta', { name: 'beta', run() {} });
  runner.register('alpha', { name: 'alpha', run() {} });
  assert.deepEqual(runner.list(), ['alpha', 'beta']);
});

test('host validates plugin shape at dispatch time', async () => {
  const runner = createRunner();
  runner.register('bad', { name: 'bad' }); // no run()
  const result = await runner.run('bad', null);
  assert.equal(result.ok, false);
  assert.match(result.error, /run must be a function/);
});
