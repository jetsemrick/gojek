---
name: design-research
description: Research inspiration and patterns for a design request — Phase 1 of the design request workflow.
---

# Design research

Run **Phase 1 (Research)** of the design request workflow.

## Usage

```
/design-research <design brief or question>
```

**Examples:**

```
/design-research Checkout nudge bottom sheet — mobile grocery app, savings callout, dismissible
```

```
/design-research What mobile patterns exist for sticky CTAs above the home indicator?
```

## Steps

1. Load `design-request-research` skill.
2. Apply `design-request-workflow` rule.
3. Scope the request; gather public inspiration (web search when available).
4. If Figma/FigJam URLs are in the brief, use MCP + secondary inspect/summary skills.
5. Output research summary markdown with recommended prototype scope.

## Output

Research summary — **not** HTML or production code.

End with: "Ready for `/design-prototype`" and list recommended first screen/states.

## Related

- Full flow: `/design-request`
- Next phase: `/design-prototype`
