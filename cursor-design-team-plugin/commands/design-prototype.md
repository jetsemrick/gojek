---
name: design-prototype
description: Build a mobile-first HTML canvas prototype — Phase 2 of the design request workflow.
---

# Design prototype

Run **Phase 2 (Prototype)** — build a self-contained HTML canvas artifact.

## Usage

```
/design-prototype <brief or path to research summary>
```

**Examples:**

```
/design-prototype Build the savings nudge bottom sheet from the research summary above — 390px, safe areas, open/closed states
```

```
/design-prototype Mobile login — email, password, primary CTA, Google/Apple SSO rows, inline error on empty submit
```

## Steps

1. Load `design-prototype-html` skill.
2. Apply `html-prototype-standards` rule.
3. Use research summary or inline brief for scope.
4. Write `prototypes/<slug>-v1.html` (or team convention path).
5. Write companion notes with version and changelog.
6. Instruct designer how to preview in Cursor canvas.

## Output

- Self-contained `.html` file (inline CSS, mobile viewport)
- Companion `*-notes.md` with changelog and review checklist

## Related

- Prior phase: `/design-research`
- Next phase: `/design-iterate`
- Full flow: `/design-request`
