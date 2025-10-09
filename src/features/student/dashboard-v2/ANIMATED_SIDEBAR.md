# 🎨 AnimatedSidebar - Sidebar Dinâmica com Framer Motion

## ✨ Recursos Implementados

### 1. **Animações Suaves**
- ✅ Transição de largura: 80px (colapsado) ↔ 256px (expandido)
- ✅ Fade in/out suave para textos e badges
- ✅ Rotação do ícone de toggle (ChevronLeft)
- ✅ Escala do logo ao colapsar
- ✅ Hover com scale nos ícones de navegação

### 2. **Interatividade**
- ✅ Botão de toggle no desktop
- ✅ Menu hambúrguer no mobile
- ✅ Overlay escuro no mobile quando aberto
- ✅ Tooltips aparecem ao passar o mouse (modo colapsado)
- ✅ Destaque visual do item ativo

### 3. **Persistência**
- ✅ Estado salvo no localStorage
- ✅ Preferência mantida entre sessões
- ✅ Carregamento automático ao iniciar

### 4. **Responsividade**
- ✅ Desktop: sidebar fixa com toggle
- ✅ Mobile: sidebar overlay com botão hambúrguer
- ✅ Transições suaves em todos os tamanhos de tela

### 5. **Acessibilidade**
- ✅ Labels ARIA nos botões
- ✅ Tooltips informativos
- ✅ Contraste adequado (dark mode)
- ✅ Foco visível nos elementos clicáveis

## 🎯 Como Usar

### Importação
```tsx
import AnimatedSidebar from '../dashboard-v2/components/AnimatedSidebar'
```

### Uso no Layout
```tsx
<div className="flex h-screen">
  <AnimatedSidebar />
  <main className="flex-1">
    {/* Seu conteúdo */}
  </main>
</div>
```

## 🎭 Comportamento

### Desktop (≥1024px)
- Sidebar sempre visível
- Botão de toggle no topo direito
- Largura animada: 80px ↔ 256px
- Tooltips quando colapsado

### Mobile (<1024px)
- Sidebar oculta por padrão
- Botão hambúrguer fixo no topo esquerdo
- Overlay escuro quando aberto
- Largura fixa: 256px

## 🔧 Customização

### Adicionar Novos Itens de Navegação
```tsx
const navItems: NavItem[] = [
  {
    name: 'Novo Item',
    href: '/app/novo',
    icon: Star,
    badge: 10 // opcional
  }
]
```

### Alterar Larguras
```tsx
animate={{
  width: isCollapsed ? '5rem' : '16rem' // personalize aqui
}}
```

### Mudar Cores
- Active: `bg-indigo-600 text-white`
- Hover: `hover:bg-gray-100 dark:hover:bg-gray-700`
- Badges: `bg-indigo-100 text-indigo-600`

## 📦 Dependências

```json
{
  "framer-motion": "^11.x.x",
  "lucide-react": "^0.x.x",
  "react-router-dom": "^6.x.x"
}
```

## 🎨 Ícones Disponíveis

- **Home**: Dashboard principal
- **FolderOpen**: Projetos
- **ListTodo**: Tarefas
- **BarChart3**: Relatórios
- **Settings**: Configurações
- **Database**: Logo

## 💡 Dicas

1. **Performance**: As animações usam `transform` e `opacity` para melhor performance
2. **Dark Mode**: Totalmente compatível com Tailwind dark mode
3. **LocalStorage**: Usa `sidebarCollapsed` como chave
4. **Mobile**: Fecha automaticamente ao navegar

## 🚀 Próximas Melhorias Possíveis

- [ ] Submenu expansível
- [ ] Drag & drop para reordenar itens
- [ ] Temas personalizáveis
- [ ] Atalhos de teclado
- [ ] Busca rápida de páginas
- [ ] Notificações inline nos badges
- [ ] Favoritos/pins

## 📝 Notas Técnicas

- **Framer Motion**: Biblioteca escolhida por ser a mais popular e robusta
- **Type-safe**: Interfaces TypeScript completas
- **Bundle Size**: ~30KB (minified + gzipped)
- **Browser Support**: Todos os navegadores modernos
