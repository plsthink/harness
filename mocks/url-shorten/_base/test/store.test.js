'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createStore } = require('../store.js');

test('createStore starts empty', () => {
  const s = createStore();
  assert.equal(s.size, 0);
  assert.deepEqual(s.all(), []);
});

test('put returns true on insert, false on duplicate slug', () => {
  const s = createStore();
  assert.equal(s.put('abc', 'https://example.com/'), true);
  assert.equal(s.put('abc', 'https://other.com/'), false);
  assert.equal(s.size, 1);
});

test('put rejects empty slug or url', () => {
  const s = createStore();
  assert.throws(() => s.put('', 'https://x/'), /slug required/);
  assert.throws(() => s.put('abc', ''), /url required/);
});

test('get returns a copy of the record, or null for missing slugs', () => {
  const s = createStore(() => 100);
  s.put('abc', 'https://example.com/');
  const r = s.get('abc');
  assert.equal(r.url, 'https://example.com/');
  assert.equal(r.hits, 0);
  assert.equal(r.createdAt, 100);
  r.hits = 999; // mutating the copy must not affect the store
  assert.equal(s.get('abc').hits, 0);
  assert.equal(s.get('missing'), null);
});

test('recordHit increments the count and rejects unknown slugs', () => {
  const s = createStore();
  s.put('abc', 'https://example.com/');
  assert.equal(s.recordHit('abc'), 1);
  assert.equal(s.recordHit('abc'), 2);
  assert.equal(s.get('abc').hits, 2);
  assert.throws(() => s.recordHit('missing'), /no slug missing/);
});

test('all returns every record with slug attached', () => {
  const s = createStore(() => 0);
  s.put('a', 'https://example.com/1');
  s.put('b', 'https://example.com/2');
  s.recordHit('a');
  const rows = s.all().sort((x, y) => x.slug.localeCompare(y.slug));
  assert.equal(rows.length, 2);
  assert.equal(rows[0].slug, 'a');
  assert.equal(rows[0].hits, 1);
  assert.equal(rows[1].slug, 'b');
  assert.equal(rows[1].hits, 0);
});
