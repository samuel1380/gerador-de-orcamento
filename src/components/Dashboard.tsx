import { useMemo } from "react";
import type { Orcamento } from "@/types";
import { calcularTotal } from "@/utils/calc";
import { formatCurrency, parseLocalDate } from "@/utils/format";
import { AnimatedNumber } from "./ui";

export function Dashboard({ orcamentos }: { orcamentos: Orcamento[] }) {
  const stats = useMemo(() => {
    const totalValor = orcamentos.reduce((s, o) => s + calcularTotal(o), 0);
    const aprovados = orcamentos.filter(
      (o) => o.status === "aprovado" || o.status === "concluido"
    );
    const aprovadosValor = aprovados.reduce((s, o) => s + calcularTotal(o), 0);

    const agora = new Date();
    const doMes = orcamentos.filter((o) => {
      const d = parseLocalDate(o.data);
      if (isNaN(d.getTime())) return false;
      return (
        d.getMonth() === agora.getMonth() &&
        d.getFullYear() === agora.getFullYear()
      );
    });
    const valorMes = doMes.reduce((s, o) => s + calcularTotal(o), 0);

    return {
      total: orcamentos.length,
      totalValor,
      aprovados: aprovados.length,
      aprovadosValor,
      doMes: doMes.length,
      valorMes,
      emAberto: Math.max(0, totalValor - aprovadosValor),
    };
  }, [orcamentos]);

  const cards = [
    {
      label: "Total orçado",
      value: stats.totalValor,
      sub: `${stats.total} orçamento${stats.total !== 1 ? "s" : ""}`,
      grad: "from-sky-600 via-sky-500 to-cyan-400",
      glow: "group-hover:shadow-sky-500/40",
      icon: "📊",
    },
    {
      label: "Aprovados",
      value: stats.aprovadosValor,
      sub: `${stats.aprovados} fechado${stats.aprovados !== 1 ? "s" : ""}`,
      grad: "from-emerald-600 via-emerald-500 to-teal-400",
      glow: "group-hover:shadow-emerald-500/40",
      icon: "✅",
    },
    {
      label: "Este mês",
      value: stats.valorMes,
      sub: `${stats.doMes} novo${stats.doMes !== 1 ? "s" : ""}`,
      grad: "from-violet-600 via-violet-500 to-indigo-400",
      glow: "group-hover:shadow-violet-500/40",
      icon: "📅",
    },
    {
      label: "Em aberto",
      value: stats.emAberto,
      sub: "rascunhos e enviados",
      grad: "from-amber-500 via-orange-500 to-rose-400",
      glow: "group-hover:shadow-orange-500/40",
      icon: "⏳",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c, i) => (
        <div
          key={c.label}
          className={`group relative animate-fade-up overflow-hidden rounded-2xl bg-gradient-to-br ${c.grad} p-4 text-white shadow-lg shadow-slate-900/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${c.glow}`}
          style={{ animationDelay: `${i * 90}ms` }}
        >
          {/* brilho diagonal */}
          <span className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/20 blur-xl transition-transform duration-500 group-hover:scale-150" />
          <div className="relative">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/85">
                {c.label}
              </p>
              <span className="text-base opacity-80">{c.icon}</span>
            </div>
            <p className="truncate text-lg font-extrabold leading-tight drop-shadow-sm sm:text-2xl">
              <AnimatedNumber value={c.value} format={formatCurrency} />
            </p>
            <p className="mt-1 truncate text-[11px] text-white/75">{c.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
