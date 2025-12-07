/**
 * Hook de Departamentos - React Query
 * Busca departamentos da API
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { getDepartamentos, Departamento } from '@/api/departamentos'

/**
 * Hook para buscar lista de departamentos
 * @param options - Opções do React Query
 */
export function useDepartamentos(options?: UseQueryOptions<Departamento[], Error>) {
  return useQuery({
    queryKey: ['departamentos'],
    queryFn: () => getDepartamentos(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    ...options
  })
}

export default useDepartamentos
