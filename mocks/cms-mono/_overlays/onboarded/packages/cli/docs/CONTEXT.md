# cli glossary

Glossary only — terms + definitions. No implementation detail.

**run** — `cli`'s top-level operation: takes the parsed argv `[inputDir, '--out', outDir]`, reads
every `.md` entry under `inputDir`, renders each via `core`, and writes the matching `.html` under
`outDir` (default `./out`). Returns `{ written: string[] }` — the list of paths it wrote. Skips
non-`.md` entries silently.
_Avoid_: build, main, execute

**inputDir** — The directory `run` walks for markdown sources. A missing or non-directory path is a
usage error; non-`.md` entries under it are skipped silently.
_Avoid_: src, source, pages
