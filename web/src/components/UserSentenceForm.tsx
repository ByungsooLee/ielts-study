import { useState } from "react";
import { useProgressStore } from "../stores/progressStore";
import type { UserSentence } from "../types";

const EMPTY_SENTENCES: UserSentence[] = [];

interface Props {
  itemId: string;
}

export function UserSentenceForm({ itemId }: Props) {
  const sentences = useProgressStore(
    (s) => s.progress.userSentences?.[itemId] ?? EMPTY_SENTENCES,
  );
  const addUserSentence = useProgressStore((s) => s.addUserSentence);
  const [text, setText] = useState("");

  function save() {
    const trimmed = text.trim();
    if (!trimmed) return;
    const sentence: UserSentence = {
      id: crypto.randomUUID(),
      text: trimmed,
      createdAt: Date.now(),
    };
    addUserSentence(itemId, sentence);
    setText("");
  }

  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800/60">
      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">自作例文メモ</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        自分で英文を作って保存（添削なし）。生成効果で記憶が定着しやすくなります。
      </p>
      <textarea
        className="mt-2 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        rows={2}
        placeholder="例: I am concerned about the environmental impact."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="button"
        className="mt-2 rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
        onClick={save}
      >
        保存
      </button>
      {sentences.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-slate-700 dark:text-slate-300">
          {sentences.slice(0, 5).map((s) => (
            <li key={s.id} className="rounded bg-white px-2 py-1 dark:bg-slate-900">
              {s.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
