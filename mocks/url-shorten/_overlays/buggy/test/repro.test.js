'use strict';

// Repro test: pins the slug a known-good shortener produces for a fixed
// canonical URL. Slug generation is deterministic by contract (docs/PROJECT.md
// hard constraint, docs/CONTEXT.md "Shortener" definition), so the expected
// value is stable across runs. A regression in the slug pipeline
// (canonicalization, digest derivation, encoding, truncation) surfaces here
// as a mismatch.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { slugFor } = require('../shorten.js');

test('repro: slugFor("https://example.com/known") matches the pinned baseline', () => {
  assert.equal(slugFor('https://example.com/known'), '5XKOlfJ');
});
