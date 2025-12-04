import { useState, useCallback, useEffect } from 'react'
import { buscarMeusProjetos, deletarProjeto, MeuProjeto } from '@/api/projetos'

interface UseMeusProjetosReturn {
  publicados: MeuProjeto[]
  rascunhos: MeuProjeto[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  deleteProjeto: (uuid: string) => Promise<void>
  isDeleting: boolean
}

export function useMeusProjetos(): UseMeusProjetosReturn {
  const [publicados, setPublicados] = useState<MeuProjeto[]>([])
  const [rascunhos, setRascunhos] = useState<MeuProjeto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await buscarMeusProjetos()
      setPublicados(response.publicados || [])
      setRascunhos(response.rascunhos || [])
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao buscar seus projetos'
      setError(errorMsg)
      console.error('Erro ao buscar meus projetos:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteProjeto = useCallback(async (uuid: string) => {
    setIsDeleting(true)
    try {
      await deletarProjeto(uuid)
      // Remove o projeto das listas locais
      setPublicados(prev => prev.filter(p => p.uuid !== uuid))
      setRascunhos(prev => prev.filter(p => p.uuid !== uuid))
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao excluir projeto'
      console.error('Erro ao excluir projeto:', err)
      throw new Error(errorMsg)
    } finally {
      setIsDeleting(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return {
    publicados,
    rascunhos,
    loading,
    error,
    refetch,
    deleteProjeto,
    isDeleting
  }
}
