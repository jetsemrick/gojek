---
name: figjam-summary
description: Summarize a FigJam board into decisions, themes, open questions, and action items. Use when a designer pastes a figma.com/board link and asks to "summarize this board", "what did we decide in the workshop", "pull action items from…", or turn workshop stickies into feedback for a prototype. Not for Figma Design frames (use inspect-design), exporting a prototype to Figma (use design-export-figma), or creating FigJam diagrams.
---

# FigJam summary

Summarize a **FigJam board** for design reviews, sprint planning, or async team updates.

## When to use

- User provides a FigJam board URL for summary or synthesis.
- Secondary research input during `design-research`.
- Workshop retros, brainstorming boards, or flow diagrams need structured notes.

## Required preflight

Figma access comes from Figma's official Cursor plugin.

1. Confirm the official `figma-use` and `figma-generate-design` skills and the
   required remote FigJam tools are available.
2. If missing, **stop** and instruct the user to run `/add-plugin figma`, reload
   Cursor, and retry.
3. If disconnected, **stop** and instruct the user to open
   **Customize → Plugins → Figma**, choose **Connect/Authenticate**, and
   complete OAuth.
4. Never request a PAT or configure a Bearer token.

## Workflow

1. **Parse URL** — Confirm `/board/` or FigJam file key; extract file key.
2. **Call Figma MCP** — Read board content (stickies, sections, connectors, shapes) via available FigJam tools.
3. **Apply rules** — Follow `figma-figjam-handoff` grouping conventions.
4. **Output** — Structured summary (see template below).

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
| URL is Figma Design, not FigJam | Load `inspect-design` instead |
| Empty or sparse board | Report what MCP returned; ask if the correct board link was shared |
| Official plugin missing | Run `/add-plugin figma`, reload Cursor, and retry |
| OAuth required | Authenticate from Customize → Plugins → Figma |
| MCP lacks FigJam tools | Note blocker; suggest manual export or browser review |

## Example prompts

- "Summarize this FigJam retro board: [URL]"
- "Extract decisions and action items from this workshop board: [URL]"

## Related

- Rule: `figma-figjam-handoff`
- Figma Design inspect: `inspect-design`
