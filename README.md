# INTECH Desentupidora — Gerador de Orçamentos (PWA)

Sistema web (PWA) para a **INTECH Desentupidora** criar orçamentos de serviços
de desentupimento de forma rápida, gerar o **PDF** profissional e enviar por
**WhatsApp**. Funciona **offline** e pode ser **instalado** no celular/PC.

## ✨ Funcionalidades

- 🧾 Criação de orçamentos com dados do cliente, serviços, valores e desconto
- 📄 Geração de **PDF profissional** com cabeçalho da empresa e botão de download
- 💬 Compartilhamento do resumo via **WhatsApp**
- 🗂️ Lista de orçamentos com busca, status (rascunho, enviado, aprovado…) e edição
- 📊 Painel com totais (orçado, aprovado, mês atual, em aberto)
- ⚙️ Configuração dos dados da empresa (nome, CNPJ, contato, cor, etc.)
- 📱 PWA instalável + funcionamento offline (dados salvos no dispositivo)

## 🚀 Rodar localmente

```bash
npm install
npm run dev      # ambiente de desenvolvimento
npm run build    # gera a pasta dist/ (site estático)
npm run preview  # pré-visualiza o build
```

## ☁️ Hospedar no Render (Static Site)

1. Crie um novo serviço no Render escolhendo **Static Site**.
2. Conecte o repositório do projeto.
3. Configure:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. Salve. O Render fará o build e publicará os arquivos da pasta `dist/`.

O projeto é compilado em um único `index.html` (com JS e CSS embutidos), e os
arquivos da pasta `public/` (`manifest.webmanifest`, `sw.js` e os ícones) são
copiados para `dist/`, garantindo que o PWA funcione no Render.

## 🛠️ Tecnologias

- React + TypeScript
- Vite (`vite-plugin-singlefile`)
- Tailwind CSS
- jsPDF + jspdf-autotable (geração de PDF)
