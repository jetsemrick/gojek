---
name: design-publish-figma
description: Capture an approved, locally served HTML prototype into Figma with the official generate_figma_design workflow. Use for the Export phase of /design-request or when /design-export-figma is invoked.
---

# Publish an HTML prototype to Figma

Use Figma's **code to canvas** path: serve the approved HTML, capture the live
browser page with `generate_figma_design`, and return the resulting Figma URL.
Do not manually rebuild the DOM through `use_figma`.

## Required preflight

Figma access is supplied by Figma's official Cursor plugin; this plugin does not
bundle Figma skills or an MCP server.

Before reading or writing Figma:

1. Confirm the official skills `figma-use` and `figma-generate-design` are
   available, and confirm the **remote** Figma MCP exposes
   `generate_figma_design`.
2. If any capability is missing, **stop**. Tell the user:
   1. Run `/add-plugin figma` in Cursor agent chat.
   2. Reload Cursor so its tool list refreshes.
   3. Retry `/design-export-figma`.
3. If Figma is installed but disconnected, **stop**. Tell the user to open
   **Customize → Plugins → Figma**, choose **Connect/Authenticate**, complete
   the official Figma OAuth flow, then retry.
4. Never request a Figma personal access token, add an Authorization header, or
   configure the desktop MCP as a substitute. `generate_figma_design` is
   remote-only.

Do not start a local server or mutate the companion notes until this preflight
passes.

## Inputs

- Required: approved HTML path, such as
  `prototypes/savings-nudge-v1.html`.
- Optional: `--figma-file-key <key>` or a Figma Design URL for update mode.
- Optional: a non-default state or element to capture.

If the artifact path is missing, ask once. If the export command is invoked
explicitly, treat that as approval; otherwise confirm that the current
prototype is approved.

## 1. Validate the artifact

Read the HTML and companion `*-notes.md` when present.

- Confirm the file exists and is self-contained enough to render locally.
- Confirm the expected mobile viewport and scoped state.
- Extract the screen name and version for the export record.
- Do not redesign the approved HTML during export.

## 2. Serve and open the live page

`generate_figma_design` captures a **running browser page**, not HTML source.

1. Reuse an already-running local server when it serves the approved artifact.
2. Otherwise start a temporary local HTTP server rooted at the artifact's
   directory on an available localhost port. One suitable fallback is:

   ```bash
   python3 -m http.server <available-port> --directory <artifact-directory>
   ```

3. Verify the exact `http://localhost:<port>/<file>.html` URL renders.
4. Ask the official Figma workflow to open that URL for live capture. Let the
   tool inject its capture support and open the browser/capture toolbar.
5. Keep the server running until capture completes, then stop only the server
   started for this export.

The HTML remains directly previewable under the plugin's existing Canvas /
artifact assumption; local serving is specifically required for reliable
browser capture and is also the retained preview fallback.

## 3. Capture with `generate_figma_design`

Load the official `figma-generate-design` skill before the tool call and follow
its current parameters and capture instructions.

| Mode | Input | Behavior |
| --- | --- | --- |
| Create | No file key/URL | Capture into a new Figma Design file in the selected team or organization drafts. |
| Update | Existing Figma Design key/URL | Capture into that file as a new page/frame; do not overwrite an existing frame unless explicitly requested. |

For create mode, any Figma seat can create in drafts. For update mode:

- Any seat may edit a file in its own drafts when allowed by Figma.
- Editing an existing file outside drafts requires a **Full seat** and
  **edit permission**.
- If permission is denied, stop and report it. Offer, with user approval, to
  capture to a new draft file or the clipboard; never silently switch targets.

Use the capture toolbar for the entire screen, selected elements, or additional
states requested by the user. Complete the capture and wait for the MCP tool to
return the resulting file/claim URL.

## 4. Optional post-capture refinement

`use_figma` is **not** the HTML import path. Use it only after a successful
`generate_figma_design` capture when the user asks for refinement, or when an
explicitly scoped design-system pass is needed.

Before any `use_figma` call, load the official `figma-use` skill (and
`figma-generate-design` when its workflow requires both). Keep the captured
frame as the visual source of truth and describe any component/variable changes.

## 5. Return and record the result

Return the exact clickable Figma Design URL supplied by the capture result:

```markdown
## Figma export complete

**Source:** `prototypes/<slug>-v1.html` (v1.1.0)
**Figma:** https://www.figma.com/design/<file-key>/...?node-id=...
**Mode:** Created new draft file | Added capture to existing file
**Capture:** Entire screen | Selected element/state

### Notes
- [Any browser/capture or fidelity caveats]
```

Append the URL, mode, source version, and date to the companion notes only
after capture succeeds.

## Failure and fallback

- Never claim success without a returned Figma URL.
- If browser capture fails, preserve the HTML artifact and notes. Report the
  failed step and leave no export record.
- Offer the existing fallback: keep reviewing the self-contained HTML through
  Cursor Canvas/artifact preview or the localhost browser URL, then manually
  import a screenshot plus the structure/spec summary into Figma.
- When available and acceptable to the user, clipboard capture or a new draft
  file is a closer fallback than a manual DOM rebuild.
- Complex interactions and animations may require separate state captures or
  manual Figma polish.
