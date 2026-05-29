'use strict';

// parseMarkdown(md) -> Block[]
// A Block is { type: 'heading', level: 1..6, text } | { type: 'paragraph', text } |
// { type: 'code', text }. The parser recognises:
//   - ATX headings: leading `#`..`######` followed by a space and the heading text
//   - fenced code blocks: lines between two ``` fences are emitted verbatim as a single code block
//   - everything else: a paragraph block per blank-line-separated run
// Pure; throws TypeError on non-string input.
function parseMarkdown(md) {
  if (typeof md !== 'string') throw new TypeError('parseMarkdown expects a string');
  const lines = md.split(/\r?\n/);
  const blocks = [];
  let i = 0;
  let para = [];
  const flushPara = () => {
    if (para.length === 0) return;
    blocks.push({ type: 'paragraph', text: para.join(' ') });
    para = [];
  };
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('```')) {
      flushPara();
      const code = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        code.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      blocks.push({ type: 'code', text: code.join('\n') });
      continue;
    }
    const heading = /^(#{1,6})\s+(.*\S)\s*$/.exec(line);
    if (heading) {
      flushPara();
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] });
      i++;
      continue;
    }
    if (line.trim() === '') {
      flushPara();
      i++;
      continue;
    }
    para.push(line.trim());
    i++;
  }
  flushPara();
  return blocks;
}

// renderHTML(blocks) -> string
// Renders the Block[] returned by parseMarkdown into an HTML fragment string. Inline emphasis is
// rendered for paragraph and heading text only: `**word**` becomes `<strong>word</strong>`. Code
// block text is emitted verbatim inside `<pre><code>` and is NOT scanned for emphasis.
function renderHTML(blocks) {
  if (!Array.isArray(blocks)) throw new TypeError('renderHTML expects an array of blocks');
  const out = [];
  for (const b of blocks) {
    if (b.type === 'heading') {
      out.push(`<h${b.level}>${renderInline(b.text)}</h${b.level}>`);
    } else if (b.type === 'paragraph') {
      out.push(`<p>${renderInline(b.text)}</p>`);
    } else if (b.type === 'code') {
      out.push(`<pre><code>${renderInline(b.text)}</code></pre>`);
    }
  }
  return out.join('\n');
}

function renderInline(text) {
  return escapeHTML(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function escapeHTML(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

module.exports = { parseMarkdown, renderHTML };
