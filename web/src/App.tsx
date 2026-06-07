import { useEffect } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { syncOnStartup } from "./lib/sync";
import { startVersionCheck } from "./lib/versionCheck";
import { HardPage } from "./pages/HardPage";
import { LibraryPage } from "./pages/LibraryPage";
import { ReviewPage } from "./pages/ReviewPage";
import { SettingsPage } from "./pages/SettingsPage";
import { useContentStore } from "./stores/contentStore";
import { useProgressStore } from "./stores/progressStore";
import { useSettingsStore } from "./stores/settingsStore";
import { useTtsUsageStore } from "./stores/ttsUsageStore";
import { TtsUsageBanner } from "./components/TtsUsageBanner";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm ${isActive ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`;

export default function App() {
  const loadContent = useContentStore((s) => s.load);
  const hydrate = useProgressStore((s) => s.hydrate);
  const settings = useSettingsStore((s) => s.settings);
  const setSyncStatus = useSettingsStore((s) => s.setSyncStatus);
  const setLastSyncedAt = useSettingsStore((s) => s.setLastSyncedAt);
  const refreshTtsUsage = useTtsUsageStore((s) => s.refresh);

  useEffect(() => startVersionCheck(), []);

  useEffect(() => {
    async function init() {
      await loadContent();
      const local = useProgressStore.getState().progress;
      if (settings.workerUrl && settings.syncToken) {
        setSyncStatus("syncing");
        const merged = await syncOnStartup(settings.workerUrl, settings.syncToken, local);
        hydrate(merged);
        setSyncStatus("ok");
        setLastSyncedAt(Date.now());
        await refreshTtsUsage(settings.workerUrl, settings.syncToken);
      } else {
        hydrate(local);
        setSyncStatus(navigator.onLine ? "idle" : "offline");
      }
    }
    void init();
  }, [hydrate, loadContent, refreshTtsUsage, setLastSyncedAt, setSyncStatus, settings.syncToken, settings.workerUrl]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold">IELTS Study</h1>
            <p className="text-sm text-slate-500">単語・構文・会話の個人復習アプリ</p>
          </div>
          <nav className="flex flex-wrap gap-2">
            <NavLink to="/" end className={navClass}>ライブラリ</NavLink>
            <NavLink to="/review" className={navClass}>復習</NavLink>
            <NavLink to="/hard" className={navClass}>苦手・例文</NavLink>
            <NavLink to="/settings" className={navClass}>設定</NavLink>
          </nav>
        </div>
      </header>
      <TtsUsageBanner />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Routes>
          <Route path="/" element={<LibraryPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/hard" element={<HardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}
