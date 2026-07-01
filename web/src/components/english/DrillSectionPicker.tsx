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

export function DrillSectionPicker({ title, description, sections, activeSection, onSelect, dueCounts }: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</h2>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      {sections.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          セクションがまだありません。
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {sections.map((s) => {
            const active = s.section === activeSection;
            const due = dueCounts?.[s.section] ?? 0;
            return (
              <li key={s.section}>
                <button
                  type="button"
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                    active
                      ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/40"
                      : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-400"
                  }`}
                  onClick={() => onSelect(s.section)}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      #{s.section} {s.title}
                    </span>
                    <span className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      {due > 0 && (
                        <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                          今日 {due}
                        </span>
                      )}
                      <span>
                        {s.itemCount}語 / {s.drillCount ?? 0}ドリル
                      </span>
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
