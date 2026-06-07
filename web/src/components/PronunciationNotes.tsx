import type { StudyItem } from "../types";

interface Props {
  pron?: StudyItem["pron"];
}

export function PronunciationNotes({ pron }: Props) {
  if (!pron?.notes && !pron?.liaison && !pron?.tips?.length) return null;

  return (
    <div className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50/60 p-3 text-sm text-slate-700">
      <p className="font-medium text-indigo-900">発音ガイド</p>
      {pron.notes && <p className="mt-2">{pron.notes}</p>}
      {pron.liaison && (
        <p className="mt-2">
          <span className="font-medium text-indigo-800">リエゾン: </span>
          {pron.liaison}
        </p>
      )}
      {pron.tips && pron.tips.length > 0 && (
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {pron.tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
