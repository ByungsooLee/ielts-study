/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_WORKER_URL?: string;
  readonly VITE_DEFAULT_SYNC_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
