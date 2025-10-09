# 🧪 Guia de Teste - Modo Visitante

## 🎯 Como Ativar o Modo Visitante

### Método 1: Via URL (Recomendado)
```
http://localhost:3000/app?guest=true
```
ou
```
http://localhost:3000/app/dashboard?guest=true
```

### Método 2: Via localStorage
1. Abra o DevTools (F12)
2. Vá para a aba "Console"
3. Digite: `localStorage.setItem('isGuest', 'true')`
4. Pressione Enter
5. Recarregue a página (F5)

---

## ✅ Checklist de Verificação

### 1. **Verificar Console do Navegador**

Abra o DevTools (F12) e procure por estes logs:

```
🎯 GuestProvider - Location change: /app/dashboard ?guest=true
🎯 GuestProvider - Current isGuest state: true
🎯 GuestProvider - useEffect triggered
🛡️ Private Router Debug: { isGuest: true, isAuthenticated: false }
🎯 Dashboard - isGuest: true
🎯 Dashboard - Renderizando GuestDashboard
```

Se você ver esses logs, o modo visitante está funcionando!

---

### 2. **Elementos Visuais Esperados**

✅ **Banner Azul no Topo (apenas este):**
```
┌────────────────────────────────────────────────────────────┐
│ 👁️ Você está navegando como Visitante                     │
│ [← Voltar] [Fazer Login] [Criar Conta]                    │
└────────────────────────────────────────────────────────────┘
```

✅ **Dashboard de Visitante (full-width, SEM sidebar/header):**
```
┌────────────────────────────────────────────────────────────┐
│ Banner Azul (topo fixo)                                    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────┬─────────────────────────────────────────┐   │
│  │ FILTROS  │  PROJETOS PÚBLICOS                      │   │
│  │ ──────── │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │   │
│  │ 🔍 Busca │  │Card 1│ │Card 2│ │Card 3│ │Card 4│  │   │
│  │ 📚 Curso │  └──────┘ └──────┘ └──────┘ └──────┘  │   │
│  │ 📁 Categ │                                        │   │
│  │ 💡 Nível │  Fases de Maturidade:                 │   │
│  │ ──────── │  [Ideação] [Modelagem] [Prototipagem] │   │
│  └──────────┴─────────────────────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

✅ **O que DEVE aparecer:**
- Banner azul no topo fixo
- Conteúdo full-width (100% da largura)
- Sidebar de filtros à esquerda (dentro do conteúdo)
- Grid de projetos públicos
- Cards com fases de maturidade
- Filtros funcionais

❌ **O que NÃO deve aparecer:**
- Sidebar de navegação (AnimatedSidebar)
- Header com logo e pesquisa (ModernHeader)
- Botão "Novo Projeto"
- Botão "Ver Todos os Projetos"
- Stats cards de projetos pessoais
- Tarefas pendentes
- Menu de navegação lateral

---

## 🐛 Troubleshooting

### Problema: Banner não aparece
**Solução:**
1. Limpe o localStorage: `localStorage.clear()`
2. Limpe os cookies de autenticação
3. Recarregue a página com `?guest=true`

### Problema: Aparece dashboard normal em vez de visitante
**Solução:**
1. Verifique o console: `console.log(localStorage.getItem('isGuest'))`
2. Deve retornar `"true"`
3. Se não, execute: `localStorage.setItem('isGuest', 'true')` e recarregue

### Problema: Redireciona para login
**Solução:**
1. Certifique-se de que está usando a URL correta: `/app?guest=true`
2. Verifique se o Private Router permite visitantes
3. Limpe cookies de autenticação antigas

---

## 🧪 Testes Completos

### Teste 1: Acesso Inicial
```bash
1. Limpe localStorage e cookies
2. Acesse: http://localhost:3000/app?guest=true
3. Deve ver: Banner de visitante + Grid de projetos públicos
```

### Teste 2: Persistência
```bash
1. Com modo visitante ativo
2. Navegue para: /app/dashboard
3. Deve manter: Banner de visitante + Dashboard de visitante
```

### Teste 3: Logout de Visitante
```bash
1. Com modo visitante ativo
2. Clique no botão "Voltar" no banner
3. Deve redirecionar para: /login
4. localStorage.isGuest deve ser removido
```

### Teste 4: Dark Mode
```bash
1. Com modo visitante ativo
2. Alterne o tema (botão de lua/sol)
3. Deve alternar: Sidebar, cards, inputs para dark mode
```

---

## 📊 Estados Esperados

| Estado | isGuest | isAuthenticated | Dashboard Mostrado |
|--------|---------|-----------------|-------------------|
| **Visitante** | ✅ true | ❌ false | GuestDashboard |
| **Autenticado** | ❌ false | ✅ true | Dashboard Normal |
| **Não logado** | ❌ false | ❌ false | Redireciona /login |

---

## 🔍 Debug no Código

### Adicionar Logs Temporários

Adicione estes logs para debug:

```tsx
// No Dashboard (page.tsx)
console.log('🎯 Dashboard - isGuest:', isGuest)
console.log('🎯 Dashboard - Renderizando:', isGuest ? 'Guest' : 'Normal')

// No GuestProvider
console.log('🎯 GuestProvider - isGuest:', isGuest)
console.log('🎯 GuestProvider - localStorage:', localStorage.getItem('isGuest'))

// No Private Router
console.log('🛡️ Private Router - isGuest:', isGuest)
console.log('🛡️ Private Router - isAuthenticated:', isAuthenticated)
```

---

## ✨ Comandos Úteis no Console

```javascript
// Ver status atual
console.log('isGuest:', localStorage.getItem('isGuest'))

// Ativar modo visitante
localStorage.setItem('isGuest', 'true')
location.reload()

// Desativar modo visitante
localStorage.removeItem('isGuest')
location.reload()

// Limpar tudo
localStorage.clear()
document.cookie.split(";").forEach(c => {
  document.cookie = c.trim().split("=")[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
})
location.reload()
```

---

## 📱 Teste Responsivo

1. Abra DevTools (F12)
2. Ative o modo dispositivo (Ctrl + Shift + M)
3. Teste em:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1280px)

**Esperado:**
- Banner responsivo
- Sidebar de filtros colapsa em mobile
- Grid de projetos adapta colunas

---

## 🎨 Teste Dark Mode

1. Com modo visitante ativo
2. Clique no botão de tema (lua/sol)
3. **Deve alternar:**
   - Sidebar: `bg-white` → `bg-gray-800`
   - Cards: `bg-white` → `bg-gray-800`
   - Texto: `text-gray-900` → `text-white`
   - Bordas: `border-gray-200` → `border-gray-700`

---

## 📝 Notas Importantes

⚠️ **O modo visitante só funciona se:**
1. URL contém `?guest=true` OU
2. localStorage tem `isGuest = 'true'` E
3. NÃO há cookies de autenticação válidos

⚠️ **Se você estiver autenticado:**
- O modo visitante será automaticamente desativado
- Você verá o dashboard normal do aluno
- Para testar visitante, faça logout primeiro

⚠️ **Persistência:**
- O estado `isGuest` persiste no localStorage
- Ao recarregar a página, o modo visitante se mantém
- Ao fazer login, o modo visitante é removido automaticamente

---

**Data:** 6 de outubro de 2025  
**Versão:** 1.0.0  
**Status:** ✅ Pronto para teste
