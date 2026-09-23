# GoTo Cursor team marketplace

This repository is **GoTo** (`goto`), a private Cursor team marketplace.
Cursor reads the marketplace manifest at [`.cursor-plugin/marketplace.json`](./.cursor-plugin/marketplace.json),
which lists the plugins in this repo.

## Plugins

| Plugin | Folder | Description |
| --- | --- | --- |
| Design (`design`) | [`design/`](./design/) | Research, prototype, iterate, and export mobile design requests to Figma. |

See the [Design README](./design/README.md) for the
workflow, the Figma plugin prerequisite, and local development.

## Add the team marketplace

1. In the Cursor dashboard, open **Plugins & MCPs → Team Marketplaces → Add
   Marketplace → Import from Repo** and import
   `https://github.com/jetsemrick/goto`.
2. Track the **`main`** branch.
3. Install **Design** from **Customize → Plugins**.

Releases ship by merging to `main` with the version bumped in both the plugin's
`.cursor-plugin/plugin.json` and the root `marketplace.json`.

## Validate

Requires Node.js 20 or later; there are no dependencies to install.

```bash
npm run validate:plugin
```

This runs `design/scripts/validate-plugin.mjs`, which checks
the marketplace and plugin manifests, component names and descriptions, starter
and research board templates, and stale or forbidden references.
