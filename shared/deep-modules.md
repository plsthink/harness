# Deep modules — vocabulary

Cited by: `tdd`, `architecture`, `prd`, `diagnose`, `zoom-out`. Shared vocabulary for module design and the
deletion test. Single-source so every citer uses the same words.

## Vocabulary

- **Module** — a unit behind an interface. **Deep** = small interface, large implementation
  (much capability hidden behind little surface). **Shallow** = interface nearly as big as the
  implementation (little hidden; often pass-through). Prefer deep.
- **Interface** — the public surface: what callers depend on. Design it to express *what*, not
  *how*. Narrow interface + rich behavior = depth.
- **Depth** — capability-hidden ÷ interface-size. Deepening = moving complexity behind an
  existing interface, not adding surface.
- **Seam** — a place where you can substitute behavior (inject a dependency, swap an
  implementation) without changing callers. Testability lives at seams. **An absent seam where
  one is needed is itself a finding** (don't fabricate one to write a test — report it).
- **Deletion test** — "if I deleted this module, how much would callers have to re-implement?"
  A lot → deep/valuable. Almost nothing → shallow pass-through, a consolidation candidate.

## Use

- `tdd`: design interfaces for testability; test behavior through public interfaces, not internals.
- `architecture`: hunt deepening opportunities; apply the deletion test to find shallow modules to
  merge/remove.
- `prd`: confirm what modules exist + what to test, in this vocabulary.
