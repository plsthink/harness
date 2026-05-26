---
name: {{SKILL_NAME}}
description: {{WHAT_IT_DOES}} Use when {{TRIGGERS}}.
---

# {{SKILL_NAME}}

{{ONE_LINE_PURPOSE}}

## When to fire

- {{TRIGGER_1}}

## Procedure

1. {{STEP_1}}

<!-- Detail lives in references/, loaded only when the step that needs it runs.
     References are one level deep — no deepening chain (lateral sibling cross-links are fine).
     Name the reference + when to read it;
     do not inline its content. Shared conventions: cite ${CLAUDE_PLUGIN_ROOT}/shared/<x>.md. -->

## Pipeline
- Reads:  {{READS}}
- Writes: {{WRITES}}
- Next:   {{NEXT}}
