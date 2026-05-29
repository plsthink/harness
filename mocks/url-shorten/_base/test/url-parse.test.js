'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseUrl, canonical } = require('../url-parse.js');

test('parseUrl rejects empty / non-string input', () => {
  assert.throws(() => parseUrl(''), /url required/);
  assert.throws(() => parseUrl('   '), /url required/);
  assert.throws(() => parseUrl(null), /url required/);
});

test('parseUrl rejects invalid URLs', () => {
  assert.throws(() => parseUrl('not a url'), /invalid url/);
});

test('parseUrl rejects unsupported schemes', () => {
  assert.throws(() => parseUrl('ftp://example.com/'), /unsupported scheme/);
});

test('parseUrl normalizes scheme and host case', () => {
  const r = parseUrl('HTTPS://Example.COM/Path');
  assert.equal(r.scheme, 'https');
  assert.equal(r.host, 'example.com');
  assert.equal(r.path, '/Path');
});

test('parseUrl drops default ports and trailing-slash-only paths', () => {
  assert.equal(parseUrl('http://example.com:80/').port, '');
  assert.equal(parseUrl('https://example.com:443/').port, '');
  assert.equal(parseUrl('https://example.com/').path, '');
});

test('parseUrl retains non-default ports', () => {
  assert.equal(parseUrl('http://example.com:8080/').port, '8080');
});

test('canonical reassembles a record into a stable string', () => {
  const r = parseUrl('https://Example.com/x?a=1');
  assert.equal(canonical(r), 'https://example.com/x?a=1');
});
