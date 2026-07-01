/**
 * 単語の「色マーク」（青/黄/オレンジ）を持つチップ。
 * - タップ本体で色を循環（青→黄→オレンジ→青）
 * - 右端の 🔊 アイコンで TTS 再生（音声は別ハンドラ）
 * - 長押し / Alt+クリックで逆循環
 */
import { useCallback, useRef } from "react";
import { useWordMarkStore, type WordMark } from "../../stores/wordMarkStore";

interface Props {
  itemId: string;
  label: string;
  meaning?: string;
  onSpeak?: () => void;
  /** サイズ調整。default = sm */
  size?: "sm" | "md";
}

const MARK_STYLES: Record<WordMark, string> = {
  blue:
    "border-slate-300 bg-white text-slate-800 hover:border-blue-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200",
  yellow:
    "border-amber-400 bg-amber-100 text-amber-900 hover:border-amber-500 dark:border-amber-500 dark:bg-amber-900/50 dark:text-amber-100",
  orange:
    "border-orange-500 bg-orange-100 text-orange-900 hover:border-orange-600 dark:border-orange-500 dark:bg-orange-900/50 dark:text-orange-100",
};

const MARK_DOT: Record<WordMark, string> = {
  blue: "bg-slate-300 dark:bg-slate-600",
  yellow: "bg-amber-500",
  orange: "bg-orange-600",
};

const MARK_LABEL_JP: Record<WordMark, string> = {
  blue: "未マーク",
  yellow: "要復習",
  orange: "強め",
};

export function MarkableWordChip({ itemId, label, meaning, onSpeak, size = "sm" }: Props) {
  const mark = useWordMarkStore((s) => s.marks[itemId]) ?? "blue";
  const cycleMark = useWordMarkStore((s) => s.cycleMark);
  const cyclePrev = useWordMarkStore((s) => s.cyclePrev);

  const holdTimer = useRef<number | null>(null);
  const heldRef = useRef(false);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (heldRef.current) {
        heldRef.current = false;
        return;
      }
      if (e.altKey) {
        cyclePrev(itemId);
      } else {
        cycleMark(itemId);
      }
    },
    [cycleMark, cyclePrev, itemId],
  );

  const handlePointerDown = useCallback(() => {
    heldRef.current = false;
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => {
      heldRef.current = true;
      cyclePrev(itemId);
    }, 500);
  }, [cyclePrev, itemId]);

  const handlePointerUp = useCallback(() => {
    if (holdTimer.current) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }, []);

  const padding = size === "md" ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-xs";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border ${padding} ${MARK_STYLES[mark]}`}>
      <button
        type="button"
        className="flex items-center gap-1.5"
        title={`タップでマーク切替（現在: ${MARK_LABEL_JP[mark]}）${meaning ? ` — ${meaning}` : ""}`}
        aria-label={`${label} を ${MARK_LABEL_JP[mark]} からマーク切替`}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <span className={`h-2 w-2 rounded-full ${MARK_DOT[mark]}`} aria-hidden />
        <span className="font-medium">{label}</span>
      </button>
      {onSpeak && (
        <button
          type="button"
          className="rounded-full px-1 opacity-70 hover:opacity-100"
          title="発音"
          aria-label={`${label} を発音`}
          onClick={(e) => {
            e.stopPropagation();
            onSpeak();
          }}
        >
          🔊
        </button>
      )}
    </span>
  );
}
