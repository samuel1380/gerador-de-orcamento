import type { CompanyInfo, Orcamento } from "@/types";
import { defaultCompany } from "@/data/company";

const ORCAMENTOS_KEY = "intech:orcamentos";
const COMPANY_KEY = "intech:company";

export function loadOrcamentos(): Orcamento[] {
  try {
    const raw = localStorage.getItem(ORCAMENTOS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrcamentos(list: Orcamento[]): void {
  try {
    localStorage.setItem(ORCAMENTOS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Erro ao salvar orçamentos", e);
  }
}

export function loadCompany(): CompanyInfo {
  try {
    const raw = localStorage.getItem(COMPANY_KEY);
    if (!raw) return { ...defaultCompany };
    return { ...defaultCompany, ...JSON.parse(raw) };
  } catch {
    return { ...defaultCompany };
  }
}

export function saveCompany(company: CompanyInfo): void {
  try {
    localStorage.setItem(COMPANY_KEY, JSON.stringify(company));
  } catch (e) {
    console.error("Erro ao salvar dados da empresa", e);
  }
}
