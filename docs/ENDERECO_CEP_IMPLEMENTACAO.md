# 📍 Sistema de Endereço com CEP - Guia de Implementação

## 🎯 Objetivo

Implementar um sistema completo de cadastro de endereço que:
- Busca automaticamente dados do CEP via API ViaCEP
- Valida CEP brasileiro
- Preenche automaticamente rua, bairro, cidade e estado
- Permite edição manual dos campos

---

## 📦 Bibliotecas Necessárias

### 1. Para validação e máscara de CEP
```bash
npm install react-input-mask
# ou
npm install imask
```

### 2. API de CEP (Gratuita)
Usaremos a **ViaCEP** - API gratuita e sem necessidade de chave
- URL: `https://viacep.com.br/ws/{cep}/json/`
- Limite: Sem limite documentado (uso razoável)
- Documentação: https://viacep.com.br/

---

## 🛠️ Implementação no Frontend

### 1️⃣ Adicionar máscara ao campo CEP

```tsx
import InputMask from 'react-input-mask';

// No componente ProfileTab.tsx
const [loadingCep, setLoadingCep] = useState(false);

// Função para buscar CEP
const buscarCEP = async (cep: string) => {
  // Remove caracteres não numéricos
  const cepLimpo = cep.replace(/\D/g, '');
  
  // Valida se tem 8 dígitos
  if (cepLimpo.length !== 8) return;
  
  setLoadingCep(true);
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      alert('CEP não encontrado!');
      return;
    }
    
    // Preenche os campos automaticamente
    setFormData({
      ...formData,
      cep: cep,
      rua: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
      complemento: data.complemento || formData.complemento
    });
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    alert('Erro ao buscar CEP. Tente novamente.');
  } finally {
    setLoadingCep(false);
  }
};

// Campo CEP com máscara
<InputMask
  mask="99999-999"
  value={formData.cep}
  onChange={(e) => {
    setFormData({ ...formData, cep: e.target.value });
    // Busca automática quando CEP está completo
    if (e.target.value.replace(/\D/g, '').length === 8) {
      buscarCEP(e.target.value);
    }
  }}
  disabled={!isEditing}
>
  {(inputProps) => (
    <input
      {...inputProps}
      type="text"
      placeholder="00000-000"
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent"
    />
  )}
</InputMask>

// Adicionar indicador de carregamento
{loadingCep && (
  <div className="absolute right-3 top-1/2 -translate-y-1/2">
    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
  </div>
)}
```

---

## 🔧 Implementação Completa do Campo CEP

```tsx
import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

// Estado para controle
const [cepStatus, setCepStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

// Função melhorada de busca
const buscarCEP = async (cep: string) => {
  const cepLimpo = cep.replace(/\D/g, '');
  
  if (cepLimpo.length !== 8) {
    setCepStatus('idle');
    return;
  }
  
  setCepStatus('loading');
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      setCepStatus('error');
      return;
    }
    
    setFormData({
      ...formData,
      cep: cep,
      rua: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      estado: data.uf || '',
      complemento: data.complemento || formData.complemento
    });
    
    setCepStatus('success');
    
    // Remove o status de sucesso após 2 segundos
    setTimeout(() => setCepStatus('idle'), 2000);
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    setCepStatus('error');
  }
};

// Campo CEP com feedback visual
<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    CEP
  </label>
  <div className="relative">
    <InputMask
      mask="99999-999"
      value={formData.cep}
      onChange={(e) => {
        setFormData({ ...formData, cep: e.target.value });
        if (e.target.value.replace(/\D/g, '').length === 8) {
          buscarCEP(e.target.value);
        }
      }}
      disabled={!isEditing}
    >
      {(inputProps) => (
        <input
          {...inputProps}
          type="text"
          placeholder="00000-000"
          className={`w-full px-4 py-2 pr-10 border rounded-lg disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent ${
            cepStatus === 'error' 
              ? 'border-red-500 dark:border-red-400' 
              : 'border-gray-300 dark:border-gray-600'
          } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
        />
      )}
    </InputMask>
    
    {/* Indicadores */}
    <div className="absolute right-3 top-1/2 -translate-y-1/2">
      {cepStatus === 'loading' && (
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      )}
      {cepStatus === 'success' && (
        <CheckCircle className="h-5 w-5 text-green-500" />
      )}
      {cepStatus === 'error' && (
        <XCircle className="h-5 w-5 text-red-500" />
      )}
    </div>
  </div>
  
  {cepStatus === 'error' && (
    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
      CEP não encontrado. Verifique e tente novamente.
    </p>
  )}
</div>
```

---

## 🗄️ Estrutura no Banco de Dados

```sql
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS cep VARCHAR(9);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS rua VARCHAR(255);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS numero VARCHAR(20);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS complemento VARCHAR(100);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS bairro VARCHAR(100);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS cidade VARCHAR(100);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS estado CHAR(2);

-- Índice para buscas por localização
CREATE INDEX idx_usuarios_cidade_estado ON usuarios(cidade, estado);
```

---

## 📡 Endpoints da API

### 1. Atualizar endereço do usuário

```typescript
// Backend: PUT /api/users/endereco
interface EnderecoDTO {
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

// Endpoint
router.put('/users/endereco', authenticate, async (req, res) => {
  const { cep, rua, numero, complemento, bairro, cidade, estado } = req.body;
  const userId = req.user.uuid;
  
  try {
    // Validar CEP
    if (!/^\d{5}-?\d{3}$/.test(cep)) {
      return res.status(400).json({ error: 'CEP inválido' });
    }
    
    // Atualizar no banco
    await prisma.usuarios.update({
      where: { uuid: userId },
      data: {
        cep,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado
      }
    });
    
    res.json({ message: 'Endereço atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar endereço:', error);
    res.status(500).json({ error: 'Erro ao atualizar endereço' });
  }
});
```

---

## ✅ Validações Importantes

### 1. Validação de CEP

```typescript
const validarCEP = (cep: string): boolean => {
  // Remove caracteres não numéricos
  const cepLimpo = cep.replace(/\D/g, '');
  
  // Verifica se tem 8 dígitos
  if (cepLimpo.length !== 8) return false;
  
  // Verifica se não é uma sequência inválida (ex: 00000000)
  if (/^(\d)\1{7}$/.test(cepLimpo)) return false;
  
  return true;
};
```

### 2. Validação de Estado

```typescript
const ESTADOS_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const validarEstado = (estado: string): boolean => {
  return ESTADOS_BRASIL.includes(estado.toUpperCase());
};
```

---

## 🎨 Feedback Visual ao Usuário

### 1. Estados do campo CEP
- **Idle**: Campo normal
- **Loading**: Spinner animado
- **Success**: Check verde (2 segundos)
- **Error**: X vermelho + mensagem de erro

### 2. Preenchimento automático
Quando o CEP é válido:
1. Os campos são preenchidos automaticamente
2. Uma animação suave destaca os campos preenchidos
3. O usuário pode editar qualquer campo manualmente

---

## 🔐 Considerações de Segurança

1. **Validação no Backend**: Sempre validar CEP no servidor
2. **Sanitização**: Remover caracteres especiais antes de salvar
3. **Rate Limiting**: Limitar requisições à API ViaCEP
4. **Fallback**: Permitir preenchimento manual se API falhar

---

## 🚀 Passo a Passo de Implementação

### Fase 1: Frontend (2-3 horas)
- [x] Criar campos de endereço separados
- [ ] Instalar e configurar `react-input-mask`
- [ ] Implementar função `buscarCEP()`
- [ ] Adicionar feedback visual (loading, success, error)
- [ ] Testar em diferentes dispositivos

### Fase 2: Backend (2-3 horas)
- [ ] Adicionar colunas no banco de dados
- [ ] Criar endpoint PUT `/api/users/endereco`
- [ ] Implementar validações de CEP e estado
- [ ] Atualizar endpoint GET `/api/users/me` para incluir endereço

### Fase 3: Integração (1 hora)
- [ ] Conectar formulário ao endpoint
- [ ] Testar fluxo completo (cadastro → busca CEP → salvar)
- [ ] Adicionar tratamento de erros
- [ ] Documentar código

### Fase 4: Melhorias (opcional)
- [ ] Cache de CEPs consultados (localStorage)
- [ ] Histórico de endereços
- [ ] Geolocalização por CEP (adicionar lat/long)
- [ ] Mapa interativo mostrando localização

---

## 📱 Exemplo de UX Ideal

```
1. Usuário clica em "Editar Perfil"
2. Usuário digita CEP: "01310-100"
3. Sistema mostra spinner
4. Sistema preenche automaticamente:
   - Rua: "Avenida Paulista"
   - Bairro: "Bela Vista"
   - Cidade: "São Paulo"
   - Estado: "SP"
5. Usuário digita apenas: Número "1000"
6. Usuário clica em "Salvar"
7. Sistema valida e salva no banco
8. Mensagem de sucesso aparece
```

---

## 🔗 Links Úteis

- **ViaCEP**: https://viacep.com.br/
- **Documentação ViaCEP**: https://viacep.com.br/
- **React Input Mask**: https://github.com/sanniassin/react-input-mask
- **Validação de CEP**: https://www.devmedia.com.br/validar-cep-em-javascript/

---

## 💡 Dicas Extras

1. **Performance**: Debounce da busca do CEP (esperar 500ms após última digitação)
2. **Cache**: Salvar CEPs consultados no localStorage
3. **Offline**: Permitir preenchimento manual se offline
4. **Acessibilidade**: Adicionar labels descritivos e aria-labels

---

## ⏱️ Tempo Estimado Total

- **Frontend**: 3 horas
- **Backend**: 3 horas
- **Testes**: 1 hora
- **Total**: ~7 horas de desenvolvimento

---

## 🎯 Status Atual

✅ **Concluído:**
- Interface dos campos criada
- Layout responsivo
- Badge "Em Desenvolvimento" adicionado
- Estados brasileiros no select

⏳ **Pendente:**
- Integração com ViaCEP
- Máscara de CEP
- Validações
- Salvamento no backend
