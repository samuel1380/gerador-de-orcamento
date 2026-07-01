import { useMemo } from "react";
import type { Orcamento } from "@/types";
import { calcularTotal } from "@/utils/calc";
import { formatCurrency } from "@/utils/format";

export function Dashboard({ orcamentos }: { orcamentos: Orcamento[] }) {
  const stats = useMemo(() => {
    const totalValor = orcamentos.reduce((s, o) => s + calcularTotal(o), 0);
    const aprovados = orcamentos.filter((o) => o.status === "aprovado");
    const concluidos = orcamentos.filter((o) => o.status === "concluido");
    const aprovadosValor = aprovados.reduce((s, o) => s + calcularTotal(o), 0);

    const agora = new Date();
    const doMes = orcamentos.filter((o) => {
      const d = new Date(o.data);
      return (
        d.getMonth() === agora.getMonth() &&
        d.getFullYear() === agora.getFullYear()
      );
    });
    const valorMes = doMes.reduce((s, o) => s + calcularTotal(o), 0);

    return {
      total: orcamentos.length,
      totalValor,
      aprovados: aprovados.length + concluidos.length,
      aprovadosValor,
      doMes: doMes.length,
      valorMes,
    };
  }, [orcamentos]);

  const cards = [
    {
      label: "Total orçado",
      value: formatCurrency(stats.totalValor),
      sub: `${stats.total} orçamentos`,
      grad: "from-sky-600 to-cyan-500",
    },
    {
      label: "Aprovados / Concluídos",
      value: formatCurrency(stats.aprovadosValor),
      sub: `${stats.aprovados} fechados`,
      grad: "from-emerald-600 to-teal-500",
    },
    {
      label: "Este mês",
      value: formatCurrency(stats.valorMes),
      sub: `${stats.doMes} novos`,
      grad: "from-violet-600 to-indigo-500",
    },
    {
      label: "Em aberto",
      value: formatCurrency(stats.totalValor - stats.aprovadosValor),
      sub: "rascunhos e enviados",
      grad: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`min-w-0 overflow-hidden rounded-2xl bg-gradient-to-br ${c.grad} p-4 text-white shadow-sm`}
        >
          <p className="text-[11px] font-medium uppercase tracking-wide text-white/80">
            {c.label}
          </p>
          <p className="mt-1 truncate text-lg font-extrabold leading-tight sm:text-xl">
            {c.value}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-white/70">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
