/** Task1描写 / 意見(Writing) / 意見(Speaking) の各ページ上部に置く Part バナー。
 *  タブの Part 色（青/黄/オレンジ）と一貫させて「今どの Part にいるか」を明示する。 */
export type PartColor = "sky" | "amber" | "orange";

const CONTAINER: Record<PartColor, string> = {
  sky: "border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-700 dark:bg-sky-950/60 dark:text-sky-100",
  amber:
    "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-100",
  orange:
    "border-orange-300 bg-orange-50 text-orange-900 dark:border-orange-700 dark:bg-orange-950/60 dark:text-orange-100",
};

const BADGE: Record<PartColor, string> = {
  sky: "bg-sky-600 text-white",
  amber: "bg-amber-500 text-white",
  orange: "bg-orange-600 text-white",
};

interface Props {
  color: PartColor;
  part: "Part 2" | "Part 3" | "Part 4";
  title: string;
  subtitle?: string;
  sectionRange?: string;
}

export function PartBanner({ color, part, title, subtitle, sectionRange }: Props) {
  return (
    <div className={`flex flex-wrap items-center gap-3 rounded-lg border px-4 py-2 ${CONTAINER[color]}`}>
      <span className={`rounded px-2 py-0.5 text-xs font-bold ${BADGE[color]}`}>{part}</span>
      <div className="flex-1">
        <p className="text-base font-semibold leading-tight">{title}</p>
        {subtitle && <p className="text-xs opacity-80">{subtitle}</p>}
      </div>
      {sectionRange && (
        <span className="text-xs opacity-70">Section {sectionRange}</span>
      )}
    </div>
  );
}
