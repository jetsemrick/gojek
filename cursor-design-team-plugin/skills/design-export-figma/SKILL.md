---
name: design-export-figma
description: Export an approved HTML prototype from prototypes/<slug>/ into a Figma file the designer links, capturing every state as a 390×844 frame with generate_figma_design and recording a Figma link per state. Use when a designer says "export to Figma", "push to Figma", "send this to Figma", "put this in Figma", "capture the prototype in Figma", "approved, export it", or pastes a Figma file link after approving a prototype. Use this instead of the official figma-generate-design skill whenever the source is an HTML prototype in prototypes/. Not for building new screens in Figma from scratch, inspecting a Figma frame (use inspect-design), or editing the prototype (use design-iterate).
---

# Export prototype to Figma

Capture the live, served prototype into the designer's Figma file as editable
layers with `generate_figma_design`, one frame per state. Never rebuild the
DOM by hand with `use_figma`.

## 1. Preflight (write access)

Figma access comes from Figma's official Cursor plugin; this plugin bundles no
Figma skills or MCP server.

1. Confirm the official `figma-use` and `figma-generate-design` skills are
   available and the **remote** Figma MCP exposes `generate_figma_design` and
   `use_figma`.
2. If anything is missing, **stop** and tell the designer:
   1. Run `/add-plugin figma` in Cursor agent chat.
   2. Reload Cursor so the tool list refreshes.
   3. Retry the export.
3. If a Figma call reports an auth error, **stop** and tell the designer to
   open **Customize → Plugins → Figma**, choose **Connect/Authenticate**, finish
   the Figma OAuth flow, and retry.
4. Never ask for a personal access token, add an Authorization header, or use
   the desktop MCP. `generate_figma_design` is remote-only.

Start no server and write no files until the preflight passes.

## 2. Destination: the designer's Figma link

Every export needs a Figma Design URL that the designer gives **for this
export**. Never guess a destination.

- If this request has no link yet, ask and stop:
  "Paste the link to the Figma file to export into (in Figma: Share → Copy
  link, or copy the browser URL)."
- A link recorded in `notes.md` from an earlier export may be offered as a
  numbered option ("1. Same file as last time: <url>"), but use it only after
  the designer picks it.
- Accept only `figma.com/design/<fileKey>/…` or `figma.com/file/<fileKey>/…`.
  For `/board/` (FigJam), `/proto/`, `/slides/`, or anything else, ask for a
  Figma Design file link. Figma creates a new file when the link is not a
  Design file, so never pass one through.
- Never create a new file, capture to drafts, or capture to the clipboard on
  your own. Do those only when the designer explicitly asks in this request.

Permissions: any seat can edit files in its own drafts. Editing a file outside
drafts needs a **Full seat** and **edit permission**. If Figma denies access,
stop, report it, and ask for a link to a file the designer can edit.

## 3. Validate the prototype

From `prototypes/<slug>/`, read `index.html` and `notes.md`.

- Take the version from the version comment and the state ids from
  `data-states` on `#device`. They must match the States table in `notes.md`.
  If they differ, stop and fix the notes with the designer first.
- Capture every listed state unless the designer names a subset.
- If the export is not the designer's explicit request, confirm the prototype
  is approved.
- Do not edit `index.html` during export.

## 4. Capture from a temporary copy

The capture flow injects a script into the served page. Keep the approved file
untouched:

1. Copy `index.html` to `prototypes/<slug>/.capture/index.html` (plus any
   relative assets). All injection happens in `.capture/`.
2. Serve the copy on an available localhost port:

   ```bash
   npx --yes serve -l <port> prototypes/<slug>/.capture
   # or: python3 -m http.server <port> --directory prototypes/<slug>/.capture
   ```

3. Check the port answers before capturing:
   `curl -sI http://localhost:<port>/index.html` returns `200`.

## 5. Capture each state

Load the official `figma-generate-design` skill and follow its current
parameters. For each state id, in `data-states` order:

1. Capture `http://localhost:<port>/index.html?state=<id>&capture=1` into the
   designer's file with `generate_figma_design`. `capture=1` renders exactly one
   390×844 frame with no review bar and no motion.
2. Use a 390×844 browser viewport when the capture window allows it;
   otherwise use **Select element** on `#device`.
3. Wait for the tool to return before moving to the next state.

## 6. Name and place the frames

After capture, load `figma-use` and use `use_figma` only to organize:

- Page: `Prototype exports / <slug>` (create it if missing).
- Frame: `<slug> / <state> / v<version>`, for example
  `checkout-savings-nudge / sheet-open / v1.2.0`.
- Place new frames left to right in state order. Never overwrite or rename
  frames from earlier exports.
- Check that each frame is 390×844 and report any that are not.
- Read back each frame's node id.

Do not change captured layers. Design-system replacement is a separate
refinement the designer must ask for.

## 7. Record and clean up

1. Append one row per **successful** state to **Figma export record** in
   `notes.md`:

   ```markdown
   | 2026-09-23 | 1.2.0 | sheet-open | Prototype exports / checkout-savings-nudge › checkout-savings-nudge / sheet-open / v1.2.0 | https://www.figma.com/design/<fileKey>/?node-id=<node-id> |
   ```

2. Stop the server you started and delete `prototypes/<slug>/.capture/`.
3. Reply:

   ```markdown
   ## Exported v1.2.0 to Figma

   **File:** <designer's link> · **Page:** Prototype exports / <slug>

   | State | Frame | Link |
   | --- | --- | --- |
   | default | <slug> / default / v1.2.0 | <node URL> |
   ```

   Then add caveats, followed by the post-export numbered options from `design-request`.

## Failure and fallback

- Never claim success without a returned Figma link. Record only the states
  that succeeded, and name the ones that failed.
- On any failure, still stop the server and delete `.capture/`. `index.html`
  and history stay untouched.
- Fallback: review in Canvas or the localhost browser, then place screenshots
  and the States table into Figma by hand.
- Complex animation needs manual polish in Figma; each state is a still frame.

## Example prompts

- "Approved — export to Figma: https://www.figma.com/design/abc123/Checkout"
- "Push checkout-savings-nudge to Figma, only the sheet-open state."
