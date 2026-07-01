import type { DrillSectionEntry } from "../../lib/drillContent";

interface Props {
  title: string;
  description?: string;
  sections: DrillSectionEntry[];
  activeSection: number | null;
  onSelect: (section: number) => void;
  /** section 番号 → 今日期限の item 数 */
  dueCounts?: Record<number, number>;
}

/**
 * セクション選択：数字のみのコンパクトグリッド。
 * 選択後は各ページ側で「#N タイトル」の詳細ヘッダを表示するのでここでは番号だけ。
 * hover / long-press でタイトル tooltip を出す（title 属性）。
 */
export function DrillSectionPicker({
  title,
  description,
  sections,
  activeSection,
  onSelect,
  dueCounts,
}: Props) {
  const activeEntry = sections.find((s) => s.section === activeSection);
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h2>
        {description && (
          <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">{description}</p>
        )}
      </div>

      {sections.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">セクションがまだありません。</p>
      ) : (
        <>
          <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8 md:grid-cols-10">
            {sections.map((s) => {
              const active = s.section === activeSection;
              const due = dueCounts?.[s.section] ?? 0;
              return (
                <button
                  key={s.section}
                  type="button"
                  title={`#${s.section} ${s.title}`}
                  aria-label={`セクション ${s.section} ${s.title}`}
                  aria-pressed={active}
                  className={`relative flex aspect-square items-center justify-center rounded-md border text-sm font-semibold transition ${
                    active
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-800 hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-400 dark:hover:bg-blue-950"
                  }`}
                  onClick={() => onSelect(s.section)}
                >
                  {s.section}
                  {due > 0 && (
                    <span
                      className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-1 ring-white dark:ring-slate-900"
                      title={`今日期限 ${due} 語`}
                    >
                      {due > 9 ? "9+" : due}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {activeEntry && (
            <div className="mt-3 border-t border-slate-200 pt-2 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                #{activeEntry.section}
              </span>{" "}
              {activeEntry.title}
              <span className="ml-2 text-slate-400">
                {activeEntry.itemCount}語 / {activeEntry.drillCount ?? 0}ドリル
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
