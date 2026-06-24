import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { DomainSwitch } from "../components/DomainSwitch";
import { prefetchEngineeringThemes } from "../lib/staticContent";
import { useContentStore } from "../stores/contentStore";
import { useDomainStore } from "../stores/domainStore";
import { TtsUsageBanner } from "../components/TtsUsageBanner";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm ${
    isActive
      ? "bg-emerald-600 text-white"
      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
  }`;

export function EngineeringLayout() {
  const setDomain = useDomainStore((s) => s.setDomain);
  const [menuOpen, setMenuOpen] = useState(false);

  const loadContent = useContentStore((s) => s.load);

  useEffect(() => {
    setDomain("engineering");
  }, [setDomain]);

  useEffect(() => {
    void (async () => {
      try {
        await prefetchEngineeringThemes();
        await loadContent();
      } catch {
        /* オフライン時はキャッシュのみ */
      }
    })();
  }, [loadContent]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-emerald-200 bg-white dark:border-emerald-900/40 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">Engineering</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">技術を英語で説明する</p>
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
            className={`mt-3 flex flex-wrap gap-2 ${menuOpen ? "flex" : "hidden md:flex"}`}
            onClick={() => setMenuOpen(false)}
          >
            <NavLink to="/engineering/study" className={navClass}>
              学習
            </NavLink>
            <NavLink to="/engineering/interview" className={navClass}>
              面接
            </NavLink>
            <NavLink to="/engineering/list" className={navClass}>
              一覧
            </NavLink>
            <NavLink to="/engineering/settings" className={navClass}>
              設定
            </NavLink>
          </nav>
        </div>
      </header>
      <TtsUsageBanner />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
