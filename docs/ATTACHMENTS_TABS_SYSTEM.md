# 🎯 AttachmentsSection Atualizado - Sistema de Tabs

## 📋 O Que Mudou?

### ❌ Versão Antiga:
```tsx
// Upload genérico sem categorização
<input type="file" multiple onChange={...} />
```

### ✅ Nova Versão:
```tsx
// Sistema de tabs com componentes especializados
<AttachmentsSection data={{
  banner: File,
  ideacao: { descricao, anexos },
  modelagem: { descricao, anexos },
  prototipagem: { descricao, anexos },
  implementacao: { descricao, anexos }
}} />
```

---

## 🎨 Nova Interface

O `AttachmentsSection` agora é um **container com tabs** que renderiza os 4 componentes especializados:

```
┌─────────────────────────────────────────────────────┐
│ 🖼️ Banner do Projeto                                │
│ [Upload area com preview]                           │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 📎 Anexos das Etapas                                │
│                                                      │
│ Timeline Visual (Clicável):                         │
│  💡 Ideação  ⚙️ Modelagem  🎨 Prototipagem  🚀 Impl │
│  [active]    [2 anexos]    [inactive]    [5 anexos]│
│                                                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ CONTEÚDO DA TAB ATIVA                           │ │
│ │ <IdeacaoSection /> ou                          │ │
│ │ <ModelagemSection /> ou                        │ │
│ │ <PrototipagemSection /> ou                     │ │
│ │ <ImplementacaoSection />                       │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 Como Funciona

### 1. Timeline Interativa
```tsx
// Cada ícone da timeline é um botão clicável
{tabs.map((tab) => (
  <button onClick={() => setActiveTab(tab.id)}>
    <Icon /> {/* Lightbulb, Settings, Code, Rocket */}
    <span>{tab.name}</span>
    {attachmentCount > 0 && (
      <badge>{attachmentCount}</badge> {/* Badge com número de anexos */}
    )}
  </button>
))}
```

### 2. Renderização Condicional
```tsx
{activeTab === 'ideacao' && <IdeacaoSection ... />}
{activeTab === 'modelagem' && <ModelagemSection ... />}
{activeTab === 'prototipagem' && <PrototipagemSection ... />}
{activeTab === 'implementacao' && <ImplementacaoSection ... />}
```

### 3. Propagação de Dados
```tsx
const handlePhaseUpdate = (phase, field, value) => {
  onUpdate(phase, { ...data[phase], [field]: value })
}

// Passa para cada componente filho
<IdeacaoSection
  data={data.ideacao}
  onUpdate={(field, value) => handlePhaseUpdate('ideacao', field, value)}
/>
```

---

## 📊 Estrutura de Dados Atualizada

```typescript
// ANTES:
interface OldAttachmentsData {
  banner: File | null
  timelineFiles: (FileList | null)[]  // Array genérico
}

// DEPOIS:
interface NewAttachmentsData {
  banner: File | null
  ideacao: {
    descricao: string           // Descrição da fase
    anexos: Attachment[]        // Anexos categorizados
  }
  modelagem: {
    descricao: string
    anexos: Attachment[]
  }
  prototipagem: {
    descricao: string
    anexos: Attachment[]
  }
  implementacao: {
    descricao: string
    anexos: Attachment[]
  }
}

interface Attachment {
  id: string          // Único identificador
  file: File          // Arquivo real
  type: string        // crazy8, business_canvas, wireframes, etc.
}
```

---

## ✨ Features Implementadas

### 1. **Sistema de Tabs Animado**
- ✅ Animações Framer Motion (fade in/out, slide)
- ✅ Indicador visual da tab ativa (escala, ring, cor)
- ✅ Hover effects nos botões
- ✅ Badges com contagem de anexos

### 2. **Timeline Clicável**
- ✅ 4 ícones coloridos (Lightbulb, Settings, Code, Rocket)
- ✅ Gradientes específicos por fase
- ✅ Linha conectora animada
- ✅ Badges de progresso

### 3. **Upload de Banner Separado**
- ✅ Preview da imagem
- ✅ Botão de remover no hover
- ✅ Dica informativa

### 4. **Componentes Especializados**
- ✅ IdeacaoSection (8 tipos de anexos)
- ✅ ModelagemSection (5 tipos de anexos)
- ✅ PrototipagemSection (6 tipos de anexos)
- ✅ ImplementacaoSection (7 tipos de anexos)

---

## 🎯 Exemplo de Uso

```tsx
import { AttachmentsSection } from './sections'

const [formData, setFormData] = useState({
  banner: null,
  ideacao: { descricao: '', anexos: [] },
  modelagem: { descricao: '', anexos: [] },
  prototipagem: { descricao: '', anexos: [] },
  implementacao: { descricao: '', anexos: [] }
})

<AttachmentsSection
  data={formData}
  onUpdate={(field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }}
/>
```

---

## 🔄 Fluxo de Interação

1. **Usuário clica em uma fase** na timeline
   ```
   onClick={() => setActiveTab('modelagem')}
   ```

2. **Tab ativa muda com animação**
   ```tsx
   <motion.div
     key={activeTab}
     initial={{ opacity: 0, x: 20 }}
     animate={{ opacity: 1, x: 0 }}
   >
     {activeTab === 'modelagem' && <ModelagemSection />}
   </motion.div>
   ```

3. **Usuário adiciona arquivos** no componente
   ```
   handleFileUpload() → newAttachment → anexos.push()
   ```

4. **Dados propagam para cima**
   ```
   handlePhaseUpdate() → onUpdate() → setState()
   ```

5. **Badge atualiza automaticamente**
   ```tsx
   {data.modelagem.anexos.length > 0 && (
     <badge>{data.modelagem.anexos.length}</badge>
   )}
   ```

---

## 🎨 Animações e UX

### Transições de Tabs:
```tsx
// Entrada da direita
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}

// Saída para esquerda
exit={{ opacity: 0, x: -20 }}
```

### Hover nos Botões da Timeline:
```tsx
className={`transition-all ${
  isActive ? 'scale-110' : 'hover:scale-105'
}`}
```

### Badge Animado:
```tsx
<motion.span
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
>
  {count}
</motion.span>
```

---

## 📈 Benefícios da Nova Arquitetura

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Organização** | 1 campo genérico | 4 fases separadas |
| **Validação** | Nenhuma | Por tipo de arquivo |
| **UX** | Upload simples | Interface guiada |
| **Dados** | FileList[] | Attachment[] tipados |
| **Descrição** | Não tinha | 500 caracteres/fase |
| **Visual** | Timeline estática | Timeline interativa |
| **Contagem** | Manual | Automática com badges |

---

## 🚀 Próximas Melhorias Sugeridas

1. **Persistência Local**
   - Salvar progresso no localStorage
   - Recuperar rascunhos automaticamente

2. **Validação Avançada**
   - Verificar tamanho de arquivos
   - Validar formatos aceitos
   - Alertas de campos obrigatórios

3. **Preview de Arquivos**
   - Thumbnail para imagens
   - Ícones por tipo de arquivo
   - Player para vídeos/áudios

4. **Drag and Drop**
   - Arrastar arquivos para cada seção
   - Reordenar anexos

5. **Progress Bars**
   - Mostrar upload em andamento
   - Porcentagem de conclusão

---

## 📝 Checklist de Migração

Para migrar de `timelineFiles` para o novo formato:

```tsx
// ✅ 1. Atualizar interface de dados
interface FormData {
  - timelineFiles: (FileList | null)[]
  + ideacao: { descricao: string; anexos: Attachment[] }
  + modelagem: { descricao: string; anexos: Attachment[] }
  + prototipagem: { descricao: string; anexos: Attachment[] }
  + implementacao: { descricao: string; anexos: Attachment[] }
}

// ✅ 2. Inicializar novos campos
const [formData, setFormData] = useState({
  banner: null,
  ideacao: { descricao: '', anexos: [] },
  modelagem: { descricao: '', anexos: [] },
  prototipagem: { descricao: '', anexos: [] },
  implementacao: { descricao: '', anexos: [] }
})

// ✅ 3. Atualizar handler de update
const handleUpdate = (field: string, value: any) => {
  setFormData(prev => ({ ...prev, [field]: value }))
}

// ✅ 4. Passar para AttachmentsSection
<AttachmentsSection
  data={formData}
  onUpdate={handleUpdate}
/>
```

---

**Status:** ✅ AttachmentsSection totalmente refatorado com sistema de tabs e componentes especializados!

**Arquivo:** `src/features/student/create-project/components/sections/AttachmentsSection.tsx`

**Linhas de código:** ~240 linhas (versão otimizada com tabs)

**Data:** 19 de outubro de 2025
