# 📋 Padrão Profissional para Componentes de Anexos

## 🎯 Objetivo
Padronizar TODOS os componentes de anexos (Ideação, Modelagem, Prototipagem, Implementação) com design profissional, drag & drop e explicações.

---

## ✅ Padrão a Seguir (baseado em IdeacaoSection otimizado)

### 1. **Estrutura do Componente**

```tsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { [Ícone], Upload, X, FileText, Download, Info, Check } from 'lucide-react'

// Interfaces
interface Attachment {
  id: string
  file: File
  type: string
}

// Props do componente
interface [Nome]SectionProps {
  data: { descricao: string; anexos: Attachment[] }
  onUpdate: (field: string, value: any) => void
}

// Array de tipos de anexo COM explicações e templates
const attachmentTypes = [
  { 
    id: 'tipo1',
    label: 'Nome do Documento',
    icon: FileText,
    accept: '.pdf,.jpg,.png',
    description: 'Explicação clara do que é este documento e para que serve.',
    templateUrl: 'https://link-para-modelo.com'
  },
  // ... mais tipos
]

// Componente
const [Nome]Section: React.FC<[Nome]SectionProps> = ({ data, onUpdate }) => {
  const [dragOver, setDragOver] = useState<string | null>(null)
  
  // Handlers de drag & drop
  const handleDragOver = (e: React.DragEvent, typeId: string) => {
    e.preventDefault()
    setDragOver(typeId)
  }
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(null)
  }
  
  const handleDrop = (e: React.DragEvent, typeId: string) => {
    e.preventDefault()
    setDragOver(null)
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(typeId, file)
  }
  
  // ... resto dos handlers
}
```

---

## 🎨 Padrão Visual dos Cards

### Card de Documento (profissional e limpo)

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 + index * 0.03 }}
  className={`bg-white dark:bg-gray-800 rounded-xl p-5 border transition-all ${
    hasAttachment 
      ? 'border-green-500 shadow-sm' 
      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
  }`}
>
  <div className="flex flex-col lg:flex-row gap-5">
    
    {/* COLUNA ESQUERDA - Info */}
    <div className="flex-1 space-y-3">
      
      {/* Header do Card */}
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
              {type.label}
            </h4>
            {hasAttachment && (
              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-md border border-green-200">
                <Check className="w-3 h-3" />
                Anexado
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {type.description}
          </p>
        </div>
      </div>

      {/* Botão de Modelo/Template */}
      {type.templateUrl && (
        <a
          href={type.templateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Baixar Modelo/Template
        </a>
      )}

      {/* Lista de Arquivos Anexados */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-700 flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {attachments.length} arquivo(s):
          </p>
          {attachments.map(att => (
            <div key={att.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-xs text-gray-700 truncate font-medium">
                  {att.file.name}
                </span>
                <span className="text-xs text-gray-500">
                  ({(att.file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <button
                onClick={() => removeAttachment(att.id)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* COLUNA DIREITA - Upload */}
    <div className="lg:w-80">
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-3.5 h-3.5 text-gray-500" />
          <p className="text-xs font-medium text-gray-700">
            Anexar arquivo:
          </p>
        </div>

        <label 
          onDragOver={(e) => handleDragOver(e, type.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, type.id)}
          className={`block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-100'
          }`}
        >
          <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-colors ${
            isDragging ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <Upload className={`w-6 h-6 ${isDragging ? 'text-blue-600' : 'text-gray-500'}`} />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">
            {isDragging ? 'Solte o arquivo aqui' : 'Clique ou arraste o arquivo'}
          </p>
          <p className="text-xs text-gray-500">
            {type.accept.split(',').map(ext => ext.trim().toUpperCase().replace('.', '')).join(', ')}
          </p>
          <input
            type="file"
            accept={type.accept}
            onChange={e => e.target.files?.[0] && handleFileUpload(type.id, e.target.files[0])}
            className="hidden"
          />
        </label>
      </div>
    </div>

  </div>
</motion.div>
```

---

## 📦 Componentes a Atualizar

### 1. ✅ IdeacaoSection.tsx
- **Status**: JÁ ATUALIZADO
- Padrão profissional implementado

### 2. 🔄 ModelagemSection.tsx
- Business Model Canvas
- Planilha de Viabilidade
- Análise SWOT
- Matriz de Riscos
- Cronograma (Gantt, 5W2H)

### 3. 🔄 PrototipagemSection.tsx
- Wireframes
- Mockups
- Protótipo Interativo (Figma/Adobe XD)
- Desenho 3D/Modelagem CAD
- Fotos ou Vídeo de Maquete Física
- Fluxograma de Processo

### 4. 🔄 ImplementacaoSection.tsx
- Vídeo Pitch Final
- Teste Piloto
- Registro de Testes ou Logs
- Formulário de Feedback do Cliente
- Entrevista com Usuários
- Vídeo de Usuários Utilizando o Produto
- Vídeo do Relato de Experiência do Cliente

---

## 🎨 Cores e Estilos (Profissional)

### Paleta Neutra:
- Background: `bg-white dark:bg-gray-800`
- Borda normal: `border-gray-200 dark:border-gray-700`
- Borda hover: `border-gray-300 dark:border-gray-600`
- Borda anexado: `border-green-500`
- Ícone: `bg-gray-100 text-gray-700`
- Badge anexado: `bg-green-50 text-green-700 border-green-200`

### SEM usar:
- ❌ Gradientes coloridos
- ❌ Cores vibrantes
- ❌ Animações exageradas
- ❌ Sombras grandes

### USAR:
- ✅ Cinzas neutros
- ✅ Verde apenas para "anexado"
- ✅ Transições suaves
- ✅ Sombras sutis

---

## 🔧 Funcionalidades Obrigatórias

### Para TODOS os componentes:

1. **Drag & Drop**
   - `onDragOver`, `onDragLeave`, `onDrop`
   - Feedback visual ao arrastar
   - Estado `dragOver`

2. **Explicações**
   - Propriedade `description` em cada tipo
   - Texto claro do que é o documento

3. **Templates**
   - Propriedade `templateUrl` com link
   - Botão "Baixar Modelo/Template"

4. **Badge de Status**
   - "✅ Anexado" quando arquivo presente
   - Borda verde no card

5. **Info do Arquivo**
   - Nome do arquivo
   - Tamanho em KB
   - Botão para remover

---

## 📝 Checklist de Implementação

Para cada componente:

- [ ] Import dos ícones corretos
- [ ] Array `attachmentTypes` com description e templateUrl
- [ ] Estado `dragOver`
- [ ] Handlers: `handleDragOver`, `handleDragLeave`, `handleDrop`
- [ ] Card com 2 colunas (info + upload)
- [ ] Header do Hero com ícone e descrição
- [ ] Textarea para descrição da fase
- [ ] Cards de documentos em grid (1 coluna)
- [ ] Botão de template (se tiver URL)
- [ ] Lista de arquivos anexados
- [ ] Área de upload com drag & drop
- [ ] Remover `File` dos imports (usar `FileText`)

---

## 🚀 Próximos Passos

1. Criar ModelagemSection com padrão
2. Criar PrototipagemSection com padrão
3. Criar ImplementacaoSection com padrão
4. Testar drag & drop em todos
5. Validar responsividade
6. Testar modo escuro

---

**Última atualização:** 19 de outubro de 2025
