import axiosInstance from '../services/axios-instance'

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessTokenIntegrado')
  return token ? {
    Authorization: `Bearer ${token}`
  } : {}
}

// Interface para completar perfil de aluno
export interface CompletarPerfilAlunoPayload {
  matricula: string
  telefone: string
  bio?: string
  curso_uuid: string
  turma_uuid: string
}

// Interface para completar perfil de professor
export interface CompletarPerfilProfessorPayload {
  telefone: string
  bio?: string
  departamento_uuid: string
}

// Interface para atualizar perfil
export interface AtualizarPerfilPayload {
  telefone?: string
  bio?: string
  links_portfolio?: string[]
}

// Interface de resposta do perfil
export interface PerfilResponse {
  uuid: string
  nome: string
  email: string
  tipo: 'ALUNO' | 'PROFESSOR'
  telefone?: string
  bio?: string
  matricula?: string
  curso?: {
    uuid: string
    nome: string
    sigla: string
  }
  turma?: {
    uuid: string
    codigo: string
    nome: string
  }
  departamento?: {
    uuid: string
    nome: string
  }
  links_portfolio?: string[]
  primeiroAcesso: boolean
  criadoEm: string
  atualizadoEm: string
}

/**
 * Completar cadastro de aluno
 * POST /perfil/completar/aluno
 */
export async function completarPerfilAluno(payload: CompletarPerfilAlunoPayload): Promise<PerfilResponse> {
  const response = await axiosInstance.post('/perfil/completar/aluno', payload, {
    headers: getAuthHeaders()
  })
  return response.data
}

/**
 * Completar cadastro de professor
 * POST /perfil/completar/professor
 */
export async function completarPerfilProfessor(payload: CompletarPerfilProfessorPayload): Promise<PerfilResponse> {
  const response = await axiosInstance.post('/perfil/completar/professor', payload, {
    headers: getAuthHeaders()
  })
  return response.data
}

/**
 * Atualizar perfil
 * PATCH /perfil
 */
export async function atualizarPerfil(payload: AtualizarPerfilPayload): Promise<PerfilResponse> {
  const response = await axiosInstance.patch('/perfil', payload, {
    headers: getAuthHeaders()
  })
  return response.data
}

/**
 * Buscar perfil do usuário autenticado
 * GET /perfil
 */
export async function buscarPerfil(): Promise<PerfilResponse> {
  const response = await axiosInstance.get('/perfil', {
    headers: getAuthHeaders()
  })
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
