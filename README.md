# Vitrine de Projetos - Frontend Web

Este repositório contém a **interface web** do sistema de cadastro e compartilhamento de projetos acadêmicos, desenvolvida em **React** seguindo o padrão **MVC**.

---

## Tecnologias

- **React** (v18+) com **TypeScript**
- **React Router** para navegação
- **Context API** para gerenciamento de estado global
- **Axios** para chamadas HTTP à API
- **Tailwind CSS** para estilos
- **Framer Motion** para animações
- **Lucide React** para ícones

## 🏗️ Arquitetura Modular

Este projeto segue uma **arquitetura altamente modularizada** para garantir:
- ✅ **Manutenibilidade**: Cada componente tem uma responsabilidade única
- ✅ **Reutilização**: Componentes podem ser usados em diferentes contextos
- ✅ **Escalabilidade**: Fácil adicionar novas features sem impactar código existente
- ✅ **Testabilidade**: Componentes isolados são mais fáceis de testar
- ✅ **Performance**: React pode otimizar melhor componentes menores

### Princípios de Modularização

1. **Separação por Feature**: Cada funcionalidade em sua própria pasta
2. **Componentes Atômicos**: Dividir componentes grandes em pequenos reutilizáveis
3. **Seções Isoladas**: Formulários e páginas divididos em seções independentes
4. **Props Tipadas**: TypeScript garante contratos claros entre componentes
5. **Single Responsibility**: Cada arquivo tem apenas uma responsabilidade

---

## Visão Geral da Arquitetura (MVC)

- **Model**: Representações dos dados (e.g., `Project`, `User`), gerenciados no state ou context.
- **View**: Componentes React que exibem a interface do usuário (JSX + Tailwind CSS).
- **Controller**: Funções/hooks que orquestram fluxos—chamadas à API, tratamento de formulários e navegação.

Exemplo de fluxo:
1. Usuário acessa `/projects` (View)
2. Controller usa Axios para buscar lista de projetos da API
3. Model (state) é atualizado via Context API
4. View re-renderiza com os dados atualizados

---

## Estrutura de Pastas

> **📋 IMPORTANTE: O projeto segue uma arquitetura 100% MODULAR para melhor manutenibilidade.**
>
> **📖 Documentação Completa:** Veja [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) para detalhes da nova estrutura.

```bash
src/
├─ features/                  # Funcionalidades organizadas por tipo de usuário
│  ├─ visitor/               # Páginas públicas (landing page, sobre)
│  ├─ auth/                  # Sistema de autenticação (login, register)
│  ├─ student/               # Funcionalidades de estudante
│  │  ├─ create-project/    # Criação de projetos (TOTALMENTE MODULAR)
│  │  │  ├─ components/
│  │  │  │  ├─ sections/   # 📦 Seções modulares do formulário
│  │  │  │  │  ├─ AcademicInfoSection.tsx
│  │  │  │  │  ├─ ProjectDetailsSection.tsx
│  │  │  │  │  ├─ TeamSection.tsx
│  │  │  │  │  ├─ AttachmentsSection.tsx
│  │  │  │  │  └─ CodeSection.tsx
│  │  │  │  ├─ create-project-form.tsx  # Orquestrador
│  │  │  │  └─ project-review.tsx
│  │  │  └─ page.tsx
│  │  ├─ dashboard/
│  │  └─ projects/
│  ├─ teacher/               # Funcionalidades de professor (gerenciamento)
│  ├─ shared/                # Funcionalidades compartilhadas (notificações)
│  └─ admin/                 # Funcionalidades de administrador (futuro)
├─ components/               # Componentes reutilizáveis globais
│  ├─ ui/                   # Componentes de UI (buttons, inputs, cards)
│  ├─ layout/               # Componentes de layout (header, sidebar)
│  └─ modals/               # Modais reutilizáveis
├─ contexts/                 # Providers e contexts para estado global
├─ hooks/                    # Custom hooks
├─ routes/                   # Configuração de rotas com React Router
├─ services/                 # Camada de comunicação com a API
├─ types/                    # Definições de tipos TypeScript
├─ utils/                    # Funções utilitárias e helpers
└─ index.tsx                 # Ponto de entrada da aplicação
```

### 🎯 Exemplo de Modularização: Create Project Form

O formulário de criação de projetos é um exemplo perfeito da arquitetura modular:

**Antes**: Um único arquivo de 600+ linhas ❌

**Depois**: 6 arquivos especializados ✅
- `AcademicInfoSection.tsx` (180 linhas) - Informações acadêmicas
- `ProjectDetailsSection.tsx` (120 linhas) - Detalhes e categoria
- `TeamSection.tsx` (150 linhas) - Autores e orientadores
- `AttachmentsSection.tsx` (140 linhas) - Banner e timeline
- `CodeSection.tsx` (100 linhas) - Código fonte
- `create-project-form.tsx` (120 linhas) - Orquestrador principal

**Benefícios**:
- 🔧 Fácil manutenção: Edite apenas a seção necessária
- 🔄 Reutilização: Seções podem ser usadas em outros formulários
- 🧪 Testabilidade: Teste cada seção isoladamente
- 👥 Colaboração: Múltiplos devs podem trabalhar em paralelo

### Tipos de Usuário

- **👥 Visitor**: Acesso público (landing page, informações)
- **🎓 Student**: Dashboard, projetos, calendário, comunidade
- **👨‍🏫 Teacher**: Gerenciamento de alunos, avaliações, relatórios
- **👨‍💼 Admin**: Controle total do sistema (futuro)

### Rotas Principais

- `/` - Landing page pública
- `/app/*` - Área do estudante
- `/teacher/*` - Área do professor
- `/login`, `/register` - Autenticação

---

## Funcionalidades Principais

- Autenticação de usuário (login, logout)
- Registro de novos projetos (formulário com campos: título, descrição, links, integrantes, visibilidade)
- Listagem de projetos públicos e privados
- Edição e exclusão de projetos
- Visualização de projetos de colegas
- Integração com backend para persistência e autenticação JWT
- Responsividade (mobile-first)

---

## Instalação e Execução

1. Clone o repositório:
   ```bash
git clone https://github.com/seu-usuario/vitrine-de-projetos-frontend.git
```
2. Instale dependências:
   ```bash
cd vitrine-de-projetos-frontend
npm install
```
3. Defina variáveis de ambiente (exemplo `.env`):
   ```ini
REACT_APP_API_URL=https://api.seusite.com
```
4. Inicie em modo de desenvolvimento:
   ```bash
npm start
```
5. Acesse `http://localhost:3000`

---

## Produção

Para gerar o build de produção:
```bash
npm run build
```
O resultado ficará em `build/`, pronto para ser servido por um servidor estático.

---

## Contribuições

> **Este projeto é privado e não aceita contribuições externas.**

---

## Licença

© Vitrine de Projetos SENAI
