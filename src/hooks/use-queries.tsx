/**
 * Hooks de Query - Sincronizado com a nova API
 */

import {
  getDashboard,
  getNotifications,
  getCalendarEvents,
  getUnidadesCurriculares,
  getProjetos,
  getAvaliacoes,
  getCursos,
  getTurmas,
  getTurmasByCurso,
  getEtapasProjeto
} from '../api/queries'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'

// ============ DASHBOARD ============

export function useDashboard(options?: UseQueryOptions<any, Error>) {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
    retry: 1,
    ...options
  })
}

// ============ NOTIFICAÇÕES ============

export function useNotifications(
  params?: { apenasNaoLidas?: boolean },
  options?: UseQueryOptions<any[], Error>
) {
  return useQuery({
    queryKey: ['notificacoes', params],
    queryFn: () => getNotifications(params),
    retry: false,
    staleTime: 30000, // 30 segundos
    ...options
  })
}

// ============ CALENDÁRIO ============

export function useCalendarEvents(options?: UseQueryOptions<any, Error>) {
  return useQuery({
    queryKey: ['calendarEvents'],
    queryFn: getCalendarEvents,
    retry: 1,
    ...options
  })
}

// ============ PROJETOS ============

export function useProjetos(
  params?: {
    departamento_uuid?: string
    fase?: string
    tecnologia_uuid?: string
    busca?: string
    limit?: number
    offset?: number
  },
  options?: UseQueryOptions<any[], Error>
) {
  return useQuery({
    queryKey: ['projetos', params],
    queryFn: () => getProjetos(params),
    retry: 1,
    ...options
  })
}

/**
 * Hook legado para projetos públicos - usa o mesmo endpoint de projetos
 * @deprecated Use useProjetos() ao invés
 */
export function useProjetosPublicos(options?: UseQueryOptions<any[], Error>) {
  return useQuery({
    queryKey: ['projetos', 'publicos'],
    queryFn: () => getProjetos(),
    retry: 1,
    ...options
  })
}

// ============ ETAPAS ============

export function useEtapasProjeto(
  projetoUuid: string,
  options?: UseQueryOptions<any[], Error>
) {
  return useQuery({
    queryKey: ['etapas', projetoUuid],
    queryFn: () => getEtapasProjeto(projetoUuid),
    enabled: !!projetoUuid,
    retry: 1,
    ...options
  })
}

// ============ CURSOS ============

export function useCursos(options?: UseQueryOptions<any[], Error>) {
  return useQuery({
    queryKey: ['cursos'],
    queryFn: () => getCursos(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    ...options
  })
}

// ============ TURMAS ============

export function useTurmas(options?: UseQueryOptions<any[], Error>) {
  return useQuery({
    queryKey: ['turmas'],
    queryFn: () => getTurmas(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    ...options
  })
}

export function useTurmasByCurso(cursoUuid: string, options?: UseQueryOptions<any[], Error>) {
  return useQuery({
    queryKey: ['turmas', 'curso', cursoUuid],
    queryFn: () => getTurmasByCurso(cursoUuid),
    enabled: !!cursoUuid,
    staleTime: 5 * 60 * 1000, // 5 minutos
    ...options
  })
}

// ============ UNIDADES CURRICULARES ============

export function useUnidadesCurriculares(options?: UseQueryOptions<any[], Error>) {
  return useQuery({
    queryKey: ['unidadesCurriculares'],
    queryFn: getUnidadesCurriculares,
    retry: 1,
    ...options
  })
}

// ============ AVALIAÇÕES ============

export function useAvaliacoes(options?: UseQueryOptions<any[], Error>) {
  return useQuery({
    queryKey: ['avaliacoes'],
    queryFn: getAvaliacoes,
    retry: 1,
    ...options
  })
}

// ============ ALUNOS ============

/**
 * Hook legado para listar alunos
 * @deprecated Não há endpoint de listagem de alunos na API atual
 * Retorna array vazio como fallback
 */
export function useAlunos(options?: UseQueryOptions<any[], Error>) {
  return useQuery({
    queryKey: ['alunos'],
    queryFn: async () => {
      // A API não tem endpoint para listar alunos
      // Retorna array vazio como fallback
      console.warn('useAlunos: Endpoint não disponível na API atual')
      return []
    },
    staleTime: Infinity,
    ...options
  })
}
