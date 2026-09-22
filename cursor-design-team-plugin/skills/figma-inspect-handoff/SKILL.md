---
name: figma-inspect-handoff
description: Inspect Figma frames and produce designer-friendly mobile handoff notes — layout, typography, colors, components, and platform guidance. Use for design review and dev handoff, not codegen.
---

# Figma inspect & handoff

## When to use

- Designer asks to **inspect**, **spec**, or **hand off** a Figma frame or component.
- Preparing **mobile** dev handoff (React Native, SwiftUI, Android).
- **Design review** — spacing, accessibility, consistency checks.

Primary output is **documentation**, not code.

## Workflow

### 1. Accept the Figma URL

Required: link with `node-id` query param. If missing, ask the designer to:

1. Select the frame in Figma
2. Right-click → **Copy link to selection**

### 2. Retrieve context via Figma MCP

Call appropriate MCP tools for the node. Prefer structured design context over screenshots alone.

### 3. Produce handoff document

Use this template:

```markdown
## [Screen name]

**Figma:** [URL]
**Node:** [node id]
**Assumed device:** [e.g. iPhone 15 — 390×844]

### Overview
[1–2 sentences]

### Layout
- Structure: [header / scroll / footer]
- Key spacing: [padding, gaps]
- Scroll behavior: [fixed header, full scroll, etc.]

### Typography
| Role | Font | Size | Weight | Line height |
| --- | --- | --- | --- | --- |

### Colors
| Token / usage | Hex | Notes |
| --- | --- | --- |

### Components
| Component | Variant / state | Notes |
| --- | --- | --- |

### Assets
- [Icons, illustrations — export scale and format]

### Mobile & accessibility
- Touch targets: [pass / issues]
- Safe area: [notes]
- Platform deltas: [iOS vs Android if any]

### Open questions
- [ ] ...
```

### 4. Mobile-specific checks

- Frame width matches a known device preset?
- Bottom CTAs clear home indicator inset?
- Text scales — any truncation risk at smaller devices?
- Tap targets ≥ 44pt?

### 5. Review mode (optional)

If the designer asks for **review** rather than specs, add:

- **Consistency** — alignment to nearby screens in file if context available
- **States** — missing hover/pressed/disabled/error
- **Content** — placeholder vs final copy

## Example prompts

- "Inspect this frame for mobile handoff: [URL]"
- "Review spacing and typography on this checkout screen: [URL]"
- "What components are used in this nav bar? [URL]"

## Do not

- Generate full implementation unless separately requested via `figma-design-to-code`.
- Invent colors or fonts not returned by MCP.
- Require or reference `DESIGN_TOKEN_PATH`.
