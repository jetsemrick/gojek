---
name: design-export-figma
description: Export an approved HTML canvas prototype to Figma — Phase 4 of the design request workflow.
---

# Design export to Figma

Run **Phase 4 (Export to Figma)** — push an approved HTML prototype into Figma as a mobile frame.

## Usage

```
/design-export-figma <html-path> [--figma-file-key <key>]
```

**Examples:**

```
/design-export-figma prototypes/savings-nudge-v1.html
```

```
/design-export-figma prototypes/login-v1.html --figma-file-key abc123XYZ
```

## Steps

1. Load `design-export-figma` skill.
2. Confirm HTML artifact is approved/stable; read companion notes for version and screen name.
3. Verify Figma MCP auth (`FIGMA_ACCESS_TOKEN` or desktop MCP).
4. Load `figma-use` and `figma-generate-design` skills before MCP write calls.
5. Create new Figma file/frame, or update existing file when `--figma-file-key` is provided.
6. Apply mobile frame conventions (390px width, safe areas).
7. Return Figma URL + summary; append export record to companion notes.

## Output

- Figma file/frame URL
- Summary of created/updated frames and any export limitations
- Optional notes entry documenting the export

## Prerequisites

- Approved HTML artifact from Phase 2/3
- Figma MCP connected (required for this phase)

## Related

- Full flow: `/design-request` (includes export checkpoint after iterate)
- Prior phase: `/design-iterate`
- Figma inspect (research input): `/inspect-design`
