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
import { PassivePage } from "./pages/english/PassivePage";
import { WordsPage } from "./pages/english/WordsPage";
import { Task1Page } from "./pages/english/Task1Page";
import { SpeakingPage, WritingPage } from "./pages/english/OpinionPage";
import { EngineeringListPage } from "./pages/engineering/EngineeringListPage";
import { EngineeringStudyPage } from "./pages/engineering/EngineeringStudyPage";
import { InterviewPage } from "./pages/engineering/InterviewPage";
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
  const refreshConnection = useSettingsStore((s) => s.refreshConnection);

  useEffect(() => startVersionCheck(), []);

  useEffect(() => {
    async function init() {
      try {
        await fetchContentIndex();
      } catch {
        /* オフライン時は IndexedDB キャッシュのみ */
      }

      // 合言葉は手動設定（env / 設定画面）。最新値を settings に取り込む。
      refreshConnection();

      const localRecords = await getAllContent();
      await loadContent();
      const local = useProgressStore.getState().progress;
      const syncSettings = useSettingsStore.getState().settings;
      if (isSyncConfigured()) {
        setSyncStatus("syncing");
        await syncContentOnStartup(syncSettings.workerUrl, syncSettings.syncToken, localRecords);
        await loadContent();
        const merged = await syncOnStartup(syncSettings.workerUrl, syncSettings.syncToken, local);
        hydrate(merged);
        setSyncStatus("ok");
        setLastSyncedAt(Date.now());
        await refreshTtsUsage(syncSettings.workerUrl, syncSettings.syncToken);
      } else {
        hydrate(local);
        setSyncStatus(navigator.onLine ? "idle" : "offline");
      }
    }
    void init();
  }, [
    hydrate,
    loadContent,
    refreshConnection,
    refreshTtsUsage,
    setLastSyncedAt,
    setSyncStatus,
    settings.workerUrl,
  ]);

  return (
    <Routes>
      <Route path="/" element={<DomainRedirect />} />

      <Route path="/english" element={<EnglishLayout />}>
        <Route index element={<Navigate to="words" replace />} />
        <Route path="words" element={<WordsPage />} />
        <Route path="grammar" element={<GrammarPage />} />
        <Route path="task1" element={<Task1Page />} />
        <Route path="writing" element={<WritingPage />} />
        <Route path="speaking" element={<SpeakingPage />} />
        <Route path="passive" element={<PassivePage />} />
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
        <Route path="interview" element={<InterviewPage />} />
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
