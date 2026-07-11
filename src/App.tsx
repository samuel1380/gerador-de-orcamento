import { useState } from "react";
import type { Orcamento, QuoteStatus } from "@/types";
import { useQuotes } from "@/hooks/useQuotes";
import { useTheme } from "@/hooks/useTheme";
import { Dashboard } from "@/components/Dashboard";
import { QuoteList } from "@/components/QuoteList";
import { QuoteForm, type OrcamentoForm } from "@/components/QuoteForm";
import { CompanyModal } from "@/components/CompanyModal";
import { PwaManager } from "@/components/PwaManager";
import { ToastProvider } from "@/components/Toast";
import {
  AnimatedBackground,
  Button,
  LogoLockup,
  PlusIcon,
  SettingsIcon,
  ThemeToggle,
} from "@/components/ui";

type View =
  | { type: "lista" }
  | { type: "novo" }
  | { type: "editar"; orcamento: Orcamento };

function Shell() {
  const {
    orcamentos,
    company,
    criarOrcamento,
    atualizarOrcamento,
    removerOrcamento,
    salvarCompany,
  } = useQuotes();
  const { theme, toggle } = useTheme();
  const [view, setView] = useState<View>({ type: "lista" });
  const [settingsOpen, setSettingsOpen] = useState(false);

  const salvar = (dados: OrcamentoForm): Orcamento => {
    let result: Orcamento;
    const existente = orcamentos.find((o) => o.id === dados.id);
    if (dados.id && existente) {
      atualizarOrcamento(dados.id, dados);
      // preserva a data de criação original do orçamento
      result = {
        ...dados,
        criadoEm: existente.criadoEm,
        atualizadoEm: new Date().toISOString(),
      } as Orcamento;
    } else {
      result = criarOrcamento(dados);
    }
    setView({ type: "lista" });
    return result;
  };

  const trocarStatus = (id: string, status: QuoteStatus) =>
    atualizarOrcamento(id, { status });

  return (
    <div className="relative flex min-h-screen flex-col">
      <AnimatedBackground />
      <PwaManager hidden={view.type !== "lista"} />

      {/* Cabeçalho — respeita a área segura superior (notch / Dynamic Island / status bar) */}
      <header
        className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70"
        style={{ paddingTop: "var(--sat)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <LogoLockup onClick={() => setView({ type: "lista" })} />
          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} onToggle={toggle} />
            <button
              onClick={() => setSettingsOpen(true)}
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-sky-300 hover:text-sky-500 hover:shadow-md hover:shadow-sky-500/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-sky-400/40"
              aria-label="Configurações da empresa"
              title="Dados da empresa"
            >
              <SettingsIcon className="h-5 w-5" />
            </button>
            <Button onClick={() => setView({ type: "novo" })}>
              <PlusIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Novo Orçamento</span>
              <span className="sm:hidden">Novo</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <div key={view.type} className="animate-fade-up">
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
        </div>
      </main>

      {/* Rodapé — respeita a área segura inferior (home indicator / gestos) */}
      <footer
        className="border-t border-slate-200/70 bg-white/50 py-6 backdrop-blur-sm dark:border-white/10 dark:bg-slate-950/40"
        style={{ paddingBottom: "calc(var(--sab) + 1.5rem)" }}
      >
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {company.nome} · Sistema de Orçamentos
          </p>
          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-600">
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

export default function App() {
  return (
    <ToastProvider>
      <Shell />
    </ToastProvider>
  );
}
