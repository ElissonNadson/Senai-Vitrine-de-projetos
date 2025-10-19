# 📎 Sistema de Anexos com Destaque

## 🎯 Visão Geral

Sistema aprimorado para upload de anexos com destaque visual para cada tipo de documento, incluindo:
- **Explicações detalhadas** de cada documento
- **Links para modelos/templates** prontos
- **Interface visual aprimorada** com destaque por cor
- **Feedback visual** quando anexo está presente

---

## ✨ Melhorias Implementadas

### 1. **Explicações Detalhadas**
Cada tipo de documento agora possui uma descrição explicativa:

```typescript
{
  id: 'crazy8',
  label: 'Crazy 8',
  description: 'Técnica criativa de brainstorming que consiste em dobrar uma folha em 8 partes e desenhar 8 ideias diferentes em 8 minutos.',
  // ...
}
```

### 2. **Links para Modelos**
Cada documento tem um link para template/modelo:

```typescript
{
  templateUrl: 'https://miro.com/templates/crazy-8s/',
  // Botão "Baixar Modelo/Template" aparece automaticamente
}
```

### 3. **Sistema de Cores**
Cada documento tem sua própria identidade visual:

| Documento | Cor |
|-----------|-----|
| Crazy 8 | Yellow → Orange |
| Mapa Mental | Pink → Rose |
| Value Proposition Canvas | Blue → Cyan |
| Customer Journey Map | Purple → Indigo |
| SCAMPER | Green → Emerald |
| Mapa de Empatia | Red → Pink |
| Vídeo Pitch | Violet → Purple |
| Persona | Amber → Yellow |

### 4. **Feedback Visual**
- ✅ **Badge "Anexado"** quando arquivo está presente
- 🟢 **Borda verde** quando documento anexado
- 📊 **Contador de arquivos** com ícone
- 📏 **Tamanho do arquivo** em KB

---

## 🎨 Layout Aprimorado

### Estrutura de Card (2 Colunas)

```
┌─────────────────────────────────────────────────────────┐
│  [Ícone]  Título do Documento         ✅ Anexado       │
│           Descrição explicativa do que é...             │
│                                                          │
│  [📥 Baixar Modelo/Template]                            │
│                                                          │
│  📄 1 arquivo(s) anexado(s):                            │
│  ┌──────────────────────────────────────────────┐      │
│  │ 📄 documento.pdf (245 KB)              ❌    │      │
│  └──────────────────────────────────────────────┘      │
│                                                          │
│                                      ┌─────────────────┐│
│                                      │  [Upload Area]  ││
│                                      │   Clique para   ││
│                                      │   selecionar    ││
│                                      │  PDF, JPG, PNG  ││
│                                      └─────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Coluna Esquerda:
- Ícone colorido com gradiente
- Título + Badge de status
- Descrição explicativa
- Botão para baixar modelo
- Lista de arquivos anexados

### Coluna Direita:
- Área de upload/link
- Visual destaque com gradiente
- Instruções claras
- Aceita formatos específicos

---

## 📋 Documentos da Fase de Ideação

### 1. Crazy 8 🎨
**O que é:** Técnica criativa de brainstorming que consiste em dobrar uma folha em 8 partes e desenhar 8 ideias diferentes em 8 minutos.

**Template:** https://miro.com/templates/crazy-8s/

**Formatos:** PDF, JPG, PNG

---

### 2. Mapa Mental ou Nuvem de Palavras 🧠
**O que é:** Diagrama usado para representar palavras, ideias ou conceitos ligados a um tema central, facilitando a organização do pensamento.

**Template:** https://www.canva.com/pt_br/criar/mapas-mentais/

**Formatos:** PDF, JPG, PNG

---

### 3. Proposta de Valor (Value Proposition Canvas) 💎
**O que é:** Ferramenta que ajuda a entender o que o cliente realmente valoriza e como seu produto/serviço pode atender essas necessidades.

**Template:** https://www.strategyzer.com/library/the-value-proposition-canvas

**Formatos:** PDF, JPG, PNG

---

### 4. Jornada do Usuário (Customer Journey Map) 🗺️
**O que é:** Mapa visual que ilustra a experiência completa do cliente ao interagir com seu produto ou serviço, do início ao fim.

**Template:** https://miro.com/templates/customer-journey-map/

**Formatos:** PDF, JPG, PNG

---

### 5. Técnica SCAMPER 🔄
**O que é:** Método criativo usando 7 perguntas:
- **S**ubstituir
- **C**ombinar
- **A**daptar
- **M**odificar
- **P**ropor outros usos
- **E**liminar
- **R**eorganizar

**Template:** https://www.mindtools.com/pages/article/newCT_02.htm

**Formatos:** PDF, JPG, PNG, DOCX

---

### 6. Mapa de Empatia ❤️
**O que é:** Ferramenta que ajuda a entender melhor o cliente através de 4 quadrantes:
- O que **pensa**
- O que **sente**
- O que **vê**
- O que **ouve**, **fala** e **faz**

**Template:** https://www.canva.com/pt_br/criar/mapa-de-empatia/

**Formatos:** PDF, JPG, PNG

---

### 7. Vídeo Pitch 🎥
**O que é:** Apresentação em vídeo curta (1-3 min) sobre a ideia do projeto, problema identificado e solução proposta.

**Como fazer:**
- Cole link do YouTube, Vimeo ou Google Drive
- Duração ideal: 1-3 minutos
- Inclua: problema, solução, diferencial

**Formato:** Link de vídeo

---

### 8. Persona 👤
**O que é:** Representação fictícia do cliente ideal, baseada em dados reais, incluindo:
- Nome, idade, profissão
- Comportamentos
- Objetivos
- Desafios/Dores
- Motivações

**Template:** https://miro.com/templates/user-persona/

**Formatos:** PDF, JPG, PNG

---

## 🎯 Características Visuais

### Estados do Card

#### Sem Anexo (Estado Inicial)
```css
- Borda: cinza clara
- Background: gradiente suave da cor do documento (5% opacidade)
- Hover: borda cinza média
```

#### Com Anexo (Estado Completo)
```css
- Borda: verde (border-green-400)
- Background: gradiente suave + sombra
- Badge: "✅ Anexado" (verde)
- Lista de arquivos visível
```

### Animações

```typescript
// Entrada do card
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.2 + index * 0.05 }}

// Hover no ícone de upload
whileHover={{ scale: 1.1 }}

// Click no botão
whileTap={{ scale: 0.98 }}
```

---

## 💡 Próximos Passos

Para aplicar o mesmo sistema nas outras fases:

### 1. ModelagemSection.tsx
Documentos:
- Business Model Canvas
- Planilha de Viabilidade
- Análise SWOT
- Matriz de Riscos
- Cronograma (Gantt/5W2H)

### 2. PrototipagemSection.tsx
Documentos:
- Wireframes
- Mockups
- Protótipos Interativos (Figma/Adobe XD)
- Modelagem 3D/CAD
- Fotos do Modelo Físico
- Fluxogramas de Processo

### 3. ImplementacaoSection.tsx
Documentos:
- Vídeo Pitch Final
- Testes Piloto
- Registros de Testes
- Formulários de Feedback
- Entrevistas com Usuários
- Vídeos de Demonstração
- Vídeos de Depoimentos

---

## 📊 Benefícios

✅ **Usuário entende o que é cada documento** - Explicações claras

✅ **Acesso rápido a templates** - Links diretos para modelos

✅ **Feedback visual imediato** - Sabe exatamente o que já anexou

✅ **Interface profissional** - Design moderno e atrativo

✅ **Organização clara** - Documentos categorizados por fase

✅ **Responsivo** - Layout se adapta a desktop e mobile

---

## 🔧 Tecnologias Utilizadas

- **Framer Motion** - Animações suaves
- **Lucide React** - Ícones consistentes
- **Tailwind CSS** - Estilização com gradientes
- **TypeScript** - Type safety

---

## 📝 Exemplo de Uso

```tsx
// Usuário na fase de Ideação
1. Lê a descrição do "Crazy 8"
2. Clica em "Baixar Modelo/Template"
3. Preenche o template offline
4. Retorna ao sistema
5. Faz upload do arquivo preenchido
6. Vê o badge "✅ Anexado" e borda verde
7. Pode visualizar o arquivo anexado
8. Pode remover e anexar novamente se necessário
```

---

## 🎨 Código de Exemplo

```tsx
{
  id: 'crazy8',
  label: 'Crazy 8',
  icon: FileText,
  accept: '.pdf,.jpg,.jpeg,.png',
  description: 'Técnica criativa de brainstorming...',
  templateUrl: 'https://miro.com/templates/crazy-8s/',
  color: 'from-yellow-500 to-orange-500'
}
```

---

**Documentação criada em:** 19 de outubro de 2025
**Versão:** 1.0
**Autor:** Sistema de Anexos com Destaque
