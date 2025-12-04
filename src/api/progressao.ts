/**
 * API de Progressão - Sincronizado com API_DOCUMENTATION.md
 * Gerenciamento de progressão de fases dos projetos
 */

import axiosInstance from '../services/axios-instance'
import { API_CONFIG, FaseProjeto } from './config'

// ============ INTERFACES ============

export interface VerificarProgressaoResponse {
  podeProgredir: boolean
  faseAtual: FaseProjeto
  proximaFase?: FaseProjeto
  motivo: string
}

export interface ProgressaoResponse {
  mensagem: string
  faseAnterior: FaseProjeto
  faseAtual: FaseProjeto
}

export interface ForcarProgressaoPayload {
  novaFase: FaseProjeto
}

export interface HistoricoProgressao {
  uuid: string
  faseAnterior: FaseProjeto
  faseNova: FaseProjeto
  motivo?: string
  usuario: {
    uuid: string
    nome: string
    tipo: 'ALUNO' | 'PROFESSOR'
  }
  criadoEm: string
}

export interface TransferirLiderancaPayload {
  novoLiderAlunoUuid: string
}

// ============ FUNÇÕES DE PROGRESSÃO ============

/**
 * Verificar se projeto pode progredir de fase
 * GET /progressao/verificar/:projetoUuid
 */
export async function verificarProgressao(projetoUuid: string): Promise<VerificarProgressaoResponse> {
  const response = await axiosInstance.get(API_CONFIG.PROGRESSAO.VERIFICAR(projetoUuid))
  return response.data
}

/**
 * Executar progressão automática
 * POST /progressao/automatica/:projetoUuid
 */
export async function progressaoAutomatica(projetoUuid: string): Promise<ProgressaoResponse> {
  const response = await axiosInstance.post(API_CONFIG.PROGRESSAO.AUTOMATICA(projetoUuid))
  return response.data
}

/**
 * Forçar progressão (admin/orientador)
 * POST /progressao/forcar/:projetoUuid
 */
export async function forcarProgressao(projetoUuid: string, payload: ForcarProgressaoPayload): Promise<ProgressaoResponse> {
  const response = await axiosInstance.post(API_CONFIG.PROGRESSAO.FORCAR(projetoUuid), payload)
  return response.data
}

/**
 * Buscar histórico de progressões
 * GET /progressao/historico/:projetoUuid
 */
export async function buscarHistoricoProgressao(projetoUuid: string): Promise<HistoricoProgressao[]> {
  const response = await axiosInstance.get(API_CONFIG.PROGRESSAO.HISTORICO(projetoUuid))
  return response.data
}

/**
 * Transferir liderança do projeto
 * POST /progressao/transferir-lideranca/:projetoUuid
 */
export async function transferirLideranca(
  projetoUuid: string, 
  payload: TransferirLiderancaPayload
): Promise<{ mensagem: string }> {
  const response = await axiosInstance.post(API_CONFIG.PROGRESSAO.TRANSFERIR_LIDERANCA(projetoUuid), payload)
  return response.data
}

// ============ UTILITÁRIOS ============

/**
 * Mapeamento de fases para labels amigáveis
 */
export const LABELS_FASES: Record<FaseProjeto, string> = {
  RASCUNHO: 'Rascunho',
  PLANEJAMENTO: 'Planejamento',
  EM_DESENVOLVIMENTO: 'Em Desenvolvimento',
  EM_TESTE: 'Em Teste',
  AGUARDANDO_REVISAO: 'Aguardando Revisão',
  CONCLUIDO: 'Concluído',
  ARQUIVADO: 'Arquivado'
}

/**
 * Cores para cada fase
 */
export const CORES_FASES: Record<FaseProjeto, { bg: string; text: string; border: string }> = {
  RASCUNHO: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
  PLANEJAMENTO: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  EM_DESENVOLVIMENTO: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  EM_TESTE: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  AGUARDANDO_REVISAO: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  CONCLUIDO: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  ARQUIVADO: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' }
}

/**
 * Ordem das fases para progressão
 */
export const ORDEM_FASES: FaseProjeto[] = [
  'RASCUNHO',
  'PLANEJAMENTO',
  'EM_DESENVOLVIMENTO',
  'EM_TESTE',
  'AGUARDANDO_REVISAO',
  'CONCLUIDO'
]

/**
 * Retorna a próxima fase na ordem de progressão
 */
export function getProximaFase(faseAtual: FaseProjeto): FaseProjeto | null {
  const index = ORDEM_FASES.indexOf(faseAtual)
  if (index === -1 || index === ORDEM_FASES.length - 1) return null
  return ORDEM_FASES[index + 1]
}
