# Design Team Cursor Plugin

Private Cursor plugin for GoTo's mobile design-request workflow (v0.6.0):

```text
Brief → Research + Prototype (one turn) → Iterate → Export to Figma
```

The plugin is **skills-only**. Designers ask in plain language and Cursor loads
the matching skill; there are no slash commands. `design-request` owns the full
flow. The `design-research-verifier` agent only runs isolated source checks.

## The four phases

| Phase | Skill | Writes to `prototypes/<slug>/` |
| --- | --- | --- |
| Research | `design-research` | `research.md` with a sources table |
| Prototype | `design-prototype` | `index.html`, `notes.md`, `feedback.md`, `history/1.0.0.html` |
| Iterate | `design-iterate` | Feedback rows, updated `index.html`, `history/<version>.html`, changelog |
| Export to Figma | `design-export-figma` | Per-state Figma links in the `notes.md` export record |

Secondary skills: `inspect-design` (Figma Design frame → handoff notes) and
`figjam-summary` (FigJam board → decisions and action items).

### Fast path by default

A new brief gets research **and** a clickable prototype in one turn, with one
checkpoint at the end. Say "research first" to add a checkpoint after
`research.md`. Every phase ends with numbered options, so a designer can reply
`1`, `2`, or describe what they want.

### One folder per request

```text
prototypes/<slug>/
├── research.md          # sources, patterns, recommended starter and states
├── index.html           # current prototype
├── notes.md             # version, states table, changelog, Figma export record
├── feedback.md          # ID · date · source · feedback · priority · status · version
└── history/<version>.html
```

Resume any time with "continue <slug>".

## What designers type

```text
Design a savings nudge bottom sheet for checkout — dismissible, trust copy
I need an onboarding step for biometrics. Research first.
Make the CTA sticky and add a forgot-password link
Engineering said the close button needs a label — P1
Approved — export to Figma: https://www.figma.com/design/<fileKey>/Checkout
Continue checkout-savings-nudge
Inspect this frame for handoff: <Figma Design URL with node-id>
Summarize this FigJam board: <FigJam URL>
```

"Export/push/send to Figma" routes to `design-export-figma`, not the official
`figma-generate-design` skill, whenever the source is a prototype in
`prototypes/`.

## Prototype starters

`design-prototype` ships six unbranded mobile starters in
`skills/design-prototype/templates/`:

| Starter | States |
| --- | --- |
| `bottom-sheet` | `default`, `sheet-open` |
| `onboarding-step` | `step-1`, `step-2`, `step-3` |
| `list-detail` | `list`, `detail` |
| `form` | `default`, `error`, `submitting`, `success` |
| `empty-error` | `content`, `empty`, `error`, `loading` |
| `settings` | `default`, `notifications-off`, `sign-out-confirm` |

Each starter is one self-contained HTML file with:

- a fixed 390×844 device frame that fills the screen on phones;
- `?state=<id>` for any state listed in `data-states`;
- `?capture=1` for a clean frame with no review chrome or motion;
- a "State" review bar under the frame for flipping states in preview;
- safe areas via `max()` (no double padding), 48px targets, and `inert` plus
  Escape and focus return for sheets and dialogs.

## Preview: Canvas first

The agent shows `prototypes/<slug>/index.html` in Cursor's Canvas preview. If
Canvas cannot render it, the fallback is a local server rooted at the request
folder (`npx --yes serve -l <port> prototypes/<slug>` or
`python3 -m http.server`) opened in Cursor's browser. Export always uses a
local server.

## Export to Figma

1. The designer pastes a **Figma Design file link** for this export. If it is
   missing, the skill asks and stops. It never guesses a destination and never
   falls back to drafts, a new file, or the clipboard on its own.
2. Official Figma plugin and OAuth preflight.
3. `index.html` is copied to `prototypes/<slug>/.capture/`. The capture script
   is injected only into that copy, which is deleted afterwards.
4. The copy is served on localhost and each state is captured with
   `generate_figma_design` from `index.html?state=<id>&capture=1` as a 390×844
   frame.
5. Frames are placed on page `Prototype exports / <slug>` and named
   `<slug> / <state> / v<version>`. `use_figma` is used only for this naming
   and placement, never to rebuild the DOM.
6. One row per successful state, with its Figma node link, is appended to
   `notes.md`.

Editing a file outside the designer's drafts requires a **Full seat** and
**edit permission**. A permission error stops the export and asks for another
link.

## Install

### Official Figma plugin first

```text
/add-plugin figma
```

Then open **Customize → Plugins → Figma**, choose **Connect/Authenticate**,
finish Figma OAuth, and reload Cursor.

The current Cursor plugin manifest does not support declaring another plugin as
a dependency, so install order is explicit. This plugin ships no Figma
`mcp.json`, no personal-token variable, and no copies of Figma's official
skills. Research, prototyping, and iteration work without Figma; only Figma
steps stop with install or OAuth instructions.

### Private team marketplace

The repository root `.cursor-plugin/marketplace.json` points Cursor at
`cursor-design-team-plugin/`.

1. **Dashboard → Plugins & MCPs → Team Marketplaces → Add Marketplace →
   Import from Repo**, and import `https://github.com/jetsemrick/goto`.
2. Track the **`main`** branch.
3. Install **Design Team** from **Customize → Plugins**.

Releases ship by merging to `main` with the version bumped in both
`plugin.json` and `marketplace.json`. To roll back, revert on `main`.

### Local development

1. Copy `cursor-design-team-plugin/` to `~/.cursor/plugins/local/design-team`
   (symlinks to outside targets are not loaded).
2. Run **Developer: Reload Window** and confirm the skills, rules, and agent
   appear in Customize.

## Validation

From the repository root:

```bash
npm run validate:plugin
```

The validator checks the manifests and versions, skills-only packaging, unique
names, trigger descriptions (length, "Not for" clauses, export routing),
narrow rule globs, starter templates (frame, `?state=`, capture mode, sheet
accessibility), request-folder guidance, and forbidden auth or stale
references.

Manual checks still needed before rollout: marketplace install from `main`,
Canvas preview in the team's Cursor build, trigger routing against the official
Figma plugin, missing-plugin and OAuth stop paths, one multi-state export into a
designer-linked file, and a permission denial.

## Structure

```text
.cursor-plugin/marketplace.json
cursor-design-team-plugin/
├── .cursor-plugin/plugin.json
├── agents/design-research-verifier.md
├── rules/
├── skills/
│   ├── design-request/
│   ├── design-research/        # templates/research.md
│   ├── design-prototype/       # templates/*.html, templates/notes.md
│   ├── design-iterate/         # templates/feedback.md
│   ├── design-export-figma/
│   ├── inspect-design/
│   └── figjam-summary/
├── scripts/validate-plugin.mjs
└── assets/logo.svg
```

## Scope

Out of scope: design-token sync, production app code, and bundled copies of
official Figma skills. Internal team use.
