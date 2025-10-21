# 🎨 Sistema de Cards Colapsáveis - Documentação das Etapas do Projeto

## 📋 Visão Geral

Implementamos um sistema de **cards colapsáveis (accordion)** para todas as seções de documentos das etapas do projeto (Ideação, Modelagem, Prototipagem e Implementação). Este novo design melhora significativamente a UI/UX, tornando a interface mais limpa, organizada e profissional.

## ✨ Principais Melhorias

### 1. **Design Colapsável**
- **Todos os documentos começam fechados** - Interface limpa e menos poluída
- **Click para expandir** - Usuário escolhe qual documento quer ver
- **Animação suave** - Transição fluida ao abrir/fechar cards
- **Indicador visual** - Ícone de chevron que rotaciona ao expandir

### 2. **Sistema de Cores Vibrantes**
Cada tipo de documento possui uma cor única e gradiente vibrante:

#### **Fase 1: Ideação** 🟡
- Crazy 8: `from-rose-500 to-pink-600` (Rosa → Rosa Pink)
- Mapa Mental: `from-purple-500 to-indigo-600` (Roxo → Índigo)
- Value Proposition: `from-blue-500 to-cyan-600` (Azul → Ciano)
- Customer Journey: `from-teal-500 to-emerald-600` (Teal → Esmeralda)
- SCAMPER: `from-orange-500 to-amber-600` (Laranja → Âmbar)
- Mapa de Empatia: `from-fuchsia-500 to-pink-600` (Fúcsia → Rosa)
- Vídeo Pitch: `from-red-500 to-rose-600` (Vermelho → Rosa)
- Persona: `from-amber-500 to-yellow-500` (Âmbar → Amarelo)

#### **Fase 2: Modelagem** 🔵
- Business Canvas: `from-blue-500 to-indigo-600` (Azul → Índigo)
- Viabilidade: `from-emerald-500 to-teal-600` (Esmeralda → Teal)
- SWOT: `from-purple-500 to-pink-600` (Roxo → Rosa)
- Matriz de Riscos: `from-red-500 to-orange-600` (Vermelho → Laranja)
- Cronograma: `from-cyan-500 to-blue-600` (Ciano → Azul)

#### **Fase 3: Prototipagem** 🟣
- Wireframes: `from-slate-500 to-gray-600` (Ardósia → Cinza)
- Mockups: `from-pink-500 to-rose-600` (Rosa → Rosa)
- Protótipo Interativo: `from-violet-500 to-purple-600` (Violeta → Roxo)
- Modelagem 3D: `from-cyan-500 to-blue-600` (Ciano → Azul)
- Maquete Física: `from-amber-500 to-orange-600` (Âmbar → Laranja)
- Fluxograma: `from-teal-500 to-emerald-600` (Teal → Esmeralda)

#### **Fase 4: Implementação** 🟢
- Vídeo Pitch Final: `from-red-500 to-rose-600` (Vermelho → Rosa)
- Teste Piloto: `from-blue-500 to-cyan-600` (Azul → Ciano)
- Registro de Testes: `from-indigo-500 to-purple-600` (Índigo → Roxo)
- Feedback Cliente: `from-emerald-500 to-teal-600` (Esmeralda → Teal)
- Entrevista Usuários: `from-amber-500 to-orange-600` (Âmbar → Laranja)
- Vídeo Usuários: `from-violet-500 to-fuchsia-600` (Violeta → Fúcsia)
- Relato Experiência: `from-pink-500 to-rose-600` (Rosa → Rosa)

### 3. **Estrutura do Card**

#### **Header (Sempre Visível)**
```
┌─────────────────────────────────────────────────┐
│ [Ícone Colorido] Título do Documento  [Badge]  │
│                  Prévia da descrição...         │
│                                        [Chevron]│
└─────────────────────────────────────────────────┘
```

- **Ícone com gradiente** único para cada documento
- **Título** claro e descritivo
- **Badge verde** mostrando quantidade de arquivos anexados
- **Prévia da descrição** (primeiros 60 caracteres)
- **Chevron animado** que rotaciona ao expandir

#### **Conteúdo (Colapsável)**
Quando expandido, mostra:

1. **Descrição Completa**
   - Card com fundo gradiente sutil
   - Texto completo explicativo sobre o documento

2. **Botão de Template** (se disponível)
   - Botão com gradiente colorido
   - Link para baixar modelos/exemplos
   - Animação de hover (elevação e sombra)

3. **Área de Upload/Link**
   - Para arquivos: área de drag & drop
   - Para links: input com ícone e botão estilizado
   - Feedback visual ao arrastar arquivo

4. **Lista de Arquivos Anexados**
   - Cards individuais para cada arquivo
   - Ícone colorido matching com o tipo de documento
   - Nome, tamanho e botões de ação
   - Animação de entrada/saída

### 4. **Estados Visuais**

#### **Sem Anexo**
- Borda cinza clara
- Hover: borda ligeiramente mais escura
- Estado neutro

#### **Com Anexo**
- **Borda verde** (indica conclusão)
- **Sombra elevada** (destaque visual)
- **Badge verde** com número de arquivos

#### **Durante Drag & Drop**
- Borda colorida (azul/roxo/verde conforme fase)
- Fundo com cor translúcida
- Ícone ampliado
- Feedback visual claro

### 5. **Animações**

#### **Entrada dos Cards**
```typescript
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: index * 0.05 }}
```
- Cards aparecem sequencialmente
- Efeito de deslize suave para cima

#### **Expansão/Colapso**
```typescript
initial={{ height: 0, opacity: 0 }}
animate={{ height: 'auto', opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
transition={{ duration: 0.3 }}
```
- Animação de altura fluida
- Fade in/out simultâneo

#### **Rotação do Chevron**
```typescript
className={`transition-transform duration-300 ${
  isExpanded ? 'rotate-180' : ''
}`}
```
- Rotação suave de 180°

#### **Arquivos Anexados**
```typescript
initial={{ opacity: 0, x: -10 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: 10 }}
```
- Entrada pela esquerda
- Saída pela direita

## 🎯 Benefícios UX/UI

### **Organização**
- Interface mais limpa e menos intimidadora
- Foco no conteúdo relevante
- Redução de scroll excessivo

### **Hierarquia Visual**
- Cores ajudam a identificar rapidamente cada documento
- Estados visuais claros (pendente/concluído)
- Priorização intuitiva

### **Feedback Visual**
- Estados de hover bem definidos
- Animações suaves e profissionais
- Indicadores claros de progresso

### **Acessibilidade**
- Contraste adequado de cores
- Ícones descritivos
- Textos legíveis
- Áreas de clique generosas

### **Performance**
- Animações otimizadas com framer-motion
- Renderização condicional (só expande o necessário)
- Lazy loading implícito

## 📂 Arquivos Modificados

```
src/features/student/create-project/components/sections/
├── IdeacaoSection.tsx         ✅ Atualizado
├── ModelagemSection.tsx       ✅ Atualizado
├── PrototipagemSection.tsx    ✅ Atualizado
└── ImplementacaoSection.tsx   ✅ Atualizado
```

## 🔧 Tecnologias Utilizadas

- **React** - Componentes funcionais com hooks
- **TypeScript** - Tipagem forte
- **Framer Motion** - Animações fluidas (AnimatePresence)
- **Tailwind CSS** - Estilos utilitários e gradientes
- **Lucide React** - Ícones modernos

## 💡 Como Usar

1. **Visualizar**: Click no header do card para expandir
2. **Upload**: Arraste arquivo ou clique na área de upload
3. **Link**: Cole URL e clique em "Adicionar Link"
4. **Remover**: Click no X vermelho do arquivo
5. **Template**: Click no botão colorido para baixar modelo

## 🎨 Princípios de Design Aplicados

- **Progressive Disclosure**: Informação revelada gradualmente
- **Visual Hierarchy**: Cores e tamanhos guiam o olhar
- **Feedback Imediato**: Cada ação tem resposta visual
- **Consistência**: Padrão uniforme em todas as fases
- **Affordance**: Elementos parecem clicáveis/arrastáveis

## 🚀 Resultado Final

Um sistema de formulário mais **profissional**, **intuitivo** e **agradável** de usar, que:
- Reduz a carga cognitiva do usuário
- Torna o preenchimento mais eficiente
- Mantém o usuário focado e engajado
- Transmite profissionalismo e cuidado com detalhes
