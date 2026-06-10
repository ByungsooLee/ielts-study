const MERMAID_CDN =
  "https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.9.0/mermaid.min.js";

declare global {
  interface Window {
    mermaid?: {
      initialize: (config: Record<string, unknown>) => void;
      render: (id: string, text: string) => Promise<{ svg: string }>;
    };
  }
}

let initPromise: Promise<void> | null = null;
let renderCounter = 0;

export async function ensureMermaid(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve, reject) => {
    if (window.mermaid) {
      window.mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: "neutral" });
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = MERMAID_CDN;
    script.async = true;
    script.onload = () => {
      if (!window.mermaid) {
        // 読み込めたが API が無い＝失敗扱い。次回再試行できるようリセット。
        initPromise = null;
        reject(new Error("Mermaid の初期化に失敗しました"));
        return;
      }
      window.mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: "neutral" });
      resolve();
    };
    script.onerror = () => {
      script.remove();
      initPromise = null; // CDN 失敗時も次回再試行を許可
      reject(new Error("Mermaid の読み込みに失敗しました"));
    };
    document.head.appendChild(script);
  });

  return initPromise;
}

export async function renderMermaidSvg(code: string): Promise<string> {
  await ensureMermaid();
  const id = `mermaid-${++renderCounter}-${Date.now()}`;
  const { svg } = await window.mermaid!.render(id, code);
  return svg;
}
