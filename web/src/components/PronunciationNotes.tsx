import type { Example, StudyItem } from "../types";

interface Props {
  sentence?: string;
  example?: Example;
  pron?: StudyItem["pron"];
  compact?: boolean;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightedSentence({ sentence, stressWords }: { sentence: string; stressWords: string[] }) {
  if (!stressWords.length) return <p className="text-slate-800 dark:text-slate-200">{sentence}</p>;

  try {
    const pattern = new RegExp(
      `(${stressWords.map((w) => escapeRegExp(w)).join("|")})`,
      "gi",
    );
    const parts = sentence.split(pattern);

    return (
      <p className="text-slate-800 dark:text-slate-200">
        {parts.map((part, i) =>
          stressWords.some((w) => w.toLowerCase() === part.toLowerCase()) ? (
            <mark key={i} className="rounded bg-amber-200 px-0.5 font-semibold text-amber-950">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </p>
    );
  } catch {
    return <p className="text-slate-800 dark:text-slate-200">{sentence}</p>;
  }
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
}

export function PronunciationNotes({ sentence, example, pron, compact }: Props) {
  const notes = pron?.notes;
  const linking = example?.linking ?? pron?.liaison;
  const tips = asStringList(example?.tips ?? pron?.tips);
  const stressWords = asStringList(example?.stressWords ?? pron?.stressWords);

  if (!notes && !linking && !tips.length && !stressWords.length) return null;

  return (
    <div className={`${compact ? "mt-2" : "mt-3"} rounded-lg border border-indigo-100 bg-indigo-50/60 p-3 text-sm text-slate-700`}>
      <p className="font-medium text-indigo-900">発音ガイド</p>
      {notes && <p className="mt-2">{notes}</p>}
      {sentence && stressWords.length ? (
        <div className="mt-2">
          <p className="text-xs font-medium text-indigo-800">文強勢</p>
          <HighlightedSentence sentence={sentence} stressWords={stressWords} />
        </div>
      ) : null}
      {linking && (
        <p className="mt-2">
          <span className="font-medium text-indigo-800">連結: </span>
          <span className="font-mono text-indigo-950">{linking}</span>
        </p>
      )}
      {tips.length > 0 && (
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
