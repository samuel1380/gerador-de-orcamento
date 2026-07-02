import { useMemo, useState, type ReactNode } from "react";
import type { CompanyInfo, Orcamento, ServiceItem } from "@/types";
import { calcularSubtotal, calcularTotal, itemTotal } from "@/utils/calc";
import { formatCurrency, todayLocal, uid } from "@/utils/format";

/** Mostra vazio (placeholder) quando o número é 0 para facilitar a digitação. */
const numField = (n: number): string => (n === 0 ? "" : String(n));
import { abrirWhatsApp } from "@/utils/whatsapp";
import { gerarOrcamentoPDF } from "@/utils/pdf";
import { useToast } from "./Toast";
import { ServicePicker } from "./ServicePicker";
import {
  Button,
  DocIcon,
  Field,
  inputCls,
  PlusIcon,
  TrashIcon,
  WhatsappIcon,
} from "./ui";

export type OrcamentoForm = Omit<Orcamento, "criadoEm" | "atualizadoEm">;

interface Props {
  inicial?: Orcamento | null;
  company: CompanyInfo;
  onSalvar: (dados: OrcamentoForm, acao: "salvar") => Orcamento;
  onCancelar: () => void;
}

function itemVazio(): ServiceItem {
  return { id: uid(), descricao: "", quantidade: 1, valorUnitario: 0 };
}

/* Cabeçalho numerado das seções */
function SectionTitle({
  n,
  children,
  delay = 0,
}: {
  n: number;
  children: ReactNode;
  delay?: number;
}) {
  return (
    <h3
      className="mb-4 flex animate-fade-down items-center gap-2 text-sm font-bold uppercase tracking-wide text-sky-700 dark:text-sky-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 text-xs font-extrabold text-white shadow-sm shadow-sky-500/30">
        {n}
      </span>
      {children}
    </h3>
  );
}

const cardCls =
  "animate-fade-up rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm shadow-slate-900/5 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-black/20";

export function QuoteForm({ inicial, company, onSalvar, onCancelar }: Props) {
  const { push } = useToast();
  const [form, setForm] = useState<OrcamentoForm>(() => ({
    id: inicial?.id ?? "",
    numero: inicial?.numero ?? "—",
    data: inicial?.data ?? todayLocal(),
    validade: inicial?.validade ?? company.validadePadrao,
    status: inicial?.status ?? "rascunho",
    desconto: inicial?.desconto ?? 0,
    formaPagamento: inicial?.formaPagamento ?? company.formaPagamentoPadrao,
    garantia: inicial?.garantia ?? company.garantiaPadrao,
    observacoes: inicial?.observacoes ?? "",
    cliente: inicial?.cliente ?? {
      nome: "",
      telefone: "",
      email: "",
      cpfCnpj: "",
      endereco: "",
    },
    itens: inicial?.itens?.length ? inicial.itens : [itemVazio()],
  }));

  const set = <K extends keyof OrcamentoForm>(k: K, v: OrcamentoForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const setCliente = (k: keyof OrcamentoForm["cliente"], v: string) =>
    setForm((f) => ({ ...f, cliente: { ...f.cliente, [k]: v } }));

  const subtotal = useMemo(() => calcularSubtotal(form.itens), [form.itens]);
  const total = useMemo(
    () => calcularTotal({ itens: form.itens, desconto: form.desconto }),
    [form.itens, form.desconto]
  );

  const setItem = (id: string, patch: Partial<ServiceItem>) =>
    setForm((f) => ({
      ...f,
      itens: f.itens.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));

  const addItem = () =>
    setForm((f) => ({ ...f, itens: [...f.itens, itemVazio()] }));

  /**
   * Ao escolher um serviço: se existir um item vazio (sem descrição),
   * ele é preenchido. Caso contrário, cria um novo item.
   */
  const addServico = (descricao: string) => {
    setForm((f) => {
      const idxVazio = f.itens.findIndex((it) => !it.descricao.trim());
      if (idxVazio !== -1) {
        const itens = f.itens.map((it, i) =>
          i === idxVazio ? { ...it, descricao } : it
        );
        return { ...f, itens };
      }
      return {
        ...f,
        itens: [
          ...f.itens,
          { id: uid(), descricao, quantidade: 1, valorUnitario: 0 },
        ],
      };
    });
    if (descricao) push("Serviço adicionado ✓", "success");
  };

  const removeItem = (id: string) =>
    setForm((f) => ({
      ...f,
      itens:
        f.itens.length > 1
          ? f.itens.filter((it) => it.id !== id) // remove o item
          : [itemVazio()], // único item: limpa em vez de não fazer nada
    }));

  const onSalvarHandler = () => {
    onSalvar(form, "salvar");
    push("Orçamento salvo com sucesso!", "success");
  };

  const onSalvarEPdf = () => {
    const salvo = onSalvar(form, "salvar");
    gerarOrcamentoPDF(salvo, company, "salvar");
    push("Orçamento salvo e PDF baixado!", "success");
  };

  const onPdfDireto = () => {
    gerarOrcamentoPDF(form as Orcamento, company, "salvar");
    push("PDF gerado!", "success");
  };

  const onWhatsApp = () => {
    const salvo = onSalvar(form, "salvar");
    abrirWhatsApp(salvo, company);
    push("Abrindo WhatsApp...", "info");
  };

  return (
    <div className="mx-auto max-w-5xl pb-28">
      {/* Cabeçalho do formulário */}
      <div className="mb-5 flex flex-wrap animate-fade-down items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {inicial ? "Editar Orçamento" : "Novo Orçamento"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Preencha os dados do cliente e os serviços prestados.
          </p>
        </div>
        <Button variant="secondary" size="md" onClick={onCancelar}>
          ← Voltar
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Coluna principal */}
        <div className="space-y-5 lg:col-span-2">
          {/* Cliente */}
          <section className={cardCls}>
            <SectionTitle n={1}>Dados do Cliente</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nome do cliente *" className="sm:col-span-2">
                <input
                  className={inputCls}
                  value={form.cliente.nome}
                  onChange={(e) => setCliente("nome", e.target.value)}
                  placeholder="Ex: João da Silva / Mercearia Boa Vista"
                />
              </Field>
              <Field label="Telefone / WhatsApp">
                <input
                  className={inputCls}
                  value={form.cliente.telefone}
                  onChange={(e) => setCliente("telefone", e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </Field>
              <Field label="CPF / CNPJ">
                <input
                  className={inputCls}
                  value={form.cliente.cpfCnpj}
                  onChange={(e) => setCliente("cpfCnpj", e.target.value)}
                  placeholder="000.000.000-00"
                />
              </Field>
              <Field label="E-mail" className="sm:col-span-2">
                <input
                  className={inputCls}
                  value={form.cliente.email}
                  onChange={(e) => setCliente("email", e.target.value)}
                  placeholder="cliente@email.com"
                />
              </Field>
              <Field label="Endereço do serviço" className="sm:col-span-2">
                <input
                  className={inputCls}
                  value={form.cliente.endereco}
                  onChange={(e) => setCliente("endereco", e.target.value)}
                  placeholder="Rua, número, bairro, cidade"
                />
              </Field>
            </div>
          </section>

          {/* Serviços */}
          <section className={cardCls} style={{ animationDelay: "80ms" }}>
            <SectionTitle n={2} delay={80}>
              Serviços e Valores
            </SectionTitle>

            {/* Seletor de serviços em caixinha */}
            <ServicePicker onPick={addServico} />

            {/* Itens */}
            <div className="space-y-2.5">
              {form.itens.map((it, idx) => (
                <div
                  key={it.id}
                  className="animate-fade-up rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-white/5 dark:bg-white/[0.02]"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                      ITEM {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        removeItem(it.id);
                        push("Item removido", "info");
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-red-50 hover:text-red-500 active:scale-90 dark:hover:bg-red-500/10"
                      aria-label="Remover item"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <input
                    className={inputCls + " mb-2"}
                    value={it.descricao}
                    onChange={(e) => setItem(it.id, { descricao: e.target.value })}
                    placeholder="Descrição do serviço (ex: Desentupimento de esgoto)"
                  />
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <Field label="Qtd">
                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        step={1}
                        className={inputCls}
                        value={numField(it.quantidade)}
                        placeholder="1"
                        onChange={(e) =>
                          setItem(it.id, { quantidade: Number(e.target.value) })
                        }
                      />
                    </Field>
                    <Field label="Valor unit. (R$)">
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="0.01"
                        className={inputCls}
                        value={numField(it.valorUnitario)}
                        placeholder="0,00"
                        onChange={(e) =>
                          setItem(it.id, { valorUnitario: Number(e.target.value) })
                        }
                      />
                    </Field>
                    <div className="col-span-2 flex flex-col justify-end sm:col-span-1">
                      <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                        Total
                      </span>
                      <span className="flex min-h-[46px] items-center rounded-xl bg-white px-3 py-3 text-sm font-bold text-slate-800 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10">
                        {formatCurrency(itemTotal(it))}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="secondary" size="sm" onClick={addItem} className="mt-3">
              <PlusIcon className="h-4 w-4" /> Adicionar item
            </Button>
          </section>

          {/* Condições */}
          <section className={cardCls} style={{ animationDelay: "160ms" }}>
            <SectionTitle n={3} delay={160}>
              Condições e Observações
            </SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Forma de pagamento">
                <input
                  className={inputCls}
                  value={form.formaPagamento}
                  onChange={(e) => set("formaPagamento", e.target.value)}
                />
              </Field>
              <Field label="Garantia">
                <input
                  className={inputCls}
                  value={form.garantia}
                  onChange={(e) => set("garantia", e.target.value)}
                />
              </Field>
              <Field label="Validade (dias)">
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  className={inputCls}
                  value={form.validade}
                  onChange={(e) => set("validade", Number(e.target.value))}
                />
              </Field>
              <Field label="Data do orçamento">
                <input
                  type="date"
                  className={inputCls}
                  value={form.data}
                  onChange={(e) => set("data", e.target.value)}
                />
              </Field>
              <Field label="Observações" className="sm:col-span-2">
                <textarea
                  className={inputCls + " min-h-[80px] resize-y leading-relaxed"}
                  value={form.observacoes}
                  onChange={(e) => set("observacoes", e.target.value)}
                  placeholder="Informações adicionais, prazos de execução, materiais, etc."
                />
              </Field>
            </div>
          </section>
        </div>

        {/* Resumo lateral */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <div className="animate-fade-up overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm shadow-slate-900/5 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-black/20">
              <div className="relative overflow-hidden bg-gradient-to-br from-sky-700 via-sky-600 to-cyan-500 px-5 py-4 text-white">
                <div className="absolute inset-0 animate-gradient bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.25),transparent)] bg-[length:200%_100%]" />
                <p className="relative text-xs font-medium uppercase tracking-wide text-sky-100">
                  Resumo do orçamento
                </p>
                <p className="relative mt-1 text-2xl font-extrabold leading-tight sm:text-3xl">
                  {formatCurrency(total)}
                </p>
              </div>
              <div className="space-y-2 px-5 py-4 text-sm">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <Field label="Desconto (R$)">
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    className={inputCls}
                    value={numField(form.desconto)}
                    placeholder="0,00"
                    onChange={(e) => set("desconto", Number(e.target.value))}
                  />
                </Field>
                <div className="mt-2 flex justify-between border-t border-dashed border-slate-200 pt-2 text-slate-500 dark:border-white/10 dark:text-slate-400">
                  <span>Total</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 animate-fade-up space-y-2" style={{ animationDelay: "120ms" }}>
              <Button size="lg" className="hidden w-full lg:flex" onClick={onSalvarEPdf}>
                <DocIcon className="h-5 w-5" /> Salvar e baixar PDF
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="whatsapp" onClick={onWhatsApp}>
                  <WhatsappIcon className="h-4 w-4" /> WhatsApp
                </Button>
                <Button variant="secondary" onClick={onSalvarHandler}>
                  Salvar
                </Button>
              </div>
              <Button variant="ghost" className="w-full" onClick={onPdfDireto}>
                <DocIcon className="h-4 w-4" /> Apenas PDF (sem salvar)
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Barra fixa no mobile */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/90 p-3 backdrop-blur-lg dark:border-white/10 dark:bg-slate-900/90 lg:hidden">
        <Button size="lg" className="w-full" onClick={onSalvarEPdf}>
          <DocIcon className="h-5 w-5" /> Salvar e baixar PDF · {formatCurrency(total)}
        </Button>
      </div>
    </div>
  );
}
