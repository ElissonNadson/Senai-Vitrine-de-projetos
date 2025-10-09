# Design System - Senai Vitrine de Projetos

## 📐 Padrão de Tamanhos de Fonte

Este documento define o padrão visual unificado para todo o projeto, garantindo consistência entre todas as páginas.

---

## ✅ Status de Padronização

### Páginas Padronizadas
- ✅ **Login** - Totalmente padronizado
- ✅ **Cadastro/Registro** - Totalmente padronizado
- ✅ **Dashboard do Estudante** - Totalmente padronizado
- ⏳ **Outras páginas do Student** - Em revisão
- ⏳ **Páginas do Teacher** - Pendente
- ✅ **Landing Page/Visitor** - Já possui bom design (mantido)
- ⏳ **Componentes Compartilhados** - Em revisão

---

## 🎨 Tipografia Padronizada

### **Headers e Títulos**
- **H1 (Página Principal)**: `text-2xl` (24px) - Títulos principais de páginas
- **H2 (Subtítulos)**: `text-xl` (20px) - Seções principais
- **H3 (Seções)**: `text-lg` (18px) - Subseções
- **H4 (Cards/Componentes)**: `text-base` (16px) - Títulos de cards

### **Texto Corpo**
- **Texto Normal**: `text-sm` (14px) - Textos padrão, parágrafos
- **Texto Pequeno**: `text-xs` (12px) - Labels, helpers, footers
- **Texto Mínimo**: `text-[10px]` (10px) - Apenas quando extremamente necessário

### **Labels e Formulários**
- **Labels de Inputs**: `text-xs` (12px)
- **Placeholders**: `text-sm` (14px)
- **Mensagens de Erro**: `text-xs` (12px)
- **Texto de Ajuda**: `text-xs` (12px)

### **Botões**
- **Botões Grandes**: `text-sm` (14px) + `py-2.5 px-4`
- **Botões Médios**: `text-xs` (12px) + `py-2 px-3`
- **Botões Pequenos**: `text-xs` (12px) + `py-1.5 px-2.5`

---

## 📏 Espaçamentos Padronizados

### **Containers e Cards**
- **Padding de Cards**: `p-6 lg:p-8` (compact) ou `p-8 lg:p-12` (spacious)
- **Margem entre Seções**: `space-y-4` (compact) ou `space-y-6` (normal)
- **Gap em Grids**: `gap-4` (compact) ou `gap-6` (normal)

### **Formulários**
- **Espaço entre Campos**: `space-y-4`
- **Altura de Inputs**: `py-2` (compact - 32px total)
- **Margem Bottom de Labels**: `mb-1`

### **Layout de Página**
- **Header Padding**: `py-3` (compact)
- **Footer Padding**: `py-3` (compact)
- **Main Content Padding**: `py-6 px-4`

---

## 🎯 Ícones Padronizados

### **Tamanhos de Ícones**
- **Ícones em Inputs**: `h-4 w-4` (16px)
- **Ícones em Botões**: `h-3.5 w-3.5` ou `h-4 w-4`
- **Ícones em Headers**: `h-5 w-5` ou `h-6 w-6`
- **Ícones Decorativos**: `h-8 w-8` ou maior conforme necessário

---

## 🖼️ Componentes Específicos

### **Páginas de Autenticação (Login/Registro)**

#### Layout
```tsx
<main className="flex-1 flex items-center justify-center py-6 px-4">
  <div className="max-w-4xl w-full mx-auto">
    <div className="bg-white/95 backdrop-blur-sm p-6 lg:p-8 rounded-xl shadow-2xl">
      {/* Conteúdo */}
    </div>
  </div>
</main>
```

#### Títulos
- **Título Principal**: `text-2xl font-bold mb-1`
- **Subtítulo**: `text-sm text-gray-600`

#### Inputs
- **Label**: `text-xs font-medium text-gray-700 mb-1`
- **Input**: `text-sm py-2 pl-8 pr-3` (com ícone) ou `py-2 px-3` (sem ícone)
- **Ícone**: `h-4 w-4` posicionado em `left-2.5`

#### Botões
- **Primário**: `py-2.5 px-4 text-sm font-medium`
- **Secundário**: `py-2 px-3 text-xs font-medium`

### **Header**
- **Logo**: `h-10 w-auto` (compact)
- **Links de Navegação**: `text-xs font-medium px-3 py-1.5`
- **Padding**: `py-3 px-4`

### **Footer**
- **Texto**: `text-xs text-gray-500`
- **Padding**: `py-3 px-4`

---

## 🎨 Cores e Estados

### **Bordas e Raios**
- **Campos de Input**: `rounded-lg` (8px)
- **Cards**: `rounded-xl` (12px)
- **Botões**: `rounded-lg` (8px)

### **Sombras**
- **Cards Elevados**: `shadow-2xl`
- **Botões**: `shadow-sm` ou `shadow-md`
- **Inputs Focus**: `ring-2`

### **Transições**
- **Padrão**: `transition-colors duration-200`
- **Transformações**: `transition-all duration-200`

---

## ✅ Checklist de Consistência

Ao criar ou editar componentes, verifique:

- [ ] Títulos principais usam `text-2xl`
- [ ] Labels de formulário usam `text-xs`
- [ ] Inputs têm `py-2` e `text-sm`
- [ ] Ícones em inputs têm `h-4 w-4`
- [ ] Espaçamento entre campos é `space-y-4`
- [ ] Botões principais usam `py-2.5 px-4 text-sm`
- [ ] Cards usam `p-6 lg:p-8` e `rounded-xl`
- [ ] Headers/Footers usam `py-3 px-4`

---

## 📱 Responsividade

### **Breakpoints Tailwind**
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### **Padrão de Grid Responsivo**
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
  {/* Conteúdo */}
</div>
```

---

## 📝 Exemplos de Uso

### Formulário de Input Padrão
```tsx
<div>
  <label htmlFor="campo" className="block text-xs font-medium text-gray-700 mb-1">
    Nome do Campo
  </label>
  <div className="relative">
    <IconeComponent className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
    <input
      id="campo"
      type="text"
      className="w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Digite aqui"
    />
  </div>
</div>
```

### Botão Padrão
```tsx
<button className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
  <IconeComponent className="h-3.5 w-3.5 mr-2" />
  Texto do Botão
</button>
```

---

**Última atualização**: 02 de outubro de 2025
**Versão**: 1.0.0
