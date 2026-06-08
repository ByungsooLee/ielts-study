#!/usr/bin/env node
/**
 * 編集元 JSON を sample/ielts-import.json へ取り込む。
 * 使い方: node tools/import-content.mjs
 * 環境変数: CONTENT_SRC（既定 /Users/lee/Claude/Projects/IELTS/ielts-import.json）
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const DEFAULT_SRC = "/Users/lee/Claude/Projects/IELTS/ielts-import.json";
const DEST = resolve(root, "sample/ielts-import.json");

const srcPath = resolve(process.env.CONTENT_SRC || DEFAULT_SRC);

if (!existsSync(srcPath)) {
  console.error("ソースファイルが見つかりません:", srcPath);
  console.error("CONTENT_SRC でパスを指定してください。");
  process.exit(1);
}

let source;
try {
  source = JSON.parse(readFileSync(srcPath, "utf8"));
} catch (e) {
  console.error("ソース JSON の読み込みに失敗:", srcPath, e.message);
  process.exit(1);
}

if (!source?.items || !Array.isArray(source.items)) {
  console.error("items 配列が必要です:", srcPath);
  process.exit(1);
}
if (!source.source?.added) {
  console.error("source.added が必要です:", srcPath);
  process.exit(1);
}

let existingPassages;
if (existsSync(DEST)) {
  try {
    const existing = JSON.parse(readFileSync(DEST, "utf8"));
    if (Array.isArray(existing.passages) && existing.passages.length > 0) {
      existingPassages = existing.passages;
    }
  } catch {
    // 既存ファイルが壊れていてもソース取り込みは続行
  }
}

const output = { ...source };

if (Array.isArray(source.passages) && source.passages.length > 0) {
  output.passages = source.passages;
} else if (existingPassages) {
  output.passages = existingPassages;
  console.log(`ソースに passages がないため、既存 sample の passages (${existingPassages.length} 件) を保持します。`);
}

writeFileSync(DEST, `${JSON.stringify(output, null, 2)}\n`, "utf8");

console.log(`取り込み完了: ${srcPath}`);
console.log(`→ ${DEST}`);
console.log(`items: ${output.items.length} 件`);
if (output.passages) {
  console.log(`passages: ${output.passages.length} 件`);
}
