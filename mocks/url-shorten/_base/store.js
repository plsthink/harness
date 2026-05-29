'use strict';

// In-memory slug store. Plain Map keyed by slug; values are records of
// { url, hits, createdAt }. No I/O — the store is in-process only.

function createStore(now = () => Date.now()) {
  const map = new Map();
  return {
    put(slug, url) {
      if (typeof slug !== 'string' || slug === '') {
        throw new Error('store.put: slug required');
      }
      if (typeof url !== 'string' || url === '') {
        throw new Error('store.put: url required');
      }
      if (map.has(slug)) return false;
      map.set(slug, { url, hits: 0, createdAt: now() });
      return true;
    },
    get(slug) {
      const rec = map.get(slug);
      return rec ? { ...rec } : null;
    },
    recordHit(slug) {
      const rec = map.get(slug);
      if (!rec) throw new Error(`store.recordHit: no slug ${slug}`);
      rec.hits += 1;
      return rec.hits;
    },
    all() {
      return Array.from(map.entries(), ([slug, rec]) => ({ slug, ...rec }));
    },
    get size() {
      return map.size;
    },
  };
}

module.exports = { createStore };
