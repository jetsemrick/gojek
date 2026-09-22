# Design Team Cursor Plugin

Cursor plugin for the GoTo design team: **design request workflow** — research inspiration, build **HTML canvas prototypes**, and iterate from feedback — optimized for **designers** and **mobile-first** development.

## North star workflow

```text
Design request → Research → HTML prototype → Iterate
```

| Phase | Command | Output |
| --- | --- | --- |
| **Research** | `/design-research` | Inspiration & pattern summary |
| **Prototype** | `/design-prototype` | Self-contained mobile HTML canvas artifact |
| **Iterate** | `/design-iterate` | Updated artifact + changelog |

Run the full flow (with checkpoints): `/design-request <brief>`

**Design Request Agent** (`agents/design-request-agent.md`) orchestrates all three phases.

## What's included

| Component | Purpose |
| --- | --- |
| **Agent** | `design-request` — orchestrates research → prototype → iterate |
| **Skills** | `design-request-research`, `design-prototype-html`, `design-iterate-feedback` |
| **Commands** | `/design-request`, `/design-research`, `/design-prototype`, `/design-iterate` |
| **Rules** | `design-request-workflow`, `html-prototype-standards`, mobile + designer conventions |
| **Figma MCP** | Optional — inspect frames & summarize FigJam boards as **research inputs** |
| **Legacy commands** | `/inspect-design`, `/figjam-summary` (secondary) |

**MVP exclusions:** No design token sync, no `DESIGN_TOKEN_PATH`, no deep multi-file codegen.

## HTML canvas prototypes

Prototypes are **self-contained `.html` files** (inline CSS, vanilla JS) that designers preview in Cursor's **canvas / artifact** panel:

- **390px** mobile viewport with safe-area insets
- Semantic structure mappable to Figma frames later
- Version comment in HTML + companion `*-notes.md` changelog

Default paths: `prototypes/<slug>-v1.html` and `prototypes/<slug>-notes.md`.

## Prerequisites

- [Cursor](https://cursor.com) with plugin / MCP support
- Figma account (optional — only when using Figma/FigJam URLs in research)

## Install (team marketplace)

1. Team admin adds this repository to the **private team marketplace** in Cursor.
2. Designers install **Design Team** from **Customize → Plugins** (team catalog).
3. If using Figma/FigJam in research: **Plugins → Configure → Figma access token** (`FIGMA_ACCESS_TOKEN`).
4. Reload MCP if prompted.

## Local test (development)

1. Clone repo; checkout branch `cursor/design-team-plugin-scaffold`.
2. In Cursor: **File → Open Folder** → select `cursor-design-team-plugin/`.
3. In agent chat, try:

```
/design-request Mobile savings nudge — bottom sheet at checkout, dismissible, 390px
```

Or phase by phase:

```
/design-research Sticky CTA patterns for mobile checkout
/design-prototype Savings nudge bottom sheet from research above
/design-iterate prototypes/savings-nudge-v1.html — increase CTA tap target to 48px
```

Secondary Figma flows (optional):

```
/inspect-design https://www.figma.com/design/...?node-id=...
/figjam-summary https://www.figma.com/board/...
```

### Verify checklist

- [ ] `.cursor-plugin/plugin.json` validates (name: `design-team`, version ≥ 0.2.0)
- [ ] Agent `design-request` appears in subagent list
- [ ] Commands `/design-request` through `/design-iterate` run without missing file errors
- [ ] HTML prototype follows `html-prototype-standards` (390px, safe areas)
- [ ] Figma MCP connects when token configured (optional)

## Configuration

### Plugin variable

| Variable | Required | Where to set |
| --- | --- | --- |
| `FIGMA_ACCESS_TOKEN` | Optional* | Team marketplace **Plugins → Configure** |

\*Required only when research includes Figma/FigJam MCP calls. HTML-only workflows need no token.

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

**Alternative — Figma desktop MCP:** `http://127.0.0.1:3845/mcp` (Dev Mode toggle; no token).

## Usage (designers)

### Full design request

```
/design-request <problem, user, platform, must-haves>
```

Agent runs research → prototype → pauses for review → iterate on feedback.

### Research only

```
/design-research <question or brief>
```

### Prototype only

```
/design-prototype <brief or "from research above">
```

### Iterate on feedback

```
/design-iterate prototypes/<file>.html — <bullet feedback>
```

### Figma / FigJam (secondary research)

- **Inspect frame:** `/inspect-design <figma-url-with-node-id>`
- **Summarize board:** `/figjam-summary <figjam-url>`

## Repository structure

```
cursor-design-team-plugin/
├── .cursor-plugin/plugin.json
├── agents/design-request-agent.md
├── mcp.json
├── rules/
│   ├── design-request-workflow.mdc
│   ├── html-prototype-standards.mdc
│   └── ...
├── skills/
│   ├── design-request-research/
│   ├── design-prototype-html/
│   ├── design-iterate-feedback/
│   └── figma-*/
├── commands/
│   ├── design-request.md
│   ├── design-research.md
│   ├── design-prototype.md
│   ├── design-iterate.md
│   └── inspect-design.md, figjam-summary.md
├── assets/logo.svg
└── README.md
```

## Publish to team marketplace (admins)

**Private team marketplace only** — not public cursor.com/marketplace.

1. Push to org Git host.
2. Add team marketplace entry in Cursor team settings.
3. Smoke-test: one `/design-request` flow + one `/design-iterate` cycle.

## Support & open questions

- **Web search:** Confirm team policy for external inspiration in research phase.
- **Canvas artifacts:** Confirm HTML preview behavior in your Cursor build.
- **Figma auth:** OAuth vs PAT for marketplace installs.
- **Prototype paths:** Align on repo folder convention vs ephemeral artifacts.

## License

Internal team use — confirm with GoTo design/platform leads before external distribution.
