/* 単語マスターリスト.md → アプリ取り込み用JSON 変換スクリプト
   使い方: node tools/md2json.js
   出力:   ielts-import.json （同フォルダ）
   ※ idは front から固定生成。front を変えなければ毎回同じid＝上書き更新される。 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const MD = fs.readFileSync(path.join(ROOT, "単語マスターリスト.md"), "utf8");
const today = new Date().toISOString().slice(0, 10);

const THEME_TAG = {1:"polynesia",2:"plastic",3:"titanic",4:"beaver",5:"dance",
  6:"ai-art",7:"gifted-school",8:"hyperloop",9:"montessori",10:"lying"};

/* ---- 発音コーチ・データ ---- */
let COACH = {};
try { COACH = require(path.join(__dirname, "pron-coach.js")); } catch (e) { /* 無くてもOK */ }

/* ---- 例文をデータ.jsの物語から取得（テーマ/文番号キー付き） ---- */
const exMap = {};
try {
  const g = {};
  global.window = g;
  require(path.join(ROOT, "ielts-vocab-data.js"));
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
const LEDGER=path.join(__dirname,"number-ledger.json");
let ledger={};
try{ ledger=JSON.parse(fs.readFileSync(LEDGER,"utf8")); }catch(e){ /* 初回は空 */ }
let maxN=Object.values(ledger).reduce((m,v)=>Math.max(m,v),0);
items.forEach(it=>{ if(ledger[it.id]==null) ledger[it.id]=++maxN; it.n=ledger[it.id]; });
fs.writeFileSync(LEDGER, JSON.stringify(ledger,null,2)+"\n");

/* ---- 出力（累積版＋日付ごとの差分版） ---- */
// n を先頭付近に並べ、内部用 _date を除去
const clean = arr => arr.map(({_date, n, id, type, ...rest})=>({ n, id, type, ...rest }));

// 累積版（全件・upsertで何度でも安全）
fs.writeFileSync(path.join(ROOT,"ielts-import.json"),
  JSON.stringify({source:{book:"文脈で覚えるIELTS英単語",section:"01-10",added:today},items:clean(items)},null,2)+"\n");

// 日付ごとの追記分（新しいバッチだけアップロードしたい時用）
const IMPORTS=path.join(ROOT,"imports");
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
