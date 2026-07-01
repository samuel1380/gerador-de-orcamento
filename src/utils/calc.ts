import type { Orcamento, ServiceItem } from "@/types";

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
  const d = new Date(dataIso);
  if (isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + dias);
  return d.toISOString();
}
