import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { CompanyInfo, Orcamento } from "@/types";
import { calcularSubtotal, calcularTotal, calcularValidade } from "./calc";
import { formatCurrency, formatDate, formatNumber } from "./format";

type RGB = [number, number, number];

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 14;
const CONTENT_W = PAGE_W - MARGIN * 2;
const BOTTOM_LIMIT = PAGE_H - 18; // reserva do rodapé

function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full || "0c4a6e", 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Desenha um texto quebrando em várias linhas para caber na largura. */
function drawWrapped(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight = 4.2
): number {
  const lines = doc.splitTextToSize(text || "", maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

/** Reduz o tamanho da fonte até o texto caber em uma linha (com limite mínimo). */
function fitText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  maxSize: number,
  minSize: number
): void {
  let size = maxSize;
  doc.setFontSize(size);
  while (size > minSize && doc.getTextWidth(text) > maxWidth) {
    size -= 0.5;
    doc.setFontSize(size);
  }
  doc.text(text, x, y);
}

/** Trunca texto longo com reticências para caber em uma linha. */
function ellipsize(doc: jsPDF, text: string, maxWidth: string | number): string {
  const w = typeof maxWidth === "string" ? parseFloat(maxWidth) : maxWidth;
  if (doc.getTextWidth(text) <= w) return text;
  let t = text;
  while (t.length > 1 && doc.getTextWidth(t + "…") > w) t = t.slice(0, -1);
  return t + "…";
}

/** Garante espaço suficiente; adiciona página se necessário. */
function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > BOTTOM_LIMIT) {
    doc.addPage();
    return 20;
  }
  return y;
}

export function gerarOrcamentoPDF(
  orc: Orcamento,
  company: CompanyInfo,
  acao: "salvar" | "abrir" = "salvar"
): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const primary = hexToRgb(company.corPrimaria);
  const light: RGB = [
    Math.min(255, primary[0] + 232),
    Math.min(255, primary[1] + 232),
    Math.min(255, primary[2] + 232),
  ];
  const gray: RGB = [110, 116, 130];
  const dark: RGB = [45, 49, 58];
  const lineCol: RGB = [226, 232, 240];

  const setFill = (c: RGB) => doc.setFillColor(c[0], c[1], c[2]);
  const setTextCol = (c: RGB) => doc.setTextColor(c[0], c[1], c[2]);
  const setDraw = (c: RGB) => doc.setDrawColor(c[0], c[1], c[2]);

  /* ============================================================
     CABEÇALHO
  ============================================================ */
  setFill(primary);
  doc.rect(0, 0, PAGE_W, 36, "F");

  // Logo (monograma em círculo branco)
  setFill([255, 255, 255]);
  doc.circle(MARGIN + 9, 18, 9.5, "F");
  setTextCol(primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("IN", MARGIN + 9, 20.5, { align: "center" });

  // Caixa "ORÇAMENTO" à direita (desenhada primeiro p/ calcular largura do nome)
  const boxW = 52;
  const boxX = PAGE_W - MARGIN - boxW;
  setFill([255, 255, 255]);
  doc.roundedRect(boxX, 6, boxW, 24, 2.5, 2.5, "F");
  setTextCol(primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("ORÇAMENTO", boxX + boxW / 2, 13.5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setTextCol(dark);
  doc.text(`Nº ${orc.numero}`, boxX + 4, 19);
  doc.text(`Emissão: ${formatDate(orc.data)}`, boxX + 4, 23.5);
  doc.text(
    `Válido até: ${formatDate(calcularValidade(orc.data, orc.validade))}`,
    boxX + 4,
    28
  );

  // Dados da empresa (largura limitada para nunca sobrepor a caixa)
  const empX = MARGIN + 23;
  const empMaxW = boxX - empX - 4;

  setTextCol([255, 255, 255]);
  doc.setFont("helvetica", "bold");
  fitText(doc, company.nome, empX, 14, empMaxW, 17, 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setTextCol([214, 232, 244]);
  doc.text(ellipsize(doc, company.slogan, empMaxW), empX, 19.5);
  doc.setFontSize(7.5);
  doc.text(ellipsize(doc, `CNPJ: ${company.cnpj}`, empMaxW), empX, 24);
  doc.text(
    ellipsize(doc, `${company.endereco} - ${company.cidade}`, empMaxW),
    empX,
    28.5
  );

  let y = 44;

  /* ============================================================
     DADOS DO CLIENTE (caixa organizada em grade)
  ============================================================ */
  setFill(primary);
  doc.rect(MARGIN, y, CONTENT_W, 6.5, "F");
  setTextCol([255, 255, 255]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("DADOS DO CLIENTE", MARGIN + 3, y + 4.4);
  y += 9;

  const cli = orc.cliente;
  interface Cell {
    label: string;
    value: string;
    size?: number;
  }
  const rows: Cell[][] = [];
  rows.push([{ label: "Cliente", value: cli.nome, size: 10.5 }]);

  const r2: Cell[] = [];
  if (cli.telefone) r2.push({ label: "Telefone / WhatsApp", value: cli.telefone });
  if (cli.cpfCnpj) r2.push({ label: "CPF / CNPJ", value: cli.cpfCnpj });
  if (r2.length) rows.push(r2);

  const r3: Cell[] = [];
  if (cli.email) r3.push({ label: "E-mail", value: cli.email });
  if (cli.endereco) r3.push({ label: "Endereço do serviço", value: cli.endereco });
  if (r3.length) rows.push(r3);

  const pad = 5;
  const gap = 9;
  const lineH = 4.2;
  const labelGap = 4.2;
  const rowGap = 3.5;
  const padTop = 6;
  const padBottom = 5;

  // Mede a altura de cada linha (quantidade de linhas do maior valor)
  const rowLines = rows.map((row) => {
    const n = row.length;
    const w = n === 1 ? CONTENT_W - pad * 2 : (CONTENT_W - pad * 2 - gap) / 2;
    return row.reduce((mx, cell) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(cell.size ?? 9);
      const lines = doc.splitTextToSize(cell.value || "—", w).length;
      return Math.max(mx, lines);
    }, 0);
  });

  let boxH = padTop;
  rowLines.forEach((h) => (boxH += labelGap + h * lineH + rowGap));
  boxH += padBottom - rowGap;

  // Fundo claro + borda
  setFill(light);
  doc.roundedRect(MARGIN, y, CONTENT_W, boxH, 2.5, 2.5, "F");
  setDraw(lineCol);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN, y, CONTENT_W, boxH, 2.5, 2.5, "S");

  // Desenha cada célula
  let cy = y + padTop;
  rows.forEach((row, ri) => {
    const n = row.length;
    const w = n === 1 ? CONTENT_W - pad * 2 : (CONTENT_W - pad * 2 - gap) / 2;
    row.forEach((cell, ci) => {
      const x = MARGIN + pad + ci * (w + gap);
      // rótulo
      setTextCol(gray);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.text(cell.label.toUpperCase(), x, cy);
      // valor
      setTextCol(dark);
      doc.setFont(cell.size ? "helvetica" : "helvetica", "bold");
      doc.setFontSize(cell.size ?? 9);
      drawWrapped(doc, cell.value || "—", x, cy + labelGap, w, lineH);
    });
    cy += labelGap + rowLines[ri] * lineH + rowGap;
  });
  y += boxH + 7;

  /* ============================================================
     TABELA DE SERVIÇOS
  ============================================================ */
  const head = [["#", "Descrição do Serviço", "Qtd", "Valor Unit.", "Total"]];
  // Ignora itens sem descrição (ex.: o item vazio padrão)
  const itensValidos = orc.itens.filter(
    (it) => (it.descricao || "").trim() !== ""
  );
  const body =
    itensValidos.length > 0
      ? itensValidos.map((it, idx) => [
          String(idx + 1),
          it.descricao || "—",
          formatNumber(it.quantidade),
          formatCurrency(it.valorUnitario),
          formatCurrency((it.quantidade || 0) * (it.valorUnitario || 0)),
        ])
      : [["", "Nenhum serviço informado", "", "", ""]];

  autoTable(doc, {
    startY: y,
    head,
    body,
    theme: "grid",
    margin: { left: MARGIN, right: MARGIN, top: 10 },
    styles: { fontSize: 9, cellPadding: 2.2, lineColor: lineCol, lineWidth: 0.2 },
    headStyles: {
      fillColor: primary,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8.5,
      halign: "center",
    },
    bodyStyles: { textColor: dark, valign: "middle" },
    alternateRowStyles: { fillColor: light },
    columnStyles: {
      0: { cellWidth: 9, halign: "center" },
      1: { cellWidth: "auto", halign: "left" },
      2: { cellWidth: 16, halign: "center" },
      3: { cellWidth: 30, halign: "right" },
      4: { cellWidth: 32, halign: "right" },
    },
  });

  const finalY =
    (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
      ?.finalY ?? y;
  y = finalY + 7;

  /* ============================================================
     TOTAIS
  ============================================================ */
  const subtotal = calcularSubtotal(orc.itens);
  const desconto = Number(orc.desconto) || 0;
  const total = calcularTotal(orc);

  y = ensureSpace(doc, y, 30);
  const totW = 72;
  const totX = PAGE_W - MARGIN - totW;
  const valueX = PAGE_W - MARGIN;

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  setTextCol([80, 86, 96]);
  doc.text("Subtotal:", totX, y);
  doc.text(formatCurrency(subtotal), valueX, y, { align: "right" });
  y += 5.5;

  if (desconto > 0) {
    setTextCol([180, 50, 50]);
    doc.text("Desconto:", totX, y);
    doc.text("- " + formatCurrency(desconto), valueX, y, { align: "right" });
    y += 5.5;
  }

  // Caixa destacada do TOTAL
  setFill(primary);
  doc.roundedRect(totX - 4, y - 4.8, totW + 4, 10, 2, 2, "F");
  setTextCol([255, 255, 255]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL:", totX, y + 1.2);
  doc.text(formatCurrency(total), valueX, y + 1.2, { align: "right" });
  y += 13;

  /* ============================================================
     CONDIÇÕES E OBSERVAÇÕES
  ============================================================ */
  const condicoes: { titulo: string; valor: string }[] = [];
  if (orc.formaPagamento)
    condicoes.push({ titulo: "Forma de pagamento", valor: orc.formaPagamento });
  if (orc.garantia) condicoes.push({ titulo: "Garantia", valor: orc.garantia });

  if (condicoes.length || orc.observacoes) {
    setDraw(lineCol);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 5;

    if (condicoes.length) {
      y = ensureSpace(doc, y, 12);
      setTextCol(primary);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text("CONDIÇÕES", MARGIN, y);
      y += 5;
      setTextCol([70, 76, 86]);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      condicoes.forEach((c) => {
        const txt = `${c.titulo}: ${c.valor}`;
        y = ensureSpace(doc, y, 8);
        y = drawWrapped(doc, txt, MARGIN, y, CONTENT_W, 4) + 1.5;
      });
      y += 3;
    }

    if (orc.observacoes) {
      y = ensureSpace(doc, y, 12);
      setTextCol(primary);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text("OBSERVAÇÕES", MARGIN, y);
      y += 5;
      setTextCol([70, 76, 86]);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      y = drawWrapped(doc, orc.observacoes, MARGIN, y, CONTENT_W, 4) + 3;
    }
  }

  /* ============================================================
     ASSINATURAS
  ============================================================ */
  const sigH = 14;
  y = ensureSpace(doc, y, sigH + 8);
  y = Math.max(y + 8, BOTTOM_LIMIT - sigH - 4);

  setDraw([150, 155, 165]);
  doc.setLineWidth(0.3);
  const sigW = 74;
  doc.line(MARGIN + 6, y, MARGIN + 6 + sigW, y);
  doc.line(PAGE_W - MARGIN - 6 - sigW, y, PAGE_W - MARGIN - 6, y);
  setTextCol(gray);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Cliente", MARGIN + 6 + sigW / 2, y + 4.5, { align: "center" });
  doc.text(company.nome, PAGE_W - MARGIN - 6 - sigW / 2, y + 4.5, {
    align: "center",
  });

  /* ============================================================
     RODAPÉ (em todas as páginas)
  ============================================================ */
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    drawFooter(doc, company, primary, i, pageCount);
  }

  // Sanitiza o número do orçamento p/ um nome de arquivo válido
  const numArquivo =
    orc.numero && orc.numero !== "—" ? orc.numero.replace(/[^\w\-]/g, "") : "rascunho";
  const nome = `Orcamento_${numArquivo}.pdf`;
  if (acao === "abrir") {
    doc.output("dataurlnewwindow");
  } else {
    doc.save(nome);
  }
}

function drawFooter(
  doc: jsPDF,
  company: CompanyInfo,
  primary: RGB,
  page: number,
  total: number
): void {
  const pageH = doc.internal.pageSize.getHeight();
  setFill(doc, primary);
  doc.rect(0, pageH - 13, PAGE_W, 13, "F");
  setText(doc, [255, 255, 255]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  const contato = [
    `Tel: ${company.telefone}`,
    `WhatsApp: ${company.whatsapp}`,
    company.email,
  ].join("   |   ");
  const contatoLines = doc.splitTextToSize(contato, CONTENT_W - 14);
  doc.text(contatoLines[0] ?? "", PAGE_W / 2, pageH - 8, { align: "center" });
  const insta = doc.splitTextToSize(`Siga-nos: ${company.instagram}`, CONTENT_W / 2)[0] ?? "";
  doc.text(insta, MARGIN + 2, pageH - 8, { align: "left" });
  doc.text(`Pág. ${page}/${total}`, PAGE_W - MARGIN - 2, pageH - 8, {
    align: "right",
  });
}

// Helpers locais p/ drawFooter (escopo de módulo)
function setFill(doc: jsPDF, c: RGB): void {
  doc.setFillColor(c[0], c[1], c[2]);
}
function setText(doc: jsPDF, c: RGB): void {
  doc.setTextColor(c[0], c[1], c[2]);
}
