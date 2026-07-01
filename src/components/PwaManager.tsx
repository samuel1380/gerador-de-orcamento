import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Registra o service worker e exibe um banner para instalar o app (PWA).
 */
export function PwaManager({ hidden = false }: { hidden?: boolean }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null
  );
  const [fechado, setFechado] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(() => undefined);
      });
    }
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setDeferred(null);
      setFechado(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const instalar = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  if (!deferred || fechado || hidden) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-3">
      <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-slate-900 p-3 text-white shadow-2xl ring-1 ring-white/10">
        <img
          src="/icon-192.png"
          alt="INTECH"
          className="h-10 w-10 rounded-lg"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">Instalar aplicativo</p>
          <p className="truncate text-[11px] text-slate-300">
            Acesse offline e gere orçamentos mais rápido
          </p>
        </div>
        <button
          onClick={instalar}
          className="rounded-lg bg-sky-500 px-3 py-2 text-xs font-bold transition hover:bg-sky-600"
        >
          Instalar
        </button>
        <button
          onClick={() => setFechado(true)}
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10"
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
