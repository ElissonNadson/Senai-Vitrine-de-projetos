// Configurações centralizadas da API - Sincronizado com API_DOCUMENTATION.md

export const API_CONFIG = {
  // URL base da API (usa /api que o nginx redireciona para a API real)
  BASE_URL: import.meta.env.VITE_API_URL || '/api',
  
  // Endpoints de autenticação
  AUTH: {
    GOOGLE_OAUTH: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/callback',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout'
  },
  
  // Endpoints de perfil
  PERFIL: {
    GET: '/perfil',
    UPDATE: '/perfil',
    COMPLETAR_ALUNO: '/perfil/completar/aluno',
    COMPLETAR_PROFESSOR: '/perfil/completar/professor'
  },
  
  // Endpoints de cursos e turmas
  CURSOS: {
    LIST: '/cursos',
    GET: (uuid: string) => `/cursos/${uuid}`,
    GET_BY_SIGLA: (sigla: string) => `/cursos/sigla/${sigla}`
  },
  
  TURMAS: {
    LIST: '/turmas',
    GET: (uuid: string) => `/turmas/${uuid}`,
    GET_BY_CODIGO: (codigo: string) => `/turmas/codigo/${codigo}`
  },
  
  // Endpoints de dashboard
  DASHBOARD: {
    GET: '/dashboard'
  },
  
  // Endpoints de projetos (criação em 4 passos)
  PROJETOS: {
    LIST: '/projetos',
    MEUS: '/projetos/meus',
    GET: (uuid: string) => `/projetos/${uuid}`,
    CREATE_PASSO1: '/projetos/passo1',
    CREATE_PASSO2: (uuid: string) => `/projetos/${uuid}/passo2`,
    CREATE_PASSO3: (uuid: string) => `/projetos/${uuid}/passo3`,
    CREATE_PASSO4: (uuid: string) => `/projetos/${uuid}/passo4`,
    UPDATE: (uuid: string) => `/projetos/${uuid}`,
    DELETE: (uuid: string) => `/projetos/${uuid}`
  },
  
  // Endpoints de etapas
  ETAPAS: {
    CREATE: (projetoUuid: string) => `/etapas/projeto/${projetoUuid}`,
    LIST_BY_PROJETO: (projetoUuid: string) => `/etapas/projeto/${projetoUuid}`,
    GET: (uuid: string) => `/etapas/${uuid}`,
    UPDATE: (uuid: string) => `/etapas/${uuid}`,
    DELETE: (uuid: string) => `/etapas/${uuid}`,
    ADD_ANEXOS: (uuid: string) => `/etapas/${uuid}/anexos`,
    CONCLUIR: (uuid: string) => `/etapas/${uuid}/concluir`,
    FEEDBACK: (uuid: string) => `/etapas/${uuid}/feedback`,
    DELETE_ANEXO: (anexoUuid: string) => `/etapas/anexo/${anexoUuid}`
  },
  
  // Endpoints de upload
  UPLOAD: {
    BANNER: '/upload/banner',
    AVATAR: '/upload/avatar',
    ANEXO: '/upload/anexo',
    TIPOS: '/upload/tipos'
  },
  
  // Endpoints de progressão
  PROGRESSAO: {
    VERIFICAR: (projetoUuid: string) => `/progressao/verificar/${projetoUuid}`,
    AUTOMATICA: (projetoUuid: string) => `/progressao/automatica/${projetoUuid}`,
    FORCAR: (projetoUuid: string) => `/progressao/forcar/${projetoUuid}`,
    HISTORICO: (projetoUuid: string) => `/progressao/historico/${projetoUuid}`,
    TRANSFERIR_LIDERANCA: (projetoUuid: string) => `/progressao/transferir-lideranca/${projetoUuid}`
  },
  
  // Endpoints de notificações
  NOTIFICACOES: {
    LIST: '/notificacoes',
    CONTAR_NAO_LIDAS: '/notificacoes/nao-lidas/contar',
    MARCAR_LIDA: (uuid: string) => `/notificacoes/${uuid}/marcar-lida`,
    MARCAR_TODAS_LIDAS: '/notificacoes/marcar-todas-lidas',
    DELETE: (uuid: string) => `/notificacoes/${uuid}`
  },
  
  // Headers padrão
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // Timeouts
  TIMEOUT: 30000, // 30 segundos
  
  // URLs públicas (não requerem autenticação)
  PUBLIC_ENDPOINTS: [
    '/projetos',
    '/cursos',
    '/turmas',
    '/auth/google'
  ]
}

// Tipos de etapa
export const TIPOS_ETAPA = {
  IDEACAO: 'IDEACAO',
  MODELAGEM: 'MODELAGEM',
  PROTOTIPAGEM: 'PROTOTIPAGEM',
  IMPLEMENTACAO: 'IMPLEMENTACAO',
  PLANEJAMENTO: 'PLANEJAMENTO',
  DESENVOLVIMENTO: 'DESENVOLVIMENTO',
  TESTE: 'TESTE',
  DOCUMENTACAO: 'DOCUMENTACAO',
  APRESENTACAO: 'APRESENTACAO'
} as const

// Fases do projeto
export const FASES_PROJETO = {
  RASCUNHO: 'RASCUNHO',
  PLANEJAMENTO: 'PLANEJAMENTO',
  EM_DESENVOLVIMENTO: 'EM_DESENVOLVIMENTO',
  EM_TESTE: 'EM_TESTE',
  AGUARDANDO_REVISAO: 'AGUARDANDO_REVISAO',
  CONCLUIDO: 'CONCLUIDO',
  ARQUIVADO: 'ARQUIVADO'
} as const

// Status de feedback
export const STATUS_FEEDBACK = {
  APROVADO: 'APROVADO',
  REVISAR: 'REVISAR',
  REJEITADO: 'REJEITADO'
} as const

// Tipos de anexo
export const TIPOS_ANEXO = {
  DOCUMENTO: 'DOCUMENTO',
  IMAGEM: 'IMAGEM',
  VIDEO: 'VIDEO'
} as const

// Papéis de autor
export const PAPEIS_AUTOR = {
  LIDER: 'LIDER',
  AUTOR: 'AUTOR'
} as const

// Tipos de usuário
export const TIPOS_USUARIO = {
  ALUNO: 'ALUNO',
  PROFESSOR: 'PROFESSOR'
} as const

// Função para verificar se um endpoint é público
export const isPublicEndpoint = (url: string): boolean => {
  return API_CONFIG.PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint))
}

// Função para construir URL completa
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

export type TipoEtapa = typeof TIPOS_ETAPA[keyof typeof TIPOS_ETAPA]
export type FaseProjeto = typeof FASES_PROJETO[keyof typeof FASES_PROJETO]
export type StatusFeedback = typeof STATUS_FEEDBACK[keyof typeof STATUS_FEEDBACK]
export type TipoAnexo = typeof TIPOS_ANEXO[keyof typeof TIPOS_ANEXO]
export type PapelAutor = typeof PAPEIS_AUTOR[keyof typeof PAPEIS_AUTOR]
export type TipoUsuario = typeof TIPOS_USUARIO[keyof typeof TIPOS_USUARIO]
