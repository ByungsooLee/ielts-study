/* Part2 図解描写(Task1) ビルダー
   content-src/task1/section-*.json → web/public/content/english/ielts-task1/section-N.json
   使い方: node tools/task1build.js  （content:build から呼ばれる）
   ※ version は中身のmd5(8桁)＝idempotent（内容が変わった時だけ更新）。
      generatedAt は version 変化時のみ更新して git 差分を最小化。
   ※ standalone index は生成しない。md2json.js が web/public/content/english/ielts-task1/
      配下のシャードを直接走査して主 index.json の collections[] に反映する。 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "content-src", "task1");
const CONTENT = path.join(ROOT, "web", "public", "content");
const OUTDIR = path.join(CONTENT, "english", "ielts-task1");
const CONTENT_SCHEMA_VERSION = 1;

const hash = s => crypto.createHash("md5").update(s).digest("hex").slice(0, 8);
const nowIso = new Date().toISOString();
function readJsonIfExists(p) {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch (e) { return null; }
}

fs.mkdirSync(OUTDIR, { recursive: true });

const files = fs.existsSync(SRC)
  ? fs.readdirSync(SRC).filter(f => /^section-\d+\.json$/.test(f)).sort()
  : [];

let totalItems = 0, totalDrills = 0;

for (const f of files) {
  const d = JSON.parse(fs.readFileSync(path.join(SRC, f), "utf8"));

  // items に domain/collection/theme/themeName を付与（既存 shardToRecords と整合）
  const items = (d.items || []).map(it => ({
    ...it,
    domain: "english",
    collection: "ielts-task1",
    theme: d.section,
    themeName: d.title,
  }));

  // 内容ハッシュ（メタは含めない）
  const content = { chart: d.chart, model_paragraph: d.model_paragraph || "", items, drills: d.drills || [] };
  const version = hash(JSON.stringify(content));

  const outName = `section-${d.section}.json`;
  const outPath = path.join(OUTDIR, outName);
  const prev = readJsonIfExists(outPath);
  const generatedAt = (prev && prev.version === version && prev.generatedAt) ? prev.generatedAt : nowIso;

  const body = {
    schemaVersion: CONTENT_SCHEMA_VERSION,
    domain: "english",
    collection: "ielts-task1",
    collectionId: "ielts-task1",
    collectionName: d.collectionName || "IELTS図解描写(Task1)",
    kind: "task1",
    // ThemeShardData 互換フィールド（theme = section 番号）
    theme: d.section,
    themeId: `section-${d.section}`,
    themeName: d.title,
    version,
    generatedAt,
    // ドリル固有フィールド
    section: d.section,
    title: d.title,
    chart: d.chart,
    model_paragraph: d.model_paragraph || "",
    items,
    drills: d.drills || [],
  };
  fs.writeFileSync(outPath, JSON.stringify(body, null, 2) + "\n");

  totalItems += items.length;
  totalDrills += (d.drills || []).length;
}

console.error(`task1: sections ${files.length} | items ${totalItems} | drills ${totalDrills}`);
