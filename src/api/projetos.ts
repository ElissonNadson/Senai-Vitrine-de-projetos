/**
 * API de Projetos - Sincronizado com API_DOCUMENTATION.md
 * Criação em 4 passos, consulta e gestão de projetos
 */

import axiosInstance from '../services/axios-instance'
import { API_CONFIG, FaseProjeto, PapelAutor } from './config'

// ============ INTERFACES ============

export interface Passo1Payload {
  titulo: string
  descricao: string
  departamento_uuid?: string // Opcional
}

export interface Passo1Response {
  uuid: string
  mensagem: string
}

export interface AutorPayload {
  usuario_uuid: string
  papel: PapelAutor
}

export interface Passo2Payload {
  curso: string
  turma: string
  modalidade: string
  unidade_curricular?: string
  itinerario?: boolean
  senai_lab?: boolean
  saga_senai?: boolean
}

export interface Passo3Payload {
  autores: AutorPayload[]
  orientadores_uuids: string[] // Array de usuario_uuids dos orientadores
  tecnologias_uuids?: string[]
}

export interface AnexoFase {
  id: string
  tipo: string
  nome_arquivo: string
  url_arquivo?: string
  tamanho_bytes?: number
  mime_type?: string
  file?: File // Para novos uploads
}

export interface FasePayload {
  descricao?: string
  anexos?: AnexoFase[]
}

export interface Passo4Payload {
  ideacao?: FasePayload
  modelagem?: FasePayload
  prototipagem?: FasePayload
  implementacao?: FasePayload
}

export interface Passo5Payload {
  has_repositorio: boolean
  tipo_repositorio?: string
  link_repositorio?: string
  codigo_visibilidade?: string
  anexos_visibilidade?: string
  aceitou_termos: boolean
}

export interface ProjetoListParams {
  departamento_uuid?: string
  fase?: FaseProjeto
  tecnologia_uuid?: string
  busca?: string
  limit?: number
  offset?: number
}

export interface Autor {
  uuid: string
  nome: string
  email: string
  papel: PapelAutor
  avatarUrl?: string
}

export interface Orientador {
  uuid: string
  nome: string
  email: string
  avatarUrl?: string
}

export interface Tecnologia {
  uuid: string
  nome: string
  icone?: string
  cor?: string
}

export interface Projeto {
  uuid: string
  titulo: string
  descricao: string
  fase_atual: FaseProjeto
  banner_url?: string
  repositorio_url?: string
  demo_url?: string
  status: string
  visibilidade: string
  departamento?: {
    uuid?: string
    nome: string
    cor_hex?: string
  }
  departamento_nome?: string
  departamento_cor?: string
  categoria?: string
  curso_nome?: string
  curso_sigla?: string
  autores: Autor[]
  orientadores: Orientador[]
  tecnologias: Tecnologia[]
  objetivos?: string
  resultados_esperados?: string
  criado_em: string
  atualizado_em?: string
  data_publicacao?: string
  // Badges
  itinerario?: boolean
  lab_maker?: boolean
  participou_saga?: boolean
  // Academic Fields
  curso?: string | { nome: string; sigla: string }
  turma?: string | { codigo: string }
  modalidade?: string
  unidade_curricular?: string

  // Contadores
  visualizacoes_count?: number
  curtidas_count?: number
}

// Projeto retornado pelo endpoint /projetos/meus
export interface MeuProjeto {
  uuid: string
  titulo: string
  descricao: string
  banner_url?: string
  fase_atual: string
  status: string
  visibilidade: string
  criado_em: string
  data_publicacao?: string
  departamento?: {
    nome: string
    cor_hex: string
  }
  curso?: {
    nome: string
    sigla: string
  }
  autores: Array<{
    nome: string
    papel: string
  }>
  orientadores: Array<{
    nome: string
  }>
  tecnologias: Tecnologia[]
  total_autores: number
}

export interface ProjetoUpdatePayload {
  titulo?: string
  descricao?: string
  objetivos?: string
  resultados_esperados?: string
  repositorio_url?: string
  demo_url?: string
  banner_url?: string
  itinerario?: boolean
  lab_maker?: boolean
  participou_saga?: boolean
  categoria?: string
  modalidade?: string
  curso?: string
  turma?: string
  unidade_curricular?: string
}

export interface UsuariosResolvidos {
  alunos: Array<{ email: string; usuario_uuid: string; aluno_uuid: string; nome: string }>
  docentes: Array<{ email: string; usuario_uuid: string; usuario_tipo: string; nome: string }>
  invalidos: string[]
}

// ============ CRIAÇÃO EM 4 PASSOS ============

/**
 * Passo 1: Informações básicas
 * POST /projetos/passo1
 */
export async function criarProjetoPasso1(payload: Passo1Payload): Promise<Passo1Response> {
  const response = await axiosInstance.post(API_CONFIG.PROJETOS.CREATE_PASSO1, payload)
  return response.data
}

/**
 * Passo 2: Autores
 * POST /projetos/:uuid/passo2
 */
export async function criarProjetoPasso2(projetoUuid: string, payload: Passo2Payload): Promise<{ mensagem: string }> {
  const response = await axiosInstance.post(API_CONFIG.PROJETOS.CREATE_PASSO2(projetoUuid), payload)
  return response.data
}

/**
 * Passo 3: Orientadores e tecnologias
 * POST /projetos/:uuid/passo3
 */
export async function criarProjetoPasso3(projetoUuid: string, payload: Passo3Payload): Promise<{ mensagem: string }> {
  const response = await axiosInstance.post(API_CONFIG.PROJETOS.CREATE_PASSO3(projetoUuid), payload)
  return response.data
}

/**
 * Passo 4: Fases do projeto com anexos
 * POST /projetos/:uuid/passo4
 * Converte automaticamente para FormData se houver arquivos
 */
export async function criarProjetoPasso4(projetoUuid: string, payload: Passo4Payload): Promise<{ mensagem: string }> {
  // Verificar se há arquivos para upload
  const temArquivos = Object.values(payload).some(fase =>
    fase?.anexos?.some(anexo => anexo.file)
  );

  // Converter para FormData se houver arquivos
  const data = temArquivos ? converterPasso4ParaFormData(payload) : payload;

  const response = await axiosInstance.post(
    API_CONFIG.PROJETOS.CREATE_PASSO4(projetoUuid),
    data,
    temArquivos ? {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    } : undefined
  );

  return response.data;
}

/**
 * Passo 5: Repositório e Confirmação
 * POST /projetos/:uuid/passo5
 */
export async function configurarRepositorioPasso5(projetoUuid: string, payload: Passo5Payload): Promise<{ mensagem: string }> {
  const response = await axiosInstance.post(API_CONFIG.PROJETOS.CREATE_PASSO5(projetoUuid), payload)
  return response.data
}

// ============ CONSULTA ============

/**
 * Listar projetos com filtros
 * GET /projetos
 */
export async function listarProjetos(params?: ProjetoListParams): Promise<Projeto[]> {
  const response = await axiosInstance.get(API_CONFIG.PROJETOS.LIST, { params })
  return response.data
}

/**
 * Buscar projeto por UUID
 * GET /projetos/:uuid
 */
export async function buscarProjeto(uuid: string): Promise<Projeto> {
  const response = await axiosInstance.get(API_CONFIG.PROJETOS.GET(uuid))
  return response.data
}

// ============ GESTÃO ============

/**
 * Atualizar projeto
 * PATCH /projetos/:uuid
 */
export async function atualizarProjeto(uuid: string, payload: ProjetoUpdatePayload): Promise<Projeto> {
  const response = await axiosInstance.patch(API_CONFIG.PROJETOS.UPDATE(uuid), payload)
  return response.data
}

/**
 * Deletar projeto
 * DELETE /projetos/:uuid
 */
export async function deletarProjeto(uuid: string): Promise<{ mensagem: string }> {
  const response = await axiosInstance.delete(API_CONFIG.PROJETOS.DELETE(uuid))
  return response.data
}



/**
 * Resolver e-mails para UUIDs
 * POST /projetos/resolver-usuarios
 */
export async function resolverUsuarios(emails: string[]): Promise<UsuariosResolvidos> {
  const response = await axiosInstance.post(API_CONFIG.PROJETOS.RESOLVER_USUARIOS, { emails })
  return response.data
}

/**
 * Buscar usuários para autocomplete
 * GET /projetos/usuarios/busca?termo=
 */
export async function buscarUsuariosAPI(termo: string): Promise<any[]> {
  const response = await axiosInstance.get('/projetos/usuarios/busca', {
    params: { termo }
  })
  return response.data
}

// ============ UTILITÁRIOS ============

/**
 * Converte Passo4Payload em FormData para upload de arquivos
 */
export function converterPasso4ParaFormData(payload: Passo4Payload): FormData {
  const formData = new FormData();
  const fases = ['ideacao', 'modelagem', 'prototipagem', 'implementacao'] as const;

  for (const nomeFase of fases) {
    const faseData = payload[nomeFase];

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
          if (anexo.tamanho_bytes) {
            formData.append(`${nomeFase}[anexos][${index}][tamanho_bytes]`, anexo.tamanho_bytes.toString());
          }
          if (anexo.mime_type) {
            formData.append(`${nomeFase}[anexos][${index}][mime_type]`, anexo.mime_type);
          }
        }

        // Se tem arquivo novo para upload (File object)
        if (anexo.file) {
          const fieldname = `${nomeFase}_${anexo.tipo}`;
          formData.append(fieldname, anexo.file);
        }
      });
    }
  }

  return formData;
}

export interface MeusProjetosResponse {
  publicados: MeuProjeto[]
  rascunhos: MeuProjeto[]
}

/**
 * Buscar projetos do usuário logado
 * GET /projetos/meus
 */
export async function buscarMeusProjetos(): Promise<MeusProjetosResponse> {
  const response = await axiosInstance.get(API_CONFIG.PROJETOS.MEUS)
  return response.data
}
