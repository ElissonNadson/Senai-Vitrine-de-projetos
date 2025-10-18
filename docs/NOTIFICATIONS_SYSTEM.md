# 🔔 Sistema de Notificações - Vitrine de Projetos

## 📋 Visão Geral

Sistema completo de notificações implementado para a **Vitrine de Projetos SENAI**, com dropdown no header e página dedicada para visualização completa.

---

## 🎯 Funcionalidades Implementadas

### 1. **Dropdown de Notificações (Header)**
Localização: `src/features/student/dashboard-v2/components/ModernHeader.tsx`

#### Características:
- ✅ Badge com contador de notificações não lidas
- ✅ Animação no ícone do sino ao passar o mouse (bounce)
- ✅ Exibição das 3 notificações mais recentes
- ✅ Indicador visual para notificações não lidas (bolinha azul + fundo destacado)
- ✅ Ícones coloridos por tipo de notificação
- ✅ Botão "Ver todas as notificações" (aparece se houver mais de 3)
- ✅ Fecha automaticamente ao clicar fora
- ✅ Mensagem amigável quando não há notificações

### 2. **Página Completa de Notificações**
Localização: `src/features/student/dashboard-v2/pages/NotificationsPage.tsx`

#### Características:
- ✅ Header fixo com contador de não lidas
- ✅ Sistema de filtros por categoria
- ✅ Botão "Marcar todas como lidas"
- ✅ Ações individuais (marcar como lida, excluir)
- ✅ Avatar do usuário que gerou a notificação
- ✅ Timestamp relativo (Há X minutos/horas/dias)
- ✅ Link "Ver detalhes" para cada notificação
- ✅ Suporte completo a dark mode
- ✅ Design responsivo

---

## 🎨 Tipos de Notificações

### 1. 💬 **Comentários** (`comment`)
- **Cor:** Azul
- **Ícone:** MessageCircle
- **Exemplo:** "Maria Silva comentou no seu projeto 'App de Gestão Escolar'"

### 2. ❤️ **Curtidas** (`like`)
- **Cor:** Vermelho
- **Ícone:** Heart
- **Exemplo:** "João Pedro e outras 14 pessoas curtiram seu projeto 'Sistema de Biblioteca'"

### 3. 📢 **Publicações** (`published`)
- **Cor:** Verde
- **Ícone:** Upload
- **Exemplo:** "Seu projeto 'Dashboard Analytics' foi publicado com sucesso"

### 4. 👥 **Colaboração** (`collaboration`)
- **Cor:** Roxo
- **Ícone:** Users
- **Exemplo:** "Ana Costa te adicionou como colaborador no projeto 'E-commerce'"

### 5. 🔔 **Seguidores** (`follower`)
- **Cor:** Índigo
- **Ícone:** UserPlus
- **Exemplo:** "Carlos Mendes começou a seguir seus projetos"

### 6. 💬 **Respostas** (`reply`)
- **Cor:** Verde-água
- **Ícone:** MessageCircle
- **Exemplo:** "Pedro Santos respondeu ao seu comentário no projeto 'App Mobile'"

### 7. 👁️ **Visualizações** (`view`)
- **Cor:** Ciano
- **Ícone:** Eye
- **Exemplo:** "Seu projeto atingiu 100 visualizações esta semana!"

### 8. 🔗 **Compartilhamentos** (`share`)
- **Cor:** Laranja
- **Ícone:** Share2
- **Exemplo:** "Fernanda Lima compartilhou seu projeto 'Sistema de Gestão'"

### 9. 📌 **Menções** (`mention`)
- **Cor:** Amarelo
- **Ícone:** Bell
- **Exemplo:** "Lucas Oliveira mencionou você em um comentário"

---

## 🗂️ Estrutura de Dados

```typescript
interface Notification {
  id: number
  type: NotificationType
  title: string
  message: string
  projectName?: string      // Nome do projeto relacionado
  userName?: string         // Nome do usuário que gerou a notificação
  userAvatar?: string       // Iniciais para o avatar
  time: string             // Timestamp formatado ("Há 5 minutos")
  timestamp: Date          // Data/hora real
  read: boolean           // Status de leitura
  actionUrl?: string      // URL para ação relacionada
}
```

---

## 🎯 Filtros Disponíveis

A página de notificações possui os seguintes filtros:

1. **Todas** - Exibe todas as notificações
2. **Não Lidas** - Apenas notificações não lidas
3. **Comentários** - Apenas comentários
4. **Curtidas** - Apenas curtidas
5. **Colaboração** - Convites e adições a projetos
6. **Publicações** - Status de publicação de projetos

---

## 🛣️ Rotas Configuradas

```typescript
// Rota dentro do Layout da Dashboard
/app/student-notifications  → StudentNotificationsPage (dentro do Layout)

// Navegação
Header → "Ver todas as notificações" → /app/student-notifications
Sidebar → "Notificações" → /app/student-notifications
```

**IMPORTANTE:** A página de notificações fica **dentro do layout da dashboard**, mantendo:
- ✅ Sidebar visível
- ✅ Header visível
- ✅ Tema consistente com o resto da aplicação
- ✅ Navegação integrada

---

## 🎨 Paleta de Cores (Dark Mode Support)

### Modo Claro
- Background: `bg-white`, `bg-gray-50`
- Texto: `text-gray-900`, `text-gray-600`
- Bordas: `border-gray-200`
- Hover: `hover:bg-gray-100`

### Modo Escuro
- Background: `dark:bg-gray-800`, `dark:bg-gray-900`
- Texto: `dark:text-white`, `dark:text-gray-400`
- Bordas: `dark:border-gray-700`
- Hover: `dark:hover:bg-gray-700`

---

## 🔄 Ações Disponíveis

### No Dropdown:
1. Clicar em notificação → Ver detalhes
2. Clicar "Ver todas" → Ir para página completa

### Na Página Completa:
1. **Marcar como lida** → Marca individualmente (ícone ✓)
2. **Marcar todas como lidas** → Marca todas de uma vez
3. **Excluir notificação** → Remove da lista (ícone 🗑️)
4. **Ver detalhes** → Link para o projeto/contexto relacionado
5. **Filtrar por categoria** → Visualiza apenas tipo específico

---

## 📱 Responsividade

### Mobile (< 768px)
- Nome do usuário oculto no header (apenas avatar)
- Cards de notificação adaptados
- Filtros em grid responsivo

### Desktop (≥ 768px)
- Nome e email visíveis no header
- Layout otimizado com mais espaço
- Grid de filtros expandido

---

## 🚀 Próximos Passos (Integração com API)

### Para conectar com backend:

1. **Criar serviço de notificações**
```typescript
// src/api/notifications.ts
export const getNotifications = async () => {
  const response = await api.get('/notifications')
  return response.data
}

export const markAsRead = async (id: number) => {
  await api.patch(`/notifications/${id}/read`)
}

export const markAllAsRead = async () => {
  await api.patch('/notifications/read-all')
}

export const deleteNotification = async (id: number) => {
  await api.delete(`/notifications/${id}`)
}
```

2. **Usar React Query para gerenciamento de estado**
```typescript
const { data: notifications, refetch } = useQuery('notifications', getNotifications)
```

3. **WebSocket para notificações em tempo real**
```typescript
// Escutar novas notificações
socket.on('new-notification', (notification) => {
  // Atualizar lista
  refetch()
})
```

---

## 🎨 Animações Implementadas

1. **Sino (Bell):** `group-hover:animate-bounce` - Pula ao passar o mouse
2. **Badge:** `group-hover:scale-110` - Aumenta levemente
3. **Engrenagem:** `group-hover:rotate-90` - Gira 90 graus
4. **Dropdown:** `animate-in fade-in slide-in-from-top-2` - Entrada suave

---

## 📦 Dependências Utilizadas

- `lucide-react` - Ícones
- `react-router-dom` - Navegação
- `tailwindcss` - Estilização
- Contextos: `auth-context`, `notification-context`

---

## ✅ Checklist de Implementação

- [x] Dropdown de notificações no header
- [x] Badge com contador de não lidas
- [x] Animações nos ícones
- [x] Página completa de notificações
- [x] Sistema de filtros
- [x] Ações (marcar como lida, excluir)
- [x] Suporte a dark mode
- [x] Design responsivo
- [x] Rotas configuradas
- [x] Integração com navegação
- [ ] Integração com API backend
- [ ] WebSocket para tempo real
- [ ] Notificações push no navegador
- [ ] Preferências de notificação

---

## 📝 Notas Importantes

1. **Dados Mockados:** Atualmente usando dados de exemplo. Substituir por chamadas à API.
2. **Estado Local:** Notificações armazenadas em `useState`. Migrar para context/redux quando integrar API.
3. **Tempo Real:** Considerar implementar WebSocket para notificações instantâneas.
4. **Paginação:** Adicionar lazy loading para muitas notificações.
5. **Push Notifications:** Implementar API de notificações do navegador.

---

**Desenvolvido para:** Vitrine de Projetos SENAI  
**Data:** Outubro 2025  
**Versão:** 1.0.0
