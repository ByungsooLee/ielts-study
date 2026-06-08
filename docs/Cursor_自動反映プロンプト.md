# Cursor 実装プロンプト：教材データの自動反映（dev/本番）

> 既存リポジトリ `ielts-study`（GitHub: ByungsooLee/ielts-study, main）に、教材データを **git push 一発で本番KVへ反映**する仕組みを追加する。
> 既存の `deploy.yml`（Pages/Worker デプロイ）は壊さない。まず現状把握→計画→承認→実装。

## 背景（確認済みの事実）
- 教材は `tools/push-content.mjs`（`npm run content:push`）で Worker KV `/content` に PUT される。
  - 読み込み元: `sample/ielts-import.json`
  - 認証: `SYNC_TOKEN`（`process.env` → `worker/.dev.vars` → `web/.env.local` の順で解決）
  - Worker URL: `process.env.WORKER_URL` → `web/.env.local` の `VITE_DEFAULT_WORKER_URL` → 既定 `https://ielts-study-worker.byung4050.workers.dev`
- dev（localhost）も本番（pages.dev）も**同じ Worker/KV を参照**するため、content:push 1回で両環境に反映される。
- `.github/workflows/deploy.yml` は push to main で Pages/Worker を自動デプロイ済み。

## やること

### A. 教材反映の専用ワークフローを新規追加（deploy.yml は編集しない）
`.github/workflows/content.yml` を新規作成：
- トリガー: `push`（branch `main`、`paths: ["sample/ielts-import.json"]`）＋ `workflow_dispatch`。
- ジョブ: Node 22 をセットアップ → `SYNC_TOKEN` の有無を検証 → `node tools/push-content.mjs sample/ielts-import.json` を実行。
- 秘密情報: `SYNC_TOKEN` は **GitHub Actions Secret**（`secrets.SYNC_TOKEN`）。`WORKER_URL` は任意で **Actions Variable**（`vars.WORKER_URL`、未設定なら push-content.mjs の既定値）。
- `push-content.mjs` は依存パッケージ不要（node:fs / global fetch）。`npm ci` は不要。
- 雛形：
```yaml
name: Push content
on:
  push:
    branches: [main]
    paths: ["sample/ielts-import.json"]
  workflow_dispatch:
concurrency:
  group: content-${{ github.ref }}
  cancel-in-progress: true
jobs:
  push-content:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
      - name: Validate secret
        run: |
          if [ -z "${{ secrets.SYNC_TOKEN }}" ]; then
            echo "::error::SYNC_TOKEN が未設定です（GitHub → Settings → Secrets and variables → Actions）"; exit 1; fi
      - name: Push content to KV
        env:
          SYNC_TOKEN: ${{ secrets.SYNC_TOKEN }}
          WORKER_URL: ${{ vars.WORKER_URL }}
        run: node tools/push-content.mjs sample/ielts-import.json
```
- 注意: GitHub Secret `SYNC_TOKEN` は **Worker 側の secret `SYNC_TOKEN` と同じ値**である必要がある（一致しないと /content が 401）。README にその旨を明記。

### B. 教材を取り込む repo スクリプト（#1 を repo 側でも再現可能に）
`tools/import-content.mjs` を新規作成（外部の編集元フォルダから sample へコピー）：
- ソース: `process.env.CONTENT_SRC`（既定 `/Users/lee/Claude/Projects/IELTS/ielts-import.json`）。
- 動作: ソースJSONを検証（`source.added` と `items[]` 必須）し、`sample/ielts-import.json` へ上書きコピー。`passages` があれば保持。
- `package.json` に `"content:import": "node tools/import-content.mjs"` を追加。
- これで「編集元 → repo」も 1 コマンドにできる（Claude も同じファイルを直接ミラーする）。

### C. ドキュメント
`README.md` に「教材更新フロー」を追記：
1. 教材JSONを `sample/ielts-import.json` に置く（`npm run content:import` または Claude が直接ミラー）。
2. `git add sample/ielts-import.json && git commit && git push origin main`。
3. → `content.yml` が走り、本番KVへ反映（dev/本番アプリは次回取得で更新）。
4. ローカルで即反映したい場合は `npm run content:push`。
- GitHub に `SYNC_TOKEN`（Secret）と任意で `WORKER_URL`（Variable）を登録する手順も明記。

## 厳守
- `deploy.yml` を改変しない（教材反映は専用 `content.yml` に分離）。
- 秘密情報をコミットしない（`.gitignore` 既存ルールを尊重、`.dev.vars`/`.env*` は除外済み）。
- 既存の `content:push` / デプロイ挙動を壊さない。

## 進め方
1. 現状把握（`deploy.yml` のジョブ構成、`push-content.mjs` の env 解決、`package.json` scripts）＋計画を提示し承認。
2. `content.yml` 追加 → `import-content.mjs` ＋ `package.json` 更新 → README 追記。
3. 動作確認手順を添える（後述）。判断が要る点は質問。

## 受け入れ基準
1. `sample/ielts-import.json` を変更して `git push origin main` すると、`content.yml` が起動し本番KV `/content` が更新される（Actions ログで 200/OK を確認）。
2. `SYNC_TOKEN` 未登録時はワークフローが明確なエラーで停止する（誤公開しない）。
3. `npm run content:import`（`CONTENT_SRC` 既定）で編集元 → `sample/ielts-import.json` がコピーされ、`passages` が保持される。
4. `deploy.yml`（Pages/Worker）の既存デプロイは従来どおり動く。
5. 秘密情報がリポジトリにコミットされていない。
