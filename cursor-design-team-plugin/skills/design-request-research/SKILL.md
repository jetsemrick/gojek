---
name: design-request-research
description: Research inspiration and relevant publicly accessible designs or features for a design request. Use at the start of a design request workflow or when /design-research is invoked.
---

# Design request research

## When to use

- A **design request** arrives (new screen, flow, component, or UX improvement).
- User runs `/design-research` or Phase 1 of `/design-request`.
- Before building an HTML prototype — establish patterns, constraints, and inspiration.

Primary output is a **research summary**, not code or Figma edits.

## Inputs

Collect or infer:

1. **Problem statement** — what user/job is this for?
2. **Platform** — mobile (default), iOS/Android specifics if known.
3. **Constraints** — brand, accessibility, existing patterns, deadlines.
4. **References** — optional Figma/FigJam URLs, competitor apps, screenshots, prior prototypes.

If the brief is vague, ask **one focused clarifying question** before researching.

## Workflow

### 1. Scope the request

Restate the request in one paragraph. List:
- Target user and moment in the journey
- Success criteria for the design
- In-scope vs out-of-scope for MVP prototype

### 2. Gather inspiration

**Public / external sources (when web search is available):**
- Search for mobile UI patterns, accessibility guidance, and comparable product flows.
- Prefer **publicly accessible** examples (app store screenshots, design system docs, Material/HIG patterns, open design galleries).
- Cite sources with links; do not copy proprietary assets.

**Internal / team sources (when URLs provided):**
- Figma frames → use `figma-inspect-handoff` skill + Figma MCP for existing team patterns.
- FigJam boards → use `/figjam-summary` patterns for workshop context.

### 3. Synthesize findings

Produce a research summary using this template:

```markdown
## Research — [Request title]

**Request:** [one-line summary]
**Platform:** Mobile — [iOS / Android / cross-platform]
**Date:** [today]

### Problem & goals
- ...

### Inspiration & references
| Source | Type | Relevant takeaway |
| --- | --- | --- |
| [Name/link] | App / DS / Article | ... |

### Mobile UX patterns to apply
- Layout: ...
- Interaction: ...
- Accessibility: ...
- Safe area / touch targets: ...

### Risks & open questions
- [ ] ...

### Recommended prototype scope
- **Screens/states:** ...
- **Must-have interactions:** ...
- **Defer to later:** ...

### Next step
Ready for `/design-prototype` — [one sentence on what to build first]
```

### 4. Hand off to prototype phase

End with explicit readiness: either proceed to prototype (if user asked for full flow) or pause for designer approval.

## Example prompts

- "Research mobile checkout nudge patterns for a grocery app — bottom sheet, dismissible, savings callout."
- `/design-research Onboarding for a fintech app: trust, biometrics optional, 390px mobile.`
- "What inspiration exists for sticky CTAs above the home indicator on iOS?"

## Do not

- Build HTML in this phase (that is `design-prototype-html`).
- Generate production React Native / SwiftUI code unless explicitly requested separately.
- Invent competitor features — cite or label as assumption.
- Require Figma auth when the request has no Figma URLs.
