import React, { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { api } from '@/services/api'
import { toast } from 'react-hot-toast'

interface ArchiveRequestModalProps {
  isOpen: boolean
  onClose: () => void
  project: {
    id: string
    titulo: string
  } | null
  onSuccess: () => void
}

export function ArchiveRequestModal({ isOpen, onClose, project, onSuccess }: ArchiveRequestModalProps) {
  const [justificativa, setJustificativa] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen || !project) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (justificativa.length < 20) {
      toast.error('A justificativa deve ter pelo menos 20 caracteres')
      return
    }

    try {
      setLoading(true)
      await api.post('/projetos-arquivados/solicitar', {
        projeto_uuid: project.id,
        justificativa
      })

      toast.success('Solicitação de arquivamento enviada com sucesso!')
      onSuccess()
      onClose()
      setJustificativa('')
    } catch (error: any) {
      console.error('Erro ao solicitar arquivamento:', error)
      toast.error(error.response?.data?.message || 'Erro ao solicitar arquivamento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Arquivar Projeto
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Solicitando arquivamento para: <strong>{project.titulo}</strong>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            O projeto ficará pendente de aprovação pelo orientador. Se aprovado, ele não aparecerá mais na vitrine pública.
          </p>

          <div className="mb-4">
            <label htmlFor="justificativa" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Justificativa <span className="text-red-500">*</span>
            </label>
            <textarea
              id="justificativa"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm resize-none"
              placeholder="Explique por que deseja arquivar este projeto..."
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              required
            />
            <p className="mt-1 text-xs text-gray-500 text-right">
              {justificativa.length}/20 caracteres mínimos
            </p>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={loading || justificativa.length < 20}
            >
              {loading ? 'Enviando...' : 'Solicitar Arquivamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
