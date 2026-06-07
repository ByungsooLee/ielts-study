import {
  deleteRecording,
  getRecordingsByItemId,
  saveRecording,
  trimRecordings,
} from "../db";
import type { Recording } from "../types";

export class RecordingSession {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: BlobPart[] = [];
  private stream: MediaStream | null = null;
  private startedAt = 0;

  async start(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(this.stream);
    this.chunks = [];
    this.startedAt = Date.now();
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data);
    };
    this.mediaRecorder.start();
  }

  async stop(itemId: string): Promise<Recording> {
    if (!this.mediaRecorder) throw new Error("録音が開始されていません");
    const recorder = this.mediaRecorder;
    const durationMs = Date.now() - this.startedAt;

    const blob = await new Promise<Blob>((resolve, reject) => {
      recorder.onstop = () => {
        resolve(new Blob(this.chunks, { type: recorder.mimeType || "audio/webm" }));
      };
      recorder.onerror = () => reject(new Error("録音に失敗しました"));
      recorder.stop();
    });

    this.stream?.getTracks().forEach((t) => t.stop());
    this.mediaRecorder = null;
    this.stream = null;

    const recording: Recording = {
      id: crypto.randomUUID(),
      itemId,
      blob,
      createdAt: Date.now(),
      durationMs,
    };
    await saveRecording(recording);
    await trimRecordings(itemId, 5);
    return recording;
  }
}

export async function listRecordings(itemId: string): Promise<Recording[]> {
  return getRecordingsByItemId(itemId);
}

export async function removeRecording(id: string): Promise<void> {
  await deleteRecording(id);
}

export async function playRecordingBlob(blob: Blob): Promise<void> {
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  await new Promise<void>((resolve, reject) => {
    audio.onended = () => {
      URL.revokeObjectURL(url);
      resolve();
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("再生に失敗しました"));
    };
    void audio.play().catch(reject);
  });
}
