# Claude 用：取り込み JSON 生成プロンプト

以下を Claude にコピペして使います。`【今回の入力】` だけ差し替えてください。

---

次の内容を、IELTS学習アプリ用の取り込みJSONとして出力してください。

【出力ルール】
- JSONのみ出力（説明文・markdown・コードフェンス不要）
- 必須: source.added, 各 item の id / type / front / meaning
- type は "word" | "phrase" | "grammar" | "conversation" のみ
- id は固定で不変（例: w-単語, g-構文, c-会話, p-フレーズ）
- added は今日の日付 YYYY-MM-DD

【発音ガイド（pron）— 必ず含める】
各 item の pron に以下を日本語で記述してください（該当なしは省略可）:
- lookup: 辞書API用の単語（word/phrase）
- tts: TTSで読む英文（例文または front）
- notes: 発音の注意点（アクセント位置、弱読、母音の質など）
- liaison: リエゾン・音の連結（どこをつなげ、どこを区切るか）
- tips: より自然に聞こえるためのヒント（文字列配列、2〜3個）

【スキーマ例】
{
  "source": { "book": "...", "section": "...", "added": "YYYY-MM-DD" },
  "items": [
    {
      "id": "w-example",
      "type": "word",
      "front": "deteriorate",
      "ipa": "/dɪˈtɪəriəreɪt/",
      "meaning": "悪化する",
      "examples": [{ "en": "...", "jp": "..." }],
      "pron": {
        "lookup": "deteriorate",
        "tts": "The hull had badly deteriorated underwater.",
        "notes": "第4音節にアクセント...",
        "liaison": "deteriorated underwater → ...",
        "tips": ["語尾 -ate は弱く", "..."]
      },
      "tags": ["..."],
      "priority": "S"
    }
  ]
}

【今回の入力】
（スクショの説明、単語リスト、章番号などをここに書く）
