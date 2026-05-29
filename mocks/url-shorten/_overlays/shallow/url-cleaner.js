'use strict';

// SHALLOW: this is a thin wrapper around String.prototype.trim and a single
// regex. Interface ≈ implementation; no abstraction earned. /architecture
// should propose folding the trim into url-parse.js (which already validates
// input shape) or growing this module into a real input-sanitization
// responsibility (e.g. unicode-normalize host, IDN-aware homograph guards).

function clean(input) {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/\s+/g, '');
}

module.exports = { clean };
