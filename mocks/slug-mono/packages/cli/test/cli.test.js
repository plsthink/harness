'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { run } = require('../index.js');

test('run slugifies the joined argv via core', () => {
  assert.strictEqual(run(['Hello', 'World']), 'hello-world');
});

test('run rejects empty input', () => {
  assert.throws(() => run([]), /usage/);
});

test('run applies a --max-length cap to the slugified argv', () => {
  assert.strictEqual(run(['--max-length', '6', 'Hello', 'World']), 'hello');
  assert.strictEqual(run(['Hello', 'World']), 'hello-world');
});

test('run rejects --max-length with a missing or non-numeric value', () => {
  assert.throws(() => run(['--max-length']), /usage/);
  assert.throws(() => run(['--max-length', 'abc', 'Hello']), /usage/);
});

test('run --check reports a canonical Slug as valid', () => {
  assert.strictEqual(run(['--check', 'hello-world']), 'valid');
});

test('run --check reports non-canonical input as invalid', () => {
  assert.strictEqual(run(['--check', 'Hello', 'World']), 'invalid');
});
