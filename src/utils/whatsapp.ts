import type { CompanyInfo, Orcamento } from "@/types";
import { calcularTotal } from "./calc";
import { formatCurrency, formatDate } from "./format";

/** Monta um resumo do orçamento para enviar via WhatsApp */
export function montarMensagemWhatsApp(orc: Orcamento): string {
  const total = calcularTotal(orc);
  // ignora itens sem descrição
  const itens = orc.itens.filter((it) => (it.descricao || "").trim() !== "");
  const linhas: string[] = [];
  linhas.push("*ORÇAMENTO*");
  linhas.push(`Nº ${orc.numero}`);
  linhas.push(`Data: ${formatDate(orc.data)}`);
  linhas.push("");
  linhas.push(`*Cliente:* ${orc.cliente.nome}`);
  if (itens.length) {
    linhas.push("");
    linhas.push("*Serviços:*");
    itens.forEach((it, i) => {
      linhas.push(
        `${i + 1}. ${it.descricao} — ${formatCurrency(
          (it.quantidade || 0) * (it.valorUnitario || 0)
        )}`
      );
    });
  } else {
    linhas.push("");
    linhas.push(`*Valor:* ${formatCurrency(total)}`);
  }
  linhas.push("");
  linhas.push(`*Total: ${formatCurrency(total)}*`);
  if (orc.formaPagamento) linhas.push(`Pagamento: ${orc.formaPagamento}`);
  if (orc.garantia) linhas.push(`Garantia: ${orc.garantia}`);
  linhas.push("");
  linhas.push("_Orçamento gerado pela INTECH Desentupidora_");
  return linhas.join("\n");
}

export function abrirWhatsApp(
  orc: Orcamento,
  company: CompanyInfo
): void {
  const texto = encodeURIComponent(montarMensagemWhatsApp(orc));
  let tel = orc.cliente.telefone.replace(/\D/g, "");
  // Telefone brasileiro sem código de país: adiciona o 55 do Brasil
  if (tel && tel.length >= 10 && tel.length <= 11 && !tel.startsWith("55")) {
    tel = "55" + tel;
  }
  const numero = tel ? tel : company.whatsapp.replace(/\D/g, "");
  const url = `https://wa.me/${numero}?text=${texto}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
