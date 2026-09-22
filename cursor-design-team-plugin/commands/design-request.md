---
name: design-request
description: Sole orchestrator for research, HTML prototype, feedback iteration, and optional Figma export.
---

# Design request (full workflow)

Orchestrate the end-to-end design request workflow. Do not delegate ownership of
the multi-turn workflow to a subagent.

## Usage

```
/design-request <design brief>
```

**Example:**

```
/design-request Mobile onboarding for a savings app — 3 steps, trust signals, optional biometrics, 390px mobile. Research public patterns first, then HTML prototype.
```

## Stages

| # | Stage | Skill | Output |
| --- | --- | --- | --- |
| 1 | Research | `design-request-research` | Research summary |
| 2 | Prototype | `design-prototype-html` | HTML canvas artifact + notes |
| 3 | Iterate | `design-iterate-feedback` | Updated artifact (when feedback provided) |
| 4 | Export to Figma | `design-publish-figma` | Figma file/frame URL (when approved) |

## Steps

1. **Intake** — Parse brief; clarify once if needed.
2. **Research** — Inspiration, patterns, optional Figma/FigJam context.
3. **Checkpoint** — Confirm before prototype unless user asked to run through.
4. **Prototype** — Self-contained mobile HTML per `html-prototype-standards`.
5. **Review** — Share preview instructions; collect feedback.
6. **Iterate** — Run `/design-iterate` or continue in same thread with feedback.
7. **Export** — When approved, follow `design-publish-figma` or ask the
   designer to run `/design-export-figma <html-path>`.

Before any Figma-dependent work, apply the Figma preflight from the selected
skill. Missing official plugin capabilities or OAuth is a hard stop for that
work; it does not block HTML-only research, prototype, or iteration.

## Rules and optional verifier

- Rules: `design-request-workflow`, `html-prototype-standards`
- Optional isolated research check: `design-research-verifier`

`design-research-verifier` returns a bounded report. It never orchestrates the
workflow or owns designer feedback loops.

## Related commands

- `/design-research` — research only
- `/design-prototype` — prototype only
- `/design-iterate` — apply feedback to existing artifact
- `/design-export-figma` — export approved HTML to Figma
- `/inspect-design` — Figma frame inspect (secondary research input)
