/**
 * API de Perfil - Sincronizado com API_DOCUMENTATION.md
 * Gerenciamento de perfil do usuário
 */

import axiosInstance from '../services/axios-instance'
import { API_CONFIG } from './config'

// ============ INTERFACES ============

// Interface para completar perfil de aluno
export interface CompletarPerfilAlunoPayload {
  matricula: string
  telefone: string
  bio?: string
  curso_uuid: string
  turma_uuid: string
}

// Interface para completar perfil de docente
export interface CompletarPerfilDocentePayload {
  telefone: string
  bio?: string
  departamento_uuid: string
}

// Interface para atualizar perfil
export interface AtualizarPerfilPayload {
  telefone?: string
  bio?: string
  linkedin_url?: string
  github_url?: string
  portfolio_url?: string
  instagram_url?: string
  tiktok_url?: string
  facebook_url?: string

  // Dados Acadêmicos (Opcionais para atualização)
  curso_uuid?: string
  turma_uuid?: string
}

// Interface de resposta do perfil
export interface PerfilResponse {
  uuid: string
  nome: string
  email: string
  tipo: 'ALUNO' | 'DOCENTE'
  telefone?: string
  bio?: string
  avatarUrl?: string
  avatar_url?: string
  matricula?: string
  curso?: {
    uuid: string
    nome: string
    sigla: string
  }
  // Campos alternativos retornados pela API
  curso_nome?: string
  curso_uuid?: string
  turma_uuid?: string
  turma?: {
    uuid: string
    codigo: string
    nome: string
  }
  turma_codigo?: string
  departamento?: {
    uuid: string
    nome: string
  }
  links_portfolio?: string[]
  // Redes sociais
  linkedin_url?: string
  github_url?: string
  portfolio_url?: string
  instagram_url?: string
  tiktok_url?: string
  facebook_url?: string

  // Metadados
  primeiroAcesso: boolean
  criadoEm: string
  atualizadoEm: string
}

// ============ FUNÇÕES ============

/**
 * Completar cadastro de aluno
 * POST /perfil/completar/aluno
 */
export async function completarPerfilAluno(payload: CompletarPerfilAlunoPayload): Promise<PerfilResponse> {
  const response = await axiosInstance.post(API_CONFIG.PERFIL.COMPLETAR_ALUNO, payload)
  return response.data
}

/**
 * Completar cadastro de docente
 * POST /perfil/completar/docente
 */
export async function completarPerfilDocente(payload: CompletarPerfilDocentePayload): Promise<PerfilResponse> {
  const response = await axiosInstance.post(API_CONFIG.PERFIL.COMPLETAR_DOCENTE, payload)
  return response.data
}

/**
 * Atualizar perfil
 * PATCH /perfil
 */
export async function atualizarPerfil(payload: AtualizarPerfilPayload): Promise<{ mensagem: string; perfil: PerfilResponse }> {
  const response = await axiosInstance.patch(API_CONFIG.PERFIL.UPDATE, payload)
  return response.data
}

/**
 * Buscar perfil do usuário autenticado
 * GET /perfil
 */
export async function buscarPerfil(): Promise<PerfilResponse> {
  const response = await axiosInstance.get(API_CONFIG.PERFIL.GET)
  return response.data
}

/**
 * Verificar se usuário precisa completar o cadastro
 */
export async function verificarPerfilCompleto(): Promise<{ completo: boolean; pendencias?: string[] }> {
  try {
    const perfil = await buscarPerfil()

    const pendencias: string[] = []

    if (perfil.tipo === 'ALUNO') {
      if (!perfil.matricula) pendencias.push('matricula')
      if (!perfil.curso) pendencias.push('curso')
      if (!perfil.turma) pendencias.push('turma')
    }

    if (!perfil.telefone) pendencias.push('telefone')

    return {
      completo: pendencias.length === 0,
      pendencias: pendencias.length > 0 ? pendencias : undefined
    }
  } catch (error) {
    console.error('Erro ao verificar perfil:', error)
    return { completo: false }
  }
}
