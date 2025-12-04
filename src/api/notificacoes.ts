/**
 * API de Notificações - Sincronizado com API_DOCUMENTATION.md
 * Gerenciamento de notificações do usuário
 */

import axiosInstance from '../services/axios-instance'
import { API_CONFIG } from './config'

// ============ INTERFACES ============

export interface Notificacao {
  uuid: string
  titulo: string
  mensagem: string
  tipo: 'INFO' | 'SUCESSO' | 'ALERTA' | 'ERRO' | 'PROJETO' | 'ETAPA' | 'FEEDBACK'
  lida: boolean
  link?: string
  projeto?: {
    uuid: string
    titulo: string
  }
  etapa?: {
    uuid: string
    titulo: string
  }
  criadoEm: string
}

export interface ListarNotificacoesParams {
  apenasNaoLidas?: boolean
}

export interface ContarNaoLidasResponse {
  total: number
}

// ============ FUNÇÕES ============

/**
 * Listar notificações
 * GET /notificacoes
 */
export async function listarNotificacoes(params?: ListarNotificacoesParams): Promise<Notificacao[]> {
  const response = await axiosInstance.get(API_CONFIG.NOTIFICACOES.LIST, { params })
  return response.data
}

/**
 * Contar notificações não lidas
 * GET /notificacoes/nao-lidas/contar
 */
export async function contarNaoLidas(): Promise<ContarNaoLidasResponse> {
  const response = await axiosInstance.get(API_CONFIG.NOTIFICACOES.CONTAR_NAO_LIDAS)
  return response.data
}

/**
 * Marcar notificação como lida
 * POST /notificacoes/:uuid/marcar-lida
 */
export async function marcarComoLida(uuid: string): Promise<{ mensagem: string }> {
  const response = await axiosInstance.post(API_CONFIG.NOTIFICACOES.MARCAR_LIDA(uuid))
  return response.data
}

/**
 * Marcar todas as notificações como lidas
 * POST /notificacoes/marcar-todas-lidas
 */
export async function marcarTodasComoLidas(): Promise<{ mensagem: string; quantidade: number }> {
  const response = await axiosInstance.post(API_CONFIG.NOTIFICACOES.MARCAR_TODAS_LIDAS)
  return response.data
}

/**
 * Deletar notificação
 * DELETE /notificacoes/:uuid
 */
export async function deletarNotificacao(uuid: string): Promise<{ mensagem: string }> {
  const response = await axiosInstance.delete(API_CONFIG.NOTIFICACOES.DELETE(uuid))
  return response.data
}

// ============ UTILITÁRIOS ============

/**
 * Ícones para cada tipo de notificação
 */
export const ICONES_NOTIFICACAO: Record<Notificacao['tipo'], string> = {
  INFO: '📢',
  SUCESSO: '✅',
  ALERTA: '⚠️',
  ERRO: '❌',
  PROJETO: '📁',
  ETAPA: '📋',
  FEEDBACK: '💬'
}

/**
 * Cores para cada tipo de notificação
 */
export const CORES_NOTIFICACAO: Record<Notificacao['tipo'], { bg: string; text: string; border: string }> = {
  INFO: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  SUCESSO: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  ALERTA: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  ERRO: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  PROJETO: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  ETAPA: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  FEEDBACK: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' }
}

/**
 * Formata data relativa (ex: "há 5 minutos")
 */
export function formatarDataRelativa(dataString: string): string {
  const data = new Date(dataString)
  const agora = new Date()
  const diffMs = agora.getTime() - data.getTime()
  const diffMinutos = Math.floor(diffMs / (1000 * 60))
  const diffHoras = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutos < 1) return 'agora mesmo'
  if (diffMinutos < 60) return `há ${diffMinutos} minuto${diffMinutos > 1 ? 's' : ''}`
  if (diffHoras < 24) return `há ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`
  if (diffDias < 7) return `há ${diffDias} dia${diffDias > 1 ? 's' : ''}`
  
  return data.toLocaleDateString('pt-BR')
}
