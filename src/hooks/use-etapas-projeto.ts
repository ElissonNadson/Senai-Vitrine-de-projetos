import { useState, useCallback } from 'react'
import { 
  criarEtapa,
  atualizarEtapa,
  deletarEtapa as deletarEtapaApi,
  listarEtapasProjeto,
  buscarEtapa
} from '../api/etapas'
import type { CriarEtapaPayload, Etapa } from '../api/etapas'

interface UseEtapasProjetoReturn {
  etapas: Etapa[]
  loading: boolean
  error: string | null
  fetchEtapasByProjeto: (projetoUuid: string) => Promise<void>
  createEtapa: (projetoUuid: string, etapa: CriarEtapaPayload) => Promise<Etapa>
  updateEtapa: (uuid: string, etapa: { titulo?: string; descricao?: string }) => Promise<Etapa>
  deleteEtapa: (uuid: string) => Promise<void>
  clearEtapas: () => void
}

export function useEtapasProjeto(): UseEtapasProjetoReturn {
  const [etapas, setEtapas] = useState<Etapa[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEtapasByProjeto = useCallback(async (projetoUuid: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await listarEtapasProjeto(projetoUuid)
      setEtapas(response)
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao buscar etapas do projeto'
      setError(errorMsg)
      console.error('Erro ao buscar etapas:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createEtapa = useCallback(async (projetoUuid: string, etapa: CriarEtapaPayload) => {
    setLoading(true)
    setError(null)
    try {
      const response = await criarEtapa(projetoUuid, etapa)
      setEtapas(prev => [...prev, response])
      return response
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao criar etapa'
      setError(errorMsg)
      console.error('Erro ao criar etapa:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateEtapa = useCallback(async (uuid: string, etapa: { titulo?: string; descricao?: string }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await atualizarEtapa(uuid, etapa)
      setEtapas(prev => prev.map(e => e.uuid === uuid ? response : e))
      return response
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao atualizar etapa'
      setError(errorMsg)
      console.error('Erro ao atualizar etapa:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteEtapa = useCallback(async (uuid: string) => {
    setLoading(true)
    setError(null)
    try {
      await deletarEtapaApi(uuid)
      setEtapas(prev => prev.filter(e => e.uuid !== uuid))
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao deletar etapa'
      setError(errorMsg)
      console.error('Erro ao deletar etapa:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const clearEtapas = useCallback(() => {
    setEtapas([])
    setError(null)
  }, [])

  return {
    etapas,
    loading,
    error,
    fetchEtapasByProjeto,
    createEtapa,
    updateEtapa,
    deleteEtapa,
    clearEtapas
  }
}
