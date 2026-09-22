---
name: design-request
description: Kick off the full design request workflow — research, HTML canvas prototype, and iteration checkpoints.
---

# Design request (full workflow)

Start the **3-phase design request workflow** for a new mobile design request.

## Usage

```
/design-request <design brief>
```

**Example:**

```
/design-request Mobile onboarding for a savings app — 3 steps, trust signals, optional biometrics, 390px mobile. Research public patterns first, then HTML prototype.
```

Or delegate to the **Design Request** agent with the same brief in chat.

## Phases

| # | Phase | Skill | Output |
| --- | --- | --- | --- |
| 1 | Research | `design-request-research` | Research summary |
| 2 | Prototype | `design-prototype-html` | HTML canvas artifact + notes |
| 3 | Iterate | `design-iterate-feedback` | Updated artifact (when feedback provided) |

## Steps

1. **Intake** — Parse brief; clarify once if needed.
2. **Research** — Inspiration, patterns, optional Figma/FigJam context.
3. **Checkpoint** — Confirm before prototype unless user asked to run through.
4. **Prototype** — Self-contained mobile HTML per `html-prototype-standards`.
5. **Review** — Share preview instructions; collect feedback.
6. **Iterate** — Run `/design-iterate` or continue in same thread with feedback.

## Rules & agent

- Agent: `design-request` (`agents/design-request-agent.md`)
- Rules: `design-request-workflow`, `html-prototype-standards`

## Related commands

- `/design-research` — research only
- `/design-prototype` — prototype only
- `/design-iterate` — apply feedback to existing artifact
- `/inspect-design` — Figma frame inspect (secondary research input)
