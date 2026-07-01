/* Part2 図解描写(Task1) ビルダー
   content-src/task1/section-*.json → web/public/content/english/ielts-task1/section-N.json ＋ 目次
   使い方: node tools/task1build.js  （content:build から呼ばれる）
   ※ version は中身のmd5(8桁)＝idempotent（内容が変わった時だけ更新）。
      generatedAt は version 変化時のみ更新して git 差分を最小化。 */
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

const sections = [];
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

  sections.push({
    section: d.section,
    title: d.title,
    chartType: d.chart && d.chart.type,
    file: `english/ielts-task1/${outName}`,
    version,
    itemCount: items.length,
    drillCount: (d.drills || []).length,
  });
  totalItems += items.length;
  totalDrills += (d.drills || []).length;
}

sections.sort((a, b) => a.section - b.section);
const indexVersion = hash(sections.map(s => s.section + ":" + s.version).join("|"));
const indexPath = path.join(CONTENT, "task1-index.json");
const prevIndex = readJsonIfExists(indexPath);
const indexGeneratedAt = (prevIndex && prevIndex.version === indexVersion && prevIndex.generatedAt) ? prevIndex.generatedAt : nowIso;
const index = {
  schemaVersion: CONTENT_SCHEMA_VERSION,
  id: "ielts-task1",
  domain: "english",
  name: "IELTS図解描写(Task1)",
  kind: "task1",
  version: indexVersion,
  generatedAt: indexGeneratedAt,
  sections,
};
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + "\n");

console.error(`task1: sections ${sections.length} | items ${totalItems} | drills ${totalDrills}`);
