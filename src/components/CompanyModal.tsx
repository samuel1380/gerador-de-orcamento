import { useState } from "react";
import type { CompanyInfo } from "@/types";
import { Button, Field, inputCls, Modal } from "./ui";

interface Props {
  open: boolean;
  company: CompanyInfo;
  onClose: () => void;
  onSalvar: (c: CompanyInfo) => void;
}

const presetColors = [
  "#0c4a6e",
  "#0e7490",
  "#06b6d4",
  "#1d4ed8",
  "#15803d",
  "#b45309",
  "#9333ea",
  "#be123c",
];

export function CompanyModal({ open, company, onClose, onSalvar }: Props) {
  const [form, setForm] = useState<CompanyInfo>(company);

  const set = <K extends keyof CompanyInfo>(k: K, v: CompanyInfo[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const salvar = () => {
    onSalvar(form);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Dados da Empresa" size="lg">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome da empresa" className="sm:col-span-2">
            <input
              className={inputCls}
              value={form.nome}
              onChange={(e) => set("nome", e.target.value)}
            />
          </Field>
          <Field label="Slogan / Frase" className="sm:col-span-2">
            <input
              className={inputCls}
              value={form.slogan}
              onChange={(e) => set("slogan", e.target.value)}
            />
          </Field>
          <Field label="CNPJ">
            <input
              className={inputCls}
              value={form.cnpj}
              onChange={(e) => set("cnpj", e.target.value)}
            />
          </Field>
          <Field label="Telefone">
            <input
              className={inputCls}
              value={form.telefone}
              onChange={(e) => set("telefone", e.target.value)}
            />
          </Field>
          <Field label="WhatsApp (somente números)">
            <input
              className={inputCls}
              value={form.whatsapp}
              onChange={(e) => set("whatsapp", e.target.value)}
              placeholder="5511999998888"
            />
          </Field>
          <Field label="E-mail">
            <input
              className={inputCls}
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>
          <Field label="Endereço">
            <input
              className={inputCls}
              value={form.endereco}
              onChange={(e) => set("endereco", e.target.value)}
            />
          </Field>
          <Field label="Cidade / UF">
            <input
              className={inputCls}
              value={form.cidade}
              onChange={(e) => set("cidade", e.target.value)}
            />
          </Field>
          <Field label="Instagram">
            <input
              className={inputCls}
              value={form.instagram}
              onChange={(e) => set("instagram", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Cor principal do orçamento">
          <div className="flex items-center gap-2">
            {presetColors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => set("corPrimaria", c)}
                className={`h-9 w-9 rounded-full ring-2 ring-offset-2 transition hover:scale-110 dark:ring-offset-slate-900 ${
                  form.corPrimaria === c
                    ? "ring-slate-900 dark:ring-white scale-110"
                    : "ring-transparent"
                }`}
                style={{ backgroundColor: c }}
                aria-label={`Cor ${c}`}
              />
            ))}
          </div>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Forma de pagamento (padrão)">
            <input
              className={inputCls}
              value={form.formaPagamentoPadrao}
              onChange={(e) => set("formaPagamentoPadrao", e.target.value)}
            />
          </Field>
          <Field label="Garantia (padrão)">
            <input
              className={inputCls}
              value={form.garantiaPadrao}
              onChange={(e) => set("garantiaPadrao", e.target.value)}
            />
          </Field>
          <Field label="Validade padrão (dias)">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              className={inputCls}
              value={form.validadePadrao}
              onChange={(e) => set("validadePadrao", Number(e.target.value))}
            />
          </Field>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={salvar}>Salvar dados</Button>
        </div>
      </div>
    </Modal>
  );
}
