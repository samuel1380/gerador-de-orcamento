import { useCallback, useEffect, useState } from "react";
import type { CompanyInfo, Orcamento } from "@/types";
import {
  loadCompany,
  loadOrcamentos,
  saveCompany,
  saveOrcamentos,
} from "@/utils/storage";
import { uid } from "@/utils/format";

function gerarNumeroOrcamento(lista: Orcamento[]): string {
  const ano = new Date().getFullYear();
  // Encontra a maior sequência já usada no ano para evitar repetição,
  // mesmo após excluir orçamentos.
  let maxSeq = 0;
  lista.forEach((o) => {
    const match = o.numero.match(/^(\d{4})-(\d+)$/);
    if (match && Number(match[1]) === ano) {
      maxSeq = Math.max(maxSeq, Number(match[2]));
    }
  });
  const seq = String(maxSeq + 1).padStart(4, "0");
  return `${ano}-${seq}`;
}

export function useQuotes() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [company, setCompany] = useState<CompanyInfo>(loadCompany());
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    setOrcamentos(loadOrcamentos());
    setCarregado(true);
  }, []);

  const persistir = useCallback((lista: Orcamento[]) => {
    setOrcamentos(lista);
    saveOrcamentos(lista);
  }, []);

  const criarOrcamento = useCallback(
    (orc: Omit<Orcamento, "id" | "numero" | "criadoEm" | "atualizadoEm">) => {
      const agora = new Date().toISOString();
      const novo: Orcamento = {
        ...orc,
        id: uid(),
        numero: gerarNumeroOrcamento(orcamentos),
        criadoEm: agora,
        atualizadoEm: agora,
      };
      const lista = [novo, ...orcamentos];
      persistir(lista);
      return novo;
    },
    [orcamentos, persistir]
  );

  const atualizarOrcamento = useCallback(
    (id: string, dados: Partial<Orcamento>) => {
      const lista = orcamentos.map((o) =>
        o.id === id
          ? { ...o, ...dados, atualizadoEm: new Date().toISOString() }
          : o
      );
      persistir(lista);
    },
    [orcamentos, persistir]
  );

  const removerOrcamento = useCallback(
    (id: string) => {
      persistir(orcamentos.filter((o) => o.id !== id));
    },
    [orcamentos, persistir]
  );

  const salvarCompany = useCallback((dados: CompanyInfo) => {
    setCompany(dados);
    saveCompany(dados);
  }, []);

  return {
    carregado,
    orcamentos,
    company,
    criarOrcamento,
    atualizarOrcamento,
    removerOrcamento,
    salvarCompany,
  };
}
