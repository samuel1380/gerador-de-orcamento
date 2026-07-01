import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/utils/cn";

type ToastType = "success" | "info" | "error";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  closing?: boolean;
}

interface ToastCtx {
  push: (message: string, type?: ToastType) => void;
}

const Ctx = createContext<ToastCtx>({ push: () => {} });

export function useToast(): ToastCtx {
  return useContext(Ctx);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((list) => list.map((t) => (t.id === id ? { ...t, closing: true } : t)));
    setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const push = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = Date.now() + Math.random();
      setToasts((list) => [...list, { id, message, type }]);
      setTimeout(() => remove(id), 3200);
    },
    [remove]
  );

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-3 sm:bottom-6 sm:right-6 sm:left-auto sm:items-end sm:px-0">
        {toasts.map((t) => (
          <ToastView key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </Ctx.Provider>
  );
}

const config: Record<
  ToastType,
  { icon: string; ring: string; bar: string; text: string }
> = {
  success: {
    icon: "✓",
    ring: "ring-emerald-500/30",
    bar: "from-emerald-500 to-teal-400",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  info: {
    icon: "i",
    ring: "ring-sky-500/30",
    bar: "from-sky-500 to-cyan-400",
    text: "text-sky-600 dark:text-sky-400",
  },
  error: {
    icon: "✕",
    ring: "ring-red-500/30",
    bar: "from-red-500 to-rose-400",
    text: "text-red-600 dark:text-red-400",
  },
};

function ToastView({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const c = config[toast.type];
  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-center gap-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-3 pr-4 shadow-xl shadow-slate-900/10 ring-1 backdrop-blur-xl dark:border-white/10 dark:bg-slate-800/90 dark:shadow-black/40",
        c.ring,
        toast.closing ? "animate-toast-out" : "animate-toast-in"
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold text-white",
          c.bar
        )}
      >
        {toast.type === "info" ? "ℹ" : c.icon}
      </div>
      <p className="min-w-0 flex-1 text-sm font-medium text-slate-700 dark:text-slate-200">
        {toast.message}
      </p>
      <button
        onClick={onClose}
        className="shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-slate-200"
        aria-label="Fechar"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" className="h-4 w-4">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
