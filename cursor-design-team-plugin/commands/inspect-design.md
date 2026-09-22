---
name: inspect-design
description: Inspect a Figma frame or layer from URL and produce mobile-friendly handoff notes for designers and engineers.
---

# Inspect design

Inspect a **Figma Design** frame or layer and produce structured handoff documentation optimized for **mobile** development.

## Usage

Provide a Figma URL that includes `node-id` (copy link to selection in Figma).

**Example:**

```
/inspect-design https://www.figma.com/design/ABC123/MyApp?node-id=1-234
```

Or in chat:

> Inspect this screen for mobile handoff: [paste Figma URL]

## Steps

1. **Parse URL** — Extract file key and node id; normalize id for MCP (`-` → `:`).
2. **Load skill** — Follow `figma-inspect-handoff` skill instructions.
3. **Call Figma MCP** — Fetch design context for the node.
4. **Apply rules** — Use `mobile-design-handoff` and `figma-figjam-handoff` conventions.
5. **Output** — Handoff markdown (layout, type, color, components, assets, a11y, open questions).

## Output expectations

- Designer-readable language (not raw MCP JSON).
- Mobile assumptions stated explicitly (device size, safe areas).
- **No code** unless the user also asks for implementation.
- Flag missing states or ambiguous interactions.

## Troubleshooting

| Issue | Action |
| --- | --- |
| Missing `node-id` | Ask designer to copy link to selection |
| MCP auth error | Check Plugins → Configure → `FIGMA_ACCESS_TOKEN` or complete Figma OAuth |
| Wrong file type (FigJam) | Redirect to `/figjam-summary` command |

## Related

- Skill: `figma-inspect-handoff`
- For codegen: `figma-design-to-code` skill (explicit request only)
