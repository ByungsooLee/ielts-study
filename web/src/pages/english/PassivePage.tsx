import { useEffect, useMemo, useState } from "react";
import { useContentStore } from "../../stores/contentStore";
import { useSettingsStore } from "../../stores/settingsStore";
import { playPronunciation } from "../../lib/pronunciation";
import { prefetchEnglishVocabThemes } from "../../lib/staticContent";
import { buildThemeRanges, needsThemeRangeNav } from "../../lib/themes";
import {
  dueIdsPassive,
  getAllPassiveSched,
  gradePassive,
  type PassiveGrade,
} from "../../lib/passiveSrs";
import type { ContentRecord, ThemeInfo, ThemeRange } from "../../types";

type ThemeFilter = "all" | number;

const DAILY_PASSIVE_LIMIT = 30;

function isPassiveRecord(r: ContentRecord): boolean {
  return r.item.register === "passive";
}

function searchMatch(r: ContentRecord, q: string): boolean {
  if (!q) return true;
  const lower = q.toLowerCase();
  const front = r.item.front?.toLowerCase() ?? "";
  const meaning = r.item.meaning?.toLowerCase() ?? "";
  const syn = (r.item.synonyms ?? []).join(",").toLowerCase();
  return front.includes(lower) || meaning.includes(lower) || syn.includes(lower);
}

interface ThemeGroup {
  theme: number;
  themeName: string;
  records: ContentRecord[];
}

function groupByTheme(records: ContentRecord[]): ThemeGroup[] {
  const map = new Map<number, ThemeGroup>();
  for (const r of records) {
    const t = r.item.theme ?? 0;
    const name = r.item.themeName ?? (t === 0 ? "汎用" : `テーマ${t}`);
    let g = map.get(t);
    if (!g) {
      g = { theme: t, themeName: name, records: [] };
      map.set(t, g);
    }
    g.records.push(r);
  }
  for (const g of map.values()) {
    g.records.sort((a, b) => (a.item.n ?? 0) - (b.item.n ?? 0));
  }
  return [...map.values()].sort((a, b) => a.theme - b.theme);
}

export function PassivePage() {
  const allItems = useContentStore((s) => s.items);
  const settings = useSettingsStore((s) => s.settings);

  const [themeFilter, setThemeFilter] = useState<ThemeFilter>("all");
  const [themeRangeMin, setThemeRangeMin] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [confirmMode, setConfirmMode] = useState(false);
  const [todayOnly, setTodayOnly] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [schedTick, setSchedTick] = useState(0);

  useEffect(() => {
    void prefetchEnglishVocabThemes();
  }, []);

  const passiveAll = useMemo(() => allItems.filter(isPassiveRecord), [allItems]);

  const themes = useMemo<ThemeInfo[]>(() => {
    const seen = new Map<number, string>();
    for (const r of passiveAll) {
      const t = r.item.theme ?? 0;
      if (!seen.has(t)) seen.set(t, r.item.themeName ?? `テーマ${t}`);
    }
    return [...seen.entries()]
      .sort(([a], [b]) => a - b)
      .map(([num, name]) => ({ num, name }));
  }, [passiveAll]);

  const ranges = useMemo<ThemeRange[]>(() => buildThemeRanges(themes), [themes]);
  const hasRangeNav = useMemo(
    () => needsThemeRangeNav(themes.map((t) => ({ num: t.num, name: t.name, count: 0 }))),
    [themes],
  );

  // テーマレンジ初期化（初回のみ。番号フィルタ操作中は維持）
  useEffect(() => {
    if (hasRangeNav && themeRangeMin == null && ranges.length > 0) {
      setThemeRangeMin(ranges[0].min);
    }
  }, [hasRangeNav, ranges, themeRangeMin]);

  const dueSet = useMemo(() => {
    void schedTick; // 再評価トリガ
    if (!todayOnly) return null;
    return dueIdsPassive(passiveAll.map((r) => r.id));
  }, [passiveAll, todayOnly, schedTick]);

  const filteredRecords = useMemo(() => {
    let xs = passiveAll;
    if (themeFilter === "all") {
      if (hasRangeNav && themeRangeMin != null) {
        const range = ranges.find((r) => r.min === themeRangeMin);
        if (range) {
          xs = xs.filter((r) => {
            const t = r.item.theme ?? -1;
            return t >= range.min && t <= range.max;
          });
        }
      }
    } else {
      xs = xs.filter((r) => r.item.theme === themeFilter);
    }
    xs = xs.filter((r) => searchMatch(r, query));
    if (todayOnly && dueSet) {
      xs = xs
        .filter((r) => dueSet.has(r.id))
        .slice(0, DAILY_PASSIVE_LIMIT);
    }
    return xs;
  }, [passiveAll, themeFilter, themeRangeMin, ranges, hasRangeNav, query, todayOnly, dueSet]);

  const groups = useMemo(() => groupByTheme(filteredRecords), [filteredRecords]);

  const visibleNumberButtons = useMemo(() => {
    if (!hasRangeNav || themeRangeMin == null) return themes;
    const range = ranges.find((r) => r.min === themeRangeMin);
    if (!range) return themes;
    return themes.filter((t) => t.num >= range.min && t.num <= range.max);
  }, [themes, ranges, themeRangeMin, hasRangeNav]);

  async function play(record: ContentRecord) {
    try {
      await playPronunciation({
        item: record.item,
        accent: settings.accent,
        workerUrl: settings.workerUrl,
        syncToken: settings.syncToken,
      });
    } catch (e) {
      alert(e instanceof Error ? e.message : "発音再生に失敗しました");
    }
  }

  function toggleReveal(id: string) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleGrade(id: string, grade: PassiveGrade) {
    gradePassive(id, grade);
    setRevealed((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setSchedTick((n) => n + 1);
  }

  const totalCount = passiveAll.length;
  const displayedCount = filteredRecords.length;
  const allSched = getAllPassiveSched();
  const dueCount = useMemo(() => {
    void schedTick;
    return dueIdsPassive(passiveAll.map((r) => r.id)).size;
  }, [passiveAll, schedTick]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Passive一覧（認識用）
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          読み・聞きで認識できればOKの語彙 {totalCount}語。物語と Active SRS には混ぜません。
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {hasRangeNav && (
          <div className="mb-3 flex flex-wrap gap-2">
            {ranges.map((r) => (
              <button
                key={r.min}
                type="button"
                onClick={() => setThemeRangeMin(r.min)}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  themeRangeMin === r.min
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setThemeFilter("all")}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              themeFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            全部
          </button>
          {visibleNumberButtons.map((t) => (
            <button
              key={t.num}
              type="button"
              title={t.name}
              onClick={() => setThemeFilter(t.num)}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                themeFilter === t.num
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {t.num} {t.name}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="検索：語・意味・言い換え"
            className="min-w-[12rem] flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={confirmMode}
              onChange={(e) => {
                setConfirmMode(e.target.checked);
                if (!e.target.checked) setRevealed(new Set());
              }}
            />
            確認モード（意味を隠す）
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={todayOnly}
              onChange={(e) => setTodayOnly(e.target.checked)}
            />
            今日のPassive確認のみ（{dueCount}件・上限{DAILY_PASSIVE_LIMIT}）
          </label>
          <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
            表示中: {displayedCount} 語
          </span>
        </div>
      </div>

      {groups.length === 0 && (
        <div className="rounded-xl bg-white p-8 text-center text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-400">
          {totalCount === 0 ? "Passive語が読み込まれていません。" : "条件に該当する語がありません。"}
        </div>
      )}

      {groups.map((g) => (
        <section
          key={g.theme}
          className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <header className="border-b border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
            テーマ{g.theme}：{g.themeName}
            <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">
              {g.records.length}語
            </span>
          </header>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {g.records.map((r) => {
              const isRevealed = !confirmMode || revealed.has(r.id);
              const sched = allSched[r.id];
              return (
                <li key={r.id} className="px-4 py-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                    <div className="sm:w-48 sm:shrink-0">
                      <button
                        type="button"
                        onClick={() => play(r)}
                        className="text-left font-semibold text-blue-700 hover:underline dark:text-blue-300"
                        title="タップで発音"
                      >
                        {r.item.front}
                      </button>
                      {sched && (
                        <span className="ml-2 text-[10px] text-slate-400">
                          box{sched.box}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      {isRevealed ? (
                        <div className="space-y-1">
                          <div className="text-slate-900 dark:text-slate-100">
                            {r.item.meaning}
                          </div>
                          {(r.item.synonyms?.length ?? 0) > 0 && (
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              ≒ {r.item.synonyms?.join(", ")}
                            </div>
                          )}
                          {r.item.collocation && (
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {r.item.collocation}
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleReveal(r.id)}
                          className="rounded bg-slate-100 px-3 py-1 text-sm text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          意味を表示
                        </button>
                      )}
                    </div>
                    {confirmMode && isRevealed && (
                      <div className="flex gap-2 sm:shrink-0">
                        <button
                          type="button"
                          onClick={() => handleGrade(r.id, "remembered")}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-700"
                        >
                          覚えてた
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGrade(r.id, "fuzzy")}
                          className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm text-white hover:bg-amber-600"
                        >
                          あやしい
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
