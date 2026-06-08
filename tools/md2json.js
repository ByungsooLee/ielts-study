/* content-src/ の教材ソース → 取り込み用JSON 変換スクリプト
   使い方: npm run content:build  （= node tools/md2json.js）
   出力:   sample/ielts-import.json（KV互換・全件）
           web/public/content/（index.json + theme シャード・Pages/CDN配信用）
   ※ idは front から固定生成。front を変えなければ毎回同じid＝上書き更新される。 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const MD = fs.readFileSync(path.join(ROOT, "content-src", "単語マスターリスト.md"), "utf8");
const today = new Date().toISOString().slice(0, 10);

const THEME_TAG = {1:"polynesia",2:"plastic",3:"titanic",4:"beaver",5:"dance",
  6:"ai-art",7:"gifted-school",8:"hyperloop",9:"montessori",10:"lying"};

/* ---- 発音コーチ・データ ---- */
let COACH = {};
try { COACH = require(path.join(ROOT, "content-src", "pron-coach.js")); } catch (e) { /* 無くてもOK */ }

/* ---- 例文をデータ.jsの物語から取得（テーマ/文番号キー付き） ---- */
const exMap = {};
let STORY = [];               // data.js の物語（passages生成にも使う）
try {
  const g = {};
  global.window = g;
  require(path.join(ROOT, "content-src", "ielts-vocab-data.js"));
  STORY = g.IELTS_DATA || [];
  const re = /\[([^\]]+)\]/g;
  (g.IELTS_DATA || []).forEach(t => t.story.forEach((s, idx) => {
    const clean = s.replace(re, (_, b) => b.split("|")[0]); // 表示形に戻す
    const key = `t${t.id}-s${idx + 1}`;
    let m; const r2 = /\[([^\]]+)\]/g;
    while ((m = r2.exec(s))) {
      const f = m[1].split("|");
      const base = (f[1] || "").toLowerCase();
      if (base && !exMap[base]) exMap[base] = { en: clean, key };
    }
  }));
} catch (e) { /* データ.jsが無くてもOK */ }

/* ---- ヘルパ ---- */
const stripParen = x => x.replace(/[（(][^）)]*[）)]/g, "").trim();
const splitSyn = x => stripParen(x).split("/").map(s => s.trim()).filter(Boolean);
function slug(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");}
function isPhrase(front){return /\s/.test(front.trim());}

/* ---- 優先度マップ（S/A/B） ---- */
const tier = {};
{
  const lines = MD.split("\n");
  let cur = null;
  for (let i=0;i<lines.length;i++){
    const ln=lines[i].trim();
    const h=ln.match(/^####\s*([SAB])[＝=]/);
    if(h){cur=h[1];
      // 次の非空・非見出し行がリスト
      let j=i+1; while(j<lines.length && (!lines[j].trim()||lines[j].startsWith("#"))) j++;
      if(j<lines.length){
        lines[j].split(",").forEach(entry=>{
          const words=splitSyn(entry); // 例: "alter / transform（変える）"
          words.forEach(w=>{ if(w && !tier[w.toLowerCase()]) tier[w.toLowerCase()]=cur; });
        });
      }
      cur=null;
    }
  }
}

/* ---- テーマ別 Active表 / Passive を項目化 ---- */
const items=[];
const seen=new Set();
let currentDate=today; // 直近の "## YYYY-MM-DD" 見出しから設定
function addItem({front,meaning,syn,collo,themeNum,themeName,defaultTier}){
  front=stripParen(front).trim();
  if(!front||!meaning) return;
  const type=isPhrase(front)?"phrase":"word";
  const id=(type==="phrase"?"p-":"w-")+slug(front);
  if(seen.has(id)){ // 既出（＝既に追記済み）なら theme タグだけ足す。初出日は保持
    const it=items.find(x=>x.id===id);
    if(it){const tg=THEME_TAG[themeNum]; if(tg&&!it.tags.includes(tg))it.tags.push(tg);}
    return;
  }
  seen.add(id);
  const pr=tier[front.toLowerCase()]||defaultTier;
  const ex=exMap[front.toLowerCase()];
  let example=null;
  if(ex){
    const c=COACH[ex.key];
    example={en:ex.en, ...(c?{linking:c.linking, tips:c.tips}:{})};
  }
  const it={
    id, type, front,
    meaning: meaning.trim(),
    ...(syn&&syn.length?{synonyms:syn}:{}),
    ...(collo?{collocation:collo.trim()}:{}),
    ...(example?{examples:[example]}:{}),
    pron: type==="word" ? {lookup:front, tts:front} : {tts:front},
    tags: THEME_TAG[themeNum]?[THEME_TAG[themeNum]]:[],
    ...(themeNum?{theme:themeNum}:{}),
    ...(themeName?{themeName}:{}),
    priority: pr,
    _date: currentDate            // 内部用（初出日）。出力前に除去
  };
  items.push(it);
}

{
  const lines=MD.split("\n");
  let themeNum=null, themeName=null, sub=null;
  for(let i=0;i<lines.length;i++){
    const raw=lines[i], ln=raw.trim();
    const dm=ln.match(/^##\s+(\d{4}-\d{2}-\d{2})/);
    if(dm){currentDate=dm[1]; continue;}
    const tm=ln.match(/^###\s*テーマ(\d+)[：:]\s*(.*)$/);
    if(tm){themeNum=+tm[1]; themeName=(tm[2]||"").trim()||null; sub=null; continue;}
    if(/^###\s*★/.test(ln)){themeNum=null; themeName=null; sub=null; continue;}
    if(/^####\s*Active/.test(ln)){sub="active"; continue;}
    if(/^####\s*Passive/.test(ln)){sub="passive"; continue;}
    if(themeNum==null) continue;

    if(sub==="active" && ln.startsWith("|")){
      if(/^\|\s*概念/.test(ln) || /^\|[-\s|]+$/.test(ln)) continue; // ヘッダ/区切り
      const c=ln.split("|").map(s=>s.trim()); // ['',概念,代表語,言い換え,collo,'']
      const meaning=c[1], rep=c[2], syn=c[3], collo=c[4];
      if(!rep) continue;
      const repParts=splitSyn(rep);
      const front=repParts[0];
      const synonyms=[...repParts.slice(1), ...(syn?splitSyn(syn):[])];
      addItem({front,meaning,syn:synonyms,collo,themeNum,themeName,defaultTier:"A"});
    }
    if(sub==="passive" && ln && !ln.startsWith("#")){
      ln.split(",").forEach(entry=>{
        const mm=entry.match(/^(.*?)[（(]([^）)]*)[）)]\s*$/);
        let words, jp;
        if(mm){words=mm[1]; jp=mm[2];}
        else {words=entry; jp="";}
        const parts=splitSyn(words);
        if(!parts.length||!jp) return;
        addItem({front:parts[0],meaning:jp,syn:parts.slice(1),collo:"",themeNum,themeName,defaultTier:"B"});
      });
      sub=null; // Passiveは1行で終わり
    }
  }
}

/* ---- 構文(grammar)項目（学習ノートより） ---- */
const grammar=[
  {id:"g-past-perfect",type:"grammar",front:"had + 過去分詞（過去完了）",
   meaning:"過去のある時点より前に完了した動作・状態を表す",
   examples:[{en:"By 1985, previous attempts had all failed.",jp:"1985年までに、以前の試みは全て失敗していた。"}],
   pron:{tts:"By 1985, previous attempts had all failed."},tags:["grammar"]},
  {id:"g-uncountable-evidence",type:"grammar",front:"不可算名詞（evidence など）",
   meaning:"evidence/information/advice/research/progress は不可算。複数形・a/many は不可。much/a lot of を使う",
   examples:[{en:"There is a lot of evidence for this.",jp:"これには多くの証拠がある。（×many evidences）"}],
   pron:{tts:"There is a lot of evidence for this."},tags:["grammar"]},
  {id:"g-move-usage",type:"grammar",front:"move の用法（移住 vs 移動）",
   meaning:"move は『永続的に住む場所を移す』時に使う。日常の移動には go を使う",
   examples:[{en:"I go to work by train.",jp:"電車で通勤します。（×I move to work by train）"}],
   pron:{tts:"I go to work by train."},tags:["grammar"]}
];
grammar.forEach(g=>items.push({...g,_date:"2026-06-07"}));

/* ---- 通し番号 n を付与（id→番号を台帳で固定。新規はmax+1。再生成してもズレない） ---- */
const LEDGER=path.join(ROOT,"content-src","number-ledger.json");
let ledger={};
try{ ledger=JSON.parse(fs.readFileSync(LEDGER,"utf8")); }catch(e){ /* 初回は空 */ }
let maxN=Object.values(ledger).reduce((m,v)=>Math.max(m,v),0);
items.forEach(it=>{ if(ledger[it.id]==null) ledger[it.id]=++maxN; it.n=ledger[it.id]; });
fs.writeFileSync(LEDGER, JSON.stringify(ledger,null,2)+"\n");

/* ---- passages（文脈モード用）: data.js の物語から生成 ---- */
const itemIds = new Set(items.map(it=>it.id));
const passages = STORY.map(t=>{
  const sentences = (t.story||[]).map((s, idx)=>{
    const targets=[];
    const clean = s.replace(/\[([^\]]+)\]/g, (_, b)=>{
      const f=b.split("|"); const base=(f[1]||f[0]).trim();
      const tid=(isPhrase(base)?"p-":"w-")+slug(base);
      if(itemIds.has(tid) && !targets.includes(tid)) targets.push(tid); // 存在する語だけ紐づけ
      return f[0]; // 表示形に戻す
    });
    const c = COACH[`t${t.id}-s${idx+1}`] || {};
    return { en: clean,
      ...(c.linking?{linking:c.linking}:{}),
      ...(c.tips?{tips:c.tips}:{}),
      ...(targets.length?{targets}:{}) };
  });
  return { id:"t"+t.id, theme:t.id, themeName:t.title, ...(t.jp?{jp:t.jp}:{}), sentences };
}).filter(p=>p.sentences.length).sort((a,b)=>a.theme-b.theme);

/* ---- 出力（累積版＋日付ごとの差分版） ---- */
// n を先頭付近に並べ、内部用 _date を除去
const clean = arr => arr.map(({_date, n, id, type, ...rest})=>({ n, id, type, ...rest }));

// 累積版（全件・upsertで何度でも安全）。passages も同梱（文脈モード用）
fs.writeFileSync(path.join(ROOT,"sample","ielts-import.json"),
  JSON.stringify({source:{book:"文脈で覚えるIELTS英単語",section:"01-10",added:today},items:clean(items),passages},null,2)+"\n");

/* ---- 新レイアウト: domain/collection/theme でシャード＋目次(index.json) ----
   静的(Pages)配信用。content/ 以下に出力。version は内容ハッシュ＝中身が変わった時だけ更新。 */
const DOMAIN="english", COLLECTION="ielts-vocab", COLLECTION_NAME="IELTS単語帳";
const hash = s => crypto.createHash("md5").update(s).digest("hex").slice(0,8);

// 各itemに domain/collection を付与
items.forEach(it=>{ it.domain=DOMAIN; it.collection=COLLECTION; });

// テーマ別にまとめる（theme無し=0「汎用（文法など）」）
const byTheme={};
items.forEach(it=>{ const th=it.theme||0; (byTheme[th]=byTheme[th]||[]).push(it); });
const passageByTheme={}; passages.forEach(p=>{ passageByTheme[p.theme]=p; });

const CONTENT = path.join(ROOT,"web","public","content");
const COLLDIR = path.join(CONTENT, DOMAIN, COLLECTION);
fs.mkdirSync(COLLDIR, {recursive:true});

// コレクションをシャード出力する汎用関数（domain/collection/theme でファイル分割）
function emitCollection(col){
  fs.mkdirSync(path.join(CONTENT, col.domain, col.collection), {recursive:true});
  const entries = (col.themes||[]).slice().sort((a,b)=>a.theme-b.theme).map(t=>{
    const cleanItems = clean(t.items);
    const passage = t.passage || null;
    const version = hash(JSON.stringify({items:cleanItems, passage}));
    const file = `${col.domain}/${col.collection}/theme-${t.theme}.json`;
    const body = { domain:col.domain, collection:col.collection, collectionName:col.collectionName,
                   theme:t.theme, themeName:t.themeName, version, items:cleanItems, ...(passage?{passage}:{}) };
    fs.writeFileSync(path.join(CONTENT,file), JSON.stringify(body,null,2)+"\n");
    return { theme:t.theme, themeName:t.themeName, count:cleanItems.length, file, version };
  });
  const cversion = hash(entries.map(e=>e.theme+":"+e.version).join("|"));
  return { id:col.collection, domain:col.domain, name:col.collectionName, kind:col.kind||"vocab", version:cversion, themes:entries };
}

// 1) 英語・単語帳（md/data.js 由来）
const englishThemes = Object.keys(byTheme).map(Number).sort((a,b)=>a-b).map(th=>{
  const list = byTheme[th];
  return { theme:th, themeName: th===0 ? "汎用（文法など）" : (list[0].themeName || `テーマ${th}`),
           items:list, passage: passageByTheme[th]||null };
});
const collectionsOut = [ emitCollection({domain:DOMAIN, collection:COLLECTION, collectionName:COLLECTION_NAME, kind:"vocab", themes:englishThemes}) ];

// 2) 事前ビルド済みコレクション（engineering 等）: content-src/collections/*.json
const COLDIR = path.join(ROOT,"content-src","collections");
let prebuiltFiles=[];
try { prebuiltFiles = fs.readdirSync(COLDIR).filter(f=>f.endsWith(".json")).sort(); } catch(e){ prebuiltFiles=[]; }
for(const f of prebuiltFiles){
  const col = JSON.parse(fs.readFileSync(path.join(COLDIR,f),"utf8"));
  (col.themes||[]).forEach(t=>(t.items||[]).forEach(it=>{
    it.domain=col.domain; it.collection=col.collection; it.theme=t.theme; it.themeName=t.themeName;
    if(!it.type) it.type="concept";
    if(ledger[it.id]==null) ledger[it.id]=++maxN; it.n=ledger[it.id];   // 通し番号も統一台帳で固定
  }));
  collectionsOut.push(emitCollection({domain:col.domain, collection:col.collection, collectionName:col.collectionName, kind:col.kind, themes:col.themes||[]}));
}
fs.writeFileSync(LEDGER, JSON.stringify(ledger,null,2)+"\n"); // 事前ビルド分の n も台帳へ反映

// 目次（最初にこれだけ取得。collection/theme の version で差分判定）
const index = {
  version: hash(collectionsOut.map(c=>c.id+":"+c.version).join("|")),
  collections: collectionsOut.map(({version, ...rest})=>rest)
};
fs.writeFileSync(path.join(CONTENT,"index.json"), JSON.stringify(index,null,2)+"\n");

// 日付ごとの追記分（新しいバッチだけアップロードしたい時用）
const IMPORTS=path.join(ROOT,"sample","imports");
fs.mkdirSync(IMPORTS,{recursive:true});
const byDate={};
items.forEach(it=>{(byDate[it._date]=byDate[it._date]||[]).push(it);});
Object.keys(byDate).sort().forEach(d=>{
  fs.writeFileSync(path.join(IMPORTS,`ielts-import-${d}.json`),
    JSON.stringify({source:{book:"文脈で覚えるIELTS英単語",section:`batch-${d}`,added:d},items:clean(byDate[d])},null,2)+"\n");
});

const by=t=>items.filter(x=>x.type===t).length;
console.error(`total: ${items.length} | word:${by("word")} phrase:${by("phrase")} grammar:${by("grammar")} conversation:${by("conversation")}`);
console.error(`priority S:${items.filter(x=>x.priority==="S").length} A:${items.filter(x=>x.priority==="A").length} B:${items.filter(x=>x.priority==="B").length}`);
console.error(`date batches: ${Object.keys(byDate).sort().map(d=>d+"("+byDate[d].length+")").join(", ")}`);
