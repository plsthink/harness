# core glossary

Glossary only — terms + definitions. No implementation detail.

**slugify** — `core`'s Slug-producing operation: maps arbitrary text to a Slug, collapsing every run
of non-alphanumerics to one dash and trimming edge dashes. Rejects non-string input.
_Avoid_: normalize, clean, sanitize

**isSlug** — `core`'s Slug-validating predicate: true iff `text` is already a canonical Slug
(slugifying it changes nothing and it is non-empty). Non-string input is not a Slug — returns false
rather than throwing.
_Avoid_: validate, isValid, check
