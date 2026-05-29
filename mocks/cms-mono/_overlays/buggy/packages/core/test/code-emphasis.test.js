'use strict';

// Planted failing repro for the buggy overlay. The contract: code-block text is emitted verbatim
// inside <pre><code> and is NOT scanned for emphasis. The bug in _overlays/buggy/ is that
// renderHTML's code branch calls renderInline, so `**asterisks**` inside a fenced block render as
// <strong> instead of as literal text. /diagnose should reproduce this test, isolate the offending
// line in renderHTML, and replace renderInline with escapeHTML for the code branch.
const test = require('node:test');
const assert = require('node:assert');
const { parseMarkdown, renderHTML } = require('../index.js');

test('renderHTML preserves literal **asterisks** inside fenced code blocks', () => {
  const html = renderHTML(parseMarkdown('```\nuse `**` to emphasise\n```'));
  assert.strictEqual(html, '<pre><code>use `**` to emphasise</code></pre>');
});

test('renderHTML preserves a literal **bold-looking** span inside a fenced code block', () => {
  const html = renderHTML(parseMarkdown('```\nthe **bold** marker\n```'));
  assert.strictEqual(html, '<pre><code>the **bold** marker</code></pre>');
});
