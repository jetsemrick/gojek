---
name: design-prototype
description: Build a clickable, self-contained mobile HTML prototype (fixed 390×844 frame, reviewable states) from a starter template into prototypes/<slug>/index.html and preview it in Canvas. Use when a designer says "prototype this", "build it", "mock it up in HTML", "make it clickable", "build the screen from the research", or picks "build the prototype" at a checkpoint, and as the build step inside design-request. Not for a brand-new brief without research (use design-request), changes to an existing prototype (use design-iterate), or exporting to Figma (use design-export-figma).
---

# Design prototype

Build one focused screen or flow as a single HTML file in the request folder.

## Output

In `prototypes/<slug>/`:

| File | From |
| --- | --- |
| `index.html` | A starter in `templates/` next to this SKILL.md |
| `notes.md` | `templates/notes.md` next to this SKILL.md |
| `feedback.md` | `../design-iterate/templates/feedback.md` (header only, no rows) |
| `history/1.0.0.html` | Copy of `index.html` once it is written |

If `index.html` already exists, stop and use `design-iterate` instead.

## 1. Pick a starter

Use the starter named in `research.md`, or the closest match:

| Starter | Use for | States |
| --- | --- | --- |
| `bottom-sheet.html` | Nudges, confirmations, pickers over a screen | `default`, `sheet-open` |
| `onboarding-step.html` | Multi-step intro, permission priming | `step-1`, `step-2`, `step-3` |
| `list-detail.html` | Browse and drill in | `list`, `detail` |
| `form.html` | Sign-in, sign-up, any input with validation | `default`, `error`, `submitting`, `success` |
| `empty-error.html` | Empty, error, loading, and loaded content | `content`, `empty`, `error`, `loading` |
| `settings.html` | Grouped rows, toggles, destructive confirm | `default`, `notifications-off`, `sign-out-confirm` |

Copy the starter, then adapt it. Rename, add, or remove states to match the
brief. If nothing fits, copy the closest starter and replace the screen content
while keeping the frame and scaffold.

## 2. Keep the scaffold

Every prototype keeps these parts of the starter; export depends on them:

- **Fixed frame:** `#device` is 390×844 on desktop and fills the viewport on phones.
- **States:** `data-states` on `#device` lists every state id in review order.
  `render(state)` sets the whole screen from the state id alone, so
  `index.html?state=<id>` always shows the same thing. Interactions call
  `setState(id, { interactive: true })`.
- **Capture mode:** `?capture=1` hides the review bar, removes the frame
  shadow, and disables motion. Do not remove the capture CSS.
- **Review bar:** the "State" switcher under the frame. It is outside
  `#device`, hidden on phones and during capture.
- **Version comment** in `<head>`: prototype name, slug, version, starter,
  states, changelog line.

## 3. Standards

- One file, inline `<style>` and `<script>`, no external scripts, fonts, or
  network calls. Inline SVG for icons.
- Semantic elements (`header`, `main`, `button`, `form`, `label`).
- Touch targets 48px (meets 44pt iOS and 48dp Android); visible `:focus-visible`.
- Safe areas use `max(env(safe-area-inset-*), <simulated inset>)`, never a sum.
- Modals and sheets: backdrop fades with opacity (no `hidden`), closed layers
  are `inert`, the background is `inert` while open, Escape closes, focus
  moves in on open and returns to the opener on close.
- Tokens live in `:root`; change values, keep names stable.
- Label placeholder copy in `notes.md` open questions.

## 4. Write notes and feedback

- `notes.md`: fill in slug, version `1.0.0`, starter, and the **States** table
  in the same order as `data-states`. Export captures one frame per row.
- `feedback.md`: copy the header and legend; rows are added by `design-iterate`.
- Copy `index.html` to `history/1.0.0.html`.

## 5. Preview: Canvas first

1. Show `prototypes/<slug>/index.html` in Cursor's Canvas preview. Tell the
   designer to use the State bar under the frame to flip states.
2. If Canvas is unavailable, blank, or blocks the scripts, fall back to a
   local server rooted at the request folder:

   ```bash
   npx --yes serve -l <port> prototypes/<slug>
   # or: python3 -m http.server <port> --directory prototypes/<slug>
   ```

   Check the port answers (`curl -sI http://localhost:<port>/index.html`), then
   open `http://localhost:<port>/index.html` in Cursor's browser. States are
   also reachable as `?state=<id>`.

## 6. Checkpoint

End with the numbered options from `design-request`: approve and export (paste
a Figma file link), change something, add a state.

## Example prompts

- "Prototype the savings nudge from the research — bottom sheet, dismissible."
- "Build a settings screen with a notifications toggle and a sign-out confirm."
- "Make the login form clickable with an error state."
