---
name: figjam-summary
description: Summarize a FigJam board — workshops, stickies, sections, and flows — into decisions, open questions, and action items.
---

# FigJam summary

Summarize a **FigJam board** for design reviews, sprint planning, or async team updates.

## Usage

Provide a FigJam board URL from the browser.

**Example:**

```
/figjam-summary https://www.figma.com/board/XYZ789/Product-Workshop
```

Or in chat:

> Summarize this FigJam retro board: [paste FigJam URL]

## Steps

1. **Parse URL** — Confirm `/board/` or FigJam file key; extract file key.
2. **Preflight** — Confirm the official `figma-use` and
   `figma-generate-design` skills and required remote FigJam tools are
   available.
   - If missing, **stop** and tell the user to run `/add-plugin figma`, reload
     Cursor, and retry.
   - If disconnected, **stop** and tell the user to use
     **Customize → Plugins → Figma → Connect/Authenticate**, complete OAuth,
     and retry.
   - Never request a PAT or configure a Bearer token.
3. **Call Figma MCP** — Read board content (stickies, sections, connectors, shapes) via available FigJam tools.
4. **Apply rules** — Follow `figma-figjam-handoff` grouping conventions.
5. **Output** — Structured summary (see template below).

## Output template

```markdown
## FigJam summary — [Board title if known]

**Board:** [URL]

### Purpose
[Inferred workshop goal, 1–2 sentences]

### Key decisions
- ...

### Ideas & themes
- ...

### Open questions
- ...

### Action items
| Item | Owner (if labeled) | Notes |
| --- | --- | --- |

### User flows / diagrams
[Describe connectors and flows in plain language]

### Follow-ups for design
- ...
```

## Designer tips

- **Color-coded stickies** — Mention color meaning if sections are labeled (e.g. green = decided).
- **Sections** — Preserve workshop structure (e.g. "Problem", "Solutions", "Next steps").
- **Do not** flatten everything into one bullet list; keep workshop narrative.

## Troubleshooting

| Issue | Action |
| --- | --- |
| URL is Figma Design, not FigJam | Use `/inspect-design` instead |
| Empty or sparse board | Report what MCP returned; ask if the correct board link was shared |
| Official plugin missing | Run `/add-plugin figma`, reload Cursor, and retry |
| OAuth required | Authenticate from Customize → Plugins → Figma |
| MCP lacks FigJam tools | Note blocker; suggest manual export or browser review |

## Related

- Rule: `figma-figjam-handoff`
- Skill: `figma-inspect-handoff` (for Design files only)
