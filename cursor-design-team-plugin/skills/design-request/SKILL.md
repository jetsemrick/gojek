---
name: design-request
description: Sole orchestrator for research, HTML prototype, feedback iteration, and optional Figma export. Load when the user starts a full design request workflow.
---

# Design request (full workflow)

Orchestrate the end-to-end design request workflow. Do not delegate ownership of
the multi-turn workflow to a subagent.

## When to use

- A new design brief arrives and the user wants the full four-phase flow.
- User asks to run research, prototype, iterate, and optionally export in one thread.
- Phrases like "design request", "run the full workflow", or "research then prototype".

## Stages

| # | Stage | Skill to load | Output |
| --- | --- | --- | --- |
| 1 | Research | `design-research` | Research summary |
| 2 | Prototype | `design-prototype` | HTML canvas artifact + notes |
| 3 | Iterate | `design-iterate` | Updated artifact (when feedback provided) |
| 4 | Export to Figma | `design-export-figma` | Figma file/frame URL (when approved) |

## Steps

1. **Intake** — Parse brief; clarify once if needed.
2. **Research** — Load `design-research`; gather inspiration, patterns, optional Figma/FigJam context.
3. **Checkpoint** — Confirm before prototype unless user asked to run through.
4. **Prototype** — Load `design-prototype`; self-contained mobile HTML per `html-prototype-standards`.
5. **Review** — Share preview instructions; collect feedback.
6. **Iterate** — Load `design-iterate` or continue in same thread with feedback.
7. **Export** — When approved, load `design-export-figma` with the HTML path.

Before any Figma-dependent work, apply the Figma preflight from the selected
skill. Missing official plugin capabilities or OAuth is a hard stop for that
work; it does not block HTML-only research, prototype, or iteration.

## Rules and optional verifier

- Rules: `design-request-workflow`, `html-prototype-standards`
- Optional isolated research check: `design-research-verifier` agent

`design-research-verifier` returns a bounded report. It never orchestrates the
workflow or owns designer feedback loops.

## Related skills

- `design-research` — research only
- `design-prototype` — prototype only
- `design-iterate` — apply feedback to existing artifact
- `design-export-figma` — export approved HTML to Figma
- `inspect-design` — Figma frame inspect (secondary research input)
- `figjam-summary` — FigJam board summary (secondary research input)

## Example prompts

- "Design request: mobile onboarding for a savings app — 3 steps, trust signals, optional biometrics, 390px mobile. Research public patterns first, then HTML prototype."
- "Run the full design workflow for a checkout savings nudge bottom sheet."
