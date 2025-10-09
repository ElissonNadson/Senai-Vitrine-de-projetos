# Dashboard V2 - Estrutura Moderna

## 📁 Estrutura de Pastas

```
dashboard-v2/
├── components/           # Componentes reutilizáveis
│   ├── ModernSidebar.tsx    # Sidebar com navegação
│   ├── ModernHeader.tsx     # Header com busca e perfil
│   └── TasksTable.tsx       # Tabela de tarefas pendentes
├── layouts/              # Layouts da aplicação
│   └── ModernDashboardLayout.tsx  # Layout principal
├── stats/                # Componentes de estatísticas
│   ├── StatsCard.tsx         # Card de estatística individual
│   └── ProgressChart.tsx     # Gráfico circular de progresso
└── page.tsx              # Página principal do dashboard
```

## 🎨 Componentes

### ModernSidebar
Sidebar com navegação moderna e ícones
- ✅ Navegação com indicador de página ativa
- ✅ Ícones lucide-react
- ✅ Suporte a dark mode
- ✅ Responsivo

### ModernHeader
Header com funcionalidades modernas
- ✅ Campo de busca integrado
- ✅ Botão de notificações com badge
- ✅ Avatar do usuário
- ✅ Dark mode ready

### StatsCard
Card reutilizável para exibir estatísticas
- ✅ Ícone personalizável
- ✅ Cores customizáveis
- ✅ Estado de loading
- ✅ Efeito hover

### TasksTable
Tabela de tarefas com prioridades
- ✅ Colunas: Tarefa, Projeto, Prazo, Prioridade
- ✅ Badges coloridos por prioridade
- ✅ Hover effects
- ✅ Estado vazio e loading

### ProgressChart
Gráfico circular de progresso SVG
- ✅ Animação suave
- ✅ Porcentagem dinâmica
- ✅ Totalmente responsivo
- ✅ Dark mode

### ModernDashboardLayout
Layout principal que integra todos os componentes
- ✅ Sidebar fixa
- ✅ Header no topo
- ✅ Content area com max-width
- ✅ Suporta Outlet para rotas aninhadas

## 🚀 Como Usar

### 1. Importar o Layout no Router

```tsx
import ModernDashboardLayout from '@/features/student/dashboard-v2/layouts/ModernDashboardLayout'
import ModernDashboardPage from '@/features/student/dashboard-v2/page'

// No seu router.tsx
<Route path="/app/dashboard-v2" element={<ModernDashboardLayout />}>
  <Route index element={<ModernDashboardPage />} />
  {/* Outras rotas aqui */}
</Route>
```

### 2. Usar Componentes Individualmente

```tsx
import StatsCard from '@/features/student/dashboard-v2/stats/StatsCard'
import { FolderOpen } from 'lucide-react'

<StatsCard
  title="Projetos Ativos"
  value={12}
  icon={FolderOpen}
  iconBgColor="bg-indigo-100 dark:bg-indigo-900/50"
  iconColor="text-indigo-500 dark:text-indigo-400"
/>
```

## 🎯 Funcionalidades

- ✅ **Totalmente Responsivo** - Mobile, Tablet e Desktop
- ✅ **Dark Mode** - Suporte completo
- ✅ **Componentes Modulares** - Fácil reutilização
- ✅ **TypeScript** - Type safety
- ✅ **Tailwind CSS** - Estilização moderna
- ✅ **Lucide Icons** - Ícones consistentes
- ✅ **Loading States** - UX aprimorada
- ✅ **Acessibilidade** - Estrutura semântica

## 🔧 Personalização

### Cores do Tema

As cores principais estão definidas no Tailwind:
- Primary: `indigo-600`
- Background: `white` / `gray-800` (dark)
- Text: `gray-900` / `white` (dark)
- Border: `gray-200` / `gray-700` (dark)

### Adicionar Nova Rota no Sidebar

Edite `components/ModernSidebar.tsx`:

```tsx
const navItems: NavItem[] = [
  // ... itens existentes
  {
    name: 'Nova Página',
    href: '/app/nova-pagina',
    icon: <NomeDoIcone className="h-5 w-5" />
  }
]
```

## 📊 Dados

Os dados são obtidos através dos hooks:
- `useProjetos()` - Lista de projetos
- `useAuth()` - Informações do usuário

## 🎨 Design System

Baseado no design fornecido com:
- Cards com bordas arredondadas
- Sombras sutis
- Transições suaves
- Espaçamento consistente
- Tipografia hierárquica
- Paleta de cores harmoniosa

## 📝 To-Do

- [ ] Conectar API de tarefas real
- [ ] Adicionar filtros na TasksTable
- [ ] Implementar paginação
- [ ] Adicionar notificações reais
- [ ] Sistema de temas (além de dark mode)
- [ ] Gráficos adicionais (Chart.js ou Recharts)
