import { useEffect, useState } from "react";
import { getCoachCache, setCoachCache } from "../db";
import { requestCoach } from "../lib/api";
import { useSettingsStore } from "../stores/settingsStore";
import type { CoachResult, Example, StudyItem } from "../types";

interface Props {
  sentence: string;
  example?: Example;
  pron?: StudyItem["pron"];
  compact?: boolean;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightedSentence({ sentence, stressWords }: { sentence: string; stressWords: string[] }) {
  if (!stressWords.length) return <p className="text-slate-800">{sentence}</p>;

  const pattern = new RegExp(
    `(${stressWords.map((w) => escapeRegExp(w)).join("|")})`,
    "gi",
  );
  const parts = sentence.split(pattern);

  return (
    <p className="text-slate-800">
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
}

export function PronunciationCoach({ sentence, example, pron, compact }: Props) {
  const settings = useSettingsStore((s) => s.settings);
  const [generated, setGenerated] = useState<CoachResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const staticCoach: CoachResult | null =
    example?.linking || example?.tips?.length || example?.stressWords?.length || pron?.liaison || pron?.tips?.length || pron?.stressWords?.length
      ? {
          linking: example?.linking ?? pron?.liaison ?? "",
          tips: example?.tips ?? pron?.tips ?? [],
          stressWords: example?.stressWords ?? pron?.stressWords,
        }
      : null;

  const coach = generated ?? staticCoach;
  const notes = pron?.notes;

  useEffect(() => {
    let cancelled = false;
    void getCoachCache(sentence).then((cached) => {
      if (cancelled || !cached) return;
      setGenerated({
        linking: cached.linking,
        tips: cached.tips,
        stressWords: cached.stressWords,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [sentence]);

  async function generate() {
    if (!settings.workerUrl || !settings.syncToken) {
      setError("設定画面で Worker URL と合言葉を入力してください");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const cached = await getCoachCache(sentence);
      if (cached) {
        setGenerated({
          linking: cached.linking,
          tips: cached.tips,
          stressWords: cached.stressWords,
        });
        return;
      }
      const result = await requestCoach({
        workerUrl: settings.workerUrl,
        syncToken: settings.syncToken,
        sentence,
      });
      await setCoachCache(sentence, result);
      setGenerated(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "発音コーチの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  const hasCoachContent = Boolean(coach?.linking || coach?.tips?.length || coach?.stressWords?.length);
  const canGenerate = Boolean(settings.workerUrl && settings.syncToken);

  if (!notes && !hasCoachContent && !canGenerate) return null;

  return (
    <div className={`${compact ? "mt-2" : "mt-3"} rounded-lg border border-indigo-100 bg-indigo-50/60 p-3 text-sm text-slate-700`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium text-indigo-900">発音コーチ</p>
        {settings.workerUrl && settings.syncToken && (
          <button
            type="button"
            className="rounded bg-indigo-600 px-2 py-1 text-xs text-white disabled:opacity-50"
            disabled={loading}
            onClick={() => void generate()}
          >
            {loading ? "生成中…" : hasCoachContent && !generated ? "再生成" : "発音コーチ"}
          </button>
        )}
      </div>

      {notes && <p className="mt-2">{notes}</p>}

      {coach?.stressWords?.length ? (
        <div className="mt-2">
          <p className="text-xs font-medium text-indigo-800">文強勢</p>
          <HighlightedSentence sentence={sentence} stressWords={coach.stressWords} />
        </div>
      ) : !compact ? (
        <p className="mt-2 text-slate-800">{sentence}</p>
      ) : null}

      {coach?.linking && (
        <p className="mt-2">
          <span className="font-medium text-indigo-800">連結: </span>
          <span className="font-mono text-indigo-950">{coach.linking}</span>
        </p>
      )}

      {coach?.tips && coach.tips.length > 0 && (
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {coach.tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      )}

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
