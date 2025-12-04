/**
 * API Queries - Sincronizado com API_DOCUMENTATION.md
 * Funções de consulta à API
 */

import axiosInstance from '../services/axios-instance'
import { API_CONFIG } from './config'

// ============ AUTENTICAÇÃO ============

/**
 * Buscar usuário atual
 * GET /auth/me
 */
export async function getMe() {
  const response = await axiosInstance.get(API_CONFIG.AUTH.ME)
  return response.data
}

/**
 * Renovar token
 * POST /auth/refresh
 */
export async function refreshToken(token: string) {
  const response = await axiosInstance.post(API_CONFIG.AUTH.REFRESH, { token })
  return response.data
}

/**
 * Logout
 * POST /auth/logout
 */
export async function logout() {
  const response = await axiosInstance.post(API_CONFIG.AUTH.LOGOUT)
  return response.data
}

// ============ DASHBOARD ============

/**
 * Buscar dados do dashboard
 * GET /dashboard
 */
export async function getDashboard() {
  const response = await axiosInstance.get(API_CONFIG.DASHBOARD.GET)
  return response.data
}

// ============ CURSOS ============

/**
 * Listar cursos
 * GET /cursos
 */
export async function getCursos(incluirInativos: boolean = false) {
  const response = await axiosInstance.get(API_CONFIG.CURSOS.LIST, {
    params: { incluirInativos }
  })
  return response.data
}

/**
 * Buscar curso por UUID
 * GET /cursos/:uuid
 */
export async function getCursoByUuid(uuid: string) {
  const response = await axiosInstance.get(API_CONFIG.CURSOS.GET(uuid))
  return response.data
}

/**
 * Buscar curso por sigla
 * GET /cursos/sigla/:sigla
 */
export async function getCursoBySigla(sigla: string) {
  const response = await axiosInstance.get(API_CONFIG.CURSOS.GET_BY_SIGLA(sigla))
  return response.data
}

// ============ TURMAS ============

/**
 * Listar turmas
 * GET /turmas
 */
export async function getTurmas(params?: { cursoUuid?: string; incluirInativas?: boolean }) {
  const response = await axiosInstance.get(API_CONFIG.TURMAS.LIST, { params })
  return response.data
}

/**
 * Buscar turma por UUID
 * GET /turmas/:uuid
 */
export async function getTurmaByUuid(uuid: string, incluirAlunos: boolean = false) {
  const response = await axiosInstance.get(API_CONFIG.TURMAS.GET(uuid), {
    params: { incluirAlunos }
  })
  return response.data
}

/**
 * Buscar turma por código
 * GET /turmas/codigo/:codigo
 */
export async function getTurmaByCodigo(codigo: string) {
  const response = await axiosInstance.get(API_CONFIG.TURMAS.GET_BY_CODIGO(codigo))
  return response.data
}

/**
 * Buscar turmas por curso
 * GET /turmas?cursoUuid=xxx
 */
export async function getTurmasByCurso(cursoUuid: string, incluirInativas: boolean = false) {
  const response = await axiosInstance.get(API_CONFIG.TURMAS.LIST, {
    params: { cursoUuid, incluirInativas }
  })
  return response.data
}

// ============ PROJETOS ============

/**
 * Listar projetos
 * GET /projetos
 */
export async function getProjetos(params?: {
  departamento_uuid?: string
  fase?: string
  tecnologia_uuid?: string
  busca?: string
  limit?: number
  offset?: number
}) {
  const response = await axiosInstance.get(API_CONFIG.PROJETOS.LIST, { params })
  return response.data
}

/**
 * Buscar projeto por UUID
 * GET /projetos/:uuid
 */
export async function getProjetoByUuid(uuid: string) {
  const response = await axiosInstance.get(API_CONFIG.PROJETOS.GET(uuid))
  return response.data
}

// ============ ETAPAS ============

/**
 * Listar etapas de um projeto
 * GET /etapas/projeto/:projetoUuid
 */
export async function getEtapasProjeto(projetoUuid: string) {
  const response = await axiosInstance.get(API_CONFIG.ETAPAS.LIST_BY_PROJETO(projetoUuid))
  return response.data
}

/**
 * Buscar etapa por UUID
 * GET /etapas/:uuid
 */
export async function getEtapaByUuid(uuid: string) {
  const response = await axiosInstance.get(API_CONFIG.ETAPAS.GET(uuid))
  return response.data
}

// ============ NOTIFICAÇÕES ============

/**
 * Listar notificações
 * GET /notificacoes
 */
export async function getNotifications(params?: { apenasNaoLidas?: boolean }) {
  try {
    const response = await axiosInstance.get(API_CONFIG.NOTIFICACOES.LIST, { params })
    return response.data
  } catch (error: any) {
    if (error?.response?.status !== 403) {
      console.error('Erro ao buscar notificações:', error)
    }
    return []
  }
}

/**
 * Contar notificações não lidas
 * GET /notificacoes/nao-lidas/contar
 */
export async function getNotificacoesNaoLidas() {
  try {
    const response = await axiosInstance.get(API_CONFIG.NOTIFICACOES.CONTAR_NAO_LIDAS)
    return response.data
  } catch (error) {
    return { total: 0 }
  }
}

// ============ PERFIL ============

/**
 * Buscar perfil do usuário
 * GET /perfil
 */
export async function getPerfil() {
  const response = await axiosInstance.get(API_CONFIG.PERFIL.GET)
  return response.data
}

// ============ PROGRESSÃO ============

/**
 * Verificar progressão do projeto
 * GET /progressao/verificar/:projetoUuid
 */
export async function verificarProgressao(projetoUuid: string) {
  const response = await axiosInstance.get(API_CONFIG.PROGRESSAO.VERIFICAR(projetoUuid))
  return response.data
}

/**
 * Buscar histórico de progressão
 * GET /progressao/historico/:projetoUuid
 */
export async function getHistoricoProgressao(projetoUuid: string) {
  const response = await axiosInstance.get(API_CONFIG.PROGRESSAO.HISTORICO(projetoUuid))
  return response.data
}

// ============ UPLOAD ============

/**
 * Buscar tipos de upload suportados
 * GET /upload/tipos
 */
export async function getTiposUpload() {
  const response = await axiosInstance.get(API_CONFIG.UPLOAD.TIPOS)
  return response.data
}

// ============ FUNÇÕES LEGADAS (mantidas para compatibilidade) ============

// Essas funções são mantidas para não quebrar código existente
// mas usam os novos endpoints

export async function getCalendarEvents() {
  // Não há endpoint de eventos no momento
  return { data: [] }
}

export async function getCommunityData() {
  // Dados da comunidade podem vir do dashboard
  return {
    featuredProjects: [],
    recentDiscussions: [],
    activeMembers: []
  }
}

export async function getUnidadesCurriculares() {
  // Retorna array vazio - endpoint não existe na nova API
  return []
}

export async function getAvaliacoes() {
  // Retorna array vazio - endpoint não existe na nova API
  return []
}
