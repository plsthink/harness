# max-length — PRD

<!-- Fixture: a faithful canonical PRD so the prd→issues→triage→execute-issue pipeline can be
     dogfooded against a MULTI-PACKAGE mock. Vocabulary routed per-package via CONTEXT-MAP
     (core's slugify, cli's Invocation); no file paths / code; no Status (a per-issue field). -->

## Problem
A Slug from arbitrary text can be arbitrarily long, but many consumers — URL path segments, file
names, fixed-width columns — cap how long a Slug may be. Today neither `core` nor the `cli`
Invocation offers any way to bound a Slug's length.

## Solution
`core`'s slugify gains an optional maximum length: when supplied, the finished Slug is capped to
that many characters and stays a valid Slug (no trailing dash). The `cli` Invocation exposes the
cap through a `--max-length` flag, leaving every existing invocation unchanged when the flag is
absent.

## User stories
1. As a caller of `core`, I want slugify to optionally cap the Slug length, so that I can fit a Slug
   into a fixed-width field.
2. As a caller, I want a capped Slug to never end in a dash, so that truncation still yields a valid
   Slug.
3. As a caller, I want a cap larger than the Slug to leave it unchanged, so that the cap is a
   ceiling, not padding.
4. As a `cli` user, I want a `--max-length` flag on the slug Invocation, so that I can bound output
   from the command line.
5. As a `cli` user, I want omitting the flag to behave exactly as it does today, so that existing
   usage is unaffected.
6. As a `cli` user, I want a `--max-length` with no number (or a non-numeric one) to be a usage
   error, so that a malformed Invocation fails loudly rather than producing a surprising Slug.

## Implementation decisions
- `core`: slugify takes an optional second argument carrying a maximum length. When it is a
  positive number the Slug is cut to that many characters and any resulting trailing dash is
  trimmed, so the output stays a valid Slug; without it the behaviour is unchanged. slugify stays
  pure and still rejects non-string text.
- The cap is measured on the finished Slug — applied after the existing lowercase / dash-collapse /
  edge-trim — so length is counted on the canonical form, not the raw input.
- `cli`: the Invocation extracts the `--max-length` flag and its value from argv before joining the
  remaining words, then hands the parsed cap to `core`. A missing or non-numeric value is a usage
  error, consistent with how empty input is already handled.

## Testing decisions
- Test external behaviour through each package's public interface — slugify in `core`, run in `cli`
  — never the truncation step in isolation.
- `core` cases: a cap shorter than the Slug truncates and trims a trailing dash; a cap at or above
  the Slug length leaves it unchanged; an omitted cap reproduces today's behaviour; a non-string
  still throws.
- `cli` cases: `--max-length` bounds the printed Slug; omitting the flag matches today; a missing or
  non-numeric value is a usage error.
- Mirror each package's existing node --test style (assert on the public function's return value).

## Out of scope
Word-boundary-aware truncation (cutting only at dash boundaries), a minimum length, and a
configurable separator character. Not this feature.

## Notes
First work item in slug-mono and the first multi-package pipeline fixture: one vertical slice cuts
both `core` and `cli`, exercising per-package glossary routing (core's slugify term, cli's
Invocation term) end to end.
