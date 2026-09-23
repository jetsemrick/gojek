# GoTo private Cursor plugins

This repository is a private Cursor team marketplace for GoTo. Cursor reads the
marketplace manifest at [`.cursor-plugin/marketplace.json`](./.cursor-plugin/marketplace.json),
which lists the plugins in this repo.

## Plugins

| Plugin | Folder | Description |
| --- | --- | --- |
| Design Team (`design-team`) | [`cursor-design-team-plugin/`](./cursor-design-team-plugin/) | Research, prototype, iterate, and export mobile design requests to Figma. |

See the [Design Team README](./cursor-design-team-plugin/README.md) for the
workflow, the Figma plugin prerequisite, and local development.

## Add the team marketplace

1. In the Cursor dashboard, open **Plugins & MCPs → Team Marketplaces → Add
   Marketplace → Import from Repo** and import
   `https://github.com/jetsemrick/goto`.
2. Track the **`main`** branch.
3. Install **Design Team** from **Customize → Plugins**.

Releases ship by merging to `main` with the version bumped in both the plugin's
`.cursor-plugin/plugin.json` and the root `marketplace.json`.

## Validate

Requires Node.js 20 or later; there are no dependencies to install.

```bash
npm run validate:plugin
```

This runs `cursor-design-team-plugin/scripts/validate-plugin.mjs`, which checks
the marketplace and plugin manifests, component names and descriptions, starter
templates, and stale or forbidden references.
