import { useState } from "react";
import type { Orcamento, QuoteStatus } from "@/types";
import { useQuotes } from "@/hooks/useQuotes";
import { Dashboard } from "@/components/Dashboard";
import { QuoteList } from "@/components/QuoteList";
import { QuoteForm, type OrcamentoForm } from "@/components/QuoteForm";
import { CompanyModal } from "@/components/CompanyModal";
import { PwaManager } from "@/components/PwaManager";
import { Button, LogoLockup, PlusIcon, SettingsIcon } from "@/components/ui";

type View = { type: "lista" } | { type: "novo" } | { type: "editar"; orcamento: Orcamento };

export default function App() {
  const {
    orcamentos,
    company,
    criarOrcamento,
    atualizarOrcamento,
    removerOrcamento,
    salvarCompany,
  } = useQuotes();
  const [view, setView] = useState<View>({ type: "lista" });
  const [settingsOpen, setSettingsOpen] = useState(false);

  const salvar = (dados: OrcamentoForm): Orcamento => {
    let result: Orcamento;
    if (dados.id && orcamentos.some((o) => o.id === dados.id)) {
      atualizarOrcamento(dados.id, dados);
      result = { ...dados, criadoEm: "", atualizadoEm: "" } as Orcamento;
    } else {
      result = criarOrcamento(dados);
    }
    setView({ type: "lista" });
    return result;
  };

  const trocarStatus = (id: string, status: QuoteStatus) =>
    atualizarOrcamento(id, { status });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <PwaManager hidden={view.type !== "lista"} />

      {/* Cabeçalho */}
      <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <LogoLockup />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSettingsOpen(true)}
              className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Configurações da empresa"
              title="Dados da empresa"
            >
              <SettingsIcon className="h-5 w-5" />
            </button>
            <Button onClick={() => setView({ type: "novo" })} className="shadow-sm">
              <PlusIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Novo Orçamento</span>
              <span className="sm:hidden">Novo</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        {view.type === "lista" ? (
          <div className="space-y-6">
            <Dashboard orcamentos={orcamentos} />
            <QuoteList
              orcamentos={orcamentos}
              company={company}
              onEditar={(o) => setView({ type: "editar", orcamento: o })}
              onRemover={removerOrcamento}
              onStatus={trocarStatus}
            />
          </div>
        ) : (
          <QuoteForm
            inicial={view.type === "editar" ? view.orcamento : null}
            company={company}
            onSalvar={salvar}
            onCancelar={() => setView({ type: "lista" })}
          />
        )}
      </main>

      {/* Rodapé */}
      <footer className="border-t border-slate-100 bg-white/60 py-6">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-xs text-slate-400">
            {company.nome} · Sistema de Orçamentos
          </p>
          <p className="mt-1 text-[11px] text-slate-300">
            Funciona offline · Dados salvos neste dispositivo · PWA
          </p>
        </div>
      </footer>

      <CompanyModal
        open={settingsOpen}
        company={company}
        onClose={() => setSettingsOpen(false)}
        onSalvar={salvarCompany}
      />
    </div>
  );
}
