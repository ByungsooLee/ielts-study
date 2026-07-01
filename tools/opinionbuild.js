/* Part3 意見(Writing Task2 / Speaking) ビルダー
   content-src/writing/section-*.json  → web/public/content/english/ielts-writing/section-N.json
   content-src/speaking/section-*.json → web/public/content/english/ielts-speaking/section-N.json
   使い方: node tools/opinionbuild.js
   ※ version は中身のmd5(8桁)。接続表現など複数ファイル共有のitem idはそのまま（SRSはid単位）。
   ※ standalone index は生成しない。md2json.js が上記シャード dir を直接走査して
      主 index.json の collections[] に反映する。 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const CONTENT = path.join(ROOT, "web", "public", "content");
const CONTENT_SCHEMA_VERSION = 1;

const hash = s => crypto.createHash("md5").update(s).digest("hex").slice(0, 8);
const nowIso = new Date().toISOString();
function readJsonIfExists(p) {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch (e) { return null; }
}

function build(kind, collId, collName, srcSub) {
  const SRC = path.join(ROOT, "content-src", srcSub);
  const OUTDIR = path.join(CONTENT, "english", collId);
  fs.mkdirSync(OUTDIR, { recursive: true });

  const files = fs.existsSync(SRC)
    ? fs.readdirSync(SRC).filter(f => /^section-\d+\.json$/.test(f)).sort()
    : [];
  let totalItems = 0, totalDrills = 0;

  for (const f of files) {
    const d = JSON.parse(fs.readFileSync(path.join(SRC, f), "utf8"));

    const items = (d.items || []).map(it => ({
      ...it,
      domain: "english",
      collection: collId,
      theme: d.section,
      themeName: d.title,
    }));

    const prompt = d.prompt || d.question || "";
    const promptJp = d.prompt_jp || d.question_jp || "";
    const outlineJp = d.outline_jp;
    const modelAnswer = d.model_answer || [];
    const drills = d.drills || [];

    const content = { prompt, promptJp, outlineJp: outlineJp || null, modelAnswer, items, drills };
    const version = hash(JSON.stringify(content));

    const outName = `section-${d.section}.json`;
    const outPath = path.join(OUTDIR, outName);
    const prev = readJsonIfExists(outPath);
    const generatedAt = (prev && prev.version === version && prev.generatedAt) ? prev.generatedAt : nowIso;

    const body = {
      schemaVersion: CONTENT_SCHEMA_VERSION,
      domain: "english",
      collection: collId,
      collectionId: collId,
      collectionName: collName,
      kind,
      // ThemeShardData 互換フィールド
      theme: d.section,
      themeId: `section-${d.section}`,
      themeName: d.title,
      version,
      generatedAt,
      // ドリル固有フィールド
      section: d.section,
      title: d.title,
      prompt,
      prompt_jp: promptJp,
      ...(outlineJp ? { outline_jp: outlineJp } : {}),
      model_answer: modelAnswer,
      items,
      drills,
    };
    fs.writeFileSync(outPath, JSON.stringify(body, null, 2) + "\n");

    totalItems += items.length;
    totalDrills += drills.length;
  }

  console.error(`${kind}: sections ${files.length} | items ${totalItems} | drills ${totalDrills}`);
}

build("writing", "ielts-writing", "IELTS意見エッセイ(Writing Task2)", "writing");
build("speaking", "ielts-speaking", "IELTS口頭回答(Speaking)", "speaking");
