export interface ServiceItem {
  id: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
}

export type QuoteStatus =
  | "rascunho"
  | "enviado"
  | "aprovado"
  | "recusado"
  | "concluido";

export interface Cliente {
  nome: string;
  telefone: string;
  email: string;
  cpfCnpj: string;
  endereco: string;
}

export interface Orcamento {
  id: string;
  numero: string;
  data: string; // ISO date string
  validade: number; // dias de validade
  cliente: Cliente;
  itens: ServiceItem[];
  observacoes: string;
  desconto: number; // valor em R$
  formaPagamento: string;
  garantia: string;
  status: QuoteStatus;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CompanyInfo {
  nome: string;
  slogan: string;
  cnpj: string;
  telefone: string;
  whatsapp: string;
  email: string;
  endereco: string;
  cidade: string;
  instagram: string;
  corPrimaria: string;
  garantiaPadrao: string;
  validadePadrao: number;
  formaPagamentoPadrao: string;
}
