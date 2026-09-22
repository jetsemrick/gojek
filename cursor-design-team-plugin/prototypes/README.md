# Prototype artifacts

Self-contained HTML prototypes for the design request workflow. Each screen
uses:

- `prototypes/<slug>-v1.html` — mobile-first canvas artifact
- `prototypes/<slug>-notes.md` — version, changelog, and review checklist

## Getting started

1. Copy `_template-v1.html` and `_template-notes.md` to a new slug (for example
   `checkout-nudge-v1.html` and `checkout-nudge-notes.md`).
2. Run `/design-prototype` or continue from `/design-request` research output.
3. Preview in Cursor Canvas/artifact or open via a local browser server.
4. Iterate with `/design-iterate prototypes/<slug>-v1.html — <feedback>`.
5. When approved, export with `/design-export-figma prototypes/<slug>-v1.html`.

The `_template-*` files are reference starters — they are not linked from the
plugin manifest and are safe to copy or replace.
