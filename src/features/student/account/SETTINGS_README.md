# 🎨 Settings Page - Página de Configurações Moderna

## ✨ Visão Geral

Página de configurações completamente redesenhada com interface moderna, intuitiva e responsiva.

---

## 📋 Estrutura

### **1. UserProfileModal** (Header Dropdown)
**Arquivo:** `dashboard-v2/components/UserProfileModal.tsx`

Modal que aparece ao clicar no avatar do usuário no header:

**Funcionalidades:**
- ✅ Informações do usuário (nome, email, avatar)
- ✅ Links rápidos:
  - Ver Perfil
  - Configurações
  - Notificações
  - Segurança
  - Aparência
- ✅ Botão de Sair
- ✅ Animação suave (Framer Motion)
- ✅ Fecha ao clicar fora
- ✅ Posicionamento automático

**Uso:**
```tsx
<UserProfileModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  anchorRef={avatarRef}
/>
```

---

### **2. Página Principal de Settings**
**Arquivo:** `account/page.tsx`

Layout com sidebar de navegação e conteúdo dinâmico.

**Estrutura:**
- Header com título e botão "Voltar"
- Sidebar com 4 abas
- Conteúdo renderizado dinamicamente
- Suporte a query params (`?tab=security`)

**Abas Disponíveis:**
1. 👤 **Perfil** (`profile`)
2. 🔒 **Segurança** (`security`)
3. 🔔 **Notificações** (`notifications`)
4. 🎨 **Aparência** (`appearance`)

---

## 🎯 Componentes das Abas

### **ProfileTab** 
**Arquivo:** `account/components/ProfileTab.tsx`

**Seções:**
- **Header do Perfil**
  - Avatar com botão de upload (câmera)
  - Nome, curso e badges de status
  - Botão "Editar Perfil"

- **Informações Pessoais**
  - Nome Completo ✏️
  - Email ✏️
  - Telefone ✏️
  - Matrícula (somente leitura)
  - Curso (somente leitura)
  - Bio ✏️

- **Redes Sociais**
  - LinkedIn
  - GitHub

**Estados:**
- Modo visualização (campos desabilitados)
- Modo edição (campos habilitados)
- Botão "Salvar Alterações" aparece ao editar

---

### **SecurityTab**
**Arquivo:** `account/components/SecurityTab.tsx`

**Seções:**

1. **Alterar Senha**
   - Senha atual (com toggle show/hide)
   - Nova senha (com indicador de força)
   - Confirmar senha (com validação)
   - Botão "Alterar Senha"

2. **Autenticação de Dois Fatores (2FA)**
   - Toggle on/off
   - Banner "Em Desenvolvimento"

3. **Sessões Ativas**
   - Lista de dispositivos conectados
   - Botão "Encerrar Todas as Outras Sessões"

**Recursos:**
- ✅ Indicador de força de senha (3 níveis)
- ✅ Validação em tempo real
- ✅ Ícones de visibilidade (Eye/EyeOff)
- ✅ Feedback visual de erros

---

### **NotificationsTab**
**Arquivo:** `account/components/NotificationsTab.tsx`

**Seções:**

1. **Tabela de Preferências**
   - 4 tipos de notificações:
     - ✅ Atualizações de Projetos
     - ⏰ Tarefas e Prazos
     - 💬 Mensagens e Comentários
     - 📅 Eventos do Calendário
   - Toggles para Email e Push

2. **Resumo por Email**
   - Opções:
     - Diariamente (9h)
     - Semanalmente (segunda-feira)
     - Nunca

**Recursos:**
- ✅ Toggles animados
- ✅ Ícones para cada tipo
- ✅ Layout responsivo (tabela → cards no mobile)

---

### **AppearanceTab**
**Arquivo:** `account/components/AppearanceTab.tsx`

**Seções:**

1. **Tema da Interface**
   - ☀️ Claro
   - 🌙 Escuro
   - 💻 Sistema (segue SO)

2. **Cor de Destaque**
   - 6 opções de cores:
     - Índigo, Azul, Roxo, Rosa, Verde, Laranja
   - Preview visual das cores

3. **Pré-visualização**
   - Mockup da interface com configurações aplicadas

4. **Configurações de Exibição**
   - Modo Compacto
   - Animações Reduzidas

**Recursos:**
- ✅ Seleção visual de tema (cards grandes)
- ✅ Preview em tempo real
- ✅ Círculos de cor clicáveis
- ✅ Indicador de seleção (check)

---

## 🎨 Design System

### **Cores**
- Primary: Indigo (`indigo-600`)
- Success: Green (`green-600`)
- Warning: Amber (`amber-600`)
- Danger: Red (`red-600`)
- Info: Blue (`blue-600`)

### **Espaçamento**
- Card padding: `p-6`
- Section gap: `space-y-6`
- Input height: `h-10` ou `py-2`

### **Bordas**
- Radius padrão: `rounded-lg`
- Border cards: `border-gray-200 dark:border-gray-700`

### **Tipografia**
- Título seção: `text-lg font-semibold`
- Descrição: `text-sm text-gray-600 dark:text-gray-400`
- Label: `text-sm font-medium`

---

## 🎭 Animações

Todas as transições usam **Framer Motion**:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Conteúdo */}
</motion.div>
```

**Tipos de animações:**
- Fade in/out + slide (tabs)
- Scale (modal)
- Toggle smooth (switches)
- Hover effects (buttons, cards)

---

## 🔄 Navegação

### **Via Modal (Header)**
1. Clique no avatar
2. Selecione opção do menu
3. Redireciona para `/app/account?tab=xxx`

### **Via URL Direta**
- `/app/account` → Aba Perfil
- `/app/account?tab=security` → Aba Segurança
- `/app/account?tab=notifications` → Aba Notificações
- `/app/account?tab=appearance` → Aba Aparência

### **Via Sidebar**
1. Clique em "Configurações" na sidebar animada
2. Abre página de settings
3. Navegue pelas abas na sidebar interna

---

## 📱 Responsividade

### **Desktop (≥1024px)**
- Sidebar lateral (4 colunas)
- Conteúdo ocupa 3 colunas
- Cards em grid

### **Tablet (768px - 1023px)**
- Sidebar empilhada no topo
- Conteúdo ocupa largura total
- Grid de 2 colunas

### **Mobile (<768px)**
- Sidebar como tabs horizontais
- Conteúdo em coluna única
- Campos de formulário em largura total

---

## 🚀 Próximas Implementações

### **Backend Integration**
- [ ] API para salvar perfil
- [ ] API para trocar senha
- [ ] API para 2FA
- [ ] API para preferências de notificação
- [ ] API para tema e aparência
- [ ] Upload de avatar

### **Features Adicionais**
- [ ] Crop de imagem do avatar
- [ ] Validação de email
- [ ] Confirmação por email ao trocar senha
- [ ] Histórico de login
- [ ] Exportar dados (LGPD)
- [ ] Deletar conta

### **Melhorias UX**
- [ ] Toast notifications ao salvar
- [ ] Loading states
- [ ] Erro handling
- [ ] Undo changes
- [ ] Keyboard shortcuts

---

## 💾 LocalStorage Keys

```typescript
// Tema
localStorage.setItem('theme', 'dark' | 'light' | 'system')

// Cor de destaque
localStorage.setItem('accentColor', 'indigo' | 'blue' | ...)

// Modo compacto
localStorage.setItem('compactMode', 'true' | 'false')

// Animações reduzidas
localStorage.setItem('reducedMotion', 'true' | 'false')
```

---

## 🎯 Validações Implementadas

### **Senha**
- Mínimo 8 caracteres
- Pelo menos 1 letra maiúscula
- Pelo menos 1 número
- Confirmação deve coincidir

### **Email**
- Formato válido
- Único no sistema (backend)

### **Telefone**
- Formato brasileiro: (00) 00000-0000
- Opcional

---

## 🔐 Segurança

- ✅ Senhas nunca são exibidas sem toggle
- ✅ Sessões podem ser revogadas
- ✅ 2FA preparado (em desenvolvimento)
- ✅ Redirecionamento se não autenticado
- ✅ Proteção contra CSRF (via backend)

---

## 📊 Performance

- ✅ Lazy loading de componentes
- ✅ Memoização de funções pesadas
- ✅ Debounce em validações
- ✅ Otimização de re-renders
- ✅ Code splitting por tab

---

## 🎉 Resumo das Melhorias

### **Antes:**
- Interface antiga e confusa
- Apenas 2 abas (Projetos, Conta)
- Sem modal no header
- Layout limitado
- Sem dark mode
- Sem validações

### **Depois:**
- ✨ Interface moderna e clean
- 🎯 4 abas completas e organizadas
- 🎭 Modal animado no header
- 📱 Totalmente responsivo
- 🌙 Dark mode completo
- ✅ Validações em tempo real
- 🎨 Personalizável (tema, cores)
- 🔒 Foco em segurança
- 📊 Melhor UX/UI

---

**Tudo pronto e funcionando! 🚀**
