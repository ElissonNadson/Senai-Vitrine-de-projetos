# Guia Rápido - Frontend: Upload de Anexos no Passo 4

## Mudanças Necessárias no Frontend

### 1. Modificar o Hook de Envio

No arquivo `frontend/src/api/projetos.ts`, a função `criarProjetoPasso4` já deve estar pronta para aceitar `FormData`:

```typescript
export async function criarProjetoPasso4(
  projetoUuid: string, 
  formData: FormData
): Promise<{ mensagem: string }> {
  const response = await axiosInstance.post(
    API_CONFIG.PROJETOS.CREATE_PASSO4(projetoUuid), 
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return response.data;
}
```

### 2. Preparar FormData no Componente

Exemplo de como montar o FormData quando o usuário salva o passo 4:

```typescript
const handleSalvarPasso4 = async () => {
  const formData = new FormData();

  // Para cada fase com dados
  const fases = ['ideacao', 'modelagem', 'prototipagem', 'implementacao'];
  
  for (const nomeFase of fases) {
    const faseData = projectData[nomeFase]; // Seus dados da fase
    
    if (!faseData) continue;

    // Adicionar descrição
    if (faseData.descricao) {
      formData.append(`${nomeFase}[descricao]`, faseData.descricao);
    }

    // Adicionar anexos
    if (faseData.anexos && faseData.anexos.length > 0) {
      faseData.anexos.forEach((anexo, index) => {
        // Metadados do anexo
        formData.append(`${nomeFase}[anexos][${index}][id]`, anexo.id);
        formData.append(`${nomeFase}[anexos][${index}][tipo]`, anexo.tipo);
        formData.append(`${nomeFase}[anexos][${index}][nome_arquivo]`, anexo.nome_arquivo);
        
        // Se já tem URL (anexo existente), enviar URL
        if (anexo.url_arquivo && !anexo.file) {
          formData.append(`${nomeFase}[anexos][${index}][url_arquivo]`, anexo.url_arquivo);
        }
        
        // Se tem arquivo novo para upload (File object)
        if (anexo.file) {
          const fieldname = `${nomeFase}_${anexo.tipo}`;
          formData.append(fieldname, anexo.file);
        }
      });
    }
  }

  // Enviar para a API
  try {
    await criarProjetoPasso4(projetoUuid, formData);
    toast.success('Fases salvas com sucesso!');
  } catch (error) {
    toast.error('Erro ao salvar fases');
  }
};
```

### 3. Estrutura de Dados Recomendada no Estado

```typescript
interface AnexoFase {
  id: string;
  tipo: string; // 'crazy8', 'wireframe', etc.
  nome_arquivo: string;
  url_arquivo?: string; // URL se já existe no servidor
  file?: File; // Objeto File se é novo upload
  tamanho_bytes?: number;
  mime_type?: string;
}

interface FaseData {
  descricao: string;
  anexos: AnexoFase[];
}

interface ProjectData {
  ideacao?: FaseData;
  modelagem?: FaseData;
  prototipagem?: FaseData;
  implementacao?: FaseData;
}
```

### 4. Adicionar Anexo (quando usuário seleciona arquivo)

```typescript
const handleAdicionarAnexo = (fase: string, tipo: string, file: File) => {
  const novoAnexo: AnexoFase = {
    id: `temp-${Date.now()}`, // ID temporário
    tipo: tipo,
    nome_arquivo: file.name,
    file: file, // Guarda o File object
    tamanho_bytes: file.size,
    mime_type: file.type
  };

  setProjectData(prev => ({
    ...prev,
    [fase]: {
      ...prev[fase],
      anexos: [...(prev[fase]?.anexos || []), novoAnexo]
    }
  }));
};
```

### 5. Substituir Anexo Existente

```typescript
const handleSubstituirAnexo = (fase: string, indexAnexo: number, novoFile: File) => {
  setProjectData(prev => {
    const faseData = prev[fase];
    const anexos = [...faseData.anexos];
    
    // Atualiza o anexo específico mantendo o tipo
    anexos[indexAnexo] = {
      ...anexos[indexAnexo],
      nome_arquivo: novoFile.name,
      file: novoFile, // Novo arquivo para upload
      tamanho_bytes: novoFile.size,
      mime_type: novoFile.type
    };

    return {
      ...prev,
      [fase]: {
        ...faseData,
        anexos
      }
    };
  });
};
```

### 6. Remover Anexo

```typescript
const handleRemoverAnexo = (fase: string, indexAnexo: number) => {
  setProjectData(prev => {
    const faseData = prev[fase];
    const anexos = faseData.anexos.filter((_, idx) => idx !== indexAnexo);

    return {
      ...prev,
      [fase]: {
        ...faseData,
        anexos
      }
    };
  });
};
```

### 7. Carregar Projeto Existente (Edição)

Quando buscar um projeto para editar, converter os anexos do formato da API:

```typescript
const carregarProjetoParaEdicao = async (uuid: string) => {
  const projeto = await buscarProjeto(uuid);
  
  // Converter fases
  const projectData = {
    ideacao: projeto.fases?.ideacao ? {
      descricao: projeto.fases.ideacao.descricao,
      anexos: projeto.fases.ideacao.anexos.map(a => ({
        id: a.id,
        tipo: a.tipo_anexo,
        nome_arquivo: a.nome_arquivo,
        url_arquivo: a.url_arquivo,
        tamanho_bytes: a.tamanho_bytes,
        mime_type: a.mime_type
        // Sem 'file' pois é anexo existente
      }))
    } : undefined,
    // Repetir para outras fases...
  };

  setProjectData(projectData);
};
```

### 8. Componente de Upload de Arquivo

```tsx
interface FileUploadProps {
  fase: string;
  tipo: string;
  anexoExistente?: AnexoFase;
  onUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ fase, tipo, anexoExistente, onUpload }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="border-2 border-dashed rounded-lg p-4">
      <input
        type="file"
        onChange={handleChange}
        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
        className="hidden"
        id={`upload-${fase}-${tipo}`}
      />
      
      <label 
        htmlFor={`upload-${fase}-${tipo}`}
        className="cursor-pointer"
      >
        {anexoExistente ? (
          <div>
            <p>Arquivo: {anexoExistente.nome_arquivo}</p>
            <button className="text-blue-600">Substituir</button>
          </div>
        ) : (
          <div>
            <p>Clique para fazer upload</p>
            <p className="text-sm text-gray-500">ou arraste o arquivo aqui</p>
          </div>
        )}
      </label>
    </div>
  );
};
```

## Fluxo Completo

### Criação (primeira vez)
1. Usuário preenche descrição da fase
2. Usuário seleciona arquivo(s) para upload
3. Arquivo é armazenado no estado como `File` object
4. Ao salvar, FormData é montado com descrição + arquivos
5. API recebe, salva arquivos no disco e registra no banco

### Edição (atualização)
1. Busca projeto existente
2. Carrega anexos existentes (com URL)
3. Anexos existentes aparecem com botão "Substituir"
4. Se usuário não mexer no anexo, ele não é enviado
5. Se usuário substituir, envia apenas o novo arquivo
6. Outros anexos permanecem intactos

## Vantagens desta Abordagem

✅ **Upload incremental**: Apenas arquivos novos/modificados são enviados  
✅ **Sem perda de dados**: Anexos não enviados permanecem no servidor  
✅ **Performance**: Não reenvia arquivos que já estão no servidor  
✅ **Flexibilidade**: Pode adicionar N anexos de tipos diferentes  
✅ **Versionamento**: Substituir arquivo mantém o tipo, apenas atualiza conteúdo  

## Próximos Passos

1. Implementar componente de upload de arquivos
2. Adicionar preview de arquivos (especialmente imagens)
3. Adicionar progress bar para uploads grandes
4. Implementar drag-and-drop
5. Validar tipos de arquivo no frontend antes de enviar
6. Adicionar opção de remover anexo permanentemente (se necessário)
