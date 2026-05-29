'use strict';

// Aggregations over a store. The store is the source of truth; analytics
// reads it and returns derived values, never mutates.

function summary(store) {
  const rows = store.all();
  const totalHits = rows.reduce((sum, r) => sum + r.hits, 0);
  return {
    totalSlugs: rows.length,
    totalHits,
  };
}

function top(store, n = 5) {
  if (!Number.isInteger(n) || n < 1) {
    throw new Error('top: n must be a positive integer');
  }
  return store
    .all()
    .filter((r) => r.hits > 0)
    .sort((a, b) => b.hits - a.hits || a.slug.localeCompare(b.slug))
    .slice(0, n)
    .map((r) => ({ slug: r.slug, url: r.url, hits: r.hits }));
}

module.exports = { summary, top };
