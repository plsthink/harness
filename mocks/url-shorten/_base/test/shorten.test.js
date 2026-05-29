'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { slugFor, DEFAULT_LEN } = require('../shorten.js');

test('slugFor returns a string of the requested length', () => {
  const slug = slugFor('https://example.com/');
  assert.equal(typeof slug, 'string');
  assert.equal(slug.length, DEFAULT_LEN);
});

test('slugFor is deterministic for the same input', () => {
  const a = slugFor('https://example.com/x');
  const b = slugFor('https://example.com/x');
  assert.equal(a, b);
});

test('slugFor differs across different URLs', () => {
  const a = slugFor('https://example.com/a');
  const b = slugFor('https://example.com/b');
  assert.notEqual(a, b);
});

test('slugFor honors a custom length', () => {
  assert.equal(slugFor('https://example.com/', 4).length, 4);
  assert.equal(slugFor('https://example.com/', 12).length, 12);
});

test('slugFor rejects invalid lengths', () => {
  assert.throws(() => slugFor('https://example.com/', 0), /len must be/);
  assert.throws(() => slugFor('https://example.com/', 99), /len must be/);
});

test('slugFor uses only base62 characters', () => {
  const slug = slugFor('https://example.com/q');
  assert.match(slug, /^[0-9A-Za-z]+$/);
});

test('slugFor normalizes case-equivalent URLs to the same slug', () => {
  const a = slugFor('HTTPS://Example.com/');
  const b = slugFor('https://example.com/');
  assert.equal(a, b);
});
