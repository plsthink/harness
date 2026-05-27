'use strict';

// slugify(text, max?) -> Slug: lowercase, every run of non-alphanumerics collapsed to a single dash,
// leading/trailing dashes trimmed. Pure; throws TypeError on non-string input. When `max` is a
// positive number the Slug is capped to that many characters and any resulting trailing dash is
// trimmed, so the output is always a valid Slug; otherwise `max` is ignored.
function slugify(text, max) {
  if (typeof text !== 'string') throw new TypeError('slugify expects a string');
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (typeof max === 'number' && max > 0 && slug.length > max) {
    return slug.slice(0, max).replace(/-+$/g, '');
  }
  return slug;
}

// isSlug(text) -> boolean: true iff `text` is already a canonical Slug. A string is a valid Slug
// exactly when slugifying it changes nothing and it is non-empty; non-string input is not a Slug
// (returns false rather than throwing).
function isSlug(text) {
  return typeof text === 'string' && text.length > 0 && text === slugify(text);
}

module.exports = { slugify, isSlug };
