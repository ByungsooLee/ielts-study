export async function requestFeedback(options: {
  workerUrl: string;
  syncToken: string;
  sentence: string;
  grammar?: string;
  word?: string;
}): Promise<{ corrected: string; comment: string }> {
  const base = options.workerUrl.replace(/\/$/, "");
  const res = await fetch(`${base}/feedback`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.syncToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sentence: options.sentence,
      grammar: options.grammar,
      word: options.word,
    }),
  });
  if (!res.ok) throw new Error(`添削失敗 (${res.status})`);
  return (await res.json()) as { corrected: string; comment: string };
}
