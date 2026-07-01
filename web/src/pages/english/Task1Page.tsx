import { useEffect, useMemo, useState } from "react";
import { DrillRunner } from "../../components/english/DrillRunner";
import { DrillSectionPicker } from "../../components/english/DrillSectionPicker";
import { ModelText } from "../../components/english/ModelText";
import { PartBanner } from "../../components/english/PartBanner";
import {
  SectionModeSwitcher,
  type SectionMode,
} from "../../components/english/SectionModeSwitcher";
import { WordModeView } from "../../components/english/WordModeView";
import {
  computeDrillDueCounts,
  DRILL_COLLECTION_IDS,
  ensureDrillSection,
  fetchDrillCollection,
  prefetchDrillCollection,
  type DrillCollectionMeta,
} from "../../lib/drillContent";
import { srsColor, todayDay } from "../../lib/srs";
import { playPronunciation } from "../../lib/pronunciation";
import { useContentStore } from "../../stores/contentStore";
import { useProgressStore } from "../../stores/progressStore";
import { useSettingsStore } from "../../stores/settingsStore";
import type { DrillSection } from "../../types";

function ChartView({ svg, caption }: { svg: string; caption: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
      <div
        className="mx-auto max-w-xl [&_svg]:h-auto [&_svg]:w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{caption}</p>
    </div>
  );
}

export function Task1Page() {
  const [collection, setCollection] = useState<DrillCollectionMeta | null>(null);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [section, setSection] = useState<DrillSection | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<SectionMode>("vocab");
  const [currentFocus, setCurrentFocus] = useState<string | undefined>();
  const load = useContentStore((s) => s.load);
  const allRecords = useContentStore((s) => s.items);
  const srs = useProgressStore((s) => s.progress.srs);
  const accent = useSettingsStore((s) => s.settings.accent);
  const workerUrl = useSettingsStore((s) => s.settings.workerUrl);
  const syncToken = useSettingsStore((s) => s.settings.syncToken);
  const dueCounts = useMemo(
    () => computeDrillDueCounts(allRecords, srs, DRILL_COLLECTION_IDS.task1, todayDay()),
    [allRecords, srs],
  );

  useEffect(() => {
    let alive = true;
    void fetchDrillCollection("task1").then((meta) => {
      if (!alive) return;
      setCollection(meta);
      if (meta && meta.sections.length > 0 && activeSection == null) {
        setActiveSection(meta.sections[0].section);
      }
    });
    void prefetchDrillCollection("task1");
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeSection == null) return;
    let alive = true;
    setLoading(true);
    void ensureDrillSection("task1", activeSection)
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
  }, [activeSection, load]);

  useEffect(() => {
    setCurrentFocus(section?.drills[0]?.focus_func);
  }, [section]);

  // 進捗バッジ（単語モード用）
  const vocabProgress = useMemo(() => {
    if (!section) return undefined;
    const learned = section.items.filter((it) => srsColor(srs[it.id]) === "green").length;
    return `${learned}/${section.items.length}`;
  }, [section, srs]);

  const drillBadge = section && section.drills.length > 0 ? String(section.drills.length) : undefined;

  return (
    <div className="space-y-4">
      <PartBanner
        color="sky"
        part="Part 2"
        title="図解描写 (Task1)"
        subtitle="図の動きを英語で描く"
        sectionRange="58–65"
      />
      <DrillSectionPicker
        title="セクション"
        description="Section 58–65"
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

          {section.chart && (
            <ChartView svg={section.chart.svg} caption={section.chart.caption} />
          )}

          <div className="flex justify-center">
            <SectionModeSwitcher
              mode={mode}
              onChange={setMode}
              vocabBadge={vocabProgress}
              drillBadge={drillBadge}
            />
          </div>

          {mode === "vocab" && (
            <WordModeView items={section.items} kind="task1" focusFunc={currentFocus} />
          )}

          {mode === "drill" && (
            <DrillRunner kind="task1" drills={section.drills} items={section.items} />
          )}

          {mode === "model" && section.model_paragraph && (
            <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  モデル段落（描写全体）
                </p>
                <button
                  type="button"
                  className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 dark:border-slate-600 dark:text-slate-200"
                  onClick={() =>
                    void playPronunciation({
                      text: section.model_paragraph!,
                      source: "sentence",
                      accent,
                      workerUrl,
                      syncToken,
                    }).catch(() => {})
                  }
                >
                  🔊 全文
                </button>
              </div>
              <p className="whitespace-pre-line text-base leading-relaxed text-slate-800 dark:text-slate-100">
                <ModelText text={section.model_paragraph} items={section.items} />
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
