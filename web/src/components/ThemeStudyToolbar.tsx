import type { ReactNode } from "react";
import type { VocabTypeFilter } from "../stores/wordSessionStore";
import type { DeckSort, StudyContentMode, StudyDirection } from "../types";

interface Props {
  direction: StudyDirection;
  contentMode: StudyContentMode;
  sort: DeckSort;
  vocabTypeFilter: VocabTypeFilter;
  onDirection: (d: StudyDirection) => void;
  onContentMode: (m: StudyContentMode) => void;
  onSort: (s: DeckSort) => void;
  onVocabTypeFilter: (f: VocabTypeFilter) => void;
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

export function ThemeStudyToolbar({
  direction,
  contentMode,
  sort,
  vocabTypeFilter,
  onDirection,
  onContentMode,
  onSort,
  onVocabTypeFilter,
  onShuffle,
}: Props) {
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">語彙カード（単語・構文）</p>
      <div className="flex flex-wrap gap-2">
        <ToggleBtn active={vocabTypeFilter === "all"} onClick={() => onVocabTypeFilter("all")}>
          すべて
        </ToggleBtn>
        <ToggleBtn active={vocabTypeFilter === "word"} onClick={() => onVocabTypeFilter("word")}>
          単語のみ
        </ToggleBtn>
        <ToggleBtn active={vocabTypeFilter === "phrase"} onClick={() => onVocabTypeFilter("phrase")}>
          構文のみ
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
      <div className="flex flex-wrap gap-2">
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
    </div>
  );
}
