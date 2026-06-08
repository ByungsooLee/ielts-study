# CLAUDE.md — ielts-study 開発ガイド（Claude Code 用）

このリポジトリは **英語 + エンジニアリングの個人用学習アプリ**。英語（IELTS語彙・文法・構文・長文）と技術学習を1つのアプリで、発音・リスニングまで学べることを目指す。

## アーキテクチャ
- `web/` … フロント（Vite + React、Cloudflare Pages で配信）。本番: https://ielts-study.pages.dev
- `worker/` … Cloudflare Worker（KV）。本番: https://ielts-study-worker.byung4050.workers.dev
  - `GET/PUT /content`（教材・KV）、`GET/PUT /progress`（進捗・KV）。認証 `Authorization: Bearer <SYNC_TOKEN>`。
- `.github/workflows/deploy.yml` … push to main で Pages/Worker 自動デプロイ。
- 教材データは **静的JSONとして `web/public/content/` から配信**（CDN）。進捗は KV。録音/音声キャッシュは端末 IndexedDB。

## データ（最重要）
階層: **domain → collection → theme → item**。
- 配信レイアウト（静的・CDN）:
  - `web/public/content/index.json` … 目次（collections→themes{theme,themeName,count,file,version}）。`version` は内容md5(8桁)。
  - `web/public/content/english/ielts-vocab/theme-0..10.json` … 各テーマ（`domain,collection,themeName,version,items,passage`）。theme-0=「汎用（文法など）」。
- 取得方針: 起動時に **index.json だけ**取得 → 選んだ theme のファイルを遅延取得 → `version` が変わった時だけ再取得（オフラインは IndexedDB キャッシュ）。
- **passage は各テーマの全item（word+phrase）を網羅**（`content-src/passage-extra.js` で不足語を補う追記文）。`passage.sentences[].targets` は **`{id, text}[]`**（`text`＝文中の表示形＝活用/変化形あり）。UIは **`text` でハイライト・`id` でグロス/発音**する（`item.front` 完全一致に依存しない）。単語ページのテーマ学習は **word+phrase 両方**をカード化（構文も統合）。
- item スキーマ（要点）: `id`(固定・不変), `n`(通し番号), `domain`, `collection`, `theme`, `themeName`, `type`(word|phrase|grammar|conversation; 将来 concept 追加), `front`, `ipa?`, `meaning`, `synonyms?`, `collocation?`, `examples[{en,jp,linking,tips}]`, `pron{lookup,tts}`, `tags?`, `priority?(S/A/B)`, `links?`。
- id 命名: `w-`(単語)/`p-`(フレーズ)/`g-`(文法)/`c-`(会話) + slug。**id は変えない**（upsert/進捗の鍵）。将来はコレクションで名前空間化（例 `de-sql-join`）。
- 後方互換: `sample/ielts-import.json`（全件1ファイル）も併行生成。`npm run content:push` がこれを KV `/content` に入れる（現行の取得方式）。**新UIは静的 `content/` への移行が目標**。

## 教材の作り方（パイプライン）
ソースは `content-src/`：
- `単語マスターリスト.md`（語彙の編集元・テーマ別表）
- `ielts-vocab-data.js`（テーマ別の物語＝長文/文脈モード。`[表示形|基本形|意味|言い換え|コロケ|イメージ]` 記法）
- `pron-coach.js`（連結‿/弱形/文強勢/要注意音。キー `t{theme}-s{文番号}`）
- `number-ledger.json`（id→通し番号 n の固定台帳）

生成: `npm run content:build`（= `node tools/md2json.js`）
- 出力: `web/public/content/`（シャード＋index）と `sample/ielts-import.json`（互換）。
- `version` は内容ハッシュなので、中身が変わらなければ再生成しても差分ゼロ（git が汚れない）。

## よく使うコマンド
- `npm run content:build` … 教材を再生成（content-src → web/public/content + sample）
- `npm run content:push` … sample を KV `/content` へ（SYNC_TOKEN 必要）
- `npm run dev` / `npm run dev:worker` … ローカル開発
- `npm run build` / `npm run deploy:web` / `npm run deploy:worker`

## 秘密情報
- `worker/.dev.vars`（`SYNC_TOKEN` など）、`web/.env.local`（`VITE_DEFAULT_WORKER_URL` 等）。**コミット禁止**（.gitignore 済み）。
- 本番 secret は Cloudflare 側＋GitHub Actions secret。GitHub の `SYNC_TOKEN` は Worker の `SYNC_TOKEN` と同値にすること。

## やってよい / 確認が必要
- 自由: コード編集、`content:build`、ローカル `dev`、テスト、ドキュメント更新。
- **必ず確認を取る（実行前に提案）**: `git push`、本番デプロイ（`deploy:*` / CIトリガー）、`content:push`（本番KV書換）、secret の追加・変更、ファイル/データの削除。
- 破壊的変更・大規模リファクタはしない。既存の取り込み・同期・発音・録音を壊さない。

## 実装バックログ（仕様は docs/）
- `docs/設計_統合学習アプリ.md` … 全体設計（IA・データ・ストレージ・発音/リスニング）。
- `docs/Cursor_UI改善プロンプト.md` … 単語帳カードUI（左問題/右隠し答え）・カテゴリ常設ボタン・レスポンシブ。
- `docs/Cursor_テーマ番号ボタンプロンプト.md` … テーマ番号で選ぶボタン（レンジ1–10/11–20）。
- `docs/Cursor_文脈モードプロンプト.md` … 長文から学ぶ（reading-while-listening/タップグロス/読後穴埋め）。
- `docs/Cursor_類義語クイズプロンプト.md` … 類義語クイズ（干渉回避・文脈・産出）。
- `docs/Cursor_忘却曲線復習プロンプト.md` … SM-2 間隔反復（今日の復習・新規n順）。
- `docs/Cursor_自動反映プロンプト.md` … 教材の本番反映（CI content push）。
- `docs/分野切替_Engineeringページ.md` … ヘッダで English⇄Engineering を完全切替（Engineeringは専用オリジナルページ）。
※ docs は「Cursor用」と銘打っているが、agent 非依存の仕様書。Claude Code はこれを実装指針として使う。

## 直近の優先タスク（提案）
1. UI を **English / Engineering の2分野**に再編（ヘッダ完全切替: `docs/分野切替_Engineeringページ.md`）。English ヘッダは **単語/文法/構文/あいまい一覧/類義語クイズ/設定**（ライブラリ・会話なし）。単語は**テーマ選択UI**で、テーマ内に長文(passage)＋単語カードを統合（旧『長文』タブ廃止）。詳細: `docs/英語ページ再構成_単語テーマUI.md`。
2. 教材取得を **静的 `content/index.json` → 遅延読み込み** に対応（現状の sample 全取得から移行）。
3. テーマ番号ボタン＋セット量(10/30/50)＋並び。
4. 発音（辞書/TTS・アクセント切替）＋リスニング（再生/ディクテ/シャドー）。
5. SM-2 復習（docs 参照）。
6. CI に教材反映（`docs/Cursor_自動反映プロンプト.md`）。
7. Engineering 分野（`type:"concept"`）。concept item は技術的深さと層状の英語説明を持つ：`detail_ja`（技術詳細）/`examples`/`pron.tts`/`explain{prompt_ja, points_ja[], key_phrases[], model_en, model_en_long}`。学習は「理解(JP)→骨子→英語フレーズ→産出(録音)→模範比較」の段階フロー。仕様: `docs/Cursor_Engineering説明力UI.md`。現行コレクション(engineering・計39概念): `ai-data-platform`(9)/`sql-optimization`(6)/`distributed-spark`(6)/`data-modeling`(6)/`system-design`(6)/`behavioral-star`(英語の行動面接STAR・6、model_en_longはテンプレ＝要個人化)。コレクション追加は `content-src/collections/*.json` を足して `npm run content:build`。今後候補: データパイプライン/オーケストレーション(Airflow等)。

各タスク着手前に計画を提示し、確認が必要な操作は事前に相談すること。
