import { useState, useCallback } from 'react'
import { 
  createEtapaProjeto, 
  updateEtapaProjeto, 
  deleteEtapaProjeto 
} from '../api/mutations'
import { 
  getEtapasProjetoByProjeto,
  getEtapaProjetoByUUID 
} from '../api/queries'
import type { CreateEtapaProjetoMutation } from '../types/types-mutations'
import type { EtapaProjeto } from '../types/types-queries'

interface UseEtapasProjetoReturn {
  etapas: EtapaProjeto[]
  loading: boolean
  error: string | null
  fetchEtapasByProjeto: (projetoUuid: string) => Promise<void>
  createEtapa: (etapa: CreateEtapaProjetoMutation) => Promise<EtapaProjeto>
  updateEtapa: (uuid: string, etapa: CreateEtapaProjetoMutation) => Promise<EtapaProjeto>
  deleteEtapa: (uuid: string) => Promise<void>
  updateEtapaStatus: (uuid: string, status: string) => Promise<void>
  clearEtapas: () => void
}

export function useEtapasProjeto(): UseEtapasProjetoReturn {
  const [etapas, setEtapas] = useState<EtapaProjeto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEtapasByProjeto = useCallback(async (projetoUuid: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await getEtapasProjetoByProjeto(projetoUuid)
      setEtapas(response)
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao buscar etapas do projeto'
      setError(errorMsg)
      console.error('Erro ao buscar etapas:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createEtapa = useCallback(async (etapa: CreateEtapaProjetoMutation) => {
    setLoading(true)
    setError(null)
    try {
      const response = await createEtapaProjeto(etapa)
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

  const updateEtapa = useCallback(async (uuid: string, etapa: CreateEtapaProjetoMutation) => {
    setLoading(true)
    setError(null)
    try {
      const response = await updateEtapaProjeto(uuid, etapa)
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
      await deleteEtapaProjeto(uuid)
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

  const updateEtapaStatus = useCallback(async (uuid: string, status: string) => {
    setLoading(true)
    setError(null)
    try {
      // Busca a etapa atual para manter os dados
      const etapaAtual = await getEtapaProjetoByUUID(uuid)
      
      // Atualiza apenas o status
      const etapaAtualizada: CreateEtapaProjetoMutation = {
        projeto: etapaAtual.projeto,
        nomeEtapa: etapaAtual.nomeEtapa,
        descricao: etapaAtual.descricao,
        ordem: etapaAtual.ordem,
        status: status,
        criadoEm: etapaAtual.criadoEm,
        atualizadoEm: new Date().toISOString()
      }
      
      const response = await updateEtapaProjeto(uuid, etapaAtualizada)
      setEtapas(prev => prev.map(e => e.uuid === uuid ? response : e))
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao atualizar status da etapa'
      setError(errorMsg)
      console.error('Erro ao atualizar status:', err)
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
    updateEtapaStatus,
    clearEtapas
  }
}
