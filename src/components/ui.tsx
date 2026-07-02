import {
  type ButtonHTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/utils/cn";
import { useCountUp } from "@/hooks/useCountUp";
import type { QuoteStatus } from "@/types";

/* =========================================================
   LOGO
========================================================= */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-lg shadow-sky-500/30"
      style={{ width: size, height: size }}
    >
      <img
        src="/logo.png"
        alt="INTECH Logo"
        className="h-full w-full object-contain"
      />
    </div>
  );
}

export function LogoLockup({ onClick }: { onClick?: () => void }) {
  const content = (
    <>
      <div className="animate-fade-in">
        <Logo size={40} />
      </div>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-base">
          INTECH{" "}
          <span className="bg-gradient-to-r from-sky-500 to-cyan-400 bg-clip-text text-transparent">
            DESENTUPIDORA
          </span>
        </p>
        <p className="hidden text-[11px] font-medium text-slate-400 dark:text-slate-500 sm:block">
          Gerador de Orçamentos
        </p>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="flex min-w-0 items-center gap-2.5 rounded-xl py-1 transition active:scale-95 sm:gap-3 sm:pr-2"
        title="Voltar ao início"
      >
        {content}
      </button>
    );
  }
  return (
    <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">{content}</div>
  );
}

/* =========================================================
   THEME TOGGLE
========================================================= */
export function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: "light" | "dark";
  onToggle: () => void;
}) {
  const isDark = theme === "dark";
  return (
    <button
      onClick={onToggle}
      aria-label="Alternar tema"
      title={isDark ? "Modo claro" : "Modo escuro"}
      className="group relative h-10 w-10 overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:border-sky-300 hover:text-sky-500 hover:shadow-md hover:shadow-sky-500/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-sky-400/40"
    >
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-500",
          isDark
            ? "translate-y-[-120%] rotate-90 opacity-0"
            : "translate-y-0 rotate-0 opacity-100"
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      </span>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-500",
          isDark
            ? "translate-y-0 rotate-0 opacity-100"
            : "translate-y-[120%] -rotate-90 opacity-0"
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      </span>
    </button>
  );
}

/* =========================================================
   ANIMATED BACKGROUND
========================================================= */
export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-black" />
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-sky-400/25 blur-3xl animate-blob dark:bg-sky-600/20" />
      <div
        className="absolute -right-24 top-1/4 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl animate-blob dark:bg-cyan-500/15"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl animate-blob dark:bg-indigo-600/15"
        style={{ animationDelay: "-12s" }}
      />
      {/* Grade sutil */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:42px_42px] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
    </div>
  );
}

/* =========================================================
   ANIMATED NUMBER
========================================================= */
export function AnimatedNumber({
  value,
  format,
}: {
  value: number;
  format: (n: number) => string;
}) {
  const v = useCountUp(value);
  return <span>{format(v)}</span>;
}

/* =========================================================
   BUTTON
========================================================= */
type BtnVariant = "primary" | "secondary" | "ghost" | "danger" | "success" | "whatsapp";
type BtnSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: BtnSize;
  children: ReactNode;
}

const variantCls: Record<BtnVariant, string> = {
  primary:
    "bg-gradient-to-br from-sky-600 to-sky-500 text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:brightness-110 focus-visible:ring-sky-400",
  secondary:
    "bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-slate-300 dark:bg-white/5 dark:text-slate-200 dark:border-white/10 dark:hover:bg-white/10",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-300 dark:text-slate-300 dark:hover:bg-white/10",
  danger:
    "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 focus-visible:ring-red-300 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 dark:hover:bg-red-500/20",
  success:
    "bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:brightness-110 focus-visible:ring-emerald-400",
  whatsapp:
    "bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white shadow-lg shadow-emerald-500/25 hover:brightness-105 focus-visible:ring-emerald-400",
};

const sizeCls: Record<BtnSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-base gap-2 rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden font-semibold transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent disabled:opacity-50 disabled:pointer-events-none select-none dark:ring-offset-slate-950",
        variantCls[variant],
        sizeCls[size],
        className
      )}
      {...props}
    >
      {/* Brilho no hover */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

/* =========================================================
   ICONS
========================================================= */
type IconProps = { className?: string };
const base = "stroke-current";
export const PlusIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.4} strokeLinecap="round" className={cn(base, className)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const TrashIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" />
  </svg>
);
export const DownloadIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </svg>
);
export const WhatsappIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.02c-.24.68-1.4 1.3-1.94 1.34-.5.04-1.13.2-3.66-.77-3.08-1.21-5.04-4.36-5.19-4.56-.15-.2-1.24-1.65-1.24-3.15 0-1.5.79-2.24 1.07-2.54.27-.3.6-.38.8-.38l.57.01c.18.01.43-.07.67.51.24.6.83 2.07.9 2.22.07.15.12.33.02.53-.1.2-.15.32-.3.5-.15.17-.31.39-.45.52-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12 1 2.07 1.31 2.36 1.46.3.15.47.13.64-.08.18-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.71.81 2 .96.3.15.5.22.57.35.07.12.07.72-.17 1.4Z" />
  </svg>
);
export const EyeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
export const EditIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" />
  </svg>
);
export const SettingsIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </svg>
);
export const CloseIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.2} strokeLinecap="round" className={cn(base, className)}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
export const DocIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M9 13h6M9 17h6M9 9h1" />
  </svg>
);
export const CheckIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
export const SparkIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2l1.8 5.6L19.5 9l-5.7 1.4L12 16l-1.8-5.6L4.5 9l5.7-1.4z" />
  </svg>
);

/* =========================================================
   STATUS BADGE
========================================================= */
const statusConfig: Record<QuoteStatus, { label: string; cls: string; dot: string }> = {
  rascunho: { label: "Rascunho", cls: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300", dot: "bg-slate-400" },
  enviado: { label: "Enviado", cls: "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300", dot: "bg-amber-500" },
  aprovado: { label: "Aprovado", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300", dot: "bg-emerald-500" },
  recusado: { label: "Recusado", cls: "bg-red-100 text-red-700 dark:bg-red-400/15 dark:text-red-300", dot: "bg-red-500" },
  concluido: { label: "Concluído", cls: "bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300", dot: "bg-sky-500" },
};

export function StatusBadge({ status }: { status: QuoteStatus }) {
  const c = statusConfig[status] ?? statusConfig.rascunho;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        c.cls
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  );
}

/* =========================================================
   FORM FIELDS
========================================================= */
export const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[16px] leading-none text-slate-800 placeholder:text-slate-400 transition-all duration-200 hover:border-slate-300 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-500/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-white/20 dark:focus:border-sky-400/60 dark:focus:ring-sky-400/10";

export function Field({
  label,
  children,
  hint,
  className,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-slate-400">{hint}</span>}
    </label>
  );
}

/* =========================================================
   CARD
========================================================= */
export function Card({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <section
      className={cn(
        "animate-fade-up rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm shadow-slate-900/5 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-black/20",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </section>
  );
}

/* =========================================================
   MODAL
========================================================= */
export function Modal({
  open,
  onClose,
  title,
  children,
  size = "lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "md" | "lg" | "xl";
}) {
  const [render, setRender] = useState(open);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (open) {
      setRender(true);
    } else if (timer.current === undefined) {
      timer.current = window.setTimeout(() => setRender(false), 200);
    }
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = undefined;
      }
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!render) return null;
  const w = size === "md" ? "max-w-lg" : size === "xl" ? "max-w-4xl" : "max-w-2xl";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-md sm:items-center sm:p-4">
      <div
        className={cn(
          "absolute inset-0",
          open ? "animate-fade-in" : "opacity-0 transition-opacity duration-200"
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "relative flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl ring-1 ring-slate-900/5 sm:rounded-3xl dark:bg-slate-900 dark:ring-white/10",
          w,
          open ? "animate-sheet-up sm:animate-scale-in" : ""
        )}
      >
        <div className="relative flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/10">
          <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
            aria-label="Fechar"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
