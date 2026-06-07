import { writeFileSync, mkdirSync } from "node:fs";

const version =
  process.env.GITHUB_SHA?.slice(0, 7) ||
  process.env.CF_PAGES_COMMIT_SHA?.slice(0, 7) ||
  Date.now().toString(36);

const payload = {
  version,
  builtAt: new Date().toISOString(),
};

mkdirSync("public", { recursive: true });
writeFileSync("public/version.json", JSON.stringify(payload, null, 2));
console.log(`Generated version.json: ${version}`);
