#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const pluginRoot = resolve(scriptDir, "..");
const repoRoot = resolve(pluginRoot, "..");
const errors = [];

const fail = (message) => errors.push(message);
const read = (path) => readFileSync(path, "utf8");
const readJson = (path) => {
  try {
    return JSON.parse(read(path));
  } catch (error) {
    fail(`${relative(repoRoot, path)} is not valid JSON: ${error.message}`);
    return {};
  }
};

const walk = (directory) => {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
};

const parseName = (path) => {
  const text = read(path);
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatter) {
    fail(`${relative(repoRoot, path)} is missing YAML frontmatter`);
    return undefined;
  }
  const name = frontmatter[1].match(/^name:\s*([a-z0-9.-]+)\s*$/m)?.[1];
  if (!name) fail(`${relative(repoRoot, path)} has no valid frontmatter name`);
  if (!/^description:\s*\S+/m.test(frontmatter[1])) {
    fail(`${relative(repoRoot, path)} has no frontmatter description`);
  }
  return name;
};

const requiredFiles = [
  ".cursor-plugin/marketplace.json",
  "cursor-design-team-plugin/.cursor-plugin/plugin.json",
  "cursor-design-team-plugin/README.md",
  "cursor-design-team-plugin/assets/logo.svg",
  "cursor-design-team-plugin/agents/design-research-verifier.md",
  "cursor-design-team-plugin/commands/design-request.md",
  "cursor-design-team-plugin/commands/design-export-figma.md",
  "cursor-design-team-plugin/skills/design-publish-figma/SKILL.md",
  "cursor-design-team-plugin/skills/figma-inspect-handoff/SKILL.md",
];

for (const file of requiredFiles) {
  if (!existsSync(join(repoRoot, file))) fail(`Missing required file: ${file}`);
}

const manifestPath = join(pluginRoot, ".cursor-plugin", "plugin.json");
const marketplacePath = join(repoRoot, ".cursor-plugin", "marketplace.json");
const manifest = readJson(manifestPath);
const marketplace = readJson(marketplacePath);

const manifestFields = new Set([
  "name",
  "description",
  "version",
  "author",
  "homepage",
  "repository",
  "license",
  "keywords",
  "logo",
  "rules",
  "agents",
  "skills",
  "commands",
  "hooks",
  "mcpServers",
  "variables",
]);
const marketplaceFields = new Set(["name", "owner", "metadata", "plugins"]);
const marketplaceMetadataFields = new Set([
  "description",
  "version",
  "pluginRoot",
]);
const marketplacePluginFields = new Set([
  "name",
  "source",
  "description",
  "version",
  "author",
  "homepage",
  "repository",
  "license",
  "keywords",
  "logo",
  "category",
  "tags",
  "skills",
  "rules",
  "agents",
  "commands",
  "hooks",
  "mcpServers",
  "variables",
]);

for (const field of Object.keys(manifest)) {
  if (!manifestFields.has(field)) {
    fail(`plugin.json uses undocumented field: ${field}`);
  }
}
if (!/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(manifest.name ?? "")) {
  fail("plugin.json name must be lowercase kebab-case/dotted");
}
if (!/^\d+\.\d+\.\d+$/.test(manifest.version ?? "")) {
  fail("plugin.json version must be semantic x.y.z");
}
if (manifest.mcpServers || manifest.variables) {
  fail("Design Team must not declare a duplicate Figma MCP or auth variables");
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(marketplace.name ?? "")) {
  fail("marketplace name must be kebab-case");
}
for (const field of Object.keys(marketplace)) {
  if (!marketplaceFields.has(field)) {
    fail(`marketplace.json uses undocumented field: ${field}`);
  }
}
for (const field of Object.keys(marketplace.metadata ?? {})) {
  if (!marketplaceMetadataFields.has(field)) {
    fail(`marketplace metadata uses undocumented field: ${field}`);
  }
}
if (!marketplace.owner?.name) fail("marketplace owner.name is required");
if (!Array.isArray(marketplace.plugins) || marketplace.plugins.length === 0) {
  fail("marketplace plugins must be a non-empty array");
}
for (const entry of marketplace.plugins ?? []) {
  for (const field of Object.keys(entry)) {
    if (!marketplacePluginFields.has(field)) {
      fail(`marketplace plugin "${entry.name ?? "unknown"}" uses undocumented field: ${field}`);
    }
  }
}

const marketplaceEntry = marketplace.plugins?.find(
  (entry) => entry.name === manifest.name,
);
if (!marketplaceEntry) {
  fail(`marketplace does not list plugin ${manifest.name}`);
} else {
  if (marketplaceEntry.source !== "cursor-design-team-plugin") {
    fail("design-team marketplace source must be cursor-design-team-plugin");
  }
  if (marketplaceEntry.version !== manifest.version) {
    fail("marketplace and plugin versions must match");
  }
  const sourceRoot = join(repoRoot, marketplaceEntry.source);
  if (!existsSync(join(sourceRoot, ".cursor-plugin", "plugin.json"))) {
    fail("marketplace source does not resolve to a Cursor plugin");
  }
}
if (marketplace.metadata?.version !== manifest.version) {
  fail("marketplace metadata.version and plugin version must match");
}

const components = {
  command: walk(join(pluginRoot, "commands")).filter((path) =>
    /\.(md|mdc|markdown|txt)$/.test(path),
  ),
  agent: walk(join(pluginRoot, "agents")).filter((path) =>
    /\.(md|mdc|markdown)$/.test(path),
  ),
  skill: walk(join(pluginRoot, "skills")).filter((path) =>
    path.endsWith("/SKILL.md"),
  ),
};

const names = new Map();
for (const [type, files] of Object.entries(components)) {
  for (const path of files) {
    const name = parseName(path);
    if (!name) continue;
    if (names.has(name)) {
      fail(
        `Duplicate component name "${name}" in ${names.get(name)} and ${type}`,
      );
    } else {
      names.set(name, type);
    }

    const expected =
      type === "skill"
        ? relative(join(pluginRoot, "skills"), dirname(path))
        : relative(join(pluginRoot, `${type}s`), path).replace(
            /\.(md|mdc|markdown|txt)$/,
            "",
          );
    if (expected !== name) {
      fail(
        `${relative(repoRoot, path)} declares "${name}" but path implies "${expected}"`,
      );
    }
  }
}

const expectedNames = {
  command: [
    "design-request",
    "design-research",
    "design-prototype",
    "design-iterate",
    "design-export-figma",
    "inspect-design",
    "figjam-summary",
  ],
  agent: ["design-research-verifier"],
  skill: [
    "design-request-research",
    "design-prototype-html",
    "design-iterate-feedback",
    "design-publish-figma",
    "figma-inspect-handoff",
  ],
};

for (const [type, expected] of Object.entries(expectedNames)) {
  const actual = new Set(
    components[type].map(parseName).filter((name) => name !== undefined),
  );
  for (const name of expected) {
    if (!actual.has(name)) fail(`Missing ${type}: ${name}`);
  }
  for (const name of actual) {
    if (!expected.includes(name)) fail(`Unexpected ${type}: ${name}`);
  }
}

const forbiddenFiles = [
  "cursor-design-team-plugin/mcp.json",
  "cursor-design-team-plugin/agents/design-request-agent.md",
  "cursor-design-team-plugin/skills/design-export-figma/SKILL.md",
  "cursor-design-team-plugin/skills/figma-design-to-code/SKILL.md",
  "cursor-design-team-plugin/skills/figma-code-connect/SKILL.md",
];
for (const file of forbiddenFiles) {
  if (existsSync(join(repoRoot, file))) fail(`Forbidden stale file: ${file}`);
}

const currentScript = fileURLToPath(import.meta.url);
const textFiles = walk(pluginRoot).filter(
  (path) => /\.(json|md|mdc|mjs)$/.test(path) && path !== currentScript,
);
const allText = textFiles.map(read).join("\n");
const forbiddenText = [
  ["FIGMA_ACCESS_TOKEN", "PAT variable reference"],
  ["127.0.0.1:3845/mcp", "desktop Figma MCP reference"],
  ['"Authorization": "Bearer', "Bearer MCP configuration"],
  ["figma-design-to-code", "bundled official-skill lookalike reference"],
  ["figma-code-connect", "bundled official-skill lookalike reference"],
  ["design-request-agent", "stale agent reference"],
];
for (const [needle, label] of forbiddenText) {
  if (allText.includes(needle)) fail(`${label} remains: ${needle}`);
}
if (/\b(?:three[- ]phase|all three with checkpoints)\b/i.test(allText)) {
  fail("Stale three-phase workflow wording remains");
}

const requiredContent = [
  [
    "commands/design-export-figma.md",
    [
      "/add-plugin figma",
      "OAuth",
      "generate_figma_design",
      "localhost",
      "Full seat",
      "edit permission",
      "use_figma",
      "Figma URL",
    ],
  ],
  [
    "skills/design-publish-figma/SKILL.md",
    [
      "/add-plugin figma",
      "OAuth",
      "generate_figma_design",
      "localhost",
      "Full seat",
      "edit permission",
      "use_figma",
      "Figma Design URL",
      "fallback",
    ],
  ],
  [
    "README.md",
    [
      "/add-plugin figma",
      "OAuth",
      "generate_figma_design",
      "plugin manifest does not support",
      ".cursor-plugin/marketplace.json",
    ],
  ],
];

for (const [file, needles] of requiredContent) {
  const path = join(pluginRoot, file);
  if (!existsSync(path)) continue;
  const text = read(path);
  for (const needle of needles) {
    if (!text.includes(needle)) {
      fail(`${file} is missing required guidance: ${needle}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`Plugin validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Plugin validation passed: ${names.size} unique components, version ${manifest.version}.`,
);
