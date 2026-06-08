# IELTS Study App

個人用の IELTS 学習アプリ。JSON 取り込み、単語帳UI学習、SRS 復習、発音、録音、自作例文メモ、進捗同期に対応。

## 構成

- `web/` — React + Vite + TypeScript + Tailwind（Cloudflare Pages 向け）
- `worker/` — Cloudflare Worker（進捗 KV / Google TTS）
- `tools/md2json.js` — 単語マスターリスト.md → `ielts-import.json` 変換（`theme` / `themeName` 付与）
- `sample/import-sample.json` — 取り込みテスト用サンプル

## 初回セットアップ（1回だけ）

秘密情報は **ファイルに1回書く** だけで、ターミナルで毎回 `export` や `secret put` する必要はありません。

```bash
cd /Users/lee/Documents/ielts-study
npm run setup          # .dev.vars / .env.local を作成
```

次を編集（Git に入れない）:

| ファイル | 内容 |
|---------|------|
| `worker/.dev.vars` | `SYNC_TOKEN`, `GOOGLE_TTS_KEY` |
| `web/.env.local` | `VITE_DEFAULT_WORKER_URL`, `VITE_DEFAULT_SYNC_TOKEN`（合言葉は .dev.vars と同じ） |

Cloudflare にログイン（初回のみ）:

```bash
cd worker && npx wrangler login && cd ..
npm run setup          # account_id を wrangler.toml に自動追加
npm run secrets:push   # .dev.vars を本番 Worker に一括反映
```

**重要:** ターミナルで `export CLOUDFLARE_API_TOKEN=...` や `export CLOUDFLARE_ACCOUNT_ID=...` は **しないでください**。README の説明文をそのまま貼るとエラーになります。ローカルは OAuth ログイン + `wrangler.toml` の `account_id` を使います。

## ローカル開発

```bash
npm run dev            # Web（http://localhost:5173）
npm run dev:worker     # Worker（別ターミナル、任意）
```

初回のみ各パッケージの install:

```bash
cd web && npm install && cd ../worker && npm install
```

## 本番デプロイ（無料・スマホ/iPad/PC）

### 無料 URL

| 役割 | URL の例 |
|------|---------|
| アプリ | `https://ielts-study.pages.dev` |
| API | `https://ielts-study-worker.byung4050.workers.dev` |

独自ドメイン不要。Cloudflare の無料サブドメインで利用できます。

### 手順

```bash
# 1. Worker（CORS に Pages URL を含める）
cd worker
npm run deploy

# 2. Pages にフロント公開
cd ../web
npm run deploy
```

ダッシュボードから行う場合: Workers & Pages → Create → Pages → `web/dist` を Direct Upload。

### 各端末で一度だけ

`https://ielts-study.pages.dev` を開き、**設定** に Worker URL と合言葉を入力 →「今すぐ同期」。

ホーム画面に追加すると便利です（iPhone: 共有 → ホーム画面に追加）。

### Git + 自動デプロイ（main マージ時）

`main` ブランチへ push/merge すると GitHub Actions が Pages と Worker を自動デプロイします。

#### 1. GitHub リポジトリ作成 & push

```bash
cd /Users/lee/Documents/ielts-study
git init
git add .
git commit -m "Initial commit: IELTS Study App"
gh repo create ielts-study --private --source=. --push
```

#### 2. GitHub Secrets を登録

リポジトリ → Settings → Secrets and variables → Actions → New repository secret

| Secret | 取得方法 |
|--------|---------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare Dashboard → My Profile → API Tokens → **「Edit Cloudflare Workers」テンプレート**（Read のみのトークンは不可） |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard 右サイドバー（32文字・前後に空白なし） |

**重要:** Secrets は **Repository secrets**（Actions タブ）に登録してください。Environment secrets だけだとデプロイが失敗します。

#### デプロイが失敗するとき（`Authentication error [code: 10000]` など）

1. GitHub → **ielts-study** → **Settings** → **Secrets and variables** → **Actions** で上記2つが登録されているか確認
2. API トークンを **Edit Cloudflare Workers** テンプレートで作り直す（Account Resources に自分のアカウントを選択）
3. `CLOUDFLARE_ACCOUNT_ID` を Dashboard からコピーし直す（32文字か確認）
4. Actions タブで **Deploy** ワークフローを **Run workflow** で手動再実行

#### 3. 以降の運用

```bash
git checkout -b feature/xxx
# 変更...
git commit -am "説明"
git push -u origin feature/xxx
# PR 作成 → main にマージ → 自動デプロイ
```

#### 4. ブラウザの自動更新

デプロイ後、アプリは `version.json` を定期チェックし、新バージョンを検知すると **自動でリロード** します（最大約60秒、タブを開き直したときは即時）。

### 端末ごとのデータ

| データ | 同期 |
|--------|------|
| SRS 進捗・苦手・自作例文 | ✅ Worker KV (`/progress`) |
| 教材データ | ✅ Worker KV (`/content`) — 起動時・取り込み時に自動同期 |
| 録音・TTSキャッシュ | ❌ 端末ごと |

### 教材の保管（クラウド）

教材は Cloudflare Worker の KV に `content` キーで保存されます。進捗同期と同じ Worker URL・合言葉で読み書きします。

**初回アップロード（どちらか）:**

```bash
# A. CLI から一括アップロード（推奨）
npm run content:push
# または特定ファイル
node tools/push-content.mjs sample/ielts-import.json

# B. ブラウザのライブラリで JSON 取り込み → 自動でクラウドに PUT
```

**新端末:** 設定で Worker URL と合言葉を入れて起動（または「今すぐ同期」）→ 教材が自動ダウンロードされます。手動の再取り込みは不要です。

**差分追加:** 新しい JSON を取り込むと、同じ `id` は上書き・新規 `id` は追加され、マージ後にクラウドへ反映されます。

## 教材の更新フロー

```bash
# 1. IELTS プロジェクトで JSON 再生成
cd /Users/lee/Claude/Projects/IELTS && node tools/md2json.js

# 2. sample にコピーしてクラウドへ反映
cp ielts-import.json /Users/lee/Documents/ielts-study/sample/ielts-import.json
cd /Users/lee/Documents/ielts-study && npm run content:push
```

ブラウザ取り込みでも同様にクラウドへ同期されます。各端末は次回起動時に自動取得します。

## 学習画面（/study）

- **今日の復習**: SM-2 忘却曲線。全カテゴリ混在キュー（due 古い順＋新規は `n` 昇順）
  - 1日の新規上限: 既定 **5** 件（設定で 5/10/20/50/100）
  - 「忘れた」は当日キュー末尾に最大2回まで再出題
  - `lapses >= 8` で自動停止（ライブラリから「復習を再開」で解除）
- **セット学習**: カテゴリ＋テーマで 10/30/50 枚。採点も Sched を更新
- 14日復習予定の棒グラフ、答え面に次回日数 / interval / EF 表示
- 左右2ペイン単語帳（スマホは下に展開）、Space / 上スワイプで答え表示
- キーボード: `1/2/3` 採点、`←→` 前後、`S` シャッフル

### SM-2 テスト

```bash
cd web && npm run test:sm2
```

## 受け入れ基準チェックリスト

- [ ] `sample/import-sample.json` を取り込み、一覧表示される
- [ ] 再取り込みで upsert され、SRS 進捗が保持される
- [ ] SRS 採点後に due が規則通り変化し、リロード後も保持される
- [ ] 別端末で同期設定すると同じ進捗が見える
- [ ] 単語は辞書実録音、なければ TTS。2 回目はキャッシュで再生
- [ ] アクセント切替（en-GB / en-US / en-AU）が効く
- [ ] 学習画面で答え面に自作例文メモを保存できる
- [ ] テーマ 1–10 レンジでフィルタでき、テーマ名が表示される
- [ ] 録音が再生でき、6 件目で最古が削除される
- [ ] 同期未設定・オフラインでもローカル学習が動く

## 注意

- 録音は IndexedDB のみ（同期しない）
- API キーは Worker secret にのみ保存
- `SYNC_TOKEN` は推測困難な文字列を使用
