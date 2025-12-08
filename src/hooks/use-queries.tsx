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
import {
  criarProjetoPasso1,
  criarProjetoPasso2,
  criarProjetoPasso3,
  criarProjetoPasso4,
  configurarRepositorioPasso5,
  resolverUsuarios,
  atualizarProjeto,
  Passo1Payload,
  Passo2Payload,
  Passo3Payload,
  Passo4Payload,
  Passo5Payload
} from '../api/projetos'
import { UseQueryOptions, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

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

export interface ProjetoFiltros {
  departamento_uuid?: string
  fase?: string
  tecnologia_uuid?: string
  busca?: string
  limit?: number
  offset?: number
}

export interface ProjetosPaginados {
  projetos: any[]
  total: number
  pagina: number
  limite: number
  totalPaginas: number
}

export function useProjetos(
  params?: ProjetoFiltros,
  options?: UseQueryOptions<ProjetosPaginados, Error>
) {
  return useQuery({
    queryKey: ['projetos', params],
    queryFn: () => getProjetos(params),
    retry: 1,
    staleTime: 30000, // 30 segundos - cache para evitar refetch excessivo
    ...options
  })
}

/**
 * Hook legado para projetos públicos - usa o mesmo endpoint de projetos
 * @deprecated Use useProjetos() ao invés
 */
export function useProjetosPublicos(options?: UseQueryOptions<ProjetosPaginados, Error>) {
  return useQuery({
    queryKey: ['projetos', 'publicos'],
    queryFn: () => getProjetos({ limit: 50 }),
    retry: 1,
    staleTime: 30000,
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

export function useTurmasByCurso(cursoUuid: string, options?: Partial<UseQueryOptions<any[], Error>>) {
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

// ============ MUTATIONS - CRIAR PROJETO ============

/**
 * Mutation para criar projeto (Passo 1 - Rascunho)
 * Cria o projeto com título e descrição, retorna UUID
 */
export function useCriarProjeto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dados: Passo1Payload) => criarProjetoPasso1(dados),
    onSuccess: () => {
      // Invalidar cache de projetos para aparecer na listagem
      queryClient.invalidateQueries({ queryKey: ['projetos'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (error: any) => {
      console.error('Erro ao criar projeto:', error)
    }
  })
}

/**
 * Mutation para atualizar projeto (rascunho ou publicado)
 * PATCH /projetos/:uuid
 */
export function useAtualizarProjeto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ uuid, dados }: { uuid: string; dados: { titulo?: string; descricao?: string } }) =>
      atualizarProjeto(uuid, dados),
    onSuccess: () => {
      // Invalidar cache de projetos
      queryClient.invalidateQueries({ queryKey: ['projetos'] })
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar projeto:', error)
    }
  })
}

/**
 * Mutation para salvar fases do projeto (Passo 4)
 */
export function useSalvarPasso4() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projetoUuid, dados }: { projetoUuid: string; dados: Passo4Payload }) =>
      criarProjetoPasso4(projetoUuid, dados),
    onSuccess: () => {
      // Invalidar cache de projetos
      queryClient.invalidateQueries({ queryKey: ['projetos'] })
    },
    onError: (error: any) => {
      console.error('Erro ao salvar fases do projeto:', error)
    }
  })
}

/**
 * Mutation para salvar informações acadêmicas (Passo 2)
 */
export function useSalvarPasso2() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ uuid, dados }: { uuid: string; dados: Passo2Payload }) =>
      criarProjetoPasso2(uuid, dados),
    onError: (error: any) => {
      console.error('Erro ao salvar passo 2:', error)
    }
  })
}

/**
 * Mutation para salvar equipe (Passo 3)
 */
export function useSalvarPasso3() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ uuid, dados }: { uuid: string; dados: Passo3Payload }) =>
      criarProjetoPasso3(uuid, dados),
    onError: (error: any) => {
      console.error('Erro ao salvar passo 3:', error)
    }
  })
}

/**
 * Mutation para configurar repositório e publicar (Passo 5)
 */
export function useConfigurarPasso5() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ uuid, dados }: { uuid: string; dados: Passo5Payload }) =>
      configurarRepositorioPasso5(uuid, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projetos'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (error: any) => {
      console.error('Erro ao salvar passo 5:', error)
    }
  })
}

/**
 * Mutation para resolver usuários por e-mail
 */
export function useResolverUsuarios() {
  return useMutation({
    mutationFn: (emails: string[]) => resolverUsuarios(emails),
    onError: (error: any) => {
      console.error('Erro ao resolver usuários:', error)
    }
  })
}
