---
name: design-export-figma
description: Export an approved HTML canvas prototype to Figma — create or update a mobile frame from the HTML artifact. Use for Phase 4 of the design request workflow or when /design-export-figma is invoked.
---

# Design export to Figma

## When to use

- HTML prototype is **approved** or marked stable after iteration (Phase 3 complete).
- User runs `/design-export-figma` or Phase 4 of `/design-request`.
- Designer wants the canvas artifact pushed into Figma for polish, annotation, or team handoff.

Primary output is a **Figma file/frame URL** plus a short summary of what was created or updated.

## Prerequisites

Before starting, confirm:

1. **Approved HTML artifact** — stable version path (e.g. `prototypes/savings-nudge-v1.html`); read companion notes for screen name, version, and changelog.
2. **Figma auth connected** — `FIGMA_ACCESS_TOKEN` configured in **Plugins → Configure**, or Figma desktop MCP enabled (`http://127.0.0.1:3845/mcp`). If auth is missing, stop and instruct the designer to connect Figma MCP before export.
3. **Required Cursor Figma skills loaded** — before any MCP write call:
   - Load `figma-use` skill (mandatory before `use_figma` tool calls).
   - Load `figma-generate-design` skill when assembling a full page/frame from the HTML layout (preferred for HTML → Figma export).

## Inputs

Required:
1. **HTML artifact path** — e.g. `prototypes/savings-nudge-v1.html`

Optional:
2. **`--figma-file-key`** — existing Figma file key (from URL `figma.com/design/<file-key>/...`). When provided, **update** that file (add or replace a frame). When omitted, **create** a new Figma file or frame per MCP capabilities.
3. **Frame name** — default from prototype comment or notes (e.g. "Savings nudge — v1.1.0").
4. **Target page** — page name in existing file (default: first page or "Design requests").

If artifact path is missing, ask once. If HTML is not self-contained or fails mobile standards, flag before export.

## Workflow

### 1. Validate artifact

Read the HTML file and companion notes (`*-notes.md` if present):

- Confirm **390px** mobile viewport and safe-area conventions (`html-prototype-standards`).
- Extract screen name, version, key states, and semantic regions (header, main, footer, sheet, etc.).
- Note interactive states shown in HTML — export **default/primary state** unless user asks for multiple frames.

### 2. Choose create vs update

| Mode | When | Behavior |
| --- | --- | --- |
| **Create new** | No `--figma-file-key` | Create new Figma file or top-level mobile frame via Figma MCP / generate-design workflow |
| **Update existing** | `--figma-file-key` provided | Open target file; add new frame or replace frame matching prototype name/version |

When updating, prefer **adding a versioned frame** (e.g. `Savings nudge v1.1`) over destructive overwrite unless user explicitly requests replace.

### 3. Set up mobile frame conventions

Create or target a frame with mobile-first dimensions:

| Property | Value |
| --- | --- |
| Width | **390px** (iPhone 14/15 logical width) |
| Height | Content-driven; typical **844px** for full screen, or auto-height for sheets |
| Safe areas | Top **59px** (status + nav) and bottom **34px** (home indicator) padding guides, or use Figma safe-area components if available |
| Layout | Auto-layout vertical where possible; match HTML spacing hierarchy |
| Naming | `[Screen name] — v[version]` |

Map HTML semantic blocks to Figma frames/groups:

- `header` → top bar group
- `main` → scroll content
- fixed footer / sticky CTA → bottom group with safe-area inset
- bottom sheet → separate frame or component instance if sheet is primary UI

### 4. Export via Figma MCP

Use Figma MCP tools appropriate to the environment:

1. **Load skills:** `figma-use`, then `figma-generate-design` for page assembly.
2. **Inspect HTML structure** — parse DOM/CSS for typography, colors, spacing, border-radius, shadows (approximate tokens; no design-token sync required).
3. **Push design:**
   - **Preferred:** `figma-generate-design` workflow — translate the HTML page/sections into Figma using design-system search where team libraries exist; assemble section-by-section.
   - **Alternative:** `use_figma` MCP tool — create frame, set dimensions, add text/rectangles/auto-layout to mirror HTML hierarchy.
4. **Create file** (when no file key): use MCP file-creation capabilities if available; otherwise create frame in user's designated team project and return URL.
5. **Update file** (when file key provided): navigate to file, create frame on target page, build layers from HTML.

Document any elements that could not be mapped exactly (custom JS interactions, web fonts, complex gradients).

### 5. Deliver output

Return to the designer:

```markdown
## Figma export complete

**Source:** `prototypes/<slug>-v1.html` (v1.1.0)
**Figma:** https://www.figma.com/design/<file-key>/...?node-id=...
**Mode:** Created new frame | Updated existing file
**Frame:** [Screen name] — v1.1.0 (390×844)

### Created
- Mobile frame with header, content, sticky CTA
- Safe-area padding applied
- [List major sections mapped]

### Limitations
- [Interactive states not exported / animations omitted / font approximated]

### Next steps
- Polish typography and color in Figma
- Add component variants for additional states if needed
- Link frame in design review or handoff doc
```

Append export record to companion notes:

```markdown
### Figma export — [date]
- **URL:** [figma link]
- **Frame:** [name]
- **From artifact:** `prototypes/<slug>-v1.html` v1.1.0
```

## Example prompts

- `/design-export-figma prototypes/savings-nudge-v1.html`
- `/design-export-figma prototypes/login-v1.html --figma-file-key abc123XYZ`
- "Export the approved savings nudge prototype to Figma — create a new mobile frame."
- "Push the latest login HTML to our existing Figma file (key: abc123XYZ) as a new frame."

## Do not

- Export before the designer approves the HTML artifact (confirm or infer from "approved", "ready for Figma", or explicit export command).
- Skip Figma auth setup — export requires write access.
- Use token-sync or Code Connect export in this phase unless user explicitly requests it.
- Replace existing Figma frames without confirmation when updating a shared file.
- Export desktop layouts or non-mobile viewports unless user overrides.

## Blockers and limitations

- **Figma write API / MCP:** Not all MCP deployments support file creation or programmatic layer writes; if tools fail, document the error and fall back to manual import instructions (screenshot + structure spec from HTML).
- **Pixel-perfect parity:** HTML → Figma is approximate; complex CSS (grid, calc, animations) may need manual polish in Figma.
- **Multi-state flows:** Export one primary frame per invocation; additional states require separate frames or follow-up export commands.
