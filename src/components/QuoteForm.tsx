import { useMemo, useState } from "react";
import type { CompanyInfo, Orcamento, ServiceItem } from "@/types";
import { servicosPreDefinidos } from "@/data/company";
import { calcularSubtotal, calcularTotal, itemTotal } from "@/utils/calc";
import { formatCurrency, uid } from "@/utils/format";
import { abrirWhatsApp } from "@/utils/whatsapp";
import { gerarOrcamentoPDF } from "@/utils/pdf";
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

export function QuoteForm({ inicial, company, onSalvar, onCancelar }: Props) {
  const [form, setForm] = useState<OrcamentoForm>(() => ({
    id: inicial?.id ?? "",
    numero: inicial?.numero ?? "—",
    data: inicial?.data ?? new Date().toISOString().slice(0, 10),
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

  const addPredef = (desc: string, valor: number) =>
    setForm((f) => ({
      ...f,
      itens: [...f.itens, { id: uid(), descricao: desc, quantidade: 1, valorUnitario: valor }],
    }));

  const removeItem = (id: string) =>
    setForm((f) => ({
      ...f,
      itens: f.itens.length > 1 ? f.itens.filter((it) => it.id !== id) : f.itens,
    }));

  const onSalvarHandler = () => onSalvar(form, "salvar");

  const onSalvarEPdf = () => {
    const salvo = onSalvar(form, "salvar");
    gerarOrcamentoPDF(salvo, company, "salvar");
  };

  const onPdfDireto = () => gerarOrcamentoPDF(form as Orcamento, company, "salvar");

  const onWhatsApp = () => {
    const salvo = onSalvar(form, "salvar");
    abrirWhatsApp(salvo, company);
  };

  return (
    <div className="mx-auto max-w-5xl pb-28">
      {/* Cabeçalho do formulário */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {inicial ? "Editar Orçamento" : "Novo Orçamento"}
          </h2>
          <p className="text-sm text-slate-500">
            Preencha os dados do cliente e os serviços prestados.
          </p>
        </div>
        <Button variant="ghost" size="md" onClick={onCancelar}>
          ← Voltar
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Coluna principal */}
        <div className="space-y-5 lg:col-span-2">
          {/* Cliente */}
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-sky-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-100 text-xs">
                1
              </span>
              Dados do Cliente
            </h3>
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
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-sky-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-100 text-xs">
                2
              </span>
              Serviços e Valores
            </h3>

            {/* Atalhos */}
            <div className="mb-4 flex flex-wrap gap-1.5">
              {servicosPreDefinidos.slice(0, 8).map((s) => (
                <button
                  key={s.descricao}
                  onClick={() => addPredef(s.descricao, s.valor)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                  type="button"
                >
                  + {s.descricao}
                </button>
              ))}
            </div>

            {/* Itens */}
            <div className="space-y-2.5">
              {form.itens.map((it, idx) => (
                <div
                  key={it.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/60 p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">
                      ITEM {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(it.id)}
                      className="rounded-lg p-1 text-slate-300 transition hover:bg-red-50 hover:text-red-500"
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
                        min={0}
                        step={1}
                        className={inputCls}
                        value={it.quantidade}
                        onChange={(e) =>
                          setItem(it.id, { quantidade: Number(e.target.value) })
                        }
                      />
                    </Field>
                    <Field label="Valor unit. (R$)">
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        className={inputCls}
                        value={it.valorUnitario}
                        onChange={(e) =>
                          setItem(it.id, { valorUnitario: Number(e.target.value) })
                        }
                      />
                    </Field>
                    <div className="col-span-2 flex flex-col justify-end sm:col-span-1">
                      <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                        Total
                      </span>
                      <span className="rounded-xl bg-white px-3 py-2.5 text-sm font-bold text-slate-800 ring-1 ring-slate-200">
                        {formatCurrency(itemTotal(it))}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={addItem}
              className="mt-3"
            >
              <PlusIcon className="h-4 w-4" /> Adicionar item
            </Button>
          </section>

          {/* Condições */}
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-sky-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-100 text-xs">
                3
              </span>
              Condições e Observações
            </h3>
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
                  className={inputCls + " min-h-[80px] resize-y"}
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
          <div className="lg:sticky lg:top-4">
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="bg-gradient-to-br from-sky-700 to-cyan-500 px-5 py-4 text-white">
                <p className="text-xs font-medium uppercase tracking-wide text-sky-100">
                  Resumo do orçamento
                </p>
                <p className="mt-1 text-3xl font-extrabold">
                  {formatCurrency(total)}
                </p>
              </div>
              <div className="space-y-2 px-5 py-4 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-700">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <Field label="Desconto (R$)">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    className={inputCls}
                    value={form.desconto}
                    onChange={(e) => set("desconto", Number(e.target.value))}
                  />
                </Field>
                <div className="mt-2 flex justify-between border-t border-dashed border-slate-200 pt-2 text-slate-500">
                  <span>Total</span>
                  <span className="font-bold text-emerald-600">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Button
                size="lg"
                className="hidden w-full lg:flex"
                onClick={onSalvarEPdf}
              >
                <DocIcon className="h-5 w-5" /> Salvar e baixar PDF
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="success" onClick={onWhatsApp}>
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
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <Button size="lg" className="w-full" onClick={onSalvarEPdf}>
          <DocIcon className="h-5 w-5" /> Salvar e baixar PDF · {formatCurrency(total)}
        </Button>
      </div>
    </div>
  );
}
