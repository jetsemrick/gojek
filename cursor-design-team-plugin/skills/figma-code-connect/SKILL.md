---
name: figma-code-connect
description: Optional stub for Figma Code Connect — mapping design components to code snippets. Use when the team is ready to link Figma components to React Native, SwiftUI, or Android source; not required for MVP handoff.
---

# Figma Code Connect (optional / stub)

## Status

**MVP stub.** This skill documents the intended workflow for a future phase when the team adopts Code Connect. Handoff and inspect workflows do not depend on it.

## When to use (future)

- Mapping a **Figma component** to an existing **code component**.
- Creating or updating `.figma.ts` / `.figma.tsx` (or platform-specific) Code Connect files.
- Keeping generated mobile code aligned with the design system.

## Intended workflow (not fully enabled in MVP)

1. Identify Figma component set (name, variant properties).
2. Locate matching code component in the mobile repo (RN / SwiftUI / Compose).
3. Author Code Connect template with props ↔ Figma properties mapping.
4. Validate in Figma Dev Mode.

## MVP behavior

If a designer invokes this skill today:

1. Explain Code Connect is **planned, not configured** in this plugin version.
2. Offer **`figma-inspect-handoff`** for manual component mapping in handoff notes instead.
3. If the team has Code Connect docs elsewhere, link to internal process — do not scaffold token sync.

## Example prompts (future)

- "Create Code Connect for the Primary Button component"
- "Map this Figma input field to our RN TextInput wrapper"

## Out of scope (MVP)

- No automatic Code Connect file generation in plugin repo.
- No design token path or token export pipeline.
