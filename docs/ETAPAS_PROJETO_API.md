# 📊 Sistema de Etapas do Projeto - Integração com API

## 🎯 Visão Geral

O sistema de etapas do projeto permite que os estudantes documentem e acompanhem o progresso de seus projetos através de uma **timeline interativa e incremental**. As etapas são sincronizadas automaticamente com o backend através da API REST.

---

## 🔌 Endpoints Disponíveis

### 📋 **GET - Listar Etapas**

```http
GET /api/v1/senai/etapasProjeto/findAll
GET /api/v1/senai/etapasProjeto/findByUUID/{uuid}
GET /api/v1/senai/etapasProjeto/findByProjeto/{projetoUuid}
GET /api/v1/senai/etapasProjeto/findByStatus/{status}
```

**Headers:**
```
Authorization: Bearer {token}
```

**Exemplo de Resposta:**
```json
[
  {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "projeto": {
      "uuid": "660e8400-e29b-41d4-a716-446655440001"
    },
    "nomeEtapa": "Ideação",
    "descricao": "Fase de brainstorming e planejamento inicial do projeto",
    "ordem": 1,
    "status": "CONCLUIDA",
    "criadoEm": "2025-10-01T10:00:00Z",
    "atualizadoEm": "2025-10-05T14:30:00Z"
  }
]
```

---

### ✅ **POST - Criar Etapa**

```http
POST /api/v1/senai/etapasProjeto/create
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "projeto": {
    "uuid": "660e8400-e29b-41d4-a716-446655440001"
  },
  "nomeEtapa": "Prototipagem",
  "descricao": "Desenvolvimento de protótipos e testes de usabilidade",
  "ordem": 2,
  "status": "EM_ANDAMENTO",
  "criadoEm": "2025-10-07T08:00:00Z",
  "atualizadoEm": "2025-10-07T08:00:00Z"
}
```

**Status Permitidos:**
- `PENDENTE` - Etapa não iniciada
- `EM_ANDAMENTO` - Etapa em progresso
- `CONCLUIDA` - Etapa finalizada

---

### 🔄 **PUT - Atualizar Etapa**

```http
PUT /api/v1/senai/etapasProjeto/update/{uuid}
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:** (mesma estrutura do POST)

---

### 🗑️ **DELETE - Remover Etapa**

```http
DELETE /api/v1/senai/etapasProjeto/delete/{uuid}
```

**Headers:**
```
Authorization: Bearer {token}
```

---

## 💻 Uso no Frontend

### **Hook Customizado: `useEtapasProjeto`**

Criamos um hook React para facilitar o gerenciamento das etapas:

```tsx
import { useEtapasProjeto } from '@/hooks/use-etapas-projeto'

function MyComponent() {
  const {
    etapas,              // Lista de etapas
    loading,             // Estado de carregamento
    error,               // Mensagem de erro
    fetchEtapasByProjeto,  // Buscar etapas por projeto
    createEtapa,         // Criar nova etapa
    updateEtapa,         // Atualizar etapa existente
    deleteEtapa,         // Deletar etapa
    updateEtapaStatus,   // Atualizar apenas o status
    clearEtapas          // Limpar lista local
  } = useEtapasProjeto()

  // Buscar etapas de um projeto
  useEffect(() => {
    fetchEtapasByProjeto('uuid-do-projeto')
  }, [])

  return (
    <div>
      {loading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}
      {etapas.map(etapa => (
        <div key={etapa.uuid}>{etapa.nomeEtapa}</div>
      ))}
    </div>
  )
}
```

---

### **Funções Principais**

#### 1. **Buscar Etapas de um Projeto**
```tsx
await fetchEtapasByProjeto('uuid-do-projeto')
```

#### 2. **Criar Nova Etapa**
```tsx
const novaEtapa = await createEtapa({
  projeto: { uuid: 'uuid-do-projeto' },
  nomeEtapa: 'Desenvolvimento',
  descricao: 'Implementação das funcionalidades principais',
  ordem: 3,
  status: 'EM_ANDAMENTO',
  criadoEm: new Date().toISOString(),
  atualizadoEm: new Date().toISOString()
})
```

#### 3. **Atualizar Etapa**
```tsx
await updateEtapa('uuid-da-etapa', {
  projeto: { uuid: 'uuid-do-projeto' },
  nomeEtapa: 'Desenvolvimento (Atualizado)',
  descricao: 'Nova descrição',
  ordem: 3,
  status: 'CONCLUIDA',
  criadoEm: '2025-10-01T10:00:00Z',
  atualizadoEm: new Date().toISOString()
})
```

#### 4. **Atualizar Apenas Status**
```tsx
await updateEtapaStatus('uuid-da-etapa', 'CONCLUIDA')
```

#### 5. **Deletar Etapa**
```tsx
await deleteEtapa('uuid-da-etapa')
```

---

## 🎨 Componente Timeline Integrado

O componente `TimelineProgressStep` já está **totalmente integrado** com a API:

### **Recursos Implementados:**

✅ **Salvamento Automático**
- Quando o projeto é criado, todas as etapas são automaticamente salvas no backend
- Etapas são vinculadas ao UUID do projeto

✅ **Atualização de Status em Tempo Real**
- Clicar no badge de status atualiza imediatamente no servidor
- Indicador visual de "salvando..." enquanto processa

✅ **Edição Incremental**
- Estudantes podem adicionar/editar etapas a qualquer momento
- Mudanças são sincronizadas com o backend automaticamente

✅ **Indicadores Visuais**
- ✓ **Verde com checkmark**: Etapa salva no servidor
- 🔄 **Loading spinner**: Salvando/atualizando
- ⚠️ **Mensagem de erro**: Se falhar ao salvar

---

## 🔄 Fluxo de Trabalho

### **1. Criação do Projeto**
```
Estudante preenche: Detalhes → Acadêmico → Equipe → Timeline → Revisar
                                                         ↓
                                              Timeline é salva no backend
```

### **2. Atualização Incremental**
```
Estudante volta ao projeto depois de 1 semana
                ↓
        Acessa "Editar Projeto"
                ↓
        Vai para aba "Timeline"
                ↓
    Clica no status de "Prototipagem" → muda para "Concluída"
                ↓
        Adiciona nova etapa "Testes"
                ↓
        Mudanças são salvas automaticamente
```

### **3. Visualização Pública**
```
Visitante acessa página do projeto
                ↓
    Timeline mostra progresso visual com etapas coloridas
                ↓
    Status: Pendente (cinza) | Em Andamento (amarelo) | Concluída (verde)
```

---

## 📊 Mapeamento de Status

O componente usa internamente status em inglês, mas envia para o backend em português (conforme API):

| Frontend          | Backend        | Cor     | Ícone |
|-------------------|----------------|---------|-------|
| `pending`         | `PENDENTE`     | Cinza   | ○     |
| `in-progress`     | `EM_ANDAMENTO` | Amarelo | ↗     |
| `completed`       | `CONCLUIDA`    | Verde   | ✓     |

**Funções de Conversão:**
```tsx
// Componente → API
mapStatusToBackend('in-progress') // → 'EM_ANDAMENTO'

// API → Componente
mapStatusFromBackend('CONCLUIDA') // → 'completed'
```

---

## 🛡️ Tratamento de Erros

### **Erro ao Criar Etapa**
```tsx
try {
  await createEtapa(etapaData)
} catch (error) {
  // Exibe mensagem: "Erro ao criar etapa"
  // Etapa permanece como "não salva" (pode tentar novamente)
}
```

### **Erro ao Atualizar Status**
```tsx
try {
  await updateEtapaStatus(uuid, 'CONCLUIDA')
} catch (error) {
  // Exibe mensagem: "Erro ao atualizar status da etapa"
  // Status volta ao anterior localmente
}
```

### **Erro ao Deletar**
```tsx
try {
  await deleteEtapa(uuid)
} catch (error) {
  // Exibe mensagem: "Erro ao deletar etapa"
  // Etapa é removida localmente mesmo se falhar no backend
}
```

---

## 🎯 Boas Práticas

### ✅ **Validação antes de Salvar**
```tsx
// Só salva etapas com título E descrição
if (!step.title || !step.description) {
  return // Não envia para API
}
```

### ✅ **Ordem Automática**
```tsx
// Ao adicionar nova etapa, ordem é calculada automaticamente
const newStep = {
  ordem: customSteps.length + 1,
  // ...
}
```

### ✅ **Reordenação ao Deletar**
```tsx
// Após deletar etapa, reordena as restantes
const reordered = updated.map((step, idx) => ({
  ...step,
  ordem: idx + 1
}))
```

### ✅ **Feedback Visual**
```tsx
// Sempre mostrar estado de loading/salvando
{savingSteps.has(step.id) && <Loader2 className="animate-spin" />}

// Sempre mostrar se foi salvo
{step.isSaved && <CheckCircle className="text-green-600" />}
```

---

## 🔧 Configuração

### **1. Adicionar Hook ao Projeto**
```bash
# Hook já criado em:
src/hooks/use-etapas-projeto.ts
```

### **2. Importar no Componente**
```tsx
import { useEtapasProjeto } from '@/hooks/use-etapas-projeto'
```

### **3. Usar no TimelineProgressStep**
```tsx
const { createEtapa, updateEtapa, deleteEtapa } = useEtapasProjeto()
```

---

## 📝 Exemplo Completo

```tsx
import { useEtapasProjeto } from '@/hooks/use-etapas-projeto'

function ProjetoTimeline({ projetoUuid }: { projetoUuid: string }) {
  const {
    etapas,
    loading,
    error,
    fetchEtapasByProjeto,
    createEtapa,
    updateEtapaStatus
  } = useEtapasProjeto()

  useEffect(() => {
    fetchEtapasByProjeto(projetoUuid)
  }, [projetoUuid])

  const adicionarEtapa = async () => {
    await createEtapa({
      projeto: { uuid: projetoUuid },
      nomeEtapa: 'Nova Etapa',
      descricao: 'Descrição da etapa',
      ordem: etapas.length + 1,
      status: 'PENDENTE',
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    })
  }

  const marcarConcluida = async (etapaUuid: string) => {
    await updateEtapaStatus(etapaUuid, 'CONCLUIDA')
  }

  return (
    <div>
      {loading && <p>Carregando timeline...</p>}
      {error && <p className="text-red-600">{error}</p>}
      
      <div className="space-y-4">
        {etapas.map(etapa => (
          <div key={etapa.uuid} className="border p-4 rounded">
            <h3>{etapa.nomeEtapa}</h3>
            <p>{etapa.descricao}</p>
            <span>{etapa.status}</span>
            <button onClick={() => marcarConcluida(etapa.uuid)}>
              Marcar como Concluída
            </button>
          </div>
        ))}
      </div>

      <button onClick={adicionarEtapa}>
        Adicionar Nova Etapa
      </button>
    </div>
  )
}
```

---

## 🚀 Testando a Integração

### **1. Teste Manual**
```bash
# Inicie o servidor
npm run dev

# Acesse:
http://localhost:3000/app/create-project

# Preencha até a etapa "Timeline do Projeto"
# Adicione etapas
# Publique o projeto
# Verifique no Swagger se as etapas foram criadas
```

### **2. Verificar no Backend**
```bash
# Swagger UI:
http://localhost:8080/swagger-ui.html

# Endpoint de teste:
GET /api/v1/senai/etapasProjeto/findByProjeto/{projetoUuid}
```

---

## 📚 Referências

- **API Mutations**: `src/api/mutations.tsx`
- **API Queries**: `src/api/queries.tsx`
- **Hook**: `src/hooks/use-etapas-projeto.ts`
- **Componente**: `src/features/student/create-project/components/steps/TimelineProgressStep.tsx`
- **Tipos**: `src/types/types-mutations.ts` e `src/types/types-queries.ts`

---

## ✨ Melhorias Futuras

- [ ] Drag-and-drop para reordenar etapas
- [ ] Upload de imagens em cada etapa
- [ ] Histórico de mudanças de status
- [ ] Notificações quando etapas são concluídas
- [ ] Visualização de estatísticas (tempo médio por etapa)
- [ ] Exportação da timeline em PDF
- [ ] Comparação de timelines entre projetos similares

---

**Documentação criada em:** 7 de outubro de 2025  
**Versão:** 1.0.0  
**Autor:** Sistema de Documentação SENAI
