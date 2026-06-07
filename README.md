# IELTS Study App

個人用の IELTS 学習アプリ。JSON 取り込み、SRS 復習、発音、録音、AI 添削、進捗同期に対応。

## 構成

- `web/` — React + Vite + TypeScript + Tailwind（Cloudflare Pages 向け）
- `worker/` — Cloudflare Worker（進捗 KV / Google TTS / Gemini 添削）
- `sample/import-sample.json` — 取り込みテスト用サンプル

## ローカル開発

### Web

```bash
cd web
npm install
npm run dev
```

### Worker

```bash
cd worker
npm install
npx wrangler kv namespace create IELTS_KV
# wrangler.toml の id を置き換え
npx wrangler secret put SYNC_TOKEN
npx wrangler secret put GOOGLE_TTS_KEY
npx wrangler secret put GEMINI_KEY
npm run dev
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
| `CLOUDFLARE_API_TOKEN` | Cloudflare Dashboard → My Profile → API Tokens → Create Token → 「Edit Cloudflare Workers」テンプレート + Pages Edit を付与 |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard 右サイドバー |

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
| SRS 進捗・苦手・自作例文 | ✅ クラウド同期 |
| 取り込んだ教材 JSON | ❌ 端末ごと（再取り込み） |
| 録音 | ❌ 端末ごと |

## 受け入れ基準チェックリスト

- [ ] `sample/import-sample.json` を取り込み、一覧表示される
- [ ] 再取り込みで upsert され、SRS 進捗が保持される
- [ ] SRS 採点後に due が規則通り変化し、リロード後も保持される
- [ ] 別端末で同期設定すると同じ進捗が見える
- [ ] 単語は辞書実録音、なければ TTS。2 回目はキャッシュで再生
- [ ] アクセント切替（en-GB / en-US / en-AU）が効く
- [ ] 苦手単語で例文を書き、添削結果が保存・再表示される
- [ ] 録音が再生でき、6 件目で最古が削除される
- [ ] 同期未設定・オフラインでもローカル学習が動く

## 注意

- 録音は IndexedDB のみ（同期しない）
- API キーは Worker secret にのみ保存
- `SYNC_TOKEN` は推測困難な文字列を使用
