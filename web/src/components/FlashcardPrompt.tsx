import { makeClozeSentence, pickExampleSentence } from "../lib/cloze";
import { CATEGORY_STYLES } from "../lib/themes";
import type { ContentRecord, StudyContentMode, StudyDirection } from "../types";

interface Props {
  record: ContentRecord;
  direction: StudyDirection;
  contentMode: StudyContentMode;
  onPlayAudio: () => void;
}

export function FlashcardPrompt({ record, direction, contentMode, onPlayAudio }: Props) {
  const { item } = record;
  const style = CATEGORY_STYLES[item.type];
  const example = pickExampleSentence(item);

  let main = "";
  let sub: string | null = null;

  if (item.type === "conversation") {
    main = direction === "en-to-jp" ? (example ?? item.front) : (item.examples?.[0]?.jp ?? item.meaning);
    sub = direction === "en-to-jp" ? "英文を読んで意味を思い出す" : "和訳を見て英文を思い出す";
  } else if (item.type === "grammar") {
    if (contentMode === "cloze" && example) {
      main = makeClozeSentence(example, item.front);
      sub = "構文を穴埋めで思い出す";
    } else {
      main = item.front;
      sub = "この構文の意味を思い出す";
    }
  } else if (direction === "jp-to-en") {
    main = item.meaning;
    sub = "この意味の英語を思い出す";
  } else if (contentMode === "cloze" && example) {
    main = makeClozeSentence(example, item.front);
    sub = "例文の空所を埋めて思い出す";
  } else {
    main = item.front;
    sub = example ? "見出し語と例文から意味を思い出す" : "見出し語の意味を思い出す";
    if (example && contentMode === "semantic") {
      return (
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded px-2 py-0.5 text-xs ${style.badge}`}>{item.type}</span>
            {item.themeName && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                テーマ{item.theme}: {item.themeName}
              </span>
            )}
          </div>
          <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-4xl">
            {item.front}
          </p>
          {item.ipa && <p className="mt-1 font-mono text-sm text-slate-500">{item.ipa}</p>}
          <p className="mt-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300">{example}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{sub}</p>
          <button
            type="button"
            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
            onClick={onPlayAudio}
            aria-label="問題を再生"
          >
            🔊 再生
          </button>
        </div>
      );
    }
  }

  return (
    <div className="min-w-0 max-w-full">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded px-2 py-0.5 text-xs ${style.badge}`}>{item.type}</span>
        {item.themeName && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            テーマ{item.theme}: {item.themeName}
          </span>
        )}
      </div>
      <p className="mt-3 text-sm text-indigo-700 dark:text-indigo-300">まず意味を予想してから答えを開いてください</p>
      <p className="mt-4 break-words text-2xl font-bold leading-snug text-slate-900 [overflow-wrap:anywhere] dark:text-slate-50 md:text-3xl">
        {main}
      </p>
      {sub && <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{sub}</p>}
      <button
        type="button"
        className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
        onClick={onPlayAudio}
        aria-label="問題を再生"
      >
        🔊 再生
      </button>
    </div>
  );
}
