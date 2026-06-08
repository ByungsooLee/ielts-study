import { forecastDueCounts } from "../lib/dailyQueue";
import type { ContentRecord, ProgressData } from "../types";

interface Props {
  records: ContentRecord[];
  progress: ProgressData;
}

export function ReviewForecast({ records, progress }: Props) {
  const forecast = forecastDueCounts(records, progress, 14);
  const max = Math.max(1, ...forecast.map((f) => f.count));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">今後14日の復習予定</h3>
      <div className="mt-3 flex items-end gap-1" style={{ height: 80 }}>
        {forecast.map((f) => (
          <div key={f.day} className="flex flex-1 flex-col items-center justify-end gap-1">
            <span className="text-[10px] text-slate-500">{f.count > 0 ? f.count : ""}</span>
            <div
              className="w-full rounded-t bg-blue-500/80 dark:bg-blue-400/80"
              style={{ height: `${Math.max(4, (f.count / max) * 64)}px` }}
              title={`${f.label}: ${f.count}件`}
            />
            <span className="text-[9px] text-slate-400">{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
