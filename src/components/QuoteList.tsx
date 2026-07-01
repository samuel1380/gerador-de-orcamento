import { useMemo, useState } from "react";
import type { CompanyInfo, Orcamento, QuoteStatus } from "@/types";
import { calcularTotal } from "@/utils/calc";
import { formatCurrency, formatDate } from "@/utils/format";
import { abrirWhatsApp } from "@/utils/whatsapp";
import { gerarOrcamentoPDF } from "@/utils/pdf";
import { useToast } from "./Toast";
import {
  Button,
  DocIcon,
  DownloadIcon,
  EditIcon,
  StatusBadge,
  TrashIcon,
  WhatsappIcon,
  inputCls,
} from "./ui";

interface Props {
  orcamentos: Orcamento[];
  company: CompanyInfo;
  onEditar: (o: Orcamento) => void;
  onRemover: (id: string) => void;
  onStatus: (id: string, status: QuoteStatus) => void;
}

const statusOptions: { value: QuoteStatus; label: string }[] = [
  { value: "rascunho", label: "Rascunho" },
  { value: "enviado", label: "Enviado" },
  { value: "aprovado", label: "Aprovado" },
  { value: "recusado", label: "Recusado" },
  { value: "concluido", label: "Concluído" },
];

export function QuoteList({
  orcamentos,
  company,
  onEditar,
  onRemover,
  onStatus,
}: Props) {
  const [busca, setBusca] = useState("");
  const { push } = useToast();

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return orcamentos;
    return orcamentos.filter(
      (o) =>
        o.cliente.nome.toLowerCase().includes(q) ||
        o.numero.toLowerCase().includes(q) ||
        o.cliente.telefone.includes(q)
    );
  }, [busca, orcamentos]);

  const baixarPDF = (o: Orcamento) => {
    gerarOrcamentoPDF(o, company, "salvar");
    push(`PDF do orçamento ${o.numero} baixado`, "success");
  };

  const enviarWhats = (o: Orcamento) => {
    abrirWhatsApp(o, company);
    push("Abrindo WhatsApp...", "info");
  };

  const trocarStatus = (o: Orcamento, status: QuoteStatus) => {
    onStatus(o.id, status);
    push(`Status atualizado para "${status}"`, "success");
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Orçamentos
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {orcamentos.length} orçamento{orcamentos.length !== 1 ? "s" : ""}{" "}
            cadastrado{orcamentos.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Busca */}
      <div className="relative mb-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          className={inputCls + " pl-10"}
          placeholder="Buscar por cliente, número ou telefone..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        {busca && (
          <button
            onClick={() => setBusca("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Limpar busca"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" className="h-4 w-4">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {filtrados.length === 0 ? (
        <EmptyState temDados={orcamentos.length > 0} />
      ) : (
        <div className="grid gap-3">
          {filtrados.map((o, i) => {
            const total = calcularTotal(o);
            return (
              <div
                key={o.id}
                className="group animate-fade-up overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm shadow-slate-900/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/60 hover:shadow-lg hover:shadow-sky-500/5 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-sky-400/30"
                style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
              >
                {/* faixa de cor lateral */}
                <div className="flex">
                  <div className="w-1.5 shrink-0 bg-gradient-to-b from-sky-500 to-cyan-400 transition-all duration-300 group-hover:w-2" />
                  <div className="min-w-0 flex-1 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                            {o.cliente.nome || "Sem nome"}
                          </h3>
                          <StatusBadge status={o.status} />
                        </div>
                        <p className="mt-0.5 truncate text-xs text-slate-400 dark:text-slate-500">
                          Nº {o.numero} · {formatDate(o.data)}
                          {o.cliente.telefone ? ` · ${o.cliente.telefone}` : ""}
                        </p>
                      </div>
                      <div className="min-w-0 text-right">
                        <p className="whitespace-nowrap bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-base font-extrabold text-transparent dark:from-sky-400 dark:to-cyan-300 sm:text-lg">
                          {formatCurrency(total)}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                          {o.itens.length} serviço{o.itens.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3 dark:border-white/10 sm:flex-row sm:flex-wrap sm:items-center">
                      <select
                        className="h-9 w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 sm:w-auto"
                        value={o.status}
                        onChange={(e) => trocarStatus(o, e.target.value as QuoteStatus)}
                      >
                        {statusOptions.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>

                      <div className="flex flex-wrap items-center gap-1.5 sm:ml-auto">
                        <Button
                          size="sm"
                          variant="primary"
                          className="flex-1 sm:flex-none"
                          onClick={() => baixarPDF(o)}
                        >
                          <DownloadIcon className="h-4 w-4" /> PDF
                        </Button>
                        <Button
                          size="sm"
                          variant="whatsapp"
                          className="flex-1 sm:flex-none"
                          onClick={() => enviarWhats(o)}
                        >
                          <WhatsappIcon className="h-4 w-4" />
                          <span className="sm:hidden">WhatsApp</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="flex-1 sm:flex-none"
                          onClick={() => onEditar(o)}
                        >
                          <EditIcon className="h-4 w-4" /> Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (
                              confirm(
                                `Excluir o orçamento ${o.numero} de ${o.cliente.nome}?`
                              )
                            ) {
                              onRemover(o.id);
                              push("Orçamento excluído", "info");
                            }
                          }}
                          className="!px-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState({ temDados }: { temDados: boolean }) {
  return (
    <div className="animate-fade-up flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 py-16 text-center backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.02]">
      <div className="animate-float mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-100 text-sky-500 dark:from-sky-500/20 dark:to-cyan-500/20 dark:text-sky-300">
        <DocIcon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
        {temDados ? "Nenhum resultado" : "Nenhum orçamento ainda"}
      </h3>
      <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
        {temDados
          ? "Tente outro termo de busca."
          : "Clique em “Novo Orçamento” para gerar seu primeiro orçamento em PDF."}
      </p>
    </div>
  );
}
