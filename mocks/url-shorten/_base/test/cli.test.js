'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { run } = require('../index.js');
const { createStore } = require('../store.js');

test('shorten registers a slug for a fresh url', () => {
  const s = createStore();
  const slug = run(['shorten', 'https://example.com/a'], s);
  assert.equal(typeof slug, 'string');
  assert.equal(slug.length, 7);
  assert.equal(s.size, 1);
});

test('expand returns the original url and records a hit', () => {
  const s = createStore();
  const slug = run(['shorten', 'https://example.com/a'], s);
  assert.equal(run(['expand', slug], s), 'https://example.com/a');
  assert.equal(s.get(slug).hits, 1);
});

test('expand rejects unknown slugs', () => {
  const s = createStore();
  assert.throws(() => run(['expand', 'missing'], s), /no slug missing/);
});

test('list reports empty store and populated store', () => {
  const s = createStore();
  assert.equal(run(['list'], s), '(empty)');
  run(['shorten', 'https://example.com/a'], s);
  const out = run(['list'], s);
  assert.match(out, /https:\/\/example\.com\/a/);
});

test('analytics reports the summary line and respects empty top', () => {
  const s = createStore();
  run(['shorten', 'https://example.com/a'], s);
  const out = run(['analytics'], s);
  assert.match(out, /^slugs=1 hits=0$/);
});

test('unknown command throws', () => {
  assert.throws(() => run(['frobnicate'], createStore()), /unknown command/);
});

test('help / no args returns the command list', () => {
  const out = run([], createStore());
  assert.match(out, /shorten/);
  assert.match(out, /analytics/);
});
