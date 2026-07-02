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

/** Serviços de uma desentupidora, organizados por categoria */
export interface CategoriaServicos {
  categoria: string;
  emoji: string;
  servicos: string[];
}

export const servicosCategorizados: CategoriaServicos[] = [
  {
    categoria: "Desentupimento",
    emoji: "🔧",
    servicos: [
      "Desentupimento de esgoto geral",
      "Desentupimento de pia de cozinha",
      "Desentupimento de pia de banheiro",
      "Desentupimento de tanque",
      "Desentupimento de vaso sanitário",
      "Desentupimento de mictório",
      "Desentupimento de ralo de box / chuveiro",
      "Desentupimento de ralo de piso",
      "Desentupimento de ralo seco / efeito",
      "Desentupimento de coluna de água pluvial",
      "Desentupimento de coluna de esgoto",
      "Desentupimento de calha / condutor",
      "Desentupimento de grelha de garagem",
      "Desentupimento de tubulação em geral",
    ],
  },
  {
    categoria: "Limpeza e Caixas",
    emoji: "🧰",
    servicos: [
      "Limpeza de caixa de gordura",
      "Limpeza e higienização de caixa d'água",
      "Limpeza e desentupimento de fossa",
      "Esgotamento / bombeamento de fossa",
      "Limpeza de sumidouro / fossa séptica",
      "Remoção de raiz em tubulação",
    ],
  },
  {
    categoria: "Hidrojateamento",
    emoji: "💧",
    servicos: [
      "Hidrojateamento de tubulação de esgoto",
      "Hidrojateamento de caixa de gordura",
      "Hidrojateamento de coluna",
      "Hidrojateamento preventivo",
    ],
  },
  {
    categoria: "Inspeção e Diagnóstico",
    emoji: "📸",
    servicos: [
      "Inspeção com câmera de vídeo",
      "Inspeção com câmera térmica",
      "Rastreamento de tubulação",
      "Localização de vazamento",
      "Laudo técnico de inspeção",
    ],
  },
  {
    categoria: "Serviços Extras",
    emoji: "🚚",
    servicos: [
      "Visita técnica / avaliação",
      "Atendimento de emergência 24h",
      "Serviço em horário noturno",
      "Serviço em final de semana / feriado",
      "Deslocamento",
    ],
  },
];
