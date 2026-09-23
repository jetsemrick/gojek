---
name: inspect-design
description: Read a Figma Design frame or layer and write mobile handoff or review notes (layout, type, color, components, touch targets, safe areas). Use when a designer pastes a figma.com/design link with a node-id and asks to "inspect this frame", "spec this", "write handoff notes", "review spacing on…", or "what components does this use", or shares a Figma frame as research input. Not for exporting or pushing a prototype to Figma (use design-export-figma), implementing a Figma design as code (the official Figma plugin handles that), or FigJam boards (use figjam-summary).
---

# Inspect design

Inspect a **Figma Design** frame or layer and produce structured handoff documentation optimized for **mobile** development.

## When to use

- Designer asks to **inspect**, **spec**, or **hand off** a Figma frame or component.
- Preparing **mobile** dev handoff (React Native, SwiftUI, Android).
- **Design review** — spacing, accessibility, consistency checks.
- Secondary research input during `design-research`.

Primary output is **documentation**, not code.

## Required preflight

Figma access comes from Figma's official Cursor plugin.

1. Confirm the official `figma-use` and `figma-generate-design` skills and the
   required remote Figma read tools are available.
2. If missing, **stop** and instruct the user to run `/add-plugin figma`, reload
   Cursor, and retry.
3. If disconnected, **stop** and instruct the user to open
   **Customize → Plugins → Figma**, choose **Connect/Authenticate**, and
   complete OAuth.
4. Never request a PAT or configure a Bearer token.

## Workflow

### 1. Accept the Figma URL

Required: link with `node-id` query param. Parse file key and node id; normalize
id for MCP (`-` → `:`). If missing, ask the designer to:

1. Select the frame in Figma
2. Right-click → **Copy link to selection**

### 2. Retrieve context via Figma MCP

Call appropriate MCP tools for the node. Prefer structured design context over screenshots alone.

Apply `mobile-design-handoff` and `figma-figjam-handoff` rules.

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
- Tap targets at least 44pt (iOS) / 48dp (Android)?

### 5. Review mode (optional)

If the designer asks for **review** rather than specs, add:

- **Consistency** — alignment to nearby screens in file if context available
- **States** — missing hover/pressed/disabled/error
- **Content** — placeholder vs final copy

## Output expectations

- Designer-readable language (not raw MCP JSON).
- Mobile assumptions stated explicitly (device size, safe areas).
- **No code** unless the user also asks for implementation.
- Flag missing states or ambiguous interactions.

## Troubleshooting

| Issue | Action |
| --- | --- |
| Missing `node-id` | Ask designer to copy link to selection |
| Official plugin missing | Run `/add-plugin figma`, reload Cursor, and retry |
| MCP auth error | Authenticate with Figma OAuth from Customize → Plugins → Figma |
| Wrong file type (FigJam) | Load `figjam-summary` instead |

## Example prompts

- "Inspect this frame for mobile handoff: [URL]"
- "Review spacing and typography on this checkout screen: [URL]"
- "What components are used in this nav bar? [URL]"

## Do not

- Generate full implementation unless the user explicitly starts a separate,
  scoped implementation request using the official Figma plugin.
- Invent colors or fonts not returned by MCP.
- Require or reference `DESIGN_TOKEN_PATH`.
