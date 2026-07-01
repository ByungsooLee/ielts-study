import { useMemo, useState } from "react";
import { playPronunciation } from "../../lib/pronunciation";
import { resolveTargets } from "../../lib/drillContent";
import { useProgressStore } from "../../stores/progressStore";
import { useSettingsStore } from "../../stores/settingsStore";
import { ModelText } from "./ModelText";
import { WordChip } from "./WordChip";
import { RecordingPanel } from "../RecordingPanel";
import type { DrillDef, DrillKind, Grade, StudyItem } from "../../types";

interface Props {
  kind: DrillKind;
  drills: DrillDef[];
  items: StudyItem[];
  /** section 完了時のハンドラ */
  onFinish?: () => void;
}

const GRADE_BUTTONS: { grade: Grade; label: string; className: string }[] = [
  { grade: "forgot", label: "忘れた", className: "bg-rose-600 text-white hover:bg-rose-700" },
  { grade: "maybe", label: "あいまい", className: "bg-amber-500 text-white hover:bg-amber-600" },
  { grade: "remembered", label: "覚えてた", className: "bg-emerald-600 text-white hover:bg-emerald-700" },
];

export function DrillRunner({ kind, drills, items, onFinish }: Props) {
  const gradeItem = useProgressStore((s) => s.gradeItem);
  const recordStudyDay = useProgressStore((s) => s.recordStudyDay);
  const accent = useSettingsStore((s) => s.settings.accent);
  const workerUrl = useSettingsStore((s) => s.settings.workerUrl);
  const syncToken = useSettingsStore((s) => s.settings.syncToken);
  const playbackRate = useSettingsStore((s) => s.settings.playbackRate);

  const [drillIndex, setDrillIndex] = useState(0);
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);

  const total = drills.length;
  const current = drills[drillIndex];
  const targets = useMemo(
    () => (current ? resolveTargets(items, current.target_ids) : []),
    [items, current],
  );

  if (!current) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
        このセクションにはドリルがありません。
      </div>
    );
  }

  async function playModel() {
    try {
      await playPronunciation({
        text: current.model_en,
        source: "sentence",
        accent,
        workerUrl,
        syncToken,
        playbackRate,
      });
    } catch (e) {
      console.warn("model_en TTS failed", e);
    }
  }

  function handleGrade(grade: Grade) {
    for (const t of targets) {
      gradeItem(t.id, grade);
    }
    recordStudyDay();
    setInput("");
    setRevealed(false);
    if (drillIndex + 1 < total) {
      setDrillIndex(drillIndex + 1);
    } else {
      onFinish?.();
    }
  }

  function handleSkip() {
    setInput("");
    setRevealed(false);
    if (drillIndex + 1 < total) {
      setDrillIndex(drillIndex + 1);
    } else {
      onFinish?.();
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span>
          ドリル {drillIndex + 1} / {total}
        </span>
        {current.focus_func && (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200">
            型: {current.focus_func}
          </span>
        )}
      </div>

      {current.highlight?.note && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
          注目: {current.highlight.series ? `${current.highlight.series} — ` : ""}
          {current.highlight.note}
        </p>
      )}

      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">日本語プロンプト</p>
        <p className="mt-1 text-lg leading-relaxed text-slate-900 dark:text-slate-50">{current.jp}</p>

        {targets.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              使う語（タップで意味）:
            </span>
            {targets.map((t) => (
              <WordChip key={t.id} itemId={t.id} label={t.front} />
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          英作/発話
        </label>
        <textarea
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 text-base leading-relaxed text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          rows={3}
          placeholder="ここに英語で書いてみる（または録音で発話）..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {kind === "speaking" && (
        <RecordingPanel itemId={`drill-${current.id}`} label="発話練習" />
      )}

      <div className="flex flex-wrap items-center gap-2">
        {!revealed ? (
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            onClick={() => setRevealed(true)}
          >
            答え合わせ
          </button>
        ) : (
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 dark:border-slate-600 dark:text-slate-200"
            onClick={() => void playModel()}
          >
            🔊 モデル文
          </button>
        )}
        <button
          type="button"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400"
          onClick={handleSkip}
        >
          スキップ
        </button>
      </div>

      {revealed && (
        <div className="space-y-3 rounded-lg border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/40">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">モデル解答</p>
          <p className="text-lg leading-relaxed text-slate-900 dark:text-slate-50">
            <ModelText text={current.model_en} items={items} highlightIds={current.target_ids} />
          </p>
          {current.acceptable && current.acceptable.length > 0 && (
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-semibold">別解: </span>
              {current.acceptable.join(", ")}
            </p>
          )}
          {targets.length > 0 && (
            <div className="border-t border-emerald-200 pt-3 text-xs text-slate-600 dark:border-emerald-800 dark:text-slate-400">
              <p className="mb-1 font-semibold">使った語（採点で SRS 更新）:</p>
              <div className="flex flex-wrap gap-1.5">
                {targets.map((t) => (
                  <WordChip key={t.id} itemId={t.id} label={t.front} />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {GRADE_BUTTONS.map((b) => (
              <button
                key={b.grade}
                type="button"
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${b.className}`}
                onClick={() => handleGrade(b.grade)}
                aria-label={`ドリル内の使った語を全て「${b.label}」で採点`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
