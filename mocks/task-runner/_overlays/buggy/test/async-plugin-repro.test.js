'use strict';

// Repro test for the planted bug — async plugin handlers are not awaited by
// the host, so the result envelope's `value` is a Promise instead of the
// resolved value. The fix is to `await` the handler call in host.dispatch.

const { test } = require('node:test');
const assert = require('node:assert/strict');

const { createRunner } = require('../src/index.js');

test('async plugin: result.value is the resolved value, not a Promise', async () => {
  const runner = createRunner();
  runner.register('async-double', {
    name: 'async-double',
    async run(input) {
      return input * 2;
    },
  });
  const result = await runner.run('async-double', 21);
  assert.equal(result.ok, true);
  // The bug: result.value is a Promise here, not 42.
  assert.equal(result.value, 42);
});

test('async plugin that rejects: result.ok is false with the error message', async () => {
  const runner = createRunner();
  runner.register('async-boom', {
    name: 'async-boom',
    async run() {
      throw new Error('async failed');
    },
  });
  const result = await runner.run('async-boom', null);
  // The bug: the rejection escapes because we never await, so the try/catch
  // in dispatch can't catch it; the unhandled rejection surfaces here.
  assert.equal(result.ok, false);
  assert.equal(result.error, 'async failed');
});
