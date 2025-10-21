# 🎨 Card de Resumo de Projeto - Guia Visual

## 📸 Preview do Card

### Estado Compacto (Padrão)

```
┌─────────────────────────────────────────────────────────┐
│  [Banner do Projeto - 192px altura]                     │
│  ┌────────────────────────────┐  ┌──────────────────┐   │
│  │ 🟢 Ativo                   │  │ 💡 Ideação       │   │
│  └────────────────────────────┘  └──────────────────┘   │
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │  Sistema de Gestão Escolar                     │     │
│  │  Uma plataforma completa para gerenciar...     │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  ┌────────────────────┐  ┌─────────────────────┐       │
│  │ 🎓 Curso           │  │ 👥 Turma             │       │
│  │ Desenvolvimento    │  │ 2024-DS-01           │       │
│  └────────────────────┘  └─────────────────────┘       │
│                                                          │
│  ┌────────────────────┐  ┌─────────────────────┐       │
│  │ 📚 Categoria       │  │ 📍 Modalidade        │       │
│  │ Educação           │  │ Presencial           │       │
│  └────────────────────┘  └─────────────────────┘       │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│  │📖 Itine  │ │🔧 SENAI  │ │🏆 SAGA   │                │
│  └──────────┘ └──────────┘ └──────────┘                │
│                                                          │
│  ┌──────────────────────────────────────────────┐       │
│  │     Ver Mais Detalhes             🔽         │       │
│  └──────────────────────────────────────────────┘       │
│                                                          │
│  ┌────────────┐ ┌─────────────┐ ┌──────┐               │
│  │ ✏️ Editar  │ │ ➕ Nova     │ │ 🗑️  │               │
│  │            │ │    Etapa    │ │      │               │
│  └────────────┘ └─────────────┘ └──────┘               │
│                                                          │
│  Ver página completa do projeto 🔗                      │
└─────────────────────────────────────────────────────────┘
```

### Estado Expandido

```
┌─────────────────────────────────────────────────────────┐
│  [Banner do Projeto - 192px altura]                     │
│  ┌────────────────────────────┐  ┌──────────────────┐   │
│  │ 🟢 Ativo                   │  │ 💡 Ideação       │   │
│  └────────────────────────────┘  └──────────────────┘   │
│                                                          │
│  Sistema de Gestão Escolar                              │
│  Uma plataforma completa para gerenciar...              │
│                                                          │
│  [Grid 2x2 de Informações]                              │
│  [Badges de Programas]                                  │
│                                                          │
│  ┌──────────────────────────────────────────────┐       │
│  │     Ver Menos                     🔼         │       │
│  └──────────────────────────────────────────────┘       │
│  ─────────────────────────────────────────────────      │
│                                                          │
│  ┌─────────────────────────────────────────────┐        │
│  │ 📖 Unidade Curricular                        │        │
│  │                                              │        │
│  │ Programação Web                              │        │
│  │ Desenvolvimento de aplicações web...         │        │
│  │ ⏰ 80 horas                                  │        │
│  └─────────────────────────────────────────────┘        │
│                                                          │
│  ┌─────────────────────────────────────────────┐        │
│  │ 👥 Líder do Projeto                          │        │
│  │                                              │        │
│  │ João Silva                                   │        │
│  │ joao.silva@example.com                       │        │
│  │ Matrícula: 2024001                           │        │
│  └─────────────────────────────────────────────┘        │
│                                                          │
│  ┌─────────────────┐  ┌─────────────────┐              │
│  │ 💻 Código       │  │ 🛡️ Anexos      │              │
│  │ 🌐 Público      │  │ 🔒 Privado      │              │
│  └─────────────────┘  └─────────────────┘              │
│                                                          │
│  ┌─────────────────────────────────────────────┐        │
│  │ 📅 Timeline                                  │        │
│  │                                              │        │
│  │ Criado em:        20 out 2025                │        │
│  │ Atualizado em:    20 out 2025                │        │
│  └─────────────────────────────────────────────┘        │
│                                                          │
│  [Botões de Ação]                                       │
│  [Link Ver página completa]                             │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Paleta de Cores por Fase

### 1️⃣ Ideação (Amarelo/Âmbar)

**Light Mode:**
```css
Background: linear-gradient(to bottom right, #fef3c7, #fef3c7) /* yellow-50 to amber-50 */
Border: #fde68a /* yellow-200 */
Icon Gradient: linear-gradient(to bottom right, #fbbf24, #f59e0b) /* yellow-400 to amber-500 */
Badge: #eab308 /* yellow-500 */
```

**Dark Mode:**
```css
Background: linear-gradient(to bottom right, rgba(113, 63, 18, 0.2), rgba(120, 53, 15, 0.2))
Border: #854d0e /* yellow-800 */
```

### 2️⃣ Modelagem (Azul/Índigo)

**Light Mode:**
```css
Background: linear-gradient(to bottom right, #dbeafe, #e0e7ff) /* blue-50 to indigo-50 */
Border: #bfdbfe /* blue-200 */
Icon Gradient: linear-gradient(to bottom right, #3b82f6, #4f46e5) /* blue-500 to indigo-600 */
Badge: #3b82f6 /* blue-500 */
```

**Dark Mode:**
```css
Background: linear-gradient(to bottom right, rgba(30, 58, 138, 0.2), rgba(55, 48, 163, 0.2))
Border: #1e3a8a /* blue-800 */
```

### 3️⃣ Prototipagem (Roxo/Rosa)

**Light Mode:**
```css
Background: linear-gradient(to bottom right, #f3e8ff, #fce7f3) /* purple-50 to pink-50 */
Border: #e9d5ff /* purple-200 */
Icon Gradient: linear-gradient(to bottom right, #a855f7, #db2777) /* purple-500 to pink-600 */
Badge: #a855f7 /* purple-500 */
```

**Dark Mode:**
```css
Background: linear-gradient(to bottom right, rgba(88, 28, 135, 0.2), rgba(131, 24, 67, 0.2))
Border: #581c87 /* purple-800 */
```

### 4️⃣ Implementação (Verde/Esmeralda)

**Light Mode:**
```css
Background: linear-gradient(to bottom right, #dcfce7, #d1fae5) /* green-50 to emerald-50 */
Border: #bbf7d0 /* green-200 */
Icon Gradient: linear-gradient(to bottom right, #22c55e, #10b981) /* green-500 to emerald-600 */
Badge: #22c55e /* green-500 */
```

**Dark Mode:**
```css
Background: linear-gradient(to bottom right, rgba(20, 83, 45, 0.2), rgba(6, 78, 59, 0.2))
Border: #14532d /* green-800 */
```

---

## 🔄 Animações Detalhadas

### 1. Entrada do Card

```typescript
Efeito: Fade + Slide from bottom
Duração: 300ms
Timing: Default easing

Valores:
  initial: { opacity: 0, y: 20 }
  animate: { opacity: 1, y: 0 }
  exit: { opacity: 0, y: -20 }
```

**Visual:**
```
Frame 0ms:   [Card invisível, 20px abaixo]
Frame 150ms: [Card 50% visível, 10px abaixo]
Frame 300ms: [Card 100% visível, posição final]
```

### 2. Expansão/Colapso

```typescript
Efeito: Height animation + Fade
Duração: 300ms
Propriedades animadas: height, opacity

Valores:
  Expandir:  { height: 0, opacity: 0 } → { height: 'auto', opacity: 1 }
  Recolher:  { height: 'auto', opacity: 1 } → { height: 0, opacity: 0 }
```

**Visual:**
```
Expandir:
  Frame 0ms:   [Conteúdo colapsado, altura 0]
  Frame 150ms: [Conteúdo 50% visível]
  Frame 300ms: [Conteúdo totalmente expandido]

Recolher:
  Frame 0ms:   [Conteúdo expandido]
  Frame 150ms: [Conteúdo 50% visível]
  Frame 300ms: [Conteúdo colapsado]
```

### 3. Hover nos Botões

#### Botão Editar:
```typescript
Ícone rotaciona 12° no hover
Transição: 300ms
```
```
Normal: ✏️  (0°)
Hover:  ✏️  (12° clockwise)
```

#### Botão Nova Etapa:
```typescript
Ícone rotaciona 90° no hover
Transição: 300ms
```
```
Normal: ➕  (0°)
Hover:  ✖️  (90° clockwise)
```

#### Botão Excluir:
```typescript
Ícone aumenta 10% no hover
Transição: 300ms
```
```
Normal: 🗑️  (scale: 1.0)
Hover:  🗑️  (scale: 1.1)
```

### 4. Modal de Exclusão

#### Backdrop:
```typescript
Efeito: Fade in/out
Duração: 200ms

Valores:
  initial: { opacity: 0 }
  animate: { opacity: 1 }
  exit: { opacity: 0 }
```

#### Modal Content:
```typescript
Efeito: Scale + Fade
Duração: 300ms

Valores:
  initial: { scale: 0.9, opacity: 0 }
  animate: { scale: 1, opacity: 1 }
  exit: { scale: 0.9, opacity: 0 }
```

**Visual:**
```
Abrir Modal:
  Frame 0ms:   [Backdrop invisível, modal 90% do tamanho]
  Frame 100ms: [Backdrop 50% opaco, modal 95% do tamanho]
  Frame 200ms: [Backdrop opaco, modal escala normal]
  Frame 300ms: [Estado final]

Fechar Modal:
  Processo inverso
```

---

## 📐 Dimensões e Espaçamentos

### Card Container:
```
Max Width: Definido pelo grid container
Height: Auto (adapta ao conteúdo)
Border Radius: 24px (rounded-3xl)
Border Width: 2px
Shadow: xl (0 20px 25px -5px rgba(0, 0, 0, 0.1))
Hover Shadow: 2xl (0 25px 50px -12px rgba(0, 0, 0, 0.25))
```

### Banner (se disponível):
```
Height: 192px (h-48)
Width: 100%
Object Fit: cover
Overlay Gradient: from-black/60 (bottom) to-transparent (top)
```

### Badges:
```
Fase Badge:
  Padding: 8px 16px (px-4 py-2)
  Border Radius: 9999px (rounded-full)
  Font Size: 14px (text-sm)
  Font Weight: 700 (font-bold)
  Gap: 8px (gap-2)

Status Badge:
  Padding: 6px 12px (px-3 py-1.5)
  Border Radius: 9999px
  Font Size: 12px (text-xs)
  Font Weight: 600 (font-semibold)
  Dot Size: 8px (w-2 h-2)
```

### Ícones Principais:
```
Fase Icon (sem banner): 32px × 32px (w-8 h-8)
Fase Icon (badges): 16px × 16px (w-4 h-4)
Info Icons: 16px × 16px (w-4 h-4)
Action Icons: 16px × 16px (w-4 h-4)
Badge Icons: 14px × 14px (w-3.5 h-3.5)
```

### Grid de Informações:
```
Columns: 2
Gap: 12px (gap-3)
Cell Padding: 12px (p-3)
Cell Border Radius: 12px (rounded-xl)
```

### Botões de Ação:
```
Height: 48px (py-3)
Padding Horizontal: 16px (px-4)
Border Radius: 12px (rounded-xl)
Gap entre ícone e texto: 8px (gap-2)
Gap entre botões: 12px (gap-3)

Editar: flex-1 (ocupa espaço disponível)
Nova Etapa: flex-1 (ocupa espaço disponível)
Excluir: Width auto (apenas ícone)
```

### Seção Expandível:
```
Padding Top: 16px (pt-4)
Border Top: 2px
Border Color: gray-200 / gray-700
Gap entre cards: 16px (gap-4)

Card de Info Padding: 16px (p-4)
Card Border Radius: 12px (rounded-xl)
```

---

## 🎯 Hierarquia Visual

### Nível 1 - Primário (Mais Destaque):
- ✅ Título do Projeto (text-2xl font-bold)
- ✅ Badge da Fase (cores vibrantes, posição destacada)
- ✅ Botões de Ação (gradientes coloridos, shadows)

### Nível 2 - Secundário:
- ✅ Descrição do Projeto (text-sm)
- ✅ Grid de Informações (background destacado)
- ✅ Badges de Programas (cores temáticas)
- ✅ Status Badge

### Nível 3 - Terciário:
- ✅ Detalhes Expandíveis (text-xs/text-sm)
- ✅ Datas (text-xs)
- ✅ Link "Ver página completa" (text-sm, cor secundária)

### Peso de Fontes:
```
Título Principal: 700 (font-bold)
Subtítulos: 700 (font-bold)
Labels: 600 (font-semibold)
Valores: 600 (font-semibold)
Descrições: 400 (normal)
Textos auxiliares: 400 (normal)
```

---

## 💡 Casos de Uso Especiais

### Projeto SEM Banner:

```
┌─────────────────────────────────────────────┐
│  ┌────────┐                ┌──────────────┐ │
│  │        │                │ 💡 Ideação   │ │
│  │   💡   │                └──────────────┘ │
│  │        │                                 │
│  └────────┘                                 │
│  [Gradiente da Fase]                        │
│                                             │
│  [Resto do conteúdo...]                     │
└─────────────────────────────────────────────┘
```

### Projeto SEM Badges de Programas:

Os badges são condicionais:
```tsx
{project.itinerario && <Badge>Itinerário</Badge>}
{project.labMaker && <Badge>SENAI Lab</Badge>}
{project.participouSaga && <Badge>SAGA SENAI</Badge>}
```

Se nenhum estiver presente, a seção não aparece.

### Projeto SEM Unidade Curricular:

```tsx
{project.unidadeCurricular?.nome || 'Não informado'}
```

Mostra "Não informado" com estilo discreto.

---

## 🔍 Detalhes de Acessibilidade

### Contraste de Cores:
- ✅ Todos os textos têm contraste mínimo de 4.5:1
- ✅ Badges têm cores de fundo e texto com alto contraste
- ✅ Ícones têm tamanho mínimo de 16px

### Interatividade:
- ✅ Todos os botões têm estados de hover visíveis
- ✅ Cursor pointer em elementos clicáveis
- ✅ Área de clique mínima de 44×44px nos botões

### Feedback Visual:
- ✅ Animações suaves (não bruscas)
- ✅ Transições consistentes (300ms)
- ✅ Estados de loading (se implementado)

### Semântica:
- ✅ Uso de elementos HTML semânticos
- ✅ Alt text em imagens (banner)
- ✅ Labels descritivos

---

## 📱 Comportamento Responsivo

### Mobile (< 640px):
```
- Cards ocupam 100% da largura
- Grid 2x2 mantido (mas mais compacto)
- Texto truncado com line-clamp
- Botões empilhados se necessário
```

### Tablet (640px - 1024px):
```
- 1 card por linha
- Espaçamentos mantidos
- Grid 2x2 com espaço confortável
```

### Desktop (1024px+):
```
- 2 cards por linha (lg:grid-cols-2)
- Espaçamentos completos
- Hover effects ativados
```

### Desktop Large (1280px+):
```
- 3 cards por linha (xl:grid-cols-3)
- Layout otimizado para telas grandes
- Todos os detalhes visíveis
```

---

## 🎨 Temas de Cor Adicionais (Futuros)

### Para Outras Categorias/Status:

#### Concluído (Cinza):
```tsx
{
  name: 'Concluído',
  icon: CheckCircle,
  color: 'gray',
  gradient: 'from-gray-500 to-slate-600',
  bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
  darkBg: 'dark:from-gray-900/20 dark:to-slate-900/20',
  border: 'border-gray-200 dark:border-gray-800',
  badge: 'bg-gray-500'
}
```

#### Em Revisão (Laranja):
```tsx
{
  name: 'Em Revisão',
  icon: AlertCircle,
  color: 'orange',
  gradient: 'from-orange-500 to-amber-600',
  bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
  darkBg: 'dark:from-orange-900/20 dark:to-amber-900/20',
  border: 'border-orange-200 dark:border-orange-800',
  badge: 'bg-orange-500'
}
```

---

## 🎯 Conclusão Visual

O **ProjectSummaryCard** oferece:

1. **Visual Moderno** com gradientes e sombras sutis
2. **Hierarquia Clara** com diferentes níveis de importância
3. **Feedback Visual** através de animações e estados de hover
4. **Responsividade Total** adaptando-se a qualquer tela
5. **Acessibilidade** com bom contraste e áreas de toque adequadas
6. **Consistência** com o design system do projeto
7. **Flexibilidade** para diferentes estados e dados

**Uma experiência visual profissional e moderna! 🎨✨**

---

**Guia Visual Criado:** 20 de outubro de 2025  
**Versão:** 1.0
