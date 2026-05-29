'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { parseMarkdown, renderHTML } = require('../index.js');

test('parseMarkdown returns a heading block for an ATX heading', () => {
  const blocks = parseMarkdown('# Hello');
  assert.deepStrictEqual(blocks, [{ type: 'heading', level: 1, text: 'Hello' }]);
});

test('parseMarkdown recognises heading levels 1-6', () => {
  const blocks = parseMarkdown('###### Six');
  assert.deepStrictEqual(blocks, [{ type: 'heading', level: 6, text: 'Six' }]);
});

test('parseMarkdown groups consecutive non-blank lines into one paragraph', () => {
  const blocks = parseMarkdown('one\ntwo\n\nthree');
  assert.deepStrictEqual(blocks, [
    { type: 'paragraph', text: 'one two' },
    { type: 'paragraph', text: 'three' },
  ]);
});

test('parseMarkdown emits a code block for content between fences', () => {
  const blocks = parseMarkdown('```\nlet x = 1;\n```');
  assert.deepStrictEqual(blocks, [{ type: 'code', text: 'let x = 1;' }]);
});

test('parseMarkdown throws TypeError on non-string input', () => {
  assert.throws(() => parseMarkdown(42), TypeError);
});

test('renderHTML emits the expected tag for each block type', () => {
  const html = renderHTML([
    { type: 'heading', level: 2, text: 'Title' },
    { type: 'paragraph', text: 'Body.' },
    { type: 'code', text: 'x = 1' },
  ]);
  assert.strictEqual(html, '<h2>Title</h2>\n<p>Body.</p>\n<pre><code>x = 1</code></pre>');
});

test('renderHTML renders **bold** as <strong> in paragraphs and headings', () => {
  const html = renderHTML([
    { type: 'heading', level: 1, text: 'A **strong** title' },
    { type: 'paragraph', text: 'A **bold** word.' },
  ]);
  assert.strictEqual(
    html,
    '<h1>A <strong>strong</strong> title</h1>\n<p>A <strong>bold</strong> word.</p>',
  );
});

test('renderHTML escapes HTML special characters in text', () => {
  const html = renderHTML([{ type: 'paragraph', text: 'a < b & c > d' }]);
  assert.strictEqual(html, '<p>a &lt; b &amp; c &gt; d</p>');
});

test('renderHTML throws TypeError on non-array input', () => {
  assert.throws(() => renderHTML('not blocks'), TypeError);
});
