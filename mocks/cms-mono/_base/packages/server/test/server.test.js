'use strict';

const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const { createServer } = require('../index.js');

function fetch(server, path) {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    http
      .get({ host: '127.0.0.1', port, path }, (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () =>
          resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') }),
        );
      })
      .on('error', reject);
  });
}

function withServer(store, body) {
  return new Promise((resolve, reject) => {
    const server = createServer({ store });
    server.listen(0, '127.0.0.1', async () => {
      try {
        const result = await body(server);
        server.close(() => resolve(result));
      } catch (err) {
        server.close(() => reject(err));
      }
    });
  });
}

test('GET /page/:slug renders stored markdown as HTML', async () => {
  const store = { get: (slug) => (slug === 'hello' ? '# Hi' : null) };
  await withServer(store, async (server) => {
    const { status, body } = await fetch(server, '/page/hello');
    assert.strictEqual(status, 200);
    assert.strictEqual(body, '<h1>Hi</h1>');
  });
});

test('GET /page/:slug returns 404 when the store has no markdown for the slug', async () => {
  const store = { get: () => null };
  await withServer(store, async (server) => {
    const { status, body } = await fetch(server, '/page/missing');
    assert.strictEqual(status, 404);
    assert.strictEqual(body, 'not found');
  });
});

test('GET on an unknown route returns 404', async () => {
  const store = { get: () => '# Hi' };
  await withServer(store, async (server) => {
    const { status } = await fetch(server, '/');
    assert.strictEqual(status, 404);
  });
});

test('createServer rejects a missing or malformed store', () => {
  assert.throws(() => createServer({}), TypeError);
  assert.throws(() => createServer({ store: {} }), TypeError);
});
