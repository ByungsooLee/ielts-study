import type { PassageTarget } from "../types";

export interface HighlightSpan {
  id: string;
  text: string;
  start: number;
  end: number;
}

export interface HighlightPart {
  text: string;
  highlight: boolean;
  id?: string;
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isPhrase(text: string) {
  return text.includes(" ");
}

/** 文中の targets[].text を位置付きで抽出（重複・重なりは長い span を優先） */
export function findTargetSpans(en: string, targets: PassageTarget[]): HighlightSpan[] {
  const all: HighlightSpan[] = [];

  for (const target of targets) {
    const raw = target.text?.trim();
    if (!raw) continue;
    const pattern = escapeRegex(raw);
    const regex = isPhrase(raw)
      ? new RegExp(pattern, "gi")
      : new RegExp(`\\b${pattern}\\b`, "gi");

    let match: RegExpExecArray | null;
    while ((match = regex.exec(en)) !== null) {
      all.push({
        id: target.id,
        text: match[0],
        start: match.index,
        end: match.index + match[0].length,
      });
    }
  }

  all.sort((a, b) => b.end - b.start - (a.end - a.start) || a.start - b.start);

  const taken = new Array<boolean>(en.length).fill(false);
  const picked: HighlightSpan[] = [];

  for (const span of all) {
    let overlap = false;
    for (let i = span.start; i < span.end; i++) {
      if (taken[i]) {
        overlap = true;
        break;
      }
    }
    if (overlap) continue;
    for (let i = span.start; i < span.end; i++) taken[i] = true;
    picked.push(span);
  }

  return picked.sort((a, b) => a.start - b.start);
}

export function buildHighlightedParts(en: string, targets: PassageTarget[]): HighlightPart[] {
  const spans = findTargetSpans(en, targets);
  if (!spans.length) return [{ text: en, highlight: false }];

  const parts: HighlightPart[] = [];
  let cursor = 0;

  for (const span of spans) {
    if (span.start > cursor) {
      parts.push({ text: en.slice(cursor, span.start), highlight: false });
    }
    parts.push({ text: en.slice(span.start, span.end), highlight: true, id: span.id });
    cursor = span.end;
  }

  if (cursor < en.length) {
    parts.push({ text: en.slice(cursor), highlight: false });
  }

  return parts;
}
