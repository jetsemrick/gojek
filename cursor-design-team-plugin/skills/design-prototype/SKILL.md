---
name: design-prototype
description: Build a mobile-first, self-contained HTML canvas prototype — Phase 2 of the design request workflow. Load when the user asks to prototype or build HTML.
---

# Design prototype (HTML canvas artifact)

Run **Phase 2 (Prototype)** — build a self-contained HTML canvas artifact.

## When to use

- Research is complete (or user provides enough inline brief).
- Phase 2 of `design-request`, or the user asks to prototype/build HTML only.
- Designer needs an **interactive preview** in Cursor before Figma polish.

Primary output is a **self-contained HTML file** viewable as a Cursor canvas artifact.

## Prerequisites

1. Load `html-prototype-standards` rule — follow all conventions.
2. Have research summary or brief with screen name, states, and key copy.
3. Confirm file output path with user if repo conventions exist; default: `prototypes/<slug>-v1.html`.

## Workflow

### 1. Define prototype scope

From research or brief, list:
- Screen name and primary user action
- States to include (default, loading, error, empty — only what was requested)
- Interactive behaviors (tabs, sheet open/close, form validation demo)

Keep MVP prototypes **focused** — one primary screen or flow, not a full app shell unless asked.

### 2. Build self-contained HTML

Create a **single `.html` file** with:
- Inline `<style>` (preferred) or minimal embedded CSS — no external CDN dependencies unless necessary for fonts.
- Semantic HTML: `header`, `main`, `nav`, `button`, `form`, etc.
- Mobile viewport meta and 390px-centered frame per `html-prototype-standards`.
- Safe-area padding using `env(safe-area-inset-*)`.
- Minimal vanilla JS for interactions (toggle states, open sheet, fake submit).

Include a version block comment at top of file:

```html
<!--
  Prototype: [Screen name]
  Version: 1.0.0
  Request: [link or brief ref]
  Changelog: Initial prototype
-->
```

### 3. Create companion notes

Write `prototypes/<slug>-notes.md` (or alongside artifact) with:

```markdown
# [Screen name] — prototype notes

**Artifact:** `prototypes/<slug>-v1.html`
**Version:** 1.0.0
**Platform:** Mobile 390px

## Changelog
### 1.0.0 — [date]
- Initial prototype

## Review checklist
- [ ] Layout matches brief
- [ ] Touch targets ≥ 44px
- [ ] Safe areas respected
- [ ] States documented
- [ ] Ready for Figma polish

## Open questions
- ...
```

### 4. Present to designer

Tell the designer:
1. Where the HTML file was written
2. How to open **Canvas / artifact preview** in Cursor
3. What interactions are demo-only
4. Suggested feedback format for the iterate phase (`design-iterate` skill)

## Canvas artifact behavior in Cursor

- Save the HTML file to the workspace; Cursor can preview HTML in the **artifact / canvas** panel.
- The file must be **self-contained** — designers should not need a dev server.
- Use relative paths only for assets included in the same folder; prefer inline SVG for icons in MVP.

## Example prompts

- "Prototype the savings nudge bottom sheet from the research summary."
- "Build a mobile profile settings prototype — list rows, toggle notifications, 390px."
- "Build HTML for login: email field, primary CTA, SSO buttons, error state on submit."

## Do not

- Split into multi-file bundles unless user asks (MVP = one HTML file).
- Use desktop-first layouts or fixed 1200px widths.
- Ship placeholder lorem without noting it in open questions.
- Skip version/changelog metadata.

## Related

- Prior phase: `design-research`
- Next phase: `design-iterate`
- Full flow: `design-request`
