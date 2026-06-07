import { useRef, useState } from "react";
import { useContentStore } from "../stores/contentStore";

export function ImportZone() {
  const importJsonText = useContentStore((s) => s.importJsonText);
  const lastImportResult = useContentStore((s) => s.lastImportResult);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setLoading(true);
    setError(null);
    try {
      const text = await files[0].text();
      await importJsonText(text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "取り込みに失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div
        className={`rounded-xl border-2 border-dashed p-6 text-center transition ${
          dragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-white"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFiles(e.dataTransfer.files);
        }}
      >
        <p className="text-sm text-slate-600">JSONファイルをドラッグ&ドロップ</p>
        <button
          type="button"
          className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
        >
          {loading ? "取り込み中..." : "JSONを取り込む"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {lastImportResult && (
        <div className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
          追加 {lastImportResult.added} / 更新 {lastImportResult.updated} / スキップ{" "}
          {lastImportResult.skipped}
          {lastImportResult.errors.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-red-600">
              {lastImportResult.errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
