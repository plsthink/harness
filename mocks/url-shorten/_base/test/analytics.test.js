'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createStore } = require('../store.js');
const { summary, top } = require('../analytics.js');

function seed(hitsPerSlug) {
  const s = createStore(() => 0);
  for (const [slug, hits] of hitsPerSlug) {
    s.put(slug, `https://example.com/${slug}`);
    for (let i = 0; i < hits; i++) s.recordHit(slug);
  }
  return s;
}

test('summary reports zero counts for an empty store', () => {
  assert.deepEqual(summary(createStore()), { totalSlugs: 0, totalHits: 0 });
});

test('summary sums slugs and hits', () => {
  const s = seed([['a', 3], ['b', 0], ['c', 5]]);
  assert.deepEqual(summary(s), { totalSlugs: 3, totalHits: 8 });
});

test('top returns hit slugs in descending order, capped at n', () => {
  const s = seed([['a', 3], ['b', 5], ['c', 1], ['d', 0]]);
  const t = top(s, 2);
  assert.equal(t.length, 2);
  assert.equal(t[0].slug, 'b');
  assert.equal(t[0].hits, 5);
  assert.equal(t[1].slug, 'a');
});

test('top excludes zero-hit slugs', () => {
  const s = seed([['a', 0], ['b', 0]]);
  assert.deepEqual(top(s, 5), []);
});

test('top breaks ties by slug name ascending', () => {
  const s = seed([['b', 2], ['a', 2], ['c', 2]]);
  assert.deepEqual(top(s, 3).map((r) => r.slug), ['a', 'b', 'c']);
});

test('top rejects non-positive n', () => {
  assert.throws(() => top(createStore(), 0), /positive integer/);
});
