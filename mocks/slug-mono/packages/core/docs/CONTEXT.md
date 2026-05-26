# core glossary

Glossary only — terms + definitions. No implementation detail.

**slugify** — `core`'s single pure operation: maps arbitrary text to a Slug, collapsing every run
of non-alphanumerics to one dash and trimming edge dashes. Rejects non-string input.
_Avoid_: normalize, clean, sanitize
