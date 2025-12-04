/**
 * API de Etapas - Sincronizado com API_DOCUMENTATION.md
 * Gerenciamento de etapas de projetos
 */

import axiosInstance from '../services/axios-instance'
import { API_CONFIG, TipoEtapa, StatusFeedback, TipoAnexo } from './config'

// ============ INTERFACES ============

export interface CriarEtapaPayload {
  titulo: string
  descricao: string
  tipo_etapa: TipoEtapa
}

export interface AnexoPayload {
  url: string
  tipo: TipoAnexo
  descricao?: string
}

export interface AdicionarAnexosPayload {
  anexos: AnexoPayload[]
}

export interface ConcluirEtapaPayload {
  observacoes?: string
}

export interface FeedbackPayload {
  status: StatusFeedback
  comentario?: string
}

export interface AtualizarEtapaPayload {
  titulo?: string
  descricao?: string
}

export interface Anexo {
  uuid: string
  url: string
  tipo: TipoAnexo
  descricao?: string
  criadoEm: string
}

export interface Feedback {
  uuid: string
  status: StatusFeedback
  comentario?: string
  professor: {
    uuid: string
    nome: string
  }
  criadoEm: string
}

export interface Etapa {
  uuid: string
  titulo: string
  descricao: string
  tipoEtapa: TipoEtapa
  concluida: boolean
  observacoesConclusao?: string
  concluidaEm?: string
  anexos: Anexo[]
  feedbacks: Feedback[]
  criadoEm: string
  atualizadoEm: string
  // Campos adicionais para compatibilidade com componentes legados
  nomeEtapa?: string  // Alias para titulo
  ordem?: number      // Ordem da etapa
  status?: string     // Status legado (PENDENTE, EM_ANDAMENTO, CONCLUIDA)
}

// ============ CRUD DE ETAPAS ============

/**
 * Criar etapa
 * POST /etapas/projeto/:projetoUuid
 */
export async function criarEtapa(projetoUuid: string, payload: CriarEtapaPayload): Promise<Etapa> {
  const response = await axiosInstance.post(API_CONFIG.ETAPAS.CREATE(projetoUuid), payload)
  return response.data
}

/**
 * Listar etapas de um projeto
 * GET /etapas/projeto/:projetoUuid
 */
export async function listarEtapasProjeto(projetoUuid: string): Promise<Etapa[]> {
  const response = await axiosInstance.get(API_CONFIG.ETAPAS.LIST_BY_PROJETO(projetoUuid))
  return response.data
}

/**
 * Buscar etapa por UUID
 * GET /etapas/:uuid
 */
export async function buscarEtapa(uuid: string): Promise<Etapa> {
  const response = await axiosInstance.get(API_CONFIG.ETAPAS.GET(uuid))
  return response.data
}

/**
 * Atualizar etapa
 * PATCH /etapas/:uuid
 */
export async function atualizarEtapa(uuid: string, payload: AtualizarEtapaPayload): Promise<Etapa> {
  const response = await axiosInstance.patch(API_CONFIG.ETAPAS.UPDATE(uuid), payload)
  return response.data
}

/**
 * Deletar etapa
 * DELETE /etapas/:uuid
 */
export async function deletarEtapa(uuid: string): Promise<{ mensagem: string }> {
  const response = await axiosInstance.delete(API_CONFIG.ETAPAS.DELETE(uuid))
  return response.data
}

// ============ ANEXOS ============

/**
 * Adicionar anexos a uma etapa
 * POST /etapas/:uuid/anexos
 */
export async function adicionarAnexos(etapaUuid: string, payload: AdicionarAnexosPayload): Promise<Etapa> {
  const response = await axiosInstance.post(API_CONFIG.ETAPAS.ADD_ANEXOS(etapaUuid), payload)
  return response.data
}

/**
 * Deletar anexo
 * DELETE /etapas/anexo/:anexoUuid
 */
export async function deletarAnexo(anexoUuid: string): Promise<{ mensagem: string }> {
  const response = await axiosInstance.delete(API_CONFIG.ETAPAS.DELETE_ANEXO(anexoUuid))
  return response.data
}

// ============ CONCLUSÃO E FEEDBACK ============

/**
 * Concluir etapa
 * POST /etapas/:uuid/concluir
 */
export async function concluirEtapa(uuid: string, payload?: ConcluirEtapaPayload): Promise<Etapa> {
  const response = await axiosInstance.post(API_CONFIG.ETAPAS.CONCLUIR(uuid), payload || {})
  return response.data
}

/**
 * Dar feedback em etapa (orientador)
 * POST /etapas/:uuid/feedback
 */
export async function darFeedback(uuid: string, payload: FeedbackPayload): Promise<Etapa> {
  const response = await axiosInstance.post(API_CONFIG.ETAPAS.FEEDBACK(uuid), payload)
  return response.data
}
