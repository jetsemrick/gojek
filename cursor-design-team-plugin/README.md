# Design Team Cursor Plugin

Cursor plugin for the GoTo design team: **Figma + FigJam** handoff, inspect, and review — optimized for **designers** and **mobile-first** workflows (React Native, SwiftUI, Android).

## What's included

| Component | Purpose |
| --- | --- |
| **Figma MCP** | Connect to Figma/FigJam via remote MCP server |
| **Skills** | Mobile design-to-code, inspect/handoff, Code Connect stub |
| **Rules** | Mobile handoff, Figma/FigJam URLs, designer workflow |
| **Commands** | `inspect-design`, `figjam-summary` |

**MVP exclusions:** No design token sync, no `DESIGN_TOKEN_PATH`, no deep codegen.

## Prerequisites

- [Cursor](https://cursor.com) with plugin / MCP support
- Figma account with access to team files
- Figma MCP auth (see Configuration below)

## Install (team marketplace)

1. Team admin adds this repository to the **private team marketplace** in Cursor.
2. Designers install **Design Team** from **Customize → Plugins** (team catalog).
3. Open **Plugins → Configure** on the installed plugin.
4. Set **Figma access token** (`FIGMA_ACCESS_TOKEN`).
5. Restart or reload MCP if prompted; confirm **Figma** server shows connected.

## Local test (development)

Test the plugin from a checkout before publishing to the team marketplace.

### Option A — Open plugin folder as workspace

1. Clone or copy this repo to your machine.
2. In Cursor: **File → Open Folder** → select `cursor-design-team-plugin/`.
3. Configure MCP variables locally (see Configuration).
4. In agent chat, try:
   - `/inspect-design <figma-frame-url-with-node-id>`
   - `/figjam-summary <figjam-board-url>`

### Option B — Symlink / dev install

If your Cursor version supports loading a local plugin path from team marketplace dev settings, point it at this directory. Otherwise use Option A.

### Verify checklist

- [ ] `.cursor-plugin/plugin.json` validates (name: `design-team`)
- [ ] `mcp.json` loads; Figma MCP connects
- [ ] Rules appear under project rules when plugin is active
- [ ] Skills trigger on Figma URL prompts
- [ ] Commands run without missing file errors

## Configuration

### Plugin variable

| Variable | Required | Where to set |
| --- | --- | --- |
| `FIGMA_ACCESS_TOKEN` | Yes | Team marketplace **Plugins → Configure** (never commit secrets) |

Declared in `.cursor-plugin/plugin.json` and referenced in `mcp.json`:

```json
{
  "mcpServers": {
    "figma": {
      "url": "https://mcp.figma.com/mcp",
      "headers": {
        "Authorization": "Bearer ${FIGMA_ACCESS_TOKEN}"
      }
    }
  }
}
```

### Auth note

Figma's remote MCP server [official docs](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/) describe **OAuth** as the primary flow. Confirm with your team whether PAT/Bearer via `FIGMA_ACCESS_TOKEN` is supported for marketplace installs, or if OAuth-only configuration is required.

**Alternative — Figma desktop MCP** (local):

```json
{
  "mcpServers": {
    "figma-desktop": {
      "url": "http://127.0.0.1:3845/mcp"
    }
  }
}
```

Enable in Figma desktop: Dev Mode → MCP server toggle. No token variable needed for local desktop server.

## Usage (designers)

### Inspect a mobile screen

1. In Figma, select a frame → **Copy link to selection**.
2. In Cursor chat:

   ```
   /inspect-design https://www.figma.com/design/...?node-id=...
   ```

3. Review handoff markdown (spacing, type, colors, components, a11y notes).

### Summarize a FigJam board

```
/figjam-summary https://www.figma.com/board/...
```

### Light mobile codegen (optional)

Ask explicitly with platform:

> Suggest React Native layout for this screen only: [Figma URL]

Uses `figma-design-to-code` skill — single-screen snippets, not full apps.

## Publish to team marketplace (admins)

**Do not** publish to the public cursor.com marketplace for this plugin — **private team marketplace only**.

1. Push this repo to your org's Git host (GitHub, GitLab, etc.).
2. In Cursor team settings, add a **team marketplace** entry pointing at the repo.
3. For multi-plugin repos, add `.cursor-plugin/marketplace.json` at repo root (not required for single-plugin repo).
4. Set plugin visibility to **team only**.
5. Notify designers to install and configure `FIGMA_ACCESS_TOKEN`.
6. Smoke-test: one Design inspect + one FigJam summary on real team files.

## Repository structure

```
cursor-design-team-plugin/
├── .cursor-plugin/plugin.json
├── mcp.json
├── rules/
├── skills/
├── commands/
├── assets/logo.svg
└── README.md
```

## Support & blockers

- **MCP URL:** `https://mcp.figma.com/mcp` (remote, recommended)
- **Auth model:** Confirm OAuth vs PAT with team admin
- **FigJam tool coverage:** Verify MCP tools support board read on your plan
- **Token sync:** Intentionally out of scope for MVP

## License

Internal team use — confirm license with GoTo design/platform leads before external distribution.
