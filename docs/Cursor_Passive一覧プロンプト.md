# Passive語「一覧リファレンス＋軽めSRS」画面 仕様（Claude Code / Cursor 用）

## 目的
Passive語（＝読めて聞ければOKの認識用語彙）は、今のUIだと物語に出ず**すぐ確認できない**。
これらを **「即見える一覧リファレンス」** を主役に、**軽めの認識SRS** を補助として、別画面で覚えやすく・すぐ見返せるようにする。
※ IELTS 7 では Passive は Reading/Listening の認識力に直結。「正確に産出する Active」とは別管理にする。

## データ前提（2026-06-18 追加済み）
- 各 item に `register: "active" | "passive"` フィールドあり（`tools/md2json.js` が付与）。
  - `active` … 物語＋メインSRS（SM-2）対象。
  - `passive` … 本画面の対象。現状 **140語**（テーマ1〜20）。
- Passive item の主な使用フィールド: `front`（語/フレーズ）, `meaning`（日本語）, `synonyms[]`（言い換え）, `collocation`（あれば）, `theme` / `themeName`, `pron.tts`, `n`, `priority`。
- 取得元は既存の `content/index.json` → `content/english/ielts-vocab/theme-*.json`（itemsに register 入り）。新規取得不要、フィルタするだけ。

## 画面構成

### エントリ
- English ドメイン配下に新タブ/モード **「Passive一覧（認識用）」** を追加。物語・Active SRS のフローには混ぜない。

### 主役：一覧リファレンス（即見える表）
- 既定表示は**スクロールで一気に見返せるコンパクト表**。1行＝1語。
- 列: **語（front）｜ 意味（meaning）｜ 言い換え（synonyms をカンマ区切り）**。`collocation` があれば意味の下に小さく添える。
- **テーマでグルーピング**（themeName 見出し）。上部に既存と同じ **テーマ切替（全部／11〜20…）** と **検索ボックス**（front・意味・言い換えを部分一致）。
- 語をタップで `pron.tts` 再生（既存の発音機能を再利用）。
- 並び: テーマ内は `n` 昇順。

### 補助：確認モード（軽めSRS・認識チェックのみ）
- トグル「**確認モード**」をONにすると、表の **意味・言い換え列を隠す**。
- 行タップで**その行だけ意味を開く**（めくる）。下に2ボタン: **覚えてた / あやしい**。
- 起動時に「**今日のPassive確認**」を due 順で出せる（任意・スキップ可。あくまで主役は一覧）。

### 軽めSRS 仕様（Activeと分離）
- localStorage キーは新規 `ielts_passive_srs_v1`（メインの `ielts_vocab_srs_v2` とは別）。record = `{box, due, ts}`。
- 認識のみの簡易ボックス。間隔 `INTERVALS_PASSIVE = [0, 3, 10, 30, 90]` 日（Activeより長め）。
- 採点: **覚えてた → box+1**（上限で据え置き）、**あやしい → box0**。
- 表示判定の「今日の確認」は due ≤ 今日 を古い順。1日上限はActiveと別枠で緩め（例: 30）。
- 進捗キーは item.id（register非依存。idは不変）。

## やらないこと
- Passive語を物語（passages）や Active の SM-2 に混ぜない。
- 既存の Active カード/物語/テーマナビの挙動は変えない（タブ追加のみ）。

## 受け入れ条件
1. 「Passive一覧」を開くと register=passive の140語がテーマ別の表で**即表示**される。
2. テーマ切替・検索が効く。語タップでTTS。
3. 確認モードONで意味が隠れ、行タップで開き、覚えてた/あやしいで `ielts_passive_srs_v1` に保存される。
4. Active側のSRS・物語に影響なし。

## 補足
- 反映フロー: IELTSフォルダ更新 → content-src へ取り込み → `/release`（[[release-after-vocab-add]] 参照）。
- 関連既存仕様: 忘却曲線=`Cursor_忘却曲線復習プロンプト.md`、UI=`Cursor_UI改善プロンプト.md`、テーマ番号ナビ=`Cursor_テーマ番号ボタンプロンプト.md`。
