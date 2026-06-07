import { Link } from "react-router-dom";
import { formatCharCount } from "../lib/ttsUsage";
import { useTtsUsageStore } from "../stores/ttsUsageStore";

export function TtsUsageBanner() {
  const usage = useTtsUsageStore((s) => s.usage);
  if (!usage?.warning && !usage?.blocked) return null;

  const message = usage.blocked
    ? `今月の TTS 無料枠（${formatCharCount(usage.monthlyLimit)} 文字）に達しました。新しい音声生成は停止中です。`
    : `TTS 使用量が無料枠の ${usage.percentUsed}% です（${formatCharCount(usage.charsUsed)} / ${formatCharCount(usage.monthlyLimit)} 文字）。80% を超えました。`;

  return (
    <div
      className={`border-b px-4 py-2 text-sm ${
        usage.blocked ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-900"
      }`}
    >
      <p>{message}</p>
      <p className="mt-1 text-xs opacity-80">
        キャッシュ済みの音声は引き続き再生できます。
        <Link to="/settings" className="ml-2 underline">
          設定で詳細を見る
        </Link>
      </p>
    </div>
  );
}
