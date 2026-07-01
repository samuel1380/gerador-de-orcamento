import type { CompanyInfo } from "@/types";

export const defaultCompany: CompanyInfo = {
  nome: "INTECH DESENTUPIDORA",
  slogan: "Solução definitiva em desentupimento e hidrojateamento",
  cnpj: "00.000.000/0000-00",
  telefone: "(00) 0000-0000",
  whatsapp: "5500000000000",
  email: "contato@intechdesentupidora.com.br",
  endereco: "Rua Exemplo, 123 - Centro",
  cidade: "Sua Cidade - UF",
  instagram: "@intechdesentupidora",
  corPrimaria: "#0c4a6e",
  garantiaPadrao: "90 dias de garantia no serviço prestado",
  validadePadrao: 15,
  formaPagamentoPadrao:
    "Pix, dinheiro, cartão de débito/crédito ou transferência bancária",
};

/** Serviços comuns de uma desentupidora para preenchimento rápido */
export const servicosPreDefinidos: { descricao: string; valor: number }[] = [
  { descricao: "Desentupimento de esgoto", valor: 0 },
  { descricao: "Desentupimento de pia de cozinha", valor: 0 },
  { descricao: "Desentupimento de pia de banheiro", valor: 0 },
  { descricao: "Desentupimento de vaso sanitário", valor: 0 },
  { descricao: "Desentupimento de ralo", valor: 0 },
  { descricao: "Desentupimento de coluna de água", valor: 0 },
  { descricao: "Limpeza de caixa de gordura", valor: 0 },
  { descricao: "Limpeza e desentupimento de fossa", valor: 0 },
  { descricao: "Hidrojateamento de tubulação", valor: 0 },
  { descricao: "Inspeção com câmera térmica/câmera de vídeo", valor: 0 },
  { descricao: "Rastreamento de tubulação", valor: 0 },
  { descricao: "Limpeza de caixa d'água", valor: 0 },
];
