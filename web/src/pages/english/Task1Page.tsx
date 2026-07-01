import { useEffect, useMemo, useState } from "react";
import { DrillRunner } from "../../components/english/DrillRunner";
import { DrillSectionPicker } from "../../components/english/DrillSectionPicker";
import { PartBanner } from "../../components/english/PartBanner";
import {
  computeDrillDueCounts,
  DRILL_COLLECTION_IDS,
  ensureDrillSection,
  fetchDrillCollection,
  prefetchDrillCollection,
  type DrillCollectionMeta,
} from "../../lib/drillContent";
import { todayDay } from "../../lib/srs";
import { useContentStore } from "../../stores/contentStore";
import { useProgressStore } from "../../stores/progressStore";
import type { DrillSection, StudyItem } from "../../types";

const FUNC_LABELS: Record<string, string> = {
  "up-gradual": "ゆるやかな上昇",
  "up-sharp": "急上昇",
  "down-gradual": "ゆるやかな下降",
  "down-sharp": "急落",
  overtake: "追い越す",
  peak: "頂点",
  trough: "底",
  flat: "横ばい",
  fluctuate: "変動",
  time: "時間",
  quantity: "量・倍数",
  describe: "図の提示",
  compare: "比較",
};

function FuncChips({ items, focus }: { items: StudyItem[]; focus?: string }) {
  const groups = useMemo(() => {
    const map = new Map<string, StudyItem[]>();
    for (const it of items) {
      const f = it.func ?? "topic";
      if (!map.has(f)) map.set(f, []);
      map.get(f)!.push(it);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [items]);
  return (
    <div className="flex flex-wrap gap-2">
      {groups.map(([f, list]) => {
        const isFocus = f === focus;
        return (
          <span
            key={f}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              isFocus
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            }`}
            title={list.map((it) => it.front).join(", ")}
          >
            {FUNC_LABELS[f] ?? f} ({list.length})
          </span>
        );
      })}
    </div>
  );
}

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
  const [showModel, setShowModel] = useState(false);
  const [currentFocus, setCurrentFocus] = useState<string | undefined>();
  const load = useContentStore((s) => s.load);
  const allRecords = useContentStore((s) => s.items);
  const srs = useProgressStore((s) => s.progress.srs);
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
    // 初回のみ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeSection == null) return;
    let alive = true;
    setLoading(true);
    setShowModel(false);
    void ensureDrillSection("task1", activeSection)
      .then(async (sec) => {
        if (!alive) return;
        setSection(sec);
        await load(); // 新しい items を contentStore に取り込む
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
        title="IELTS 図解描写 (Task1)"
        description="図の動きを英語で描く"
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

          {section.items.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">描写の型</p>
              <FuncChips items={section.items} focus={currentFocus} />
            </div>
          )}

          <DrillRunner
            kind="task1"
            drills={section.drills}
            items={section.items}
          />

          {section.model_paragraph && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  モデル段落（描写全体）
                </p>
                <button
                  type="button"
                  className="rounded-lg border border-slate-300 px-3 py-1 text-xs text-slate-700 dark:border-slate-600 dark:text-slate-200"
                  onClick={() => setShowModel((v) => !v)}
                >
                  {showModel ? "隠す" : "表示"}
                </button>
              </div>
              {showModel && (
                <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-slate-800 dark:text-slate-200">
                  {section.model_paragraph}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
