import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { syncContentOnStartup } from "./lib/contentSync";
import { syncOnStartup } from "./lib/sync";
import { fetchContentIndex } from "./lib/staticContent";
import { getAllContent } from "./db";
import { startVersionCheck } from "./lib/versionCheck";
import { EnglishLayout } from "./layouts/EnglishLayout";
import { EngineeringLayout } from "./layouts/EngineeringLayout";
import { DomainRedirect } from "./pages/DomainRedirect";
import { HardPage } from "./pages/HardPage";
import { MaybePage } from "./pages/MaybePage";
import { SettingsPage } from "./pages/SettingsPage";
import { SynonymQuizPage } from "./pages/SynonymQuizPage";
import { GrammarPage } from "./pages/english/GrammarPage";
import { WordsPage } from "./pages/english/WordsPage";
import { EngineeringListPage } from "./pages/engineering/EngineeringListPage";
import { EngineeringStudyPage } from "./pages/engineering/EngineeringStudyPage";
import { useContentStore } from "./stores/contentStore";
import { useProgressStore } from "./stores/progressStore";
import { useSettingsStore } from "./stores/settingsStore";
import { useTtsUsageStore } from "./stores/ttsUsageStore";
import { isSyncConfigured } from "./lib/workerConfig";

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
      try {
        await fetchContentIndex();
      } catch {
        /* オフライン時は IndexedDB キャッシュのみ */
      }
      const localRecords = await getAllContent();
      await loadContent();
      const local = useProgressStore.getState().progress;
      if (isSyncConfigured()) {
        setSyncStatus("syncing");
        await syncContentOnStartup(settings.workerUrl, settings.syncToken, localRecords);
        await loadContent();
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
    <Routes>
      <Route path="/" element={<DomainRedirect />} />

      <Route path="/english" element={<EnglishLayout />}>
        <Route index element={<Navigate to="words" replace />} />
        <Route path="words" element={<WordsPage />} />
        <Route path="grammar" element={<GrammarPage />} />
        <Route path="phrases" element={<Navigate to="/english/words" replace />} />
        <Route path="maybe" element={<MaybePage />} />
        <Route path="synonym" element={<SynonymQuizPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="library" element={<Navigate to="/english/words" replace />} />
        <Route path="study" element={<Navigate to="/english/words" replace />} />
      </Route>

      <Route path="/engineering" element={<EngineeringLayout />}>
        <Route index element={<Navigate to="study" replace />} />
        <Route path="study" element={<EngineeringStudyPage />} />
        <Route path="list" element={<EngineeringListPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="/library" element={<Navigate to="/english/words" replace />} />
      <Route path="/study" element={<Navigate to="/english/words" replace />} />
      <Route path="/maybe" element={<Navigate to="/english/maybe" replace />} />
      <Route path="/synonym" element={<Navigate to="/english/synonym" replace />} />
      <Route path="/settings" element={<Navigate to="/english/settings" replace />} />
      <Route path="/review" element={<Navigate to="/english/grammar" replace />} />
      <Route path="/hard" element={<HardPage />} />
    </Routes>
  );
}
