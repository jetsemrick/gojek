---
name: design-iterate
description: Apply feedback to an existing HTML prototype in prototypes/<slug>/, logging every item in feedback.md with an ID, source (designer, engineer, user test), priority, and status, and snapshotting each version to history/. Use when a designer says "make the CTA bigger", "change the headline", "engineering said…", "from user testing…", "add an error state", "iterate on…", pastes review or Figma comments, or picks "change something" at a checkpoint. Not for new briefs (use design-request), first builds (use design-prototype), or exporting to Figma (use design-export-figma).
---

# Design iterate

Log the feedback, change the prototype, keep every version.

## Inputs

- The request: a slug, a path in `prototypes/<slug>/`, or the request already
  in the conversation. If it is ambiguous, list the folders in `prototypes/`
  and ask once.
- Feedback in any form: chat bullets, pasted Figma comments, user-test notes,
  a review doc, or a FigJam link (summarize it with `figjam-summary` first).

## 1. Load the request

Read `index.html`, `notes.md` (current version, states), and `feedback.md`
(open items). Create `feedback.md` from `templates/feedback.md` next to this
SKILL.md if it is missing.

## 2. Log before editing

Append one row per distinct item to `feedback.md`:

| Field | Rule |
| --- | --- |
| ID | Next `F-###`; never reuse or renumber |
| Source | `designer` by default; `engineer`, `user test`, or `stakeholder` when the designer attributes it ("eng said…", "in testing…") |
| Feedback | Short quote or faithful paraphrase |
| Priority | `P1` must fix, `P2` should fix (default), `P3` nice to have; infer from wording |
| Status | `open` until handled |

Say which source and priority you inferred so the designer can correct them.
If an item conflicts with the brief, `research.md`, or an earlier item, flag it
and ask instead of guessing.

## 3. Apply changes

1. Make sure `history/<current version>.html` exists; copy `index.html` there
   if it does not.
2. Edit `index.html` in place. Preserve the scaffold (`#device`,
   `data-states`, `render`, capture CSS, review bar) and the standards in
   `design-prototype`.
3. Bump the version: patch for fixes and copy, minor for new states or
   sections, major only for a requested redesign. Update the version comment.
4. If states changed, update `data-states`, `render`, and the States table in
   `notes.md` together.
5. Copy the result to `history/<new version>.html`.

## 4. Close the loop

- In `feedback.md`, set each handled item to `done`, `deferred`, or `won't do`
  and fill **Version** with the new version. Add a note for anything not done.
- In `notes.md`, add a changelog entry that cites IDs:

  ```markdown
  ### 1.1.0 — YYYY-MM-DD
  - Sticky CTA above the home indicator (F-003)
  - Added `error` state (F-004)
  - Snapshot: `history/1.1.0.html`
  ```

## 5. Report

Reply with what changed (by ID), what is deferred and why, how to preview
(Canvas first, local server fallback as in `design-prototype`), and the
numbered options from `design-request`, including "Compare with v<previous>".

## Do not

- Delete changelog entries, feedback rows, or history snapshots.
- Break the 390×844 frame or the `?state=` convention without noting it.
- Start new research or new screens unless the designer expands the scope.

## Example prompts

- "Make the CTA sticky and add a forgot-password link."
- "Engineering feedback: the close button needs an aria-label. P1."
- "From user testing: 3 of 5 people missed the savings amount."
