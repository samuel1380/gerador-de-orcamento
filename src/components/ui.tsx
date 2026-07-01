import { type ReactNode, type ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import type { QuoteStatus } from "@/types";

/* ---------------- Logo ---------------- */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="relative flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-700 to-cyan-500 shadow-lg shadow-sky-200"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="text-white"
          style={{ width: size * 0.6, height: size * 0.6 }}
        >
          <path
            d="M12 2.5c3.8 4.3 6 7.6 6 10.6A6 6 0 0 1 6 13.1c0-3 2.2-6.3 6-10.6Z"
            fill="currentColor"
            opacity="0.95"
          />
          <path
            d="M12 8.5c1.4 1.9 2.3 3.4 2.3 4.6A2.3 2.3 0 0 1 9.7 13c0-1.2.9-2.7 2.3-4.6Z"
            fill="#0c4a6e"
            opacity="0.5"
          />
        </svg>
      </div>
    </div>
  );
}

export function LogoLockup() {
  return (
    <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
      <Logo size={40} />
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm font-extrabold tracking-tight text-slate-900 sm:text-base">
          INTECH <span className="text-sky-600">DESENTUPIDORA</span>
        </p>
        <p className="hidden text-[11px] font-medium text-slate-400 sm:block">
          Gerador de Orçamentos
        </p>
      </div>
    </div>
  );
}

/* ---------------- Button ---------------- */
type BtnVariant = "primary" | "secondary" | "ghost" | "danger" | "success";
type BtnSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: BtnSize;
  children: ReactNode;
}

const variantCls: Record<BtnVariant, string> = {
  primary:
    "bg-sky-600 text-white hover:bg-sky-700 shadow-sm shadow-sky-200 focus-visible:ring-sky-400",
  secondary:
    "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus-visible:ring-slate-300",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-300",
  danger:
    "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 focus-visible:ring-red-300",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200 focus-visible:ring-emerald-400",
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
        "inline-flex items-center justify-center font-semibold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none select-none",
        variantCls[variant],
        sizeCls[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ---------------- Icon ---------------- */
type IconProps = { className?: string };
export const PlusIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const TrashIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" />
  </svg>
);
export const DownloadIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </svg>
);
export const WhatsappIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.02c-.24.68-1.4 1.3-1.94 1.34-.5.04-1.13.2-3.66-.77-3.08-1.21-5.04-4.36-5.19-4.56-.15-.2-1.24-1.65-1.24-3.15 0-1.5.79-2.24 1.07-2.54.27-.3.6-.38.8-.38l.57.01c.18.01.43-.07.67.51.24.6.83 2.07.9 2.22.07.15.12.33.02.53-.1.2-.15.32-.3.5-.15.17-.31.39-.45.52-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12 1 2.07 1.31 2.36 1.46.3.15.47.13.64-.08.18-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.71.81 2 .96.3.15.5.22.57.35.07.12.07.72-.17 1.4Z" />
  </svg>
);
export const EyeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
export const EditIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" />
  </svg>
);
export const SettingsIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </svg>
);
export const CloseIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" className={className}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
export const DocIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M9 13h6M9 17h6M9 9h1" />
  </svg>
);
export const CheckIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/* ---------------- Status Badge ---------------- */
const statusConfig: Record<QuoteStatus, { label: string; cls: string }> = {
  rascunho: { label: "Rascunho", cls: "bg-slate-100 text-slate-600" },
  enviado: { label: "Enviado", cls: "bg-amber-100 text-amber-700" },
  aprovado: { label: "Aprovado", cls: "bg-emerald-100 text-emerald-700" },
  recusado: { label: "Recusado", cls: "bg-red-100 text-red-700" },
  concluido: { label: "Concluído", cls: "bg-sky-100 text-sky-700" },
};

export function StatusBadge({ status }: { status: QuoteStatus }) {
  const c = statusConfig[status] ?? statusConfig.rascunho;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        c.cls
      )}
    >
      {c.label}
    </span>
  );
}

/* ---------------- Form fields ---------------- */
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
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-slate-400">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100";

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
  if (!open) return null;
  const w = size === "md" ? "max-w-lg" : size === "xl" ? "max-w-4xl" : "max-w-2xl";
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        className={cn(
          "flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl",
          w
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
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
