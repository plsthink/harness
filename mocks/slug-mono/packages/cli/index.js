#!/usr/bin/env node
'use strict';

// The `cli` package consumes `core` by relative path: the monorepo is wired zero-install (no
// node_modules symlink needed), so a fresh checkout runs `npm test` green without `npm install`.
const { slugify, isSlug } = require('../core');

// run(argv) -> Slug for the joined arguments. Pure: returns the result, the entrypoint prints it.
// An optional `--max-length N` flag caps the Slug to N characters; a missing or non-numeric N is a
// usage error, like empty input. With `--check` the joined arguments are validated instead of
// slugified: it returns 'valid' or 'invalid' according to whether the input is already a Slug.
function run(argv) {
  let max;
  let check = false;
  const words = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--max-length') {
      const value = argv[++i];
      max = Number(value);
      if (value === undefined || !Number.isFinite(max)) {
        throw new Error('usage: slug [--max-length N] <text...>');
      }
      continue;
    }
    if (argv[i] === '--check') {
      check = true;
      continue;
    }
    words.push(argv[i]);
  }
  const text = words.join(' ');
  if (!text.trim()) throw new Error('usage: slug [--max-length N] <text...>');
  if (check) return isSlug(text) ? 'valid' : 'invalid';
  return slugify(text, max);
}

module.exports = { run };

if (require.main === module) {
  try {
    process.stdout.write(run(process.argv.slice(2)) + '\n');
  } catch (err) {
    process.stderr.write(err.message + '\n');
    process.exit(1);
  }
}
