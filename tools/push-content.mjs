#!/usr/bin/env node
/**
 * 教材 JSON を Worker KV (/content) にアップロードする。
 * 使い方: node tools/push-content.mjs [path/to/ielts-import.json]
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnvFile(path) {
  try {
    const text = readFileSync(path, "utf8");
    const env = {};
    for (const line of text.split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) env[m[1].trim()] = m[2].trim();
    }
    return env;
  } catch {
    return {};
  }
}

const workerEnv = loadEnvFile(resolve(root, "worker/.dev.vars"));
const webEnv = loadEnvFile(resolve(root, "web/.env.local"));

const workerUrl = (
  process.env.WORKER_URL ||
  webEnv.VITE_DEFAULT_WORKER_URL ||
  "https://ielts-study-worker.byung4050.workers.dev"
).replace(/\/$/, "");

const syncToken = process.env.SYNC_TOKEN || workerEnv.SYNC_TOKEN || webEnv.VITE_DEFAULT_SYNC_TOKEN;

if (!syncToken) {
  console.error("SYNC_TOKEN が見つかりません。worker/.dev.vars または web/.env.local を確認してください。");
  process.exit(1);
}

const jsonPath = resolve(root, process.argv[2] || "sample/ielts-import.json");
const raw = JSON.parse(readFileSync(jsonPath, "utf8"));

if (!raw?.items || !Array.isArray(raw.items)) {
  console.error("items 配列が必要です:", jsonPath);
  process.exit(1);
}
if (!raw.source?.added) {
  console.error("source.added が必要です:", jsonPath);
  process.exit(1);
}

const now = Date.now();
const records = raw.items
  .filter((item) => item?.id && item?.type && item?.front && item?.meaning)
  .map((item) => ({
    id: item.id,
    item,
    source: {
      book: raw.source.book,
      section: raw.source.section,
      added: raw.source.added,
    },
    importedAt: now,
  }));

const payload = { records, updatedAt: now };

const res = await fetch(`${workerUrl}/content`, {
  method: "PUT",
  headers: {
    Authorization: `Bearer ${syncToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});

if (!res.ok) {
  const text = await res.text();
  console.error(`アップロード失敗 (${res.status}):`, text);
  process.exit(1);
}

console.log(`教材 ${records.length} 件を ${workerUrl}/content に保存しました。`);
