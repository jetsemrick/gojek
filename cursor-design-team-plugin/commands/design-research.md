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
4. If Figma/FigJam URLs are in the brief, run the official Figma plugin
   preflight before any Figma call:
   - Missing capabilities: stop that branch and instruct the user to run
     `/add-plugin figma`, reload Cursor, and retry.
   - Disconnected plugin: stop that branch and instruct the user to complete
     OAuth from **Customize → Plugins → Figma**.
   - Never request a PAT or configure a Bearer token.
5. Use the secondary inspect/summary workflow only after preflight passes.
6. Optionally delegate an isolated evidence check to
   `design-research-verifier`; it does not own the workflow.
7. Output research summary markdown with recommended prototype scope.

## Output

Research summary — **not** HTML or production code.

End with: "Ready for `/design-prototype`" and list recommended first screen/states.

## Related

- Full flow: `/design-request`
- Next phase: `/design-prototype`
