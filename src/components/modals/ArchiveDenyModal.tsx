import React, { useState } from 'react'
import { AlertCircle, X } from 'lucide-react'
import { api } from '@/services/api'
import { toast } from 'react-hot-toast'

interface ArchiveDenyModalProps {
    isOpen: boolean
    onClose: () => void
    request: any
    onSuccess: () => void
}

export const ArchiveDenyModal: React.FC<ArchiveDenyModalProps> = ({
    isOpen,
    onClose,
    request,
    onSuccess
}) => {
    const [justification, setJustification] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    if (!isOpen || !request) return null

    const handleSubmit = async () => {
        if (!justification.trim() || justification.length < 20) {
            toast.error('A justificativa deve ter pelo menos 20 caracteres')
            return
        }

        try {
            setIsLoading(true)
            await api.post('/projetos-arquivados/negar', {
                solicitacao_uuid: request.uuid,
                justificativa_negacao: justification,
            })

            toast.success('Solicitação negada com sucesso')
            onSuccess()
            onClose()
            setJustification('')
        } catch (error: any) {
            console.error('Erro ao negar solicitação:', error)
            toast.error(error.response?.data?.message || 'Erro ao negar solicitação')
        } finally {
            setIsLoading(false)
        }
    }

    const projectTitle = request?.projeto?.titulo || request?.projeto_titulo || 'Projeto'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Negar Arquivamento</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        Negando o arquivamento do projeto <strong>{projectTitle}</strong>
                    </p>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Motivo da Negação <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={justification}
                            onChange={(e) => setJustification(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            rows={4}
                            placeholder="Explique por que o arquivamento está sendo negado (mín. 20 caracteres)..."
                        />
                        <p className="mt-1 text-xs text-gray-500 text-right">{justification.length}/20 mínimo</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={justification.length < 20 || isLoading}
                            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Enviando...' : 'Confirmar Negação'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
