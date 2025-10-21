# Sistema de Checklist de Etapas do Projeto

## 🎯 Visão Geral

Sistema inteligente que guia o usuário pelas 4 etapas padrão de um projeto (Ideação → Modelagem → Prototipagem → Implementação) com checklist visual e sugestão automática da próxima etapa.

---

## 📋 As 4 Etapas Padrão

### 1️⃣ Ideação 💡
- **Ordem:** 1
- **Cor:** Amarelo/Yellow
- **Descrição:** Fase de brainstorming, definição de conceitos e planejamento inicial do projeto
- **Quando usar:** Início do projeto, definição da ideia principal

### 2️⃣ Modelagem 📐
- **Ordem:** 2
- **Cor:** Azul/Blue
- **Descrição:** Criação de modelos, diagramas, arquitetura e especificações técnicas
- **Quando usar:** Após a ideação, para estruturar o projeto

### 3️⃣ Prototipagem 🔧
- **Ordem:** 3
- **Cor:** Roxo/Purple
- **Descrição:** Desenvolvimento de protótipos, testes iniciais e validações
- **Quando usar:** Após a modelagem, para criar versão teste

### 4️⃣ Implementação 🚀
- **Ordem:** 4
- **Cor:** Verde/Green
- **Descrição:** Desenvolvimento final, implantação e entrega do projeto completo
- **Quando usar:** Etapa final, entregar projeto completo

---

## 🔄 Fluxo Inteligente

### Cenário 1: Projeto Novo (Nenhuma Etapa)
```
📋 Checklist:
┌──────────────────────────────────────┐
│ [ ] 1. Ideação 💡          [Próxima] │ ← Selecionada automaticamente
│ [ ] 2. Modelagem 📐                  │
│ [ ] 3. Prototipagem 🔧               │
│ [ ] 4. Implementação 🚀              │
│ [✨] Etapa Personalizada             │
└──────────────────────────────────────┘

Pergunta: "Quer adicionar a Ideação?"
Resposta: Sim (adicionar) ou escolher outra
```

### Cenário 2: Já tem Ideação
```
📋 Checklist:
┌──────────────────────────────────────┐
│ [✓] 1. Ideação 💡                    │ ← Concluída (verde)
│ [ ] 2. Modelagem 📐        [Próxima] │ ← Sugerida automaticamente
│ [ ] 3. Prototipagem 🔧               │
│ [ ] 4. Implementação 🚀              │
│ [✨] Etapa Personalizada             │
└──────────────────────────────────────┘

Pergunta: "Quer adicionar a Modelagem ou ir para outras?"
Opções:
- Adicionar Modelagem (recomendado)
- Pular para Prototipagem
- Pular para Implementação
- Criar etapa personalizada
```

### Cenário 3: Tem Ideação e Modelagem
```
📋 Checklist:
┌──────────────────────────────────────┐
│ [✓] 1. Ideação 💡                    │
│ [✓] 2. Modelagem 📐                  │
│ [ ] 3. Prototipagem 🔧     [Próxima] │ ← Sugerida
│ [ ] 4. Implementação 🚀              │
│ [✨] Etapa Personalizada             │
└──────────────────────────────────────┘

Pergunta: "Quer adicionar a Prototipagem?"
```

### Cenário 4: Está na Terceira Etapa
```
📋 Checklist:
┌──────────────────────────────────────┐
│ [✓] 1. Ideação 💡                    │
│ [✓] 2. Modelagem 📐                  │
│ [✓] 3. Prototipagem 🔧               │
│ [ ] 4. Implementação 🚀    [Próxima] │ ← Última etapa!
│ [✨] Etapa Personalizada             │
└──────────────────────────────────────┘

Pergunta: "Quer adicionar a 4ª etapa (Implementação)?"
```

### Cenário 5: Todas Concluídas
```
📋 Checklist:
┌──────────────────────────────────────┐
│ [✓] 1. Ideação 💡                    │
│ [✓] 2. Modelagem 📐                  │
│ [✓] 3. Prototipagem 🔧               │
│ [✓] 4. Implementação 🚀              │
│ [✨] Etapa Personalizada   [Próxima] │ ← Única opção
└──────────────────────────────────────┘

Mensagem: "Todas as etapas padrão foram concluídas! 🎉"
Opção: Criar etapa personalizada (ex: "Apresentação", "Documentação")
```

---

## 🎨 Visual do Checklist

### Card de Etapa Normal (Disponível)
```
┌────────────────────────────────────────┐
│                          [Próxima]     │ ← Badge azul
│ 💡                                     │
│ ETAPA 1                                │
│ Ideação                                │
│ Fase de brainstorming, definição...    │
└────────────────────────────────────────┘
Estado: Branco, borda cinza, hover azul
Ação: Clicável, seleciona a etapa
```

### Card de Etapa Selecionada
```
┌════════════════════════════════════════┐ ← Borda azul dupla
│ 💡                                     │
│ ETAPA 1                                │
│ Ideação                                │ ← Texto amarelo (cor da etapa)
│ Fase de brainstorming, definição...    │
└════════════════════════════════════════┘
Estado: Fundo amarelo claro, borda azul animada
```

### Card de Etapa Concluída
```
┌────────────────────────────────────────┐
│                                   [✓]  │ ← Badge verde
│ 💡 (grayscale)                         │
│ ETAPA 1                                │
│ Ideação                                │ ← Texto cinza
│ Fase de brainstorming, definição...    │
└────────────────────────────────────────┘
Estado: Cinza, opaco 50%, não clicável
```

### Card de Etapa Personalizada
```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│ ✨ Criar Etapa Personalizada          │
│    Defina sua própria etapa com       │
│    nome e descrição customizados      │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
Estado: Borda tracejada, hover roxo
```

---

## 💻 Implementação Técnica

### Constante das Etapas Padrão
```typescript
const ETAPAS_PADRAO: EtapaPadrao[] = [
  {
    nome: 'Ideação',
    ordem: 1,
    descricao: 'Fase de brainstorming...',
    cor: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20...',
    icon: '💡'
  },
  // ... outras etapas
]
```

### Lógica de Detecção
```typescript
// Buscar etapas existentes do projeto
const etapasExistentes = etapasData?.filter(
  e => e.projeto?.uuid === projectId
) || []

// Verificar quais foram criadas
const etapasConcluidas = ETAPAS_PADRAO.map(etapa => ({
  ...etapa,
  concluida: !!etapasExistentes.find(e => 
    e.nomeEtapa.toLowerCase().includes(etapa.nome.toLowerCase())
  )
}))

// Sugerir próxima
const proximaEtapaSugerida = etapasConcluidas.find(
  e => !e.concluida
) || null
```

### Seleção Automática
```typescript
useEffect(() => {
  if (proximaEtapaSugerida && !modoPersonalizado && !etapaSelecionada) {
    handleSelecionarEtapa(proximaEtapaSugerida)
  }
}, [proximaEtapaSugerida])
```

### Handlers

**Selecionar Etapa Padrão:**
```typescript
const handleSelecionarEtapa = (etapa: EtapaPadrao) => {
  setEtapaSelecionada(etapa)
  setModoPersonalizado(false)
  setFormData({
    nomeEtapa: etapa.nome,
    descricao: etapa.descricao,
    ordem: etapa.ordem,
    status: 'EM_ANDAMENTO'
  })
}
```

**Modo Personalizado:**
```typescript
const handleModoPersonalizado = () => {
  setModoPersonalizado(true)
  setEtapaSelecionada(null)
  const proximaOrdem = Math.max(
    ...etapasExistentes.map(e => e.ordem || 0), 
    0
  ) + 1
  setFormData({
    nomeEtapa: '',
    descricao: '',
    ordem: proximaOrdem,
    status: 'EM_ANDAMENTO'
  })
}
```

---

## 🎭 Estados da Interface

### 1. Nenhuma Etapa Selecionada
- Checklist visível
- Formulário desabilitado
- Aviso: "Selecione uma etapa acima para continuar"
- Botão Salvar: DISABLED

### 2. Etapa Padrão Selecionada
- Card da etapa com borda azul animada
- Formulário preenchido automaticamente
- Nome e Descrição: READ-ONLY (com dica)
- Ordem e Status: EDITÁVEL
- Botão Salvar: ENABLED

### 3. Modo Personalizado Ativo
- Card "Etapa Personalizada" destacado (roxo)
- Formulário completamente editável
- Todos os campos limpos
- Ordem: próximo número disponível
- Botão Salvar: ENABLED

---

## 🔔 Mensagens e Feedback

### Ao Selecionar Etapa Padrão
```
💡 Nome pré-definido pela etapa selecionada.
   Escolha "Etapa Personalizada" para editar.
```

### Sem Seleção
```
⚠️ Selecione uma etapa acima para continuar
```

### Etapa Sugerida
```
Badge azul "Próxima" na etapa recomendada
```

### Etapa Concluída
```
Badge verde [✓] 
Card desabilitado e em cinza
```

---

## 📱 Responsividade

### Desktop (md+)
- Grid 2 colunas para etapas padrão
- Checklist e formulário lado a lado visualmente

### Mobile (< md)
- Grid 1 coluna (etapas empilhadas)
- Scroll vertical
- Cards com altura otimizada

---

## 🎯 Casos de Uso

### Usuário Organizado
1. Acessa "Nova Etapa"
2. Vê Ideação sugerida automaticamente
3. Clica para confirmar (ou edita descrição)
4. Adiciona anexos
5. Salva
6. **Resultado:** Etapa 1 criada ✓

Na próxima vez:
- Ideação aparece como [✓] concluída
- Modelagem é sugerida automaticamente

### Usuário que Quer Pular Etapas
1. Acessa "Nova Etapa"
2. Vê Ideação sugerida
3. **Ignora** e clica direto em "Prototipagem"
4. Preenche e salva
5. **Resultado:** Tem Prototipagem sem Ideação/Modelagem

### Usuário Criativo
1. Acessa "Nova Etapa"
2. Clica em "Etapa Personalizada"
3. Define nome: "Apresentação Final"
4. Define descrição: "Preparar slides..."
5. Salva
6. **Resultado:** Etapa customizada adicionada

---

## 🔮 Melhorias Futuras

### V2 - Obrigatoriedade
- [ ] Opção de marcar etapas como obrigatórias
- [ ] Bloquear etapa 3 até etapa 1 e 2 estarem concluídas

### V3 - Templates
- [ ] Múltiplos templates (Software, Hardware, Pesquisa)
- [ ] Etapas personalizadas por curso
- [ ] Importar template de projeto anterior

### V4 - Timeline
- [ ] Visualização de timeline horizontal
- [ ] Arrastar e soltar para reordenar
- [ ] Datas previstas vs realizadas

### V5 - Colaboração
- [ ] Comentários por etapa
- [ ] Notificação quando etapa é concluída
- [ ] Aprovação de professor necessária

---

## 📊 Exemplo Completo de Fluxo

```
DIA 1 - Novo Projeto
├─ Criar projeto "Sistema IoT"
└─ Ir para "Nova Etapa"
    ├─ Checklist mostra: [ ][ ][ ][ ]
    ├─ "Ideação" sugerida automaticamente
    ├─ Preencher descrição específica
    └─ Salvar ✓

DIA 7 - Evoluir Projeto
├─ Ir para "Nova Etapa"
├─ Checklist mostra: [✓][ ][ ][ ]
│   └─ Ideação marcada como concluída
├─ "Modelagem" sugerida automaticamente
├─ Adicionar diagramas UML como anexo
└─ Salvar ✓

DIA 15 - Continuar
├─ Checklist: [✓][✓][ ][ ]
├─ "Prototipagem" sugerida
└─ ...

DIA 30 - Finalizar
├─ Checklist: [✓][✓][✓][ ]
├─ "Implementação" sugerida (última!)
├─ Adicionar código final
└─ Salvar ✓

DIA 35 - Extra
├─ Checklist: [✓][✓][✓][✓]
├─ Todas concluídas! 🎉
├─ Criar "Documentação Técnica" personalizada
└─ Projeto completo!
```

---

## ✅ Benefícios do Sistema

1. **Guia Intuitivo** - Não precisa pensar em qual etapa vem depois
2. **Flexível** - Pode pular ou customizar
3. **Visual** - Checklist mostra progresso claramente
4. **Educativo** - Ensina metodologia de projeto
5. **Profissional** - Segue padrões da indústria
6. **Motivador** - Ver etapas concluídas dá sensação de progresso

---

## 🎨 Paleta de Cores por Etapa

| Etapa | Cor Primária | Fundo Light | Fundo Dark |
|-------|-------------|-------------|------------|
| Ideação | Yellow 600 | Yellow 50 | Yellow 900/20 |
| Modelagem | Blue 600 | Blue 50 | Blue 900/20 |
| Prototipagem | Purple 600 | Purple 50 | Purple 900/20 |
| Implementação | Green 600 | Green 50 | Green 900/20 |
| Personalizada | Purple 500 | Purple 50 | Purple 900/20 |

---

## 🚀 Como Testar

1. **Abra a página:** `/app/projects/mock-iot-001/add-stage`

2. **Veja o checklist:** 
   - Se projeto novo: 4 cards brancos, "Ideação" sugerida
   - Se tem etapa: etapas concluídas com [✓]

3. **Teste Fluxo Normal:**
   - Clique na etapa sugerida
   - Veja formulário preencher automaticamente
   - Edite descrição se quiser
   - Salve

4. **Teste Pular Etapa:**
   - Ignore a sugerida
   - Clique em qualquer outra disponível
   - Salve

5. **Teste Personalizada:**
   - Clique em "Etapa Personalizada"
   - Digite nome e descrição customizados
   - Salve

---

**Sistema criado para guiar o aluno pelas etapas de forma intuitiva, educativa e profissional! 🎓✨**
