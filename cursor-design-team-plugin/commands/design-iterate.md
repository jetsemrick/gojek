---
name: design-iterate
description: Apply feedback to refine an HTML canvas prototype — Phase 3 of the design request workflow.
---

# Design iterate

Run **Phase 3 (Iterate)** — incorporate feedback and update the HTML prototype.

## Usage

```
/design-iterate <artifact-path> — <feedback bullets>
```

**Examples:**

```
/design-iterate prototypes/savings-nudge-v1.html — Make CTA sticky above home indicator; increase tap target to 48px; shorten headline
```

```
/design-iterate prototypes/login-v1.html — Add error state for invalid email; designers want "Forgot password?" under the field
```

## Steps

1. Load `design-iterate-feedback` skill.
2. Apply `html-prototype-standards` rule.
3. Read existing HTML and notes; note current version.
4. Apply feedback; bump version in file comment and notes changelog.
5. Summarize changes and remaining open questions.

## Output

- Updated HTML artifact
- Appended changelog in companion notes

## Related

- Full flow: `/design-request`
- New request: `/design-research` or `/design-request`
