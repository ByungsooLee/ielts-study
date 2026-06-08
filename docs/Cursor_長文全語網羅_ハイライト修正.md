# 実装プロンプト：長文で全語を網羅＋ハイライト修正（targets {id,text}）

> データ側は更新済み。**各テーマの passage が全item（word+phrase）を網羅**し、`passage.sentences[].targets` の形が変わった。UIを追従させる。作り直さず統合。まず現状把握→計画→承認→実装。

## データの変更点（実装済み・前提）
- 各テーマの passage は、そのテーマの **全 word/phrase item を必ず含む**（`content-src/passage-extra.js` で不足語を補足文として追記、`npm run content:build` で生成）。
- `passage.sentences[].targets` は **オブジェクト配列**に変更：
  ```ts
  targets: { id: string; text: string }[]
  // id   = item の id（グロス/発音/カードと一致）
  // text = その文中に実際に現れる表示形（活用・変化形・語句。例 "pioneers", "dubbed", "follow in his footsteps"）
  ```
- 例：`{"id":"p-follow-in-one-s-footsteps","text":"follow in his footsteps"}`。

## タスクA：PassagePanel のハイライトを `text` ベースに（重要）
現状は `item.front` を `\bfront\b` で照合しているため、活用形（pioneers/dubbed 等）が光らない。これを修正：
- ハイライト語は **`targets[].text`** を使う（front ではない）。
- 照合は各文ごとに、その文の `targets[].text` を**そのまま**マッチ（大文字小文字無視）。英単語は語境界 `\b...\b`、複数語フレーズはそのまま部分一致でよい（`text` は実際の出現文字列なので必ず一致する）。
- ハイライト片クリック時のグロス/発音は、対応する **`target.id`** から item を引く（`records`/itemsById）。`front.toLowerCase()===part.text` のような front 依存の対応付けは廃止し、**text→id のマップ**で引く。
- 型を更新：`Passage.sentences[].targets: { id:string; text:string }[]`（`types.ts`）。旧 `string[]` 前提の箇所をすべて追従。

## タスクB：単語ページのテーマ学習に「構文(phrase)」も統合
ユーザー要望：テーマ内の語を漏れなく学ぶため、**単語ページのテーマ学習ビューに word だけでなく phrase(構文) も含める**。
- テーマ学習ビューのカード対象 = そのテーマの **type ∈ {word, phrase}**（grammar は対象外）。
- テーマ件数表示も word+phrase（`themes.ts` の `collectThemeStats` が category=word のみで数えている箇所を、単語ページのテーマ集計では word+phrase に）。
- 「構文」タブは横断学習用に残してよいが、**テーマ内学習では統合**して漏れをなくす。
- これにより「テーマを選ぶ→長文で全語が文脈表示→カードで全語(word+phrase)を学ぶ」が一致する。

## 厳守
- 既存の SRS / 発音(TTS・辞書) / 録音 / データ取得 を流用。データ生成（md2json）は変更しない（UI側のみ）。
- 既存機能を壊さない。モバイル/a11y。新ライブラリは理由を添えて確認。

## 受け入れ基準
1. 各テーマの長文で、そのテーマの**全 word/phrase が文中でハイライト**される（pioneers/dubbed/follow in his footsteps など活用形も）。
2. ハイライト語クリックで正しい item の意味・発音が出る（text→id 対応）。
3. 単語ページのテーマ学習で word+phrase の**全語がカード**として出る。件数も一致。
4. 「長文に出た語数」と「テーマの語数」が一致（未登場ゼロ）。
5. 既存（類義語クイズ・SRS・発音・録音・同期）はリグレッションなし。
