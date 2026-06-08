function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function makeClozeSentence(sentence: string, target: string): string {
  const trimmed = target.trim();
  if (!trimmed) return sentence;

  const phrasePattern = new RegExp(escapeRegExp(trimmed), "i");
  if (phrasePattern.test(sentence)) {
    return sentence.replace(phrasePattern, "______");
  }

  const words = trimmed.split(/\s+/);
  let result = sentence;
  for (const word of words) {
    const wordPattern = new RegExp(`\\b${escapeRegExp(word)}\\b`, "i");
    if (wordPattern.test(result)) {
      result = result.replace(wordPattern, "______");
    }
  }
  return result;
}

export function pickExampleSentence(item: { front: string; examples?: { en: string }[] }): string | null {
  return item.examples?.[0]?.en ?? null;
}
