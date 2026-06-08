import type { ReactNode } from "react";
import type { DeckSort, ItemType, SetSize, StudyContentMode, StudyDirection, StudyMode } from "../types";
import { CATEGORY_LABELS, CATEGORY_STYLES } from "../lib/themes";

interface Props {
  categories: ItemType[];
  category: ItemType;
  hideCategoryTabs?: boolean;
  studyMode: StudyMode;
  direction: StudyDirection;
  contentMode: StudyContentMode;
  setSize: SetSize;
  sort: DeckSort;
  dueOnly: boolean;
  hardOnly: boolean;
  unlearnedOnly: boolean;
  onCategory: (c: ItemType) => void;
  onStudyMode: (m: StudyMode) => void;
  onDirection: (d: StudyDirection) => void;
  onContentMode: (m: StudyContentMode) => void;
  onSetSize: (s: SetSize) => void;
  onSort: (s: DeckSort) => void;
  onDueOnly: (v: boolean) => void;
  onHardOnly: (v: boolean) => void;
  onUnlearnedOnly: (v: boolean) => void;
  onShuffle: () => void;
}

function ToggleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`rounded-lg px-3 py-1.5 text-sm ${
        active
          ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function StudyToolbar({
  categories,
  category,
  studyMode,
  direction,
  contentMode,
  setSize,
  sort,
  dueOnly,
  hardOnly,
  unlearnedOnly,
  onCategory,
  onStudyMode,
  onDirection,
  onContentMode,
  onSetSize,
  onSort,
  onDueOnly,
  onHardOnly,
  onUnlearnedOnly,
  onShuffle,
  hideCategoryTabs = false,
}: Props) {
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      {studyMode === "set" && !hideCategoryTabs ? (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="カテゴリ">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={category === c}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                category === c ? CATEGORY_STYLES[c].active : CATEGORY_STYLES[c].inactive
              }`}
              onClick={() => onCategory(c)}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          今日の復習は全カテゴリ混在キュー（忘却曲線優先）
        </p>
      )}

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="学習モード">
        <ToggleBtn active={studyMode === "review"} onClick={() => onStudyMode("review")}>
          今日の復習
        </ToggleBtn>
        <ToggleBtn active={studyMode === "set"} onClick={() => onStudyMode("set")}>
          セット学習
        </ToggleBtn>
      </div>

      <div className="flex flex-wrap gap-2">
        <ToggleBtn active={direction === "en-to-jp"} onClick={() => onDirection("en-to-jp")}>
          見出し→意味
        </ToggleBtn>
        <ToggleBtn active={direction === "jp-to-en"} onClick={() => onDirection("jp-to-en")}>
          意味→見出し
        </ToggleBtn>
        <ToggleBtn active={contentMode === "semantic"} onClick={() => onContentMode("semantic")}>
          語義
        </ToggleBtn>
        <ToggleBtn active={contentMode === "cloze"} onClick={() => onContentMode("cloze")}>
          例文穴埋め
        </ToggleBtn>
      </div>

      {studyMode === "set" && (
        <>
          <div className="flex flex-wrap gap-2">
            {([10, 30, 50] as SetSize[]).map((n) => (
              <ToggleBtn key={n} active={setSize === n} onClick={() => onSetSize(n)}>
                {n}枚
              </ToggleBtn>
            ))}
            <ToggleBtn active={sort === "random"} onClick={() => onSort("random")}>
              ランダム
            </ToggleBtn>
            <ToggleBtn active={sort === "asc"} onClick={() => onSort("asc")}>
              昇順
            </ToggleBtn>
            <button
              type="button"
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
              onClick={onShuffle}
              title="S キー"
            >
              シャッフル
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <ToggleBtn active={dueOnly} onClick={() => onDueOnly(!dueOnly)}>
              今日の復習のみ
            </ToggleBtn>
            <ToggleBtn active={hardOnly} onClick={() => onHardOnly(!hardOnly)}>
              苦手だけ
            </ToggleBtn>
            <ToggleBtn active={unlearnedOnly} onClick={() => onUnlearnedOnly(!unlearnedOnly)}>
              未学習だけ
            </ToggleBtn>
          </div>
        </>
      )}
    </div>
  );
}
