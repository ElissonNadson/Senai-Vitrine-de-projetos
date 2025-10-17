# 📎 Guia de Anexos por Etapa do Projeto

## 🎯 Visão Geral

O sistema de anexos por etapa permite que os estudantes documentem o trabalho realizado em cada fase do projeto através do upload de arquivos específicos ou links. Este guia explica como usar e configurar este recurso.

---

## 📋 Requisitos

Cada etapa preenchida do projeto **DEVE** ter pelo menos **1 (um)** arquivo ou link anexado. Não é necessário anexar todos os tipos disponíveis - apenas um já é suficiente para comprovar o trabalho realizado.

---

## 🔧 Etapas e Tipos de Anexos

### 1️⃣ **Ideação**

Fase de concepção e planejamento inicial do projeto.

| Tipo de Anexo | Formato | Descrição |
|---------------|---------|-----------|
| **Crazy 8** | `.pdf`, `.jpg`, `.png` | Técnica de ideação rápida com 8 esboços |
| **Mapa Mental / Nuvem de Palavras** | `.pdf`, `.jpg`, `.png` | Brainstorming ou Brainwriting visual |
| **Proposta de Valor** | `.pdf`, `.jpg`, `.png` | Value Proposition Canvas |
| **Jornada do Usuário** | `.pdf`, `.jpg`, `.png` | Customer Journey Map |
| **Técnica SCAMPER** | `.pdf`, `.jpg`, `.png`, `.docx` | Análise SCAMPER do projeto |
| **Mapa de Empatia** | `.pdf`, `.jpg`, `.png` | Mapa de empatia do público-alvo |
| **Vídeo Pitch** | Link (YouTube, Vimeo, etc.) | Apresentação da ideia em vídeo |
| **Persona** | `.pdf`, `.jpg`, `.png` | Definição de personas |

### 2️⃣ **Modelagem**

Fase de estruturação e viabilidade do negócio.

| Tipo de Anexo | Formato | Descrição |
|---------------|---------|-----------|
| **Business Model Canvas** | `.pdf`, `.jpg`, `.png` | Modelo de negócio Canvas |
| **Planilha de Viabilidade** | `.pdf`, `.xlsx`, `.xls` | Análise de viabilidade financeira |
| **Análise SWOT** | `.pdf`, `.jpg`, `.png`, `.docx` | Análise de forças, fraquezas, oportunidades e ameaças |
| **Matriz de Riscos** | `.pdf`, `.xlsx`, `.xls`, `.jpg`, `.png` | Identificação e análise de riscos |
| **Cronograma de Execução** | `.pdf`, `.xlsx`, `.xls`, `.jpg`, `.png` | Gantt, 5W2H ou similar |

### 3️⃣ **Prototipagem**

Fase de criação de protótipos e testes.

| Tipo de Anexo | Formato | Descrição |
|---------------|---------|-----------|
| **Wireframes** | `.pdf`, `.jpg`, `.png`, `.fig` | Esboços de baixa fidelidade |
| **Mockups** | `.pdf`, `.jpg`, `.png`, `.fig` | Designs de alta fidelidade |
| **Protótipo Interativo** | Link (Figma, Adobe XD, InVision) | Link para protótipo clicável |
| **Desenho 3D / Modelagem CAD** | `.pdf`, `.stl`, `.obj`, `.jpg`, `.png` | Modelos tridimensionais |
| **Maquete Física** | `.jpg`, `.png`, `.mp4`, `.mov` | Fotos ou vídeos de maquete |
| **Fluxograma de Processo** | `.pdf`, `.jpg`, `.png` | Fluxos de navegação ou processos |

### 4️⃣ **Implementação**

Fase de desenvolvimento e validação com usuários.

| Tipo de Anexo | Formato | Descrição |
|---------------|---------|-----------|
| **Vídeo Pitch** | Link (YouTube, Vimeo, etc.) | Apresentação do produto final |
| **Teste Piloto** | `.pdf`, `.docx`, `.jpg`, `.png` | Relatório de testes piloto |
| **Registro de Testes** | `.pdf`, `.txt`, `.xlsx`, `.xls` | Logs de uso ou testes realizados |
| **Feedback do Cliente** | `.pdf`, `.xlsx`, `.xls`, `.jpg`, `.png` | Formulários de feedback |
| **Entrevista com Usuários** | `.pdf`, `.docx`, `.mp3`, `.mp4` | Transcrições ou gravações |
| **Vídeo de Usuários** | Link (YouTube, Vimeo, etc.) | Vídeo mostrando uso do produto |
| **Relato de Experiência** | Link (YouTube, Vimeo, etc.) | Depoimentos de clientes |

---

## 💻 Como Usar

### **Para Estudantes:**

1. **Acesse** a tela de criação de projeto
2. **Navegue** até a aba "Timeline do Projeto"
3. **Preencha** o título e descrição de cada etapa
4. **Role** até a seção "Anexos da Etapa"
5. **Escolha** um ou mais tipos de anexo para adicionar:
   - Para **arquivos**: Clique em "Escolher arquivo" ou arraste e solte
   - Para **links**: Clique em "Adicionar link" e cole a URL
6. **Verifique** o contador de anexos no topo da etapa (ícone 📎)
7. **Continue** para a próxima etapa ou publique o projeto

### **Validações:**

- ✅ Etapas com título e descrição **devem** ter pelo menos 1 anexo
- ✅ Você pode adicionar múltiplos anexos do mesmo tipo
- ✅ Links devem ser URLs válidas (começando com http:// ou https://)
- ⚠️ Se tentar publicar sem anexos nas etapas preenchidas, receberá um erro

---

## 🎨 Interface Visual

### **Indicadores:**

- **Badge Verde com Checkmark** ✅ - Anexo adicionado com sucesso
- **Contador de Anexos** 📎 - Mostra quantos arquivos foram anexados
- **Mensagem de Erro** ⚠️ - Indica etapas sem anexos obrigatórios

### **Funcionalidades:**

- **Drag & Drop** - Arraste arquivos diretamente para a área de upload
- **Preview de Anexos** - Lista todos os arquivos anexados
- **Remover Anexos** - Botão ❌ para remover arquivos indesejados
- **Formatos Aceitos** - Hint visual dos formatos permitidos

---

## 🔌 Integração com Backend

### **Fluxo de Dados:**

1. Estudante anexa arquivos/links no frontend
2. Dados são armazenados localmente no estado do componente
3. Ao publicar o projeto, os anexos são enviados para:
   - `POST /api/v1/senai/AnexoEtapa/create`

### **Estrutura de Dados:**

```typescript
interface StageAttachment {
  id: string              // ID único do anexo
  optionId: string        // Tipo de anexo (ex: 'crazy8', 'mockups')
  type: 'file' | 'link'   // Tipo de conteúdo
  file?: File             // Arquivo (se type = 'file')
  link?: string           // URL (se type = 'link')
  name: string            // Nome do arquivo ou opção
}
```

### **API Endpoint:**

```typescript
POST /api/v1/senai/AnexoEtapa/create
{
  "etapa": { "uuid": "..." },
  "nomeArquivo": "Crazy 8.pdf",
  "url": "https://...",
  "tipo": "crazy8",
  "dataUpload": "2025-10-17T10:00:00Z"
}
```

---

## 🛠️ Configuração Técnica

### **Componentes:**

- `StageAttachmentsManager.tsx` - Gerenciador de anexos
- `TimelineProgressStep.tsx` - Integração com timeline

### **Props do StageAttachmentsManager:**

```typescript
interface StageAttachmentsManagerProps {
  stageType: 'Ideação' | 'Modelagem' | 'Prototipagem' | 'Implementação'
  attachments: StageAttachment[]
  onChange: (attachments: StageAttachment[]) => void
  error?: string
}
```

### **Exemplo de Uso:**

```tsx
<StageAttachmentsManager
  stageType="Ideação"
  attachments={step.attachments || []}
  onChange={(attachments) => {
    handleStepChange(index, 'attachments', attachments)
  }}
  error={attachmentErrors[index]}
/>
```

---

## 📊 Estatísticas

- **28 tipos diferentes** de anexos disponíveis
- **4 etapas** do projeto cobertas
- **3 formatos principais**: Arquivos, Links, Vídeos
- **15+ formatos de arquivo** suportados

---

## ⚠️ Limitações e Considerações

### **Validação:**

- Apenas etapas **preenchidas** (com título e descrição) requerem anexos
- Etapas vazias ou customizadas não exigem anexos
- A validação acontece no momento da publicação do projeto

### **Formatos:**

- Arquivos devem estar nos formatos especificados
- Links devem ser URLs completas e válidas
- Não há limite de tamanho implementado no frontend (verificar backend)

### **Armazenamento:**

- Arquivos são armazenados no backend via API
- Links são salvos como strings (URLs)
- Não há preview de arquivos antes do upload

---

## 🚀 Próximos Passos Sugeridos

1. **Upload de Arquivos Real**
   - Integrar com serviço de storage (AWS S3, Azure Blob)
   - Adicionar barra de progresso de upload
   - Implementar preview de arquivos

2. **Melhorias de UX**
   - Preview de imagens antes do upload
   - Validação de tamanho de arquivo
   - Compressão automática de imagens

3. **Funcionalidades Avançadas**
   - Galeria de anexos na visualização pública do projeto
   - Download de todos os anexos em ZIP
   - Histórico de versões de arquivos

4. **Validações Extras**
   - Verificar tipos MIME dos arquivos
   - Limitar tamanho total de anexos por projeto
   - Escanear arquivos por vírus/malware

---

## 📞 Suporte

Para dúvidas ou problemas relacionados aos anexos:

1. Verifique se o arquivo está no formato correto
2. Certifique-se de que a etapa tem título e descrição
3. Confira se o link começa com `http://` ou `https://`
4. Consulte a documentação da API: `/api/v1/senai/AnexoEtapa`

---

## 📝 Changelog

**Versão 1.0.0** (17/10/2025)
- ✅ Implementação inicial
- ✅ 28 tipos de anexos
- ✅ Suporte a drag & drop
- ✅ Validação de anexos obrigatórios
- ✅ Interface visual completa

---

**Documentação criada em:** 17 de outubro de 2025  
**Versão:** 1.0.0  
**Autor:** Sistema de Documentação SENAI
