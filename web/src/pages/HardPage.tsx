import { useEffect, useMemo, useState } from "react";
import { requestFeedback } from "../lib/api";
import { playPronunciation } from "../lib/pronunciation";
import { isHard } from "../lib/srs";
import { useContentStore } from "../stores/contentStore";
import { useProgressStore } from "../stores/progressStore";
import { useSettingsStore } from "../stores/settingsStore";
import { RecordingPanel } from "../components/RecordingPanel";

export function HardPage() {
  const items = useContentStore((s) => s.items);
  const load = useContentStore((s) => s.load);
  const progress = useProgressStore((s) => s.progress);
  const addUserSentence = useProgressStore((s) => s.addUserSentence);
  const settings = useSettingsStore((s) => s.settings);

  const hardWords = useMemo(
    () => items.filter((r) => r.item.type === "word" && isHard(r.id, progress)),
    [items, progress],
  );

  const recentGrammar = useMemo(
    () =>
      items
        .filter((r) => r.item.type === "grammar")
        .sort((a, b) => b.source.added.localeCompare(a.source.added))
        .slice(0, 8),
    [items],
  );

  const [selectedWordId, setSelectedWordId] = useState<string>("");
  const [selectedGrammarId, setSelectedGrammarId] = useState<string>("");
  const [sentence, setSentence] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!selectedWordId && hardWords[0]) setSelectedWordId(hardWords[0].id);
    if (!selectedGrammarId && recentGrammar[0]) setSelectedGrammarId(recentGrammar[0].id);
  }, [hardWords, recentGrammar, selectedWordId, selectedGrammarId]);

  const selectedWord = items.find((r) => r.id === selectedWordId);
  const savedSentences = progress.userSentences[selectedWordId] ?? [];

  async function submitFeedback() {
    if (!sentence.trim() || !selectedWord) return;
    if (!settings.workerUrl || !settings.syncToken) {
      setError("添削には設定画面で Worker URL と合言葉が必要です");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const grammarItem = items.find((r) => r.id === selectedGrammarId)?.item.front;
      const result = await requestFeedback({
        workerUrl: settings.workerUrl,
        syncToken: settings.syncToken,
        sentence,
        grammar: grammarItem,
        word: selectedWord.item.front,
      });
      addUserSentence(selectedWordId, {
        id: crypto.randomUUID(),
        text: sentence,
        usedGrammar: selectedGrammarId,
        createdAt: Date.now(),
        ai: result,
      });
      setSentence("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "添削に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  async function playSentence(text: string) {
    try {
      await playPronunciation({
        text,
        accent: settings.accent,
        workerUrl: settings.workerUrl,
        syncToken: settings.syncToken,
      });
    } catch (e) {
      alert(e instanceof Error ? e.message : "発音再生に失敗しました");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">苦手単語</h2>
        {hardWords.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">苦手単語はまだありません。</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {hardWords.map((r) => (
              <button
                key={r.id}
                type="button"
                className={`rounded px-3 py-1 text-sm ${
                  selectedWordId === r.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
                }`}
                onClick={() => setSelectedWordId(r.id)}
              >
                {r.item.front}
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedWord && (
        <section className="space-y-4 rounded-xl bg-white p-4 shadow-sm">
          <h3 className="font-semibold">例文を作る: {selectedWord.item.front}</h3>
          <div>
            <p className="mb-2 text-sm text-slate-600">最近学んだ構文を選ぶ</p>
            <div className="flex flex-wrap gap-2">
              {recentGrammar.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className={`rounded px-3 py-1 text-xs ${
                    selectedGrammarId === g.id ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => setSelectedGrammarId(g.id)}
                >
                  {g.item.front} ({g.source.added})
                </button>
              ))}
            </div>
          </div>
          <textarea
            className="w-full rounded border px-3 py-2 text-sm"
            rows={4}
            placeholder="英文を入力..."
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
          />
          <button
            type="button"
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            disabled={loading || !sentence.trim()}
            onClick={() => void submitFeedback()}
          >
            {loading ? "添削中..." : "添削する"}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </section>
      )}

      {savedSentences.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">保存した例文</h3>
          {savedSentences.map((s) => (
            <div key={s.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <p className="text-slate-800">{s.text}</p>
              {s.ai && (
                <div className="mt-2 rounded bg-slate-50 p-3 text-sm">
                  <p className="font-medium text-slate-800">{s.ai.corrected}</p>
                  <p className="mt-1 text-slate-600">{s.ai.comment}</p>
                </div>
              )}
              <div className="mt-2 flex gap-2">
                <button type="button" className="text-sm text-blue-600" onClick={() => void playSentence(s.text)}>
                  原文を再生
                </button>
                {s.ai && (
                  <button type="button" className="text-sm text-blue-600" onClick={() => void playSentence(s.ai!.corrected)}>
                    修正文を再生
                  </button>
                )}
              </div>
              <div className="mt-3">
                <RecordingPanel
                  itemId={`sentence:${s.id}`}
                  label="例文の録音"
                  onCompareModel={() => playSentence(s.ai?.corrected ?? s.text)}
                />
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
