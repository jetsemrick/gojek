---
name: design-export-figma
description: Capture an approved, locally served HTML prototype into Figma through the official plugin.
---

# Design export to Figma

Run the **Export to Figma** stage: serve the approved HTML and capture its live
browser rendering as editable Figma layers.

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

1. Load the local `design-publish-figma` skill.
2. Run its preflight before starting a server or editing notes:
   - Confirm the official `figma-use` and `figma-generate-design` skills and
     remote `generate_figma_design` tool exist.
   - If missing, **stop** and instruct the user to run `/add-plugin figma`,
     reload Cursor, and retry.
   - If disconnected, **stop** and instruct the user to use
     **Customize → Plugins → Figma → Connect/Authenticate**, complete Figma
     OAuth, and retry.
   - Never ask for a PAT or configure a Bearer token.
3. Confirm the HTML artifact is approved/stable; read companion notes for its
   version and screen name.
4. Serve the artifact at a verified `http://localhost:<port>/...` URL.
5. Load the official `figma-generate-design` skill and use
   `generate_figma_design` for live browser capture:
   - No file key: create a new file in drafts.
   - File key/Design URL: add the capture to that existing file.
6. For an existing file outside drafts, verify the user has a **Full seat** and
   **edit permission**. Do not silently fall back to another target.
7. Return the exact Figma URL from the capture result and append it to the
   notes. Never report success without that URL.
8. Use `use_figma` only for optional post-capture refinement after loading the
   official `figma-use` skill.

## Output

- Figma file/frame URL
- Create/update mode, captured state, and any limitations
- Optional notes entry documenting the export

## Failure fallback

If capture or permissions fail, preserve the HTML and return the blocker. Retain
the existing fallback: preview via Cursor Canvas/artifact or the localhost URL,
then manually import a screenshot plus the structure/spec summary. Clipboard or
new-draft capture requires user approval.

## Related

- Full flow: `/design-request` (offers export after iteration)
- Prior stage: `/design-iterate`
- Figma inspect (research input): `/inspect-design`
