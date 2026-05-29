'use strict';

// URL validation + normalization. Returns a normalized record or throws.
// Normalization: lowercase scheme + host, drop default ports, strip trailing
// slash on root paths, drop empty query.

function parseUrl(input) {
  if (typeof input !== 'string' || input.trim() === '') {
    throw new Error('parseUrl: url required');
  }
  let u;
  try {
    u = new URL(input.trim());
  } catch (_err) {
    throw new Error(`parseUrl: invalid url: ${input}`);
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    throw new Error(`parseUrl: unsupported scheme: ${u.protocol}`);
  }
  const scheme = u.protocol.replace(':', '');
  const host = u.hostname.toLowerCase();
  const defaultPort = scheme === 'http' ? '80' : '443';
  const port = u.port === '' || u.port === defaultPort ? '' : u.port;
  let path = u.pathname;
  if (path === '/' || path === '') path = '';
  const query = u.search.replace(/^\?/, '');
  return { scheme, host, port, path, query };
}

function canonical(record) {
  const portPart = record.port ? `:${record.port}` : '';
  const queryPart = record.query ? `?${record.query}` : '';
  return `${record.scheme}://${record.host}${portPart}${record.path}${queryPart}`;
}

module.exports = { parseUrl, canonical };
