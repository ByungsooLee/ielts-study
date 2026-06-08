import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { DomainSwitch } from "../components/DomainSwitch";
import { useDomainStore } from "../stores/domainStore";
import { TtsUsageBanner } from "../components/TtsUsageBanner";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm ${
    isActive
      ? "bg-blue-600 text-white"
      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
  }`;

export function EnglishLayout() {
  const setDomain = useDomainStore((s) => s.setDomain);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setDomain("english");
  }, [setDomain]);

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
            className={`mt-3 flex flex-wrap gap-2 ${menuOpen ? "flex" : "hidden md:flex"}`}
            onClick={() => setMenuOpen(false)}
          >
            <NavLink to="/english/words" className={navClass}>
              単語
            </NavLink>
            <NavLink to="/english/grammar" className={navClass}>
              文法
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
