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
  aluno_uuid: string
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
  orientadores_uuids: string[]
  tecnologias_uuids?: string[] // Backend DTO doesnt strictly require techs in Passo3? Check backend again. DTO says orientadores_uuids is required.
}

export interface FasePayload {
  descricao?: string
  anexos?: Array<{
    id: string
    tipo: string
    nome_arquivo: string
    url_arquivo: string
    tamanho_bytes?: number
    mime_type?: string
  }>
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
}

export interface UsuariosResolvidos {
  alunos: Array<{ email: string; usuario_uuid: string; aluno_uuid: string; nome: string }>
  professores: Array<{ email: string; usuario_uuid: string; professor_uuid: string; nome: string }>
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
 * Passo 4: Banner e publicação
 * POST /projetos/:uuid/passo4
 */
export async function criarProjetoPasso4(projetoUuid: string, payload: Passo4Payload): Promise<Projeto> {
  const response = await axiosInstance.post(API_CONFIG.PROJETOS.CREATE_PASSO4(projetoUuid), payload)
  return response.data
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

// ============ UTILITÁRIOS ============

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
