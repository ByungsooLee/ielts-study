# 実装プロンプト：Engineering「技術を英語で説明できる」学習フロー

> Engineering ページを、技術概念を**深く理解し→英語で説明できる**ように育てる構成にする。
> データは拡張済み。作り直さず統合。まず現状把握→計画→承認→実装。前提は `CLAUDE.md` と `docs/分野切替_Engineeringページ.md`。

## データ（拡張済み・前提）
`engineering/ai-data-platform` の concept item（`type:"concept"`）は次を持つ：
```ts
{
  front: string;          // 英語の概念名
  meaning: string;        // 日本語の一言
  detail_ja: string;      // 日本語の技術詳細（深さ）
  examples: {en,jp}[];    // 具体例の英文
  pron: { tts: string };  // 発音/リスニング用の英文
  explain: {
    prompt_ja: string;       // 「〜を英語で説明して」の問い
    points_ja: string[];     // 説明に含めるべき技術ポイント（骨子）
    key_phrases: string[];   // 説明に使える英語フレーズ（部品）
    model_en: string;        // 模範（短・1〜2文）
    model_en_long: string;   // 模範（厚・3〜5文、面接/プレゼン想定）
  }
}
```

## 学習フロー（段階式カード＝説明力を積み上げる）
1つの概念を、下から上へ4ステップで学べるUIにする（タブ or 縦ステップ）。
1. **理解（JP）**：`front` ＋ `meaning` ＋ `detail_ja` を表示（技術的深さ）。任意で `examples` も。
2. **説明の骨子**：`points_ja` をチェックリスト表示（「英語で言うとき、この3点を押さえる」）。
3. **英語フレーズ**：`key_phrases` を一覧（各 🔊 再生）。説明の“部品”として暗記。
4. **産出練習（核）**：`prompt_ja` を提示 → ユーザーが**自分で英語で説明（録音）** → 「模範（短）`model_en`」「模範（厚）`model_en_long`」を開いて比較・🔊再生・シャドーイング。録音と手本を聞き比べ。
5. **SRS採点**（忘れた/あいまい/覚えてた）で復習間隔へ。

## リスニング/発音
- `model_en` / `model_en_long` / `examples.en` / `key_phrases` を 🔊（アクセント en-GB/US/AU 切替、既存TTS流用）。
- 任意：`model_en` のディクテーション（聞いて入力）。
- 産出は録音（既存の録音機能流用）→ 手本と並べて再生。

## UI/構成
- Engineering 専用ページ内（`docs/分野切替_Engineeringページ.md`）。コレクション→テーマ→概念カードの順。
- 「単語フラッシュカード」とは別物の**概念カード**（説明文中心、長文表示に耐えるレイアウト）。
- モバイル/a11y。配色は Engineering 分野の識別色。

## 厳守
- 既存の SRS / TTS / 録音 / データ取得（index→遅延）を流用。md2json 等データ生成は変更しない（UI側のみ）。
- `model_en_long` など長文の表示を考慮（折りたたみ/スクロール）。新ライブラリは理由を添えて確認。

## 受け入れ基準
1. 概念カードで「理解(JP詳細)→骨子(points)→英語フレーズ→産出練習(prompt→録音→模範短/厚)」の流れが踏める。
2. `detail_ja` の技術詳細と、`model_en` / `model_en_long` の英語説明が表示される（“説明の英文”が載っている）。
3. 模範・フレーズ・例文を 🔊 で聞け、録音して比較できる。
4. SRSで復習対象になり、英語分野とは分離（混ざらない）。
5. 既存機能のリグレッションなし。
