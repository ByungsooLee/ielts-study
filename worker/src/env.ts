export interface Env {
  IELTS_KV: KVNamespace;
  /** 共有合言葉（Bearer 認証）。Worker 環境変数としてのみ保持し、クライアントには返さない。 */
  SYNC_TOKEN: string;
  /** Google Cloud TTS API キー。未設定なら /tts は 503。 */
  GOOGLE_TTS_KEY: string;
  /** CORS 許可オリジン（カンマ区切り）。"*" で全許可。 */
  ALLOWED_ORIGIN?: string;
  /** TTS 月次上限（文字数）。未設定なら無料枠デフォルト。 */
  TTS_MONTHLY_LIMIT?: string;
}
