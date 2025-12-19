import React, { useState } from 'react'
import { Modal } from 'antd'
import { AlertCircle, X } from 'lucide-react'
import { api } from '@/services/api'

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

    const handleSubmit = async () => {
        if (!request) return

        try {
            setIsLoading(true)
            await api.post(`/projetos-arquivados/negar`, {
                projetoId: request.projeto_id,
                justificativa: justification
            })

            onSuccess()
            onClose()
            setJustification('')
        } catch (error) {
            console.error('Erro ao negar solicitação:', error)
            // Opcional: mostrar erro toast
        } finally {
            setIsLoading(false)
        }
    }

    if (!request) return null

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            closeIcon={<X className="w-5 h-5 text-gray-500" />}
            centered
            className="rounded-2xl overflow-hidden"
        >
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Negar Arquivamento</h2>
                <p className="text-gray-500 mt-2">
                    Você está negando o arquivamento do projeto <br />
                    <span className="font-semibold text-gray-900">{request.projeto?.titulo}</span>
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Motivo da Negação <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={justification}
                        onChange={(e) => setJustification(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all min-h-[120px] resize-none"
                        placeholder="Explique por que o arquivamento está sendo negado..."
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!justification.trim() || isLoading}
                        className="flex-1 py-3 px-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-200"
                    >
                        {isLoading ? 'Enviando...' : 'Confirmar Negação'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}
