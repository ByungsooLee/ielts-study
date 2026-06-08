# 実装プロンプト：分野の完全分離（Header で English ⇄ Engineering 切替）

> 既存アプリに、**ヘッダで分野を切り替えると、ページ全体が専用UIに切り替わる**構成を実装する。
> English と Engineering を完全に分離（混在させない）。作り直さず統合。まず現状把握→計画→承認→実装。
> データ規約・コマンドは `CLAUDE.md`、データは `web/public/content/index.json`（collections に `domain` あり）。

## 目的
- ヘッダに **分野スイッチ（English / Engineering）** を常設。選ぶと**ページ全体（ナビ・レイアウト・中身）が丸ごと切り替わる**。
- English は従来どおり（単語/文法/構文/長文の4タブ）。Engineering は**専用のオリジナル学習ページ**にする（英語UIの流用・フィルタではなく独立した画面）。

## データ前提
- `index.json` の `collections[]` は `domain`（"english" | "engineering"）を持つ。
  - English: `collection:"ielts-vocab"`（kind:"vocab"）。
  - Engineering: `collection:"ai-data-platform"`（kind:"concept"、テーマ「AI-ready データ基盤のベストプラクティス」9件）。今後コレクション追加。
- Engineering の item（type:"concept"）：`front`(英語の見出し), `meaning`(日本語), `examples[{en,jp}]`, `pron.tts`(英語), **`explain{prompt_ja, model_en}`**, `tags`。
- 取得は domain でフィルタ：English ページは domain=english のコレクションだけ、Engineering ページは domain=engineering だけを読む。

## ルーティング/状態
- ルート分離：`/english/...` と `/engineering/...`（ハッシュ or ルーター）。最後に見た分野を localStorage 保存し、起動時に復元。
- ヘッダのスイッチは2分野のみ。スマホはハンバーガー内にも同スイッチ。
- 分野ごとに**視覚的アイデンティティを変える**（アクセント色・アイコン）。別アプリに入った感を出す。

## Engineering ページ（オリジナル設計）
英語UIとは別物として作る。目標＝「設計・用語を**英語で説明できる**」。
- ナビ：上部に **コレクション選択**（例：AI-ready データ基盤）→ **テーマ/トピック選択**（番号 or リスト）。将来コレクションが増える前提で index.collections から動的生成。
- 学習カード（中核＝説明練習フロー）：
  1. 見出し（front 英語）＋日本語の意味を表示。
  2. **「英語で説明」モード**：`explain.prompt_ja`（日本語の問い）を見せる → 自分で口に出す/録音 → 「模範を見る」で `explain.model_en` を表示 → 自己採点（忘れた/あいまい/覚えてた＝SRS）。
  3. 🔊 で `model_en` / `examples.en` を再生（リスニング）。録音して手本と聞き比べ（シャドーイング）。任意でディクテーション。
- 復習：既存 SM-2 を流用しつつ、**Engineering ページの復習は domain=engineering に限定**したキュー（英語と混ざらない）。
- 一覧/検索：用語の一覧、タグ絞り込み。

## 共有して良い部分（重複実装しない）
- index/シャードの取得・IndexedDBキャッシュ、TTS/辞書発音、録音、SM-2エンジン、設定/同期は**共通基盤を流用**。
- 違うのは「ページ構成・ナビ・カードの出題フロー・配色」。English の画面ロジックは Engineering に流用しない（別コンポーネント）。

## 厳守
- English の既存機能を壊さない。分野は常に分離（横断混在の出題をしない）。
- データ駆動（domain/collection/theme/kind を index から）。新ライブラリは理由を添えて確認。モバイル/a11y。

## 進め方
1. 現状把握（ルーティング、index読み込み、SRS/TTS/録音の共通化具合）＋計画を提示し承認。
2. ヘッダ分野スイッチ＋ルート分離＋分野別レイアウトの骨格。
3. Engineering 専用ページ（コレクション/テーマ ナビ → 説明練習カード → 発音/リスニング/録音 → SRS）。
4. 配色/アイデンティティ、localStorage、モバイル、受け入れ確認。

## 受け入れ基準
1. ヘッダで English/Engineering を切替でき、**ページ全体が専用UIに丸ごと切り替わる**（フィルタ違いでなく別画面）。
2. Engineering では `ai-data-platform` のテーマ/概念が出て、`prompt_ja`→自分で説明→`model_en` の練習ができる。
3. `model_en`/例文の発音再生・録音・聞き比べができる。
4. 復習(SRS)が分野ごとに分離（英語と技術が混ざらない）。
5. English ページは従来どおり（リグレッションなし）。最後に見た分野が次回起動で復元される。
