import { useMemo, useState } from "react";
import type { CompanyInfo, Orcamento, QuoteStatus } from "@/types";
import { calcularTotal } from "@/utils/calc";
import { formatCurrency, formatDate } from "@/utils/format";
import { abrirWhatsApp } from "@/utils/whatsapp";
import { gerarOrcamentoPDF } from "@/utils/pdf";
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

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Orçamentos</h2>
          <p className="text-sm text-slate-500">
            {orcamentos.length} orçamento{orcamentos.length !== 1 ? "s" : ""}{" "}
            cadastrado{orcamentos.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <input
        className={inputCls + " mb-4"}
        placeholder="🔍 Buscar por cliente, número ou telefone..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {filtrados.length === 0 ? (
        <EmptyState temDados={orcamentos.length > 0} />
      ) : (
        <div className="grid gap-3">
          {filtrados.map((o) => {
            const total = calcularTotal(o);
            return (
              <div
                key={o.id}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-base font-bold text-slate-900">
                        {o.cliente.nome || "Sem nome"}
                      </h3>
                      <StatusBadge status={o.status} />
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Nº {o.numero} · {formatDate(o.data)}
                      {o.cliente.telefone ? ` · ${o.cliente.telefone}` : ""}
                    </p>
                  </div>
                  <div className="min-w-0 text-right">
                    <p className="whitespace-nowrap text-base font-extrabold text-slate-900 sm:text-lg">
                      {formatCurrency(total)}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {o.itens.length} serviço{o.itens.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <select
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 focus:border-sky-400 focus:outline-none sm:w-auto"
                    value={o.status}
                    onChange={(e) =>
                      onStatus(o.id, e.target.value as QuoteStatus)
                    }
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
                      onClick={() => gerarOrcamentoPDF(o, company, "salvar")}
                    >
                      <DownloadIcon className="h-4 w-4" /> PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => abrirWhatsApp(o, company)}
                    >
                      <WhatsappIcon className="h-4 w-4" />
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
                        )
                          onRemover(o.id);
                      }}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50">
        <DocIcon className="h-8 w-8 text-sky-500" />
      </div>
      <h3 className="text-lg font-bold text-slate-800">
        {temDados ? "Nenhum resultado" : "Nenhum orçamento ainda"}
      </h3>
      <p className="mt-1 max-w-xs text-sm text-slate-500">
        {temDados
          ? "Tente outro termo de busca."
          : "Clique em “Novo Orçamento” para gerar seu primeiro orçamento em PDF."}
      </p>
    </div>
  );
}
