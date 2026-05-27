# cli glossary

Glossary only — terms + definitions. No implementation detail.

**Invocation** — One run of the `slug` command with text arguments: joins argv into one string,
asks `core` to slugify it (or to report whether it already is a Slug), and writes the result to stdout (empty input
is a usage error).
_Avoid_: call, execution
