'use strict';

// Deterministic hash-based slug from a canonical URL. base62 encode the
// sha256 digest prefix; length is configurable.

const crypto = require('node:crypto');
const { parseUrl, canonical } = require('./url-parse.js');

const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const DEFAULT_LEN = 7;
const MAX_LEN = 22;

function base62(buf) {
  let n = 0n;
  for (const b of buf) n = (n << 8n) | BigInt(b);
  if (n === 0n) return '0';
  let s = '';
  while (n > 0n) {
    s = BASE62[Number(n % 62n)] + s;
    n = n / 62n;
  }
  return s;
}

function slugFor(url, len = DEFAULT_LEN) {
  if (!Number.isInteger(len) || len < 1 || len > MAX_LEN) {
    throw new Error(`slugFor: len must be an integer in [1, ${MAX_LEN}]`);
  }
  const canon = canonical(parseUrl(url));
  const digest = crypto.createHash('sha256').update(canon).digest();
  // 16 bytes of entropy ≈ 22 base62 chars; pad-left then take the first `len`.
  const encoded = base62(digest.subarray(0, 15));
  return encoded.padStart(MAX_LEN, '0').slice(0, len);
}

module.exports = { slugFor, base62, BASE62, DEFAULT_LEN, MAX_LEN };
