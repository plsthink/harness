'use strict';

// parseRoute(url) -> { slug } | null
// Extracts the page slug from a `/page/:slug` URL. Returns null when the URL is not a page route.
function parseRoute(url) {
  const match = /^\/page\/([A-Za-z0-9_-]+)$/.exec(url || '');
  if (!match) return null;
  return { slug: match[1] };
}

module.exports = { parseRoute };
