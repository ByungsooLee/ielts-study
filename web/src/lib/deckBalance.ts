/**
 * secondary を primary の間に均等に挿入して、偏りなく混ぜる。
 * セット学習の未学習単語や、今日の復習キュー内の新規単語の配置に使う。
 */
export function interleaveEvenly<T>(primary: T[], secondary: T[], limit: number): T[] {
  if (limit <= 0) return [];
  if (secondary.length === 0) return primary.slice(0, limit);
  if (primary.length === 0) return secondary.slice(0, limit);

  const total = Math.min(limit, primary.length + secondary.length);
  const secondaryCount = Math.min(secondary.length, total);
  const positions = new Set<number>();

  for (let i = 0; i < secondaryCount; i++) {
    const pos =
      secondaryCount === 1
        ? Math.floor(total / 2)
        : Math.round((i * (total - 1)) / (secondaryCount - 1));
    positions.add(Math.min(pos, total - 1));
  }

  const result: T[] = [];
  let primaryIdx = 0;
  let secondaryIdx = 0;

  for (let i = 0; i < total; i++) {
    if (positions.has(i) && secondaryIdx < secondary.length) {
      result.push(secondary[secondaryIdx++]);
    } else if (primaryIdx < primary.length) {
      result.push(primary[primaryIdx++]);
    } else if (secondaryIdx < secondary.length) {
      result.push(secondary[secondaryIdx++]);
    }
  }

  return result;
}
