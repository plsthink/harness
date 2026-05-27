'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { slugify, isSlug } = require('../index.js');

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

test('isSlug accepts a canonical Slug', () => {
  assert.strictEqual(isSlug('hello-world'), true);
});

test('isSlug rejects non-canonical text (uppercase, spaces, edge dashes)', () => {
  assert.strictEqual(isSlug('Hello World'), false);
  assert.strictEqual(isSlug('-hello-'), false);
});

test('isSlug rejects empty string and non-string without throwing', () => {
  assert.strictEqual(isSlug(''), false);
  assert.strictEqual(isSlug(42), false);
});
