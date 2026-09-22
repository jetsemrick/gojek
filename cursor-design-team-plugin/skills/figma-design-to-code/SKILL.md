---
name: figma-design-to-code
description: Secondary capability — mobile design-to-code from Figma when explicitly requested. Primary workflow uses HTML canvas prototypes (design-prototype-html); use this only for light RN/SwiftUI/Compose snippets, not full app codegen.
---

# Figma design to code (mobile)

## When to use

- Designer provides a **Figma frame URL** and wants **mobile** implementation guidance.
- Target is **React Native**, **SwiftUI**, or **Android (Jetpack Compose)**.
- Scope is **one screen or component**, not an entire application.

Do **not** use for web-only layouts, token sync, or deep repo-wide refactors.

## Prerequisites

1. Load `figma-use` workflow if available (Figma MCP write/read tools).
2. Ensure Figma MCP is connected (plugin `mcp.json` or user OAuth).
3. Confirm **target platform** with the designer if not stated.

## Workflow

### 1. Parse the Figma URL

Extract `fileKey` and `node-id`. Normalize node id (`-` → `:`) for MCP calls.

### 2. Fetch design context

Use Figma MCP tools (e.g. `get_design_context`) for the target node. Capture:

- Layout (auto-layout direction, padding, gaps)
- Typography and colors
- Component instances and variants
- Exportable assets (icons, images)

### 3. Map to mobile platform

Apply `mobile-design-handoff` rule conventions:

| Figma concept | RN | SwiftUI | Compose |
| --- | --- | --- | --- |
| Auto-layout vertical | `Column` / View + flexDirection | `VStack` | `Column` |
| Auto-layout horizontal | `Row` | `HStack` | `Row` |
| Fill container | `flex: 1` | `Spacer()` / frame max | `Modifier.weight(1f)` |
| Fixed size | explicit width/height | `.frame(width:height:)` | `Modifier.size()` |
| Corner radius | `borderRadius` | `.cornerRadius()` | `RoundedCornerShape` |

### 4. Output (designer-friendly)

Deliver in this order:

1. **Brief summary** — what the screen does (2–3 sentences).
2. **Structure outline** — hierarchy as a bullet tree.
3. **Platform snippet** — single-file, screen-level code with TODOs for navigation/data.
4. **Handoff gaps** — missing states, unspecified tokens, assets needing export.

Keep snippets **readable**; prefer named subviews/components over 200-line monoliths.

## Mobile screen conventions

- Assume **390pt width** unless frame metadata says otherwise.
- Include **SafeAreaView** (RN), safe area ignores (SwiftUI), or system bar padding (Compose).
- Use **44pt minimum** touch targets; flag smaller controls.
- For scrollable content, specify `ScrollView` / `ScrollView` / `LazyColumn` vs fixed layout.

## Example designer prompts

- "Implement this onboarding screen in React Native: [URL]"
- "SwiftUI layout for this settings row only: [URL]"
- "Compose code for the primary button styles on this frame: [URL]"

## Limits (MVP)

- No design token file sync.
- No automatic Code Connect unless `figma-code-connect` is explicitly invoked.
- Stop after one screen unless the designer asks to continue.
