import { useNavigate, useLocation } from "react-router-dom";
import { useDomainStore } from "../stores/domainStore";
import type { Domain } from "../types";

const styles: Record<
  Domain,
  { active: string; inactive: string; label: string; icon: string }
> = {
  english: {
    label: "English",
    icon: "🇬🇧",
    active: "bg-blue-600 text-white",
    inactive: "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
  },
  engineering: {
    label: "Engineering",
    icon: "⚙️",
    active: "bg-emerald-600 text-white",
    inactive: "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
  },
};

function defaultPath(domain: Domain): string {
  return domain === "engineering" ? "/engineering/study" : "/english/library";
}

export function DomainSwitch({ compact = false }: { compact?: boolean }) {
  const domain = useDomainStore((s) => s.domain);
  const setDomain = useDomainStore((s) => s.setDomain);
  const navigate = useNavigate();
  const location = useLocation();

  function switchTo(next: Domain) {
    if (next === domain) return;
    setDomain(next);
    navigate(defaultPath(next));
  }

  return (
    <div
      className={`inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800 ${compact ? "w-full" : ""}`}
      role="tablist"
      aria-label="学習分野"
    >
      {(["english", "engineering"] as const).map((d) => (
        <button
          key={d}
          type="button"
          role="tab"
          aria-selected={domain === d}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${compact ? "flex-1" : ""} ${
            domain === d ? styles[d].active : styles[d].inactive
          }`}
          onClick={() => switchTo(d)}
        >
          <span className="mr-1" aria-hidden>
            {styles[d].icon}
          </span>
          {styles[d].label}
        </button>
      ))}
      {!compact && (
        <span className="sr-only">現在のパス: {location.pathname}</span>
      )}
    </div>
  );
}
