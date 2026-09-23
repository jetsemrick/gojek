---
name: design-request
description: Default entry point for a new mobile design brief. Researches, builds a clickable HTML prototype in the same turn, then iterates and exports to Figma, keeping everything in prototypes/<slug>/. Use when a designer says "design a…", "I need a screen for…", "can you mock up…", "new design request", "prototype a bottom sheet for…", "research first, then prototype…", or "continue <slug>" / "pick up the checkout nudge". Not for feedback on an existing prototype (use design-iterate), exporting or pushing an approved prototype to Figma (use design-export-figma), inspecting a Figma frame (use inspect-design), or summarizing a FigJam board (use figjam-summary).
---

# Design request

Own the whole request in the main conversation: research, prototype, iterate,
export. Never hand the workflow to a subagent.

## Request folder

Every request lives in one folder. Create it on intake; read it on resume.

```text
prototypes/<slug>/
├── research.md          # sources, patterns, recommended starter and states
├── board.html           # visual research board: screenshots by theme, starter and states
├── references/          # screenshots cited on the board, e.g. references/01-app-screen.png
├── index.html           # current prototype (always the latest version)
├── notes.md             # version, states table, changelog, Figma export record
├── feedback.md          # feedback log: ID, source, priority, status
└── history/<version>.html   # snapshot of every version, e.g. history/1.0.0.html
```

- `<slug>` is short kebab-case from the brief, for example `checkout-savings-nudge`.
- If the folder already exists, resume it. Never overwrite a request folder.
- Use the team's path instead of `prototypes/` only if the designer names one.

## Resume ("continue <slug>")

Read `notes.md`, `feedback.md`, and `research.md`. Reply with the current
version, open feedback IDs, the last Figma export (if any), and a link to
`board.html`, then offer the numbered options for the phase it is in.

## Fast path (default)

Run research and prototype in **one turn** with a single checkpoint at the end.

1. **Intake.** Derive the slug, platform (mobile by default), and the one
   screen or flow to build. Ask one clarifying question only if the brief has no
   identifiable screen or goal; otherwise state assumptions and continue.
2. **Research.** Follow `design-research` in compact mode. Write
   `prototypes/<slug>/research.md`, capture screenshots into `references/`,
   and build a compact `board.html`.
3. **Prototype.** Follow `design-prototype`. Copy the recommended starter,
   write `index.html`, `notes.md`, `feedback.md`, and `history/1.0.0.html`.
4. **Preview.** Canvas first, local server as fallback, for `board.html` (see
   `design-research`) and then `index.html` (see `design-prototype`).
5. **Checkpoint.** Summarize research in three bullets or fewer, link
   `board.html` (note any screenshots marked missing), list states, note
   assumptions, then end with the prototype options below.

If the official Figma plugin tools are not in your tool list, add one line at
the checkpoint: export will need `/add-plugin figma` and OAuth. Do not block.

### Research first (opt-in)

If the designer says "research first", "just research", "don't build yet", or
the brief is high-stakes and ambiguous, stop after `research.md` and a full
`board.html`. Preview the board, summarize the themes, and end with:

```text
1. Build the prototype with the <starter> starter
2. Change the scope — tell me what to add or cut
3. Dig deeper into <top open question>
```

## Numbered options

Every phase ends with numbered options. The designer can reply with a digit or
free text. Fill in the specifics; keep it to three to five options.

After the prototype or an iteration:

```text
1. Approve and export to Figma — paste the Figma file link to export into
2. Change something — describe it (logged in feedback.md)
3. Add a state — name it
4. Compare with v<previous> (history/<previous>.html)   ← after iterations only
```

After an export:

```text
1. Keep iterating — describe the change
2. Export again later (new version or more states) — needs a Figma file link
3. Done for now
```

## Phase routing

| Designer reply | Do |
| --- | --- |
| Changes, comments, test notes, "make the CTA bigger" | Follow `design-iterate` |
| "Approve", "export", "push to Figma", a Figma file link | Follow `design-export-figma` |
| New screen in the same request | New prototype in the same folder only if the designer asks; otherwise a new slug |

Figma-dependent steps run the official Figma plugin preflight from the skill
that needs it. A failed preflight blocks only that step; research, prototyping,
and iteration keep working.

## Optional verifier

For high-stakes or weakly sourced research, the `design-research-verifier`
agent can check `research.md` and `board.html` once and return a report. It does not edit
files or run later phases.

## Example prompts

- "Design a savings nudge bottom sheet for checkout — dismissible, trust copy."
- "I need an onboarding step for enabling biometrics. Research first."
- "Continue checkout-savings-nudge."
