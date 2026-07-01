export type SectionMode = "vocab" | "drill" | "model";

interface Props {
  mode: SectionMode;
  onChange: (mode: SectionMode) => void;
  /** モードごとの補助バッジ（進捗など）。省略可 */
  vocabBadge?: string;
  drillBadge?: string;
  modelBadge?: string;
}

const TABS: { key: SectionMode; label: string }[] = [
  { key: "vocab", label: "単語モード" },
  { key: "drill", label: "想起ドリル" },
  { key: "model", label: "モデル全文" },
];

export function SectionModeSwitcher({ mode, onChange, vocabBadge, drillBadge, modelBadge }: Props) {
  const badges: Partial<Record<SectionMode, string | undefined>> = {
    vocab: vocabBadge,
    drill: drillBadge,
    model: modelBadge,
  };
  return (
    <div
      role="tablist"
      aria-label="学習モード"
      className="inline-flex rounded-lg border border-slate-300 bg-white p-1 text-sm dark:border-slate-600 dark:bg-slate-900"
    >
      {TABS.map((t) => {
        const active = mode === t.key;
        const badge = badges[t.key];
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={active}
            className={`rounded-md px-3 py-1.5 font-medium transition ${
              active
                ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
            onClick={() => onChange(t.key)}
          >
            {t.label}
            {badge && (
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  active
                    ? "bg-white/25"
                    : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                }`}
              >
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
