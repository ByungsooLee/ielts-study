import { useEffect, useMemo, useState } from "react";
import { DrillRunner } from "../../components/english/DrillRunner";
import { DrillSectionPicker } from "../../components/english/DrillSectionPicker";
import { ModelText } from "../../components/english/ModelText";
import { PartBanner, type PartColor } from "../../components/english/PartBanner";
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
import { playPronunciation } from "../../lib/pronunciation";
import { srsColor, todayDay } from "../../lib/srs";
import { useContentStore } from "../../stores/contentStore";
import { useProgressStore } from "../../stores/progressStore";
import { useSettingsStore } from "../../stores/settingsStore";
import type { DrillKind, DrillSection } from "../../types";

interface Props {
  kind: DrillKind;
  description: string;
  partLabel: "Part 3" | "Part 4";
  partColor: PartColor;
  partTitle: string;
  sectionRange: string;
}

export function OpinionPage({
  kind,
  description,
  partLabel,
  partColor,
  partTitle,
  sectionRange,
}: Props) {
  const [collection, setCollection] = useState<DrillCollectionMeta | null>(null);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [section, setSection] = useState<DrillSection | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<SectionMode>("vocab");
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
  const playbackRate = useSettingsStore((s) => s.settings.playbackRate);

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

  const vocabProgress = useMemo(() => {
    if (!section) return undefined;
    const learned = section.items.filter((it) => srsColor(srs[it.id]) === "green").length;
    return `${learned}/${section.items.length}`;
  }, [section, srs]);

  const drillBadge =
    section && section.drills.length > 0 ? String(section.drills.length) : undefined;

  return (
    <div className="space-y-4">
      <PartBanner
        color={partColor}
        part={partLabel}
        title={partTitle}
        subtitle={description}
        sectionRange={sectionRange}
      />
      <DrillSectionPicker
        title="セクション"
        description={`Section ${sectionRange}`}
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
                      playbackRate,
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

          <div className="flex justify-center">
            <SectionModeSwitcher
              mode={mode}
              onChange={setMode}
              vocabBadge={vocabProgress}
              drillBadge={drillBadge}
            />
          </div>

          {mode === "vocab" && (
            <WordModeView items={section.items} kind={kind} focusFunc={currentFocus} />
          )}

          {mode === "drill" && (
            <DrillRunner kind={kind} drills={section.drills} items={section.items} />
          )}

          {mode === "model" && section.model_answer && section.model_answer.length > 0 && (
            <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  モデル解答（全文）
                </p>
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
                      playbackRate,
                    }).catch(() => {})
                  }
                >
                  🔊 全文
                </button>
              </div>
              <div className="space-y-2">
                {section.model_answer.map((line, i) => (
                  <p
                    key={i}
                    className="text-base leading-relaxed text-slate-800 dark:text-slate-100"
                  >
                    <ModelText text={line} items={section.items} />
                  </p>
                ))}
              </div>
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
      partLabel="Part 3"
      partColor="amber"
      partTitle="意見(Writing)"
      sectionRange="66–77"
    />
  );
}

export function SpeakingPage() {
  return (
    <OpinionPage
      kind="speaking"
      description="Speaking 一人称回答"
      partLabel="Part 4"
      partColor="orange"
      partTitle="意見(Speaking)"
      sectionRange="78–97"
    />
  );
}
