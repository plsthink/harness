'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { slugify } = require('../index.js');

test('slugify lowercases and dashes spaces', () => {
  assert.strictEqual(slugify('Hello World'), 'hello-world');
});

test('slugify collapses non-alphanumeric runs and trims edge dashes', () => {
  assert.strictEqual(slugify('  Foo --- Bar!! '), 'foo-bar');
});

test('slugify throws TypeError on non-string input', () => {
  assert.throws(() => slugify(42), TypeError);
});

test('slugify caps the Slug to max chars and trims a resulting trailing dash', () => {
  assert.strictEqual(slugify('Hello World', 6), 'hello');
});

test('slugify leaves the Slug unchanged when max >= its length or is absent', () => {
  assert.strictEqual(slugify('Hello World'), 'hello-world');
  assert.strictEqual(slugify('Hello World', 11), 'hello-world');
  assert.strictEqual(slugify('Hello World', 99), 'hello-world');
});
