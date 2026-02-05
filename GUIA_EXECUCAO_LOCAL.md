# 🚀 Guia de Execução Local - Vitrine de Projetos SENAI

## ⚠️ Requisitos Importantes

**Node.js**: Este projeto requer **Node.js 20+** para funcionar corretamente.

### Como atualizar o Node.js:

```bash
# Usando nvm (recomendado)
nvm install 20
nvm use 20

# Ou baixe diretamente de: https://nodejs.org/
```

---

## 📦 Passos para Rodar o Projeto

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# .env
VITE_API_URL=http://localhost:3000/api # Local
# ou
VITE_API_URL=https://dev.vitrinesenaifeira.cloud/api # homologação
```

**Nota**: Se você não criar o arquivo `.env`, o projeto usará `/api` como padrão, que será redirecionado para `http://localhost:3000` através do proxy do Vite.

### 3. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

O servidor será iniciado em: **http://localhost:5173**

O Vite abrirá automaticamente no navegador.

---

## 🔧 Configuração da API

O projeto está configurado para se comunicar com a API backend através de:

- **Proxy do Vite**: Requisições para `/api` são automaticamente redirecionadas para `http://localhost:3000`
- **Variável de ambiente**: `VITE_API_URL` pode ser configurada no arquivo `.env`

---

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento (porta 5173)
- `npm run build` - Gera o build de produção
- `npm run preview` - Visualiza o build de produção localmente
- `npm test` - Executa os testes

---

## 🐛 Solução de Problemas

### Erro: "Unsupported engine"
- **Causa**: Versão do Node.js incompatível
- **Solução**: Atualize para Node.js 20+

### Erro: "Cannot connect to API"
- **Causa**: API backend não está rodando
- **Solução**: Inicie a API backend na porta 3000

### Erro: "Port 5173 already in use"
- **Causa**: Outro processo está usando a porta
- **Solução**: 
  ```bash
  # Encontrar o processo
  lsof -ti:5173
  
  # Matar o processo (substitua PID pelo número do processo)
  kill -9 PID
  ```

---

## 📚 Estrutura do Projeto

- `src/` - Código fonte
- `src/features/` - Funcionalidades organizadas por tipo de usuário
- `src/components/` - Componentes reutilizáveis
- `src/api/` - Configuração e chamadas da API
- `public/` - Arquivos estáticos

---

## 🔗 Links Úteis

- **Servidor Dev**: http://localhost:5173
- **API Backend**: http://localhost:3000 (deve estar rodando)


