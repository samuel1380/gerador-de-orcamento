import { useMemo, useState } from "react";
import { servicosCategorizados } from "@/data/company";
import { Modal, inputCls } from "./ui";

interface Props {
  onPick: (descricao: string) => void;
}

/**
 * Seletor de serviços em uma "caixinha".
 * Abre um modal com busca e serviços agrupados por categoria.
 */
export function ServicePicker({ onPick }: Props) {
  const [open, setOpen] = useState(false);
  const [busca, setBusca] = useState("");

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return servicosCategorizados;
    return servicosCategorizados
      .map((cat) => ({
        ...cat,
        servicos: cat.servicos.filter((s) => s.toLowerCase().includes(q)),
      }))
      .filter((cat) => cat.servicos.length > 0);
  }, [busca]);

  const escolher = (descricao: string) => {
    onPick(descricao);
    setBusca("");
    setOpen(false);
  };

  const fechar = () => {
    setBusca("");
    setOpen(false);
  };

  return (
    <>
      {/* Caixinha para abrir o seletor */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group mb-4 flex w-full items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-sky-300 bg-sky-50/60 px-4 py-3.5 text-sm font-semibold text-sky-700 transition-all hover:border-sky-400 hover:bg-sky-50 active:scale-[0.99] dark:border-sky-400/30 dark:bg-sky-500/5 dark:text-sky-300 dark:hover:border-sky-400/50 dark:hover:bg-sky-500/10"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 transition-transform group-hover:scale-110">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        Selecionar serviço
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Adicionar serviço"
        size="md"
      >
        {/* Busca */}
        <div className="relative mb-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            autoFocus
            className={inputCls + " pl-10"}
            placeholder="Buscar serviço..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* Lista de serviços */}
        <div className="-mr-1 max-h-[55vh] space-y-4 overflow-y-auto pr-1">
          {filtrados.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              Nenhum serviço encontrado.
            </div>
          ) : (
            filtrados.map((cat) => (
              <div key={cat.categoria}>
                <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <span>{cat.emoji}</span> {cat.categoria}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.servicos.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => escolher(s)}
                      className="animate-fade-in rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-sky-400/40 dark:hover:bg-sky-500/10 dark:hover:text-sky-300"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}

          {/* Opção de digitar manualmente */}
          <button
            type="button"
            onClick={fechar}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 py-2.5 text-xs font-semibold text-slate-500 transition hover:border-sky-300 hover:text-sky-600 dark:border-white/10 dark:text-slate-400 dark:hover:border-sky-400/40"
          >
            ✏️ Digitar serviço personalizado
          </button>
        </div>
      </Modal>
    </>
  );
}
