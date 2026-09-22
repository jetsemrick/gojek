---
name: design-iterate-feedback
description: Incorporate designer, engineer, and user feedback to refine an HTML canvas prototype. Use for Phase 3 of the design request workflow or when /design-iterate is invoked.
---

# Design iterate (feedback)

## When to use

- An HTML prototype exists and feedback has arrived.
- User runs `/design-iterate` or Phase 3 of `/design-request`.
- Designer wants a revised canvas artifact with tracked changes.

Primary output is an **updated HTML file** plus **changelog entry**.

## Inputs

Required:
1. **Artifact path** — e.g. `prototypes/savings-nudge-v1.html`
2. **Feedback** — bullets, comments, screenshots described in text, or linked review notes

Optional:
- Priority labels (must-fix vs nice-to-have)
- New states or copy from design review

If artifact path is missing, ask once. If feedback is empty, ask what to change.

## Workflow

### 1. Load current artifact

Read the HTML file and companion notes (if present). Note current version from file comment or notes.

### 2. Triage feedback

Group feedback into:
| Category | Examples |
| --- | --- |
| Layout | spacing, alignment, sticky footer |
| Visual | color, typography, icon size |
| Interaction | new state, animation, sheet behavior |
| Content | copy, labels, error messages |
| A11y / mobile | tap target, contrast, safe area |

Resolve conflicts explicitly — if feedback contradicts earlier brief, flag and ask.

### 3. Apply changes incrementally

- Preserve working structure; avoid full rewrites unless requested.
- Follow `html-prototype-standards` for all edits.
- Bump **patch version** for small fixes, **minor** for new states/sections.

Update version comment in HTML:

```html
<!--
  Prototype: [Screen name]
  Version: 1.1.0
  Changelog: [short summary of this iteration]
-->
```

Prefer updating in place (`*-v1.html`) unless user asks for versioned copies; if copying, use `*-v1.1.html` and note in changelog.

### 4. Update changelog

Append to companion notes:

```markdown
### 1.1.0 — [date]
- [Change] — addresses: "[feedback quote or paraphrase]"
- ...
```

Include a **Feedback addressed** table when helpful:

| Feedback | Status | Notes |
| --- | --- | --- |
| Increase CTA tap area | Done | min-height 48px |
| Add email error state | Done | shown on invalid submit |

### 5. Summarize for reviewer

Return short summary:
- What changed (bullets)
- What was deferred and why
- How to preview updated artifact
- Remaining open questions

## Example prompts

- `/design-iterate prototypes/login-v1.html — CTA should be sticky; add "Forgot password?" link; error state for empty email.`
- "Designers said headline is too long — shorten and bump spacing above the form."
- "Engineering feedback: use semantic button types and aria labels on the sheet close control."

## Do not

- Discard prior changelog history.
- Apply feedback that breaks mobile viewport without noting the tradeoff.
- Start research or unrelated new screens in this phase — scope to the existing artifact unless user expands.
