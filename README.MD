# noSPAM - Extensão e Backend

O **noSPAM** é uma aplicação completa (Extensão de navegador Chrome e Backend FastAPI) construída para gerenciar e combater spam. A ferramenta utiliza inteligência artificial (Gemini) e integração com Supabase, permitindo a autenticação via contas do Google.

Este guia ensinará como executar o projeto inteiramente na sua máquina local.

## 📋 Pré-requisitos
- **Node.js** (versão 18+ recomendada) e `npm` para gerenciar as dependências da extensão.
- **Python** (versão 3.9+ recomendada) e `pip` para rodar o backend.
- **Chave de API do Gemini** (para as funções de IA).
- **Conta no Supabase** (credenciais de banco e anon key).
- **Tela de Consentimento e Credenciais do Google (OAuth2)** configuradas no Google Cloud Console com o redirect URI apontando para `http://localhost:8000/auth/callback`.

---

## ⚙️ Passo 1: Executando o Backend (FastAPI)

O backend é responsável por gerenciar a autenticação e fazer o intermédio com as APIs (como o Gemini).

1. Abra um terminal e acesse a pasta do backend:
   ```bash
   cd backend
   ```

2. Crie e ative um ambiente virtual (recomendado):
   ```bash
   python -m venv venv
   
   # Para ativar no Windows:
   venv\Scripts\activate
   # Para ativar no Linux / Mac:
   source venv/bin/activate
   ```

3. Instale as dependências do projeto:
   ```bash
   pip install -r requirements.txt
   ```

4. **⚠️ IMPORTANTE: Configure as Variáveis de Ambiente:**
   O backend **não funcionará** sem as variáveis de ambiente configuradas corretamente.
   - Copie o arquivo `.env.example` para `.env`:
     ```bash
     cp .env.example .env
     ```
   - Preencha cuidadosamente o `.env` com todas as suas credenciais:
     - `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`
     - `GEMINI_API_KEY`
     - `SUPABASE_URL` e `SUPABASE_KEY`
     - `SECRET_KEY`

5. Inicie o servidor em modo de desenvolvimento:
   ```bash
   python -m uvicorn app.main:app --reload
   ```
   > 💡 O backend ficará ativo por padrão acessível em `http://localhost:8000`. Mantenha o terminal aberto.

---

### 🌐 Alternativa: Usando o Backend em Produção (Render)
Se você **não conseguir configurar ou rodar o backend localmente**, você pode utilizar a infraestrutura de produção que já estã online e configurada!
- **URL da API de Produção:** `https://nospam-backend.onrender.com`

*(Veja no passo seguinte como apontar a extensão para a nuvem em vez do localhost).*

---

## 💻 Passo 2: Compilando a Extensão (Vite + React)

A extensão se comunica com o backend para realizar as ações de autenticação e varredura.

#### 2.1. Escolha qual Backend a extensão vai acessar
Antes de prosseguir com a instalação, abra o arquivo `extension/src/background.js` e localize a variável `BACKEND_URL` na linha 1.
- **Para rodar 100% Local:** Altere para `const BACKEND_URL = "http://localhost:8000"`
- **Para usar a Produção (Render):** Deixe / altere para `const BACKEND_URL = "https://nospam-backend.onrender.com"`

1. Abra uma nova janela do terminal e navegue até a pasta da extensão:
   ```bash
   cd extension
   ```

2. Instale as dependências Node:
   ```bash
   npm install
   ```
   *(Dependências adicionais necessárias como Vite e plugins do React serão instaladas).*

3. Compile a aplicação para gerar a versão final da extensão:
   ```bash
   npx vite build
   ```
   > 💡 Ao finalizar a compilação, uma pasta chamada `dist/` será gerada dentro de `extension/`. Esta pasta contém os arquivos JavaScript minificados, bem como o `manifest.json`.

---

## 🧩 Passo 3: Instalando a Extensão no Chrome

Com a pasta `dist` pronta, precisamos carregar a extensão no navegador para testá-la.

1. Abra o **Google Chrome**.
2. Cole ou digite `chrome://extensions/` na barra de endereços e pressione Enter.
3. No canto superior direito, ative a chavinha **"Modo do desenvolvedor"** (Developer mode).
4. Agora aparecerão algumas opções no canto superior esquerdo. Clique em **"Carregar sem compactação"** (Load unpacked).
5. Por fim, localize a pasta do seu projeto em seu computador e selecione a pasta `extension/dist/`.

A extensão "noSPAM" terá sido instalada com sucesso! Você pode fixá-la na sua barra de tarefas clicando no ícone do "Quebra-cabeça" na barra superior do Chrome.

---

## 🚀 Como testar localmente

1. Pressione o ícone da extensão; aparecerá o Popup construído no Vite.
2. Interaja com a Autenticação do Google da extensão. Ela fará conexão direta com a API localhost `http://localhost:8000`.
3. Verifique os logs do terminal Python aberto para se certificar de que as requisições estão passando normalmente e explore as funcionalidades do Gemini e do Supabase configuradas!
