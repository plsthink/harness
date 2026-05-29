#!/usr/bin/env node
'use strict';

// CLI entrypoint. In-memory store: each invocation is self-contained.
// Useful for end-to-end exercise via test-driven harness scenarios, where
// the runner stitches commands together within one process.

const { slugFor } = require('./shorten.js');
const { createStore } = require('./store.js');
const { summary, top } = require('./analytics.js');
const { clean } = require('./url-cleaner.js');

function run(argv, store = createStore()) {
  const [cmd, ...rest] = argv;
  switch (cmd) {
    case 'shorten': {
      const [raw] = rest;
      if (!raw) throw new Error('shorten: url required');
      const url = clean(raw);
      const slug = slugFor(url);
      store.put(slug, url);
      return slug;
    }
    case 'expand': {
      const [slug] = rest;
      if (!slug) throw new Error('expand: slug required');
      const rec = store.get(slug);
      if (!rec) throw new Error(`expand: no slug ${slug}`);
      store.recordHit(slug);
      return rec.url;
    }
    case 'list': {
      const rows = store.all();
      if (rows.length === 0) return '(empty)';
      return rows.map((r) => `${r.slug}\t${r.url}\t${r.hits}`).join('\n');
    }
    case 'analytics': {
      const s = summary(store);
      const t = top(store, 5);
      const head = `slugs=${s.totalSlugs} hits=${s.totalHits}`;
      if (t.length === 0) return head;
      const body = t.map((r) => `${r.hits}\t${r.slug}\t${r.url}`).join('\n');
      return `${head}\n${body}`;
    }
    case undefined:
    case 'help':
      return 'commands: shorten <url> | expand <slug> | list | analytics';
    default:
      throw new Error(`unknown command: ${cmd}`);
  }
}

module.exports = { run };

if (require.main === module) {
  try {
    console.log(run(process.argv.slice(2)));
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
