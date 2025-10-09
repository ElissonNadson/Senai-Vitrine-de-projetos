# 🔧 Exemplo Prático: Editar Timeline de Projeto Existente

## 📋 Cenário

Estudante quer voltar ao projeto depois de publicado para **atualizar o progresso das etapas**.

---

## ✨ Funcionalidades

1. ✅ Carregar etapas existentes do backend
2. ✅ Editar título e descrição
3. ✅ Alterar status (Pendente → Em Andamento → Concluída)
4. ✅ Adicionar novas etapas
5. ✅ Deletar etapas (com confirmação)
6. ✅ Salvamento em tempo real
7. ✅ Feedback visual de loading

---

## 💻 Código Completo

Crie o arquivo: `src/components/EditProjectTimeline.tsx`

```tsx
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Save,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  Circle,
  TrendingUp,
  Loader2
} from 'lucide-react'
import { useEtapasProjeto } from '../hooks/use-etapas-projeto'

interface EditProjectTimelineProps {
  projetoUuid: string
  onSave?: () => void
}

const EditProjectTimeline: React.FC<EditProjectTimelineProps> = ({
  projetoUuid,
  onSave
}) => {
  const {
    etapas,
    loading,
    fetchEtapasByProjeto,
    updateEtapa,
    deleteEtapa,
    updateEtapaStatus
  } = useEtapasProjeto()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (projetoUuid) {
      fetchEtapasByProjeto(projetoUuid)
    }
  }, [projetoUuid])

  const handleStatusToggle = async (etapa: any) => {
    const statusOrder = ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA']
    const currentIndex = statusOrder.indexOf(etapa.status)
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length]

    setSavingIds(prev => new Set(prev).add(etapa.uuid))

    try {
      await updateEtapaStatus(etapa.uuid, nextStatus)
      onSave?.()
    } finally {
      setSavingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(etapa.uuid)
        return newSet
      })
    }
  }

  const handleDelete = async (uuid: string) => {
    if (!confirm('Deletar esta etapa?')) return

    setSavingIds(prev => new Set(prev).add(uuid))
    try {
      await deleteEtapa(uuid)
      onSave?.()
    } finally {
      setSavingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(uuid)
        return newSet
      })
    }
  }

  // ... resto do código (renderização dos cards de etapa)
}

export default EditProjectTimeline
```

---

## 🎯 Como Usar

### **1. Em uma página de edição de projeto:**

```tsx
import EditProjectTimeline from '@/components/EditProjectTimeline'

function EditarProjeto({ projeto }) {
  return (
    <div className="p-6">
      <h1>Editar: {projeto.titulo}</h1>
      
      <EditProjectTimeline 
        projetoUuid={projeto.uuid}
        onSave={() => {
          // Callback após salvar
          console.log('Timeline atualizada!')
        }}
      />
    </div>
  )
}
```

### **2. Como Modal/Dialog:**

```tsx
import EditProjectTimeline from '@/components/EditProjectTimeline'
import { Dialog } from '@/components/ui/dialog'

function ProjetoCard({ projeto }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        ✏️ Editar Timeline
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <EditProjectTimeline 
          projetoUuid={projeto.uuid}
          onSave={() => {
            setIsOpen(false)
            // Recarregar dados
          }}
        />
      </Dialog>
    </>
  )
}
```

---

## 🎨 Interface Visual

### **Card de Etapa (Modo Visualização):**

```
┌────────────────────────────────────────────────┐
│ [01] ──  Ideação              [✓ Concluída] │ ✏️ 🗑️ │
├────────────────────────────────────────────────┤
│ Fase de brainstorming e pesquisa inicial.     │
│ Definimos o problema e as possíveis soluções. │
└────────────────────────────────────────────────┘
```

### **Card de Etapa (Modo Edição):**

```
┌────────────────────────────────────────────────┐
│ [01] ──  [Input: Ideação_____]  [🔄 Salvando] │ ✓ ✕ │
├────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────┐ │
│ │ [Textarea: descrição...]                   │ │
│ │                                            │ │
│ └────────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Atualização de Status

```
Clique no badge "Pendente"
        ↓
   Mostra loading spinner
        ↓
   PUT /api/v1/senai/etapasProjeto/update/{uuid}
   Body: { ...etapa, status: "EM_ANDAMENTO" }
        ↓
   Badge atualiza para "Em Andamento" (amarelo)
        ↓
   Remove loading spinner
```

---

## 📊 Estados Visuais

| Estado           | Indicador Visual                      |
|------------------|---------------------------------------|
| **Salvando**     | 🔄 Spinner animado                    |
| **Salvo**        | ✓ Checkmark verde                     |
| **Erro**         | ⚠️ Mensagem vermelha                  |
| **Editando**     | 📝 Campos habilitados + botões ação   |
| **Deletando**    | 🗑️ Confirmação + loading              |

---

## 🛡️ Validações

### **Antes de Salvar:**
```tsx
if (!editForm.nomeEtapa || !editForm.descricao) {
  alert('Preencha todos os campos!')
  return
}
```

### **Antes de Deletar:**
```tsx
if (!confirm('Tem certeza?')) {
  return
}

if (etapas.length === 1) {
  alert('Mantenha pelo menos 1 etapa!')
  return
}
```

---

## 🚀 Próximos Passos

1. **Drag-and-Drop:** Reordenar etapas arrastando
2. **Upload de Imagens:** Anexar fotos em cada etapa
3. **Histórico:** Ver versões anteriores
4. **Comentários:** Professores comentarem nas etapas
5. **Notificações:** Avisar quando etapa concluída

---

**Criado em:** 7 de outubro de 2025  
**Versão:** 1.0.0
