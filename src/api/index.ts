/**
 * API Index - Exporta todas as funções de API
 * Sincronizado com API_DOCUMENTATION.md
 */

// Configurações
export * from './config'

// Queries gerais (exceto verificarProgressao que está em progressao.ts)
export {
  getMe,
  refreshToken,
  logout,
  getDashboard,
  getCursos,
  getCursoByUuid,
  getCursoBySigla,
  getTurmas,
  getTurmaByUuid,
  getTurmaByCodigo,
  getTurmasByCurso,
  getProjetos,
  getProjetoByUuid,
  getEtapasProjeto,
  getEtapaByUuid,
  getNotifications,
  getNotificacoesNaoLidas,
  getPerfil,
  getHistoricoProgressao,
  getTiposUpload,
  getCalendarEvents,
  getCommunityData,
  getUnidadesCurriculares,
  getAvaliacoes
} from './queries'

// Projetos
export * from './projetos'

// Etapas
export * from './etapas'

// Upload
export * from './upload'

// Progressão
export * from './progressao'

// Notificações
export * from './notificacoes'

// Perfil
export * from './perfil'

// Auth
export * from './auth'
