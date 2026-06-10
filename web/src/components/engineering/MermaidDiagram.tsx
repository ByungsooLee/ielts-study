import { useEffect, useState } from "react";
import { renderMermaidSvg } from "../../lib/mermaidLoader";

interface Props {
  code: string;
  className?: string;
}

export function MermaidDiagram({ code, className = "" }: Props) {
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setSvg(null);
    setFailed(false);
    setLoading(true);

    void renderMermaidSvg(code)
      .then((result) => {
        if (!cancelled) setSvg(result);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  if (loading) {
    return (
      <div className={`rounded-lg bg-slate-50 p-6 text-center text-sm text-slate-500 dark:bg-slate-800/50 ${className}`}>
        図を描画中…
      </div>
    );
  }

  if (failed || !svg) {
    return (
      <div className={`rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40 ${className}`}>
        <p className="mb-2 text-sm font-medium text-amber-900 dark:text-amber-200">図の描画に失敗しました</p>
        <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words text-xs text-slate-700 dark:text-slate-300">
          {code}
        </pre>
      </div>
    );
  }

  return (
    <div
      className={`overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/30 ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
