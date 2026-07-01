import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { DomainSwitch } from "../components/DomainSwitch";
import { useDomainStore } from "../stores/domainStore";
import { TtsUsageBanner } from "../components/TtsUsageBanner";
import { prefetchAllDrillCollectionsAndReload } from "../lib/drillContent";
import { useContentStore } from "../stores/contentStore";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm ${
    isActive
      ? "bg-slate-700 text-white"
      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
  }`;

/** Part 2/3/4 のタブは Part ごとに色分け（青 / 黄 / オレンジ）。 */
type PartColor = "sky" | "amber" | "orange";
const PART_COLOR_CLASSES: Record<
  PartColor,
  { active: string; inactive: string; badge: string }
> = {
  sky: {
    active: "bg-sky-600 text-white",
    inactive:
      "border border-sky-300 bg-sky-50 text-sky-800 hover:bg-sky-100 dark:border-sky-700 dark:bg-sky-950/60 dark:text-sky-200 dark:hover:bg-sky-900",
    badge:
      "bg-sky-200 text-sky-900 dark:bg-sky-800 dark:text-sky-100",
  },
  amber: {
    active: "bg-amber-500 text-white",
    inactive:
      "border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-200 dark:hover:bg-amber-900",
    badge:
      "bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100",
  },
  orange: {
    active: "bg-orange-600 text-white",
    inactive:
      "border border-orange-300 bg-orange-50 text-orange-900 hover:bg-orange-100 dark:border-orange-700 dark:bg-orange-950/60 dark:text-orange-200 dark:hover:bg-orange-900",
    badge:
      "bg-orange-200 text-orange-900 dark:bg-orange-800 dark:text-orange-100",
  },
};

function partNavClass(color: PartColor) {
  const c = PART_COLOR_CLASSES[color];
  return ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${
      isActive ? c.active : c.inactive
    }`;
}

function PartBadge({ label, color, active }: { label: string; color: PartColor; active: boolean }) {
  const c = PART_COLOR_CLASSES[color];
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
        active ? "bg-white/25 text-white" : c.badge
      }`}
    >
      {label}
    </span>
  );
}

export function EnglishLayout() {
  const setDomain = useDomainStore((s) => s.setDomain);
  const loadContent = useContentStore((s) => s.load);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setDomain("english");
    // Task1/Writing/Speaking の item を IndexedDB に取り込み、完了後に contentStore を
    // 再ロードして「今日の復習」キューに t1-/w2-/sp- item を載せる。
    void prefetchAllDrillCollectionsAndReload(loadContent);
  }, [setDomain, loadContent]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-blue-100 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-blue-900 dark:text-blue-100">English</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">IELTS 語彙・文法</p>
            </div>
            <div className="hidden md:block">
              <DomainSwitch />
            </div>
            <button
              type="button"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:hidden dark:border-slate-600"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              メニュー
            </button>
          </div>
          <div className={`mt-3 md:hidden ${menuOpen ? "block" : "hidden"}`}>
            <DomainSwitch compact />
          </div>
          <nav
            className={`mt-3 flex flex-wrap items-center gap-2 ${menuOpen ? "flex" : "hidden md:flex"}`}
            onClick={() => setMenuOpen(false)}
          >
            <NavLink to="/english/words" className={navClass}>
              単語
            </NavLink>
            <NavLink to="/english/grammar" className={navClass}>
              文法
            </NavLink>
            <NavLink to="/english/passive" className={navClass}>
              Passive一覧
            </NavLink>

            <span className="hidden h-6 w-px bg-slate-300 md:inline-block dark:bg-slate-700" />

            <NavLink to="/english/task1" className={partNavClass("sky")}>
              {({ isActive }) => (
                <>
                  <PartBadge label="Part 2" color="sky" active={isActive} />
                  Task1描写
                </>
              )}
            </NavLink>
            <NavLink to="/english/writing" className={partNavClass("amber")}>
              {({ isActive }) => (
                <>
                  <PartBadge label="Part 3" color="amber" active={isActive} />
                  意見(Writing)
                </>
              )}
            </NavLink>
            <NavLink to="/english/speaking" className={partNavClass("orange")}>
              {({ isActive }) => (
                <>
                  <PartBadge label="Part 4" color="orange" active={isActive} />
                  意見(Speaking)
                </>
              )}
            </NavLink>

            <span className="hidden h-6 w-px bg-slate-300 md:inline-block dark:bg-slate-700" />

            <NavLink to="/english/marks" className={navClass}>
              マーク復習
            </NavLink>
            <NavLink to="/english/maybe" className={navClass}>
              あいまい一覧
            </NavLink>
            <NavLink to="/english/synonym" className={navClass}>
              類義語クイズ
            </NavLink>
            <NavLink to="/english/settings" className={navClass}>
              設定
            </NavLink>
          </nav>
        </div>
      </header>
      <TtsUsageBanner />
      <main className="mx-auto max-w-6xl overflow-x-hidden px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
