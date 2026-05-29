'use strict';

const http = require('node:http');
const { parseMarkdown, renderHTML } = require('../core');
const { parseRoute } = require('./route-parser');

// createServer({ store }) -> http.Server
// `store` is { get(slug): string | null | undefined } — the markdown source for the page slug, or a
// nullish value when no such page exists. The server exposes one route, `GET /page/:slug`, which
// reads the markdown via `store`, parses it through `core.parseMarkdown`, renders the result
// through `core.renderHTML`, and returns it as an `text/html` response. Unknown routes return 404
// with a plain-text body; a `store.get` that returns nullish for the slug returns 404 as well.
function createServer({ store }) {
  if (!store || typeof store.get !== 'function') {
    throw new TypeError('createServer expects { store: { get(slug) } }');
  }
  return http.createServer((req, res) => {
    if (req.method !== 'GET') {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('method not allowed');
      return;
    }
    const route = parseRoute(req.url);
    if (!route) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('not found');
      return;
    }
    const markdown = store.get(route.slug);
    if (markdown == null) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('not found');
      return;
    }
    const html = renderHTML(parseMarkdown(markdown));
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  });
}

module.exports = { createServer };
