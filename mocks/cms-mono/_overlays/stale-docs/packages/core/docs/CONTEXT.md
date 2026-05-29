# core glossary

Glossary only — terms + definitions. No implementation detail.

**parseMarkdown** — `core`'s Block-producing operation: maps a markdown string to a Block array.
Recognises ATX headings (levels 1-6), fenced code blocks, and blank-line-separated paragraphs;
collapses every paragraph's lines into a single space-joined `text`. Rejects non-string input.
_Avoid_: tokenize, lex, parse

**toHTML** — `core`'s Block-rendering operation: maps a Block array to an HTML fragment string.
Renders `**bold**` as `<strong>` inside paragraph and heading text only; code-block text is emitted
verbatim inside `<pre><code>` and is NOT scanned for emphasis. Escapes `<`, `>`, `&` in text content.
Rejects non-array input.
_Avoid_: format, stringify
