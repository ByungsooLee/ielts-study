export async function requestCoach(options: {
  workerUrl: string;
  syncToken: string;
  sentence: string;
}): Promise<{ linking: string; tips: string[]; stressWords?: string[] }> {
  const base = options.workerUrl.replace(/\/$/, "");
  const res = await fetch(`${base}/coach`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.syncToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sentence: options.sentence }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? `発音コーチ失敗 (${res.status})`);
  }
  return (await res.json()) as { linking: string; tips: string[]; stressWords?: string[] };
}

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
