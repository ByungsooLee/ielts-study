/**
 * モデル文中に含まれる item.front を検出して WordChip(inline) に置換して描画する。
 * - items[] を長い front 順にソートし、貪欲マッチで重複置換を防ぐ
 * - マッチは case-insensitive
 * - 単語チップをタップすると WordDetailSheet が開く
 */
import { useMemo } from "react";
import { WordChip } from "./WordChip";
import type { StudyItem } from "../../types";

interface Props {
  text: string;
  items: StudyItem[];
  /** 追加でハイライト対象にしたい語（drill.target_ids など。既に items に含まれるなら不要） */
  highlightIds?: string[];
}

function escape(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function ModelText({ text, items, highlightIds }: Props) {
  const nodes = useMemo(() => {
    if (!text) return [] as React.ReactNode[];
    const pool = highlightIds
      ? items.filter((it) => highlightIds.includes(it.id))
      : items;
    const byFront = new Map<string, StudyItem>();
    for (const it of pool) {
      const key = it.front.trim().toLowerCase();
      if (key && !byFront.has(key)) byFront.set(key, it);
    }
    if (byFront.size === 0) return [text];
    const fronts = [...byFront.keys()].sort((a, b) => b.length - a.length);
    const pattern = new RegExp(`(${fronts.map(escape).join("|")})`, "gi");
    const parts = text.split(pattern);
    return parts.map((part, i) => {
      const key = part.toLowerCase();
      const item = byFront.get(key);
      if (!item) return <span key={i}>{part}</span>;
      return <WordChip key={i} itemId={item.id} label={part} inline />;
    });
  }, [text, items, highlightIds]);

  return <>{nodes}</>;
}
