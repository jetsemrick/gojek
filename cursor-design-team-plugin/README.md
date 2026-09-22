# Design Team Cursor Plugin

Private Cursor plugin for GoTo's mobile design-request workflow:

```text
Design request → Research → HTML prototype → Iterate → Export to Figma
```

`/design-request` is the sole orchestrator. It owns the checkpoints and the
multi-turn feedback loop; the included `design-research-verifier` agent is
limited to isolated source and assumption checks.

## Workflow

| Stage | Command | Local skill | Output |
| --- | --- | --- | --- |
| Research | `/design-research` | `design-request-research` | Sourced pattern summary |
| Prototype | `/design-prototype` | `design-prototype-html` | Self-contained mobile HTML + notes |
| Iterate | `/design-iterate` | `design-iterate-feedback` | Updated HTML + changelog |
| Export | `/design-export-figma` | `design-publish-figma` | Live browser capture + Figma URL |

Run all stages with checkpoints:

```text
/design-request <problem, user, platform, must-haves>
```

Secondary commands:

- `/inspect-design <figma-design-url>` — mobile handoff notes.
- `/figjam-summary <figjam-url>` — decisions, themes, and action items.

## Install from the private marketplace

This repository is a multi-plugin marketplace. The root
`.cursor-plugin/marketplace.json` points Cursor to
`cursor-design-team-plugin/`.

1. In **Dashboard → Plugins & MCPs → Team Marketplaces**, choose
   **Add Marketplace → Import from Repo**.
2. Import `https://github.com/jetsemrick/goto` and select the branch tracked by
   the team marketplace.
3. Install **Design Team** from **Customize → Plugins**.
4. Install the separate official Figma plugin:

   ```text
   /add-plugin figma
   ```

5. Open **Customize → Plugins → Figma**, choose
   **Connect/Authenticate**, and complete Figma OAuth.
6. Reload Cursor so the official skills and remote tools are available.

The current Cursor plugin manifest does not support declaring another plugin as
a dependency. Install order is therefore explicit: **Figma first (with OAuth),
then use this plugin's Figma-dependent commands**. This plugin intentionally
does not ship a Figma `mcp.json`, accept a personal-token variable, or copy
Figma's official skills.

Evidence:

- Cursor's current [plugin manifest reference](https://cursor.com/docs/reference/plugins)
  lists supported manifest fields and no plugin-dependency field.
- Figma's [remote server setup](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/)
  recommends `/add-plugin figma` for Cursor and requires OAuth.
- Figma's [code-to-canvas guide](https://developers.figma.com/docs/figma-mcp-server/code-to-canvas/)
  documents remote-only live browser capture, seat behavior, and
  `generate_figma_design`.

## Figma preflight

Every command or skill that needs Figma must verify:

1. Official `figma-use` and `figma-generate-design` skills are present.
2. The required remote Figma tools are present; export specifically requires
   `generate_figma_design`.
3. The Figma plugin is connected through OAuth.

If a check fails, the Figma-dependent work stops with the install/auth
instructions above. HTML-only research, prototyping, and iteration remain
available. Personal access tokens, Bearer headers, and the desktop MCP are not
valid substitutes for remote code-to-canvas capture.

## HTML prototypes

Prototypes remain self-contained `.html` files with inline CSS/JS:

- 390px mobile baseline with safe-area handling
- semantic sections and accessible touch targets
- version comment plus `*-notes.md` changelog
- no build step for the existing Cursor Canvas/artifact preview assumption

Default paths are `prototypes/<slug>-v1.html` and
`prototypes/<slug>-notes.md`. If Canvas preview is unavailable, open the file
through a local browser server; the export workflow uses that same fallback.

## Export HTML to Figma

```text
/design-export-figma prototypes/savings-nudge-v1.html
/design-export-figma prototypes/login-v1.html --figma-file-key abc123XYZ
```

Export uses Figma's remote-only `generate_figma_design` code-to-canvas tool:

1. Validate the approved HTML and companion notes.
2. Serve the artifact at a verified `http://localhost:<port>/...` URL.
3. Open the live page through the official capture workflow.
4. Capture the full screen, selected element, or requested state.
5. Return the exact Figma Design URL and record it in notes only after success.

### Create and update modes

| Mode | Input | Permission behavior |
| --- | --- | --- |
| Create | No file key | Creates a new file in selected team/organization drafts; any seat can use code to canvas in drafts. |
| Update | Existing Figma Design key/URL | Adds the capture to that file; outside drafts this requires a **Full seat** and **edit permission**. |

Permission errors are reported rather than silently changing targets. With user
approval, a new draft file or clipboard capture can be used instead.

`use_figma` is reserved for optional post-capture refinement, such as replacing
captured layers with design-system components. It is not used to manually
rebuild the HTML.

If capture fails, the workflow preserves the HTML and does not claim success or
write a Figma export record. The retained fallback is browser/Canvas review plus
manual screenshot and structure/spec import.

## Local development

1. Put `cursor-design-team-plugin/` under
   `~/.cursor/plugins/local/design-team` (copy it; external symlink targets are
   not loaded).
2. Run **Developer: Reload Window**.
3. Confirm commands, skills, rules, and the `design-research-verifier` agent
   appear in Customize.
4. Install/authenticate the official Figma plugin separately if testing Figma
   paths.

Try:

```text
/design-request Mobile savings nudge — checkout bottom sheet, dismissible, 390px
/design-iterate prototypes/savings-nudge-v1.html — increase CTA target to 48px
/design-export-figma prototypes/savings-nudge-v1.html
```

## Validation

From the repository root:

```bash
npm run validate:plugin
```

The validator checks:

- plugin and marketplace manifest shape/version/path
- required commands, skills, agent, rules, logo, and marketplace entry
- unique command/agent/skill names across component types
- stale or forbidden references, PAT/Bearer config, and duplicate Figma MCP
- required Figma preflight and browser-capture documentation

Manual smoke tests still required before rollout:

- install from the private marketplace
- missing-plugin and unauthenticated OAuth stop paths
- one create capture and one permitted existing-file capture
- permission denial with no silent target change
- Canvas preview in the team's Cursor build and localhost fallback

## Structure

```text
.cursor-plugin/marketplace.json
cursor-design-team-plugin/
├── .cursor-plugin/plugin.json
├── agents/design-research-verifier.md
├── commands/
├── rules/
├── skills/
│   ├── design-request-research/
│   ├── design-prototype-html/
│   ├── design-iterate-feedback/
│   ├── design-publish-figma/
│   └── figma-inspect-handoff/
├── scripts/validate-plugin.mjs
└── assets/logo.svg
```

## Scope

MVP excludes design-token sync, deep application code generation, and bundled
copies of official Figma skills. Figma/FigJam are optional research inputs;
approved HTML remains the working deliverable until export.

Internal team use.
