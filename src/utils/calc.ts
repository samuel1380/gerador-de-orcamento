import type { Orcamento, ServiceItem } from "@/types";
import { parseLocalDate } from "./format";

export function itemTotal(item: ServiceItem): number {
  return (Number(item.quantidade) || 0) * (Number(item.valorUnitario) || 0);
}

export function calcularSubtotal(itens: ServiceItem[]): number {
  return itens.reduce((sum, i) => sum + itemTotal(i), 0);
}

export function calcularTotal(orcamento: Pick<Orcamento, "itens" | "desconto">): number {
  return Math.max(0, calcularSubtotal(orcamento.itens) - (Number(orcamento.desconto) || 0));
}

export function calcularValidade(dataIso: string, dias: number): string {
  if (!dataIso) return "";
  const d = parseLocalDate(dataIso);
  if (isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + dias);
  // devolve no formato YYYY-MM-DD para formatDate tratar como local
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
