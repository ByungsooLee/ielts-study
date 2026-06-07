const CHECK_INTERVAL_MS = 60_000;

export function startVersionCheck(): () => void {
  let currentVersion = "";

  async function check() {
    try {
      const res = await fetch(`/version.json?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { version?: string };
      if (!data.version) return;

      if (!currentVersion) {
        currentVersion = data.version;
        return;
      }

      if (data.version !== currentVersion) {
        window.location.reload();
      }
    } catch {
      // オフライン時は無視
    }
  }

  void check();
  const intervalId = window.setInterval(() => void check(), CHECK_INTERVAL_MS);
  const onFocus = () => void check();
  const onVisible = () => {
    if (document.visibilityState === "visible") void check();
  };

  window.addEventListener("focus", onFocus);
  document.addEventListener("visibilitychange", onVisible);

  return () => {
    window.clearInterval(intervalId);
    window.removeEventListener("focus", onFocus);
    document.removeEventListener("visibilitychange", onVisible);
  };
}
