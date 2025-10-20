# 📸 Sistema de Edição de Banner com Crop

## 🎯 Visão Geral

Implementamos um sistema profissional de edição de imagens de banner, similar ao Facebook e LinkedIn, permitindo que os usuários **arrastem, redimensionem, girem e recortem** suas imagens de banner antes de salvá-las.

---

## ✨ Funcionalidades

### 1. **Upload de Imagem**
- Clique na área de upload ou arraste e solte
- Validação automática:
  - ✅ Tamanho máximo: 5MB
  - ✅ Formatos aceitos: PNG, JPG, JPEG
- Abre automaticamente o editor após o upload

### 2. **Editor Interativo de Imagem**
O modal de edição oferece:

#### 🖱️ **Controles Interativos**
- **Arrastar**: Clique e arraste a imagem para reposicionar
- **Zoom**: 
  - Use o slider para zoom preciso (100% a 300%)
  - Use o scroll do mouse sobre a imagem para zoom rápido
- **Rotação**: 
  - Slider para girar a imagem (0° a 360°)
  - Ajuste fino com incrementos de 1°

#### 🎨 **Interface do Editor**
- **Grade de Alinhamento**: Linhas guia visuais para melhor posicionamento
- **Preview em Tempo Real**: Veja as mudanças instantaneamente
- **Área de Recorte**: Proporção 16:9 (formato banner)
- **Controles Claros**: Sliders intuitivos com ícones

#### 💾 **Salvar Edição**
- Botão "Salvar" processa e recorta a imagem
- Conversão automática para JPEG otimizado (95% qualidade)
- Preview da imagem recortada aparece imediatamente

### 3. **Gerenciamento do Banner**
Após salvar, ao passar o mouse sobre o banner:

- **Overlay Escuro**: Aparece sobre a imagem
- **Botão Editar**: Reabre o editor com a imagem atual
- **Botão Remover**: Remove o banner completamente

---

## 🛠️ Tecnologias Utilizadas

### **react-easy-crop**
```bash
npm install react-easy-crop
```

Biblioteca especializada em crop de imagens com:
- Suporte a gestos (drag, pinch-zoom)
- Controle de rotação
- Grade de alinhamento
- API simples e poderosa

### **Framer Motion**
Animações suaves para:
- Transições de estado (com banner / sem banner)
- Hover effects nos botões
- Abrir/fechar modal

---

## 📁 Arquivos Criados/Modificados

### **Novo Componente**
```
src/components/ImageCropModal.tsx
```
Modal reutilizável de edição de imagem com todas as funcionalidades de crop.

### **Componentes Atualizados**

#### 1. **ProjectDetailsSection.tsx**
- Integrado com `ImageCropModal`
- Upload abre o editor automaticamente
- Botão "Editar" permite re-editar banner existente

#### 2. **AttachmentsSection.tsx**
- Mesma integração para banner da seção de anexos
- Mantém consistência visual e funcional

---

## 🎨 Fluxo de Uso

### **Fluxo Completo:**

```
1. 📤 UPLOAD
   └─> Usuário seleciona imagem
       └─> Validação automática (tamanho/tipo)
           └─> Abre editor com imagem original

2. ✂️ EDIÇÃO
   └─> Usuário ajusta:
       ├─> Posição (arrastar)
       ├─> Zoom (slider ou scroll)
       └─> Rotação (slider)
   └─> Clica em "Salvar"
       └─> Imagem é recortada e otimizada

3. 👁️ PREVIEW
   └─> Banner aparece na página
       └─> Hover revela botões:
           ├─> Editar (reabre editor)
           └─> Remover (deleta banner)
```

---

## 💡 Detalhes Técnicos

### **Processamento de Imagem**

```typescript
// 1. Upload inicial - converte para base64
FileReader.readAsDataURL(file)

// 2. Edição - usa canvas para crop
canvas.toBlob(blob, 'image/jpeg', 0.95)

// 3. Salvar - converte blob para File
new File([blob], 'banner.jpg', { type: 'image/jpeg' })
```

### **Aspect Ratio**
```typescript
aspect={16 / 9}  // Proporção de banner
```
Pode ser alterado para:
- `1` → Quadrado (perfil)
- `4 / 3` → Clássico
- `21 / 9` → Ultra-wide

### **Validações**
```typescript
// Tamanho máximo
if (file.size > 5 * 1024 * 1024) { /* erro */ }

// Tipo de arquivo
if (!file.type.startsWith('image/')) { /* erro */ }
```

---

## 🎯 Estados do Componente

```typescript
const [bannerPreview, setBannerPreview] = useState<string | null>(null)
const [showActions, setShowActions] = useState(false)
const [isEditModalOpen, setIsEditModalOpen] = useState(false)
const [originalImage, setOriginalImage] = useState<string | null>(null)
```

| Estado | Descrição |
|--------|-----------|
| `bannerPreview` | URL da imagem recortada para preview |
| `showActions` | Controla visibilidade dos botões no hover |
| `isEditModalOpen` | Controla abertura do modal de edição |
| `originalImage` | Imagem original/atual para editar |

---

## 🎨 Experiência do Usuário

### **Feedback Visual**
- ✅ Mensagens de validação claras
- ✅ Loading state durante processamento
- ✅ Animações suaves em todas transições
- ✅ Hover effects informativos
- ✅ Grade de alinhamento no editor

### **Acessibilidade**
- ✅ Botões com labels descritivos
- ✅ Cores contrastantes
- ✅ Ícones + Texto nos botões
- ✅ Estados de hover/focus visíveis

### **Responsividade**
- ✅ Modal adapta para mobile
- ✅ Controles touch-friendly
- ✅ Sliders funcionam em touch devices

---

## 🚀 Próximas Melhorias (Opcional)

1. **Filtros de Imagem**
   - Brilho, contraste, saturação
   - Filtros pré-definidos (Instagram-style)

2. **Múltiplas Áreas de Crop**
   - Crop livre (não fixo)
   - Crop circular para avatares

3. **Histórico de Edições**
   - Desfazer/Refazer alterações
   - Reset para original

4. **Compressão Inteligente**
   - WebP para browsers compatíveis
   - Lazy loading de imagens

5. **Galeria de Templates**
   - Banners pré-prontos
   - Sobreposições de texto

---

## 📝 Exemplo de Uso

```tsx
import ImageCropModal from './components/ImageCropModal'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  const handleSave = (croppedBlob: Blob) => {
    const file = new File([croppedBlob], 'banner.jpg')
    // Fazer upload do arquivo...
  }

  return (
    <ImageCropModal
      isOpen={isOpen}
      imageSrc={imageSrc}
      onClose={() => setIsOpen(false)}
      onSave={handleSave}
      aspect={16 / 9}
    />
  )
}
```

---

## ✅ Resultado Final

Os usuários agora têm uma experiência profissional de edição de banner:

1. **Upload Intuitivo** → Arrastar ou clicar
2. **Edição Poderosa** → Arrastar, zoom, girar
3. **Preview Instantâneo** → Ver resultado em tempo real
4. **Controle Total** → Editar ou remover a qualquer momento

**Similar a plataformas profissionais como Facebook, LinkedIn e Twitter!** 🎉
