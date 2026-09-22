---
name: design-research
description: Research inspiration and patterns for a design request — Phase 1 of the design request workflow. Load when the user asks for design research or inspiration.
---

# Design research

Run **Phase 1 (Research)** of the design request workflow.

## When to use

- A **design request** arrives (new screen, flow, component, or UX improvement).
- Phase 1 of `design-request`, or the user asks for research/inspiration only.
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

Apply `design-request-workflow` rule.

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
- Figma frames → run the official Figma plugin preflight before any Figma call:
  - Missing capabilities: stop that branch and instruct the user to run
    `/add-plugin figma`, reload Cursor, and retry.
  - Disconnected plugin: stop that branch and instruct the user to complete
    OAuth from **Customize → Plugins → Figma → Connect/Authenticate**.
  - Never request a PAT or configure a Bearer token.
- After preflight passes, load `inspect-design` for existing team patterns.
- FigJam boards → load `figjam-summary` for workshop context.

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
Ready for `design-prototype` — [one sentence on what to build first]
```

### 4. Hand off to prototype phase

End with explicit readiness: either proceed to prototype (if user asked for full flow) or pause for designer approval.

For high-impact or weakly sourced findings, optionally use the
`design-research-verifier` agent for one bounded verification report. That
agent does not orchestrate later stages.

## Example prompts

- "Research mobile checkout nudge patterns for a grocery app — bottom sheet, dismissible, savings callout."
- "Research onboarding for a fintech app: trust, biometrics optional, 390px mobile."
- "What inspiration exists for sticky CTAs above the home indicator on iOS?"

## Do not

- Build HTML in this phase (load `design-prototype` instead).
- Generate production React Native / SwiftUI code unless explicitly requested separately.
- Invent competitor features — cite or label as assumption.
- Require Figma auth when the request has no Figma URLs.

## Related

- Full flow: `design-request`
- Next phase: `design-prototype`
