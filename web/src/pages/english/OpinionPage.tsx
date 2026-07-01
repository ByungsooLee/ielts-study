import { useEffect, useMemo, useState } from "react";
import { DrillRunner } from "../../components/english/DrillRunner";
import { DrillSectionPicker } from "../../components/english/DrillSectionPicker";
import {
  computeDrillDueCounts,
  DRILL_COLLECTION_IDS,
  ensureDrillSection,
  fetchDrillCollection,
  prefetchDrillCollection,
  type DrillCollectionMeta,
} from "../../lib/drillContent";
import { playPronunciation } from "../../lib/pronunciation";
import { todayDay } from "../../lib/srs";
import { useContentStore } from "../../stores/contentStore";
import { useProgressStore } from "../../stores/progressStore";
import { useSettingsStore } from "../../stores/settingsStore";
import type { DrillKind, DrillSection, StudyItem } from "../../types";

const WRITING_FUNC_LABELS: Record<string, string> = {
  opinion: "意見",
  reason: "理由",
  example: "例示",
  concession: "譲歩",
  contrast: "対比",
  "cause-effect": "因果",
  result: "結果",
  conclusion: "結論",
  topic: "話題語彙",
};

const SPEAKING_FUNC_LABELS: Record<string, string> = {
  "sp-opinion": "意見",
  "sp-preference": "好み",
  "sp-frequency": "頻度",
  "sp-filler": "フィラー",
  "sp-emphasis": "強調",
  "sp-idiom": "イディオム",
  "sp-hedge": "ぼかし",
  topic: "話題語彙",
};

interface Props {
  kind: DrillKind;
  description: string;
  pickerTitle: string;
}

function TypeLibrary({
  items,
  labels,
  focus,
}: {
  items: StudyItem[];
  labels: Record<string, string>;
  focus?: string;
}) {
  const groups = useMemo(() => {
    const map = new Map<string, StudyItem[]>();
    for (const it of items) {
      const f = it.func ?? "topic";
      if (!map.has(f)) map.set(f, []);
      map.get(f)!.push(it);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [items]);

  const accent = useSettingsStore((s) => s.settings.accent);
  const workerUrl = useSettingsStore((s) => s.settings.workerUrl);
  const syncToken = useSettingsStore((s) => s.settings.syncToken);

  return (
    <div className="space-y-2">
      {groups.map(([f, list]) => {
        const isFocus = f === focus;
        return (
          <div
            key={f}
            className={`rounded-lg border p-3 ${
              isFocus
                ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30"
                : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
            }`}
          >
            <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {labels[f] ?? f}
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {list.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  className="text-sm text-slate-800 hover:text-blue-700 dark:text-slate-100 dark:hover:text-blue-300"
                  title={it.meaning}
                  onClick={() =>
                    void playPronunciation({
                      text: it.front,
                      source: "word",
                      accent,
                      workerUrl,
                      syncToken,
                    }).catch(() => {})
                  }
                >
                  🔊 <span className="font-medium">{it.front}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400"> — {it.meaning}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function OpinionPage({ kind, description, pickerTitle }: Props) {
  const [collection, setCollection] = useState<DrillCollectionMeta | null>(null);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [section, setSection] = useState<DrillSection | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [currentFocus, setCurrentFocus] = useState<string | undefined>();
  const load = useContentStore((s) => s.load);
  const allRecords = useContentStore((s) => s.items);
  const srs = useProgressStore((s) => s.progress.srs);
  const dueCounts = useMemo(
    () => computeDrillDueCounts(allRecords, srs, DRILL_COLLECTION_IDS[kind], todayDay()),
    [allRecords, srs, kind],
  );
  const accent = useSettingsStore((s) => s.settings.accent);
  const workerUrl = useSettingsStore((s) => s.settings.workerUrl);
  const syncToken = useSettingsStore((s) => s.settings.syncToken);

  useEffect(() => {
    let alive = true;
    void fetchDrillCollection(kind).then((meta) => {
      if (!alive) return;
      setCollection(meta);
      if (meta && meta.sections.length > 0 && activeSection == null) {
        setActiveSection(meta.sections[0].section);
      }
    });
    void prefetchDrillCollection(kind);
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  useEffect(() => {
    if (activeSection == null) return;
    let alive = true;
    setLoading(true);
    setShowModel(false);
    void ensureDrillSection(kind, activeSection)
      .then(async (sec) => {
        if (!alive) return;
        setSection(sec);
        await load();
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [activeSection, kind, load]);

  useEffect(() => {
    setCurrentFocus(section?.drills[0]?.focus_func);
  }, [section]);

  const labels = kind === "writing" ? WRITING_FUNC_LABELS : SPEAKING_FUNC_LABELS;

  return (
    <div className="space-y-4">
      <DrillSectionPicker
        title={pickerTitle}
        description={description}
        sections={collection?.sections ?? []}
        activeSection={activeSection}
        onSelect={setActiveSection}
        dueCounts={dueCounts}
      />

      {loading && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          セクションを読み込み中…
        </div>
      )}

      {!loading && section && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            #{section.section} {section.title}
          </h3>

          {(section.prompt || section.prompt_jp) && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              {section.prompt && (
                <p className="text-base leading-relaxed text-slate-900 dark:text-slate-50">
                  {section.prompt}
                </p>
              )}
              {section.prompt_jp && (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {section.prompt_jp}
                </p>
              )}
              {section.prompt && (
                <button
                  type="button"
                  className="mt-2 rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 dark:border-slate-600 dark:text-slate-200"
                  onClick={() =>
                    void playPronunciation({
                      text: section.prompt!,
                      source: "sentence",
                      accent,
                      workerUrl,
                      syncToken,
                    }).catch(() => {})
                  }
                >
                  🔊 質問文
                </button>
              )}
            </div>
          )}

          {section.outline_jp && section.outline_jp.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">論の骨子</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-800 dark:text-slate-200">
                {section.outline_jp.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          )}

          {section.items.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                型ライブラリ（func別）
              </p>
              <TypeLibrary items={section.items} labels={labels} focus={currentFocus} />
            </div>
          )}

          <DrillRunner
            kind={kind}
            drills={section.drills}
            items={section.items}
          />

          {section.model_answer && section.model_answer.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  モデル解答（全文）
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 dark:border-slate-600 dark:text-slate-200"
                    onClick={() =>
                      void playPronunciation({
                        text: section.model_answer!.join(" "),
                        source: "sentence",
                        accent,
                        workerUrl,
                        syncToken,
                      }).catch(() => {})
                    }
                  >
                    🔊 全文
                  </button>
                  <button
                    type="button"
                    className="rounded border border-slate-300 px-3 py-1 text-xs text-slate-700 dark:border-slate-600 dark:text-slate-200"
                    onClick={() => setShowModel((v) => !v)}
                  >
                    {showModel ? "隠す" : "表示"}
                  </button>
                </div>
              </div>
              {showModel && (
                <div className="mt-3 space-y-2">
                  {section.model_answer.map((line, i) => (
                    <p
                      key={i}
                      className="text-base leading-relaxed text-slate-800 dark:text-slate-200"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function WritingPage() {
  return (
    <OpinionPage
      kind="writing"
      description="Task2 意見エッセイ"
      pickerTitle="IELTS 意見エッセイ (Writing Task2)"
    />
  );
}

export function SpeakingPage() {
  return (
    <OpinionPage
      kind="speaking"
      description="Speaking 一人称回答"
      pickerTitle="IELTS 口頭回答 (Speaking)"
    />
  );
}
