import React, { useEffect, useState } from 'react'
import { PageBanner } from '@/components/common/PageBanner'
import { Archive, CheckCircle, XCircle, Clock, Search, Filter } from 'lucide-react'
import { api } from '@/services/api'
import { ArchiveDenyModal } from '@/components/modals/ArchiveDenyModal'

interface ArchiveRequest {
    id: string
    projeto_id: string
    aluno_id: string
    orientador_id: string
    justificativa_aluno: string
    justificativa_orientador?: string
    status: 'PENDENTE' | 'APROVADO' | 'NEGADO'
    criado_em: string
    projeto: {
        titulo: string
        descricao: string
        banner_url?: string
    }
    aluno: {
        nome: string
        email: string
    }
}

export default function ArchiveReviewPage() {
    const [requests, setRequests] = useState<ArchiveRequest[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState<'PENDENTE' | 'TODOS'>('PENDENTE')
    const [selectedRequest, setSelectedRequest] = useState<ArchiveRequest | null>(null)
    const [denyModalOpen, setDenyModalOpen] = useState(false)

    const fetchRequests = async () => {
        try {
            setIsLoading(true)
            const response = await api.get('/projetos-arquivados/pendentes') // Ou rota geral se houver filtro no back
            // Assumindo que a rota retorna lista. Se for rota especifica de orientador, ajustar.
            setRequests(response.data)
        } catch (error) {
            console.error('Erro ao buscar solicitações:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchRequests()
    }, [])

    const handleApprove = async (request: ArchiveRequest) => {
        if (!confirm(`Confirmar arquivamento do projeto "${request.projeto.titulo}"?`)) return

        try {
            await api.post('/projetos-arquivados/aprovar', { projetoId: request.projeto_id })
            fetchRequests()
        } catch (error) {
            console.error('Erro ao aprovar:', error)
            alert('Erro ao aprovar solicitação')
        }
    }

    const handleDeny = (request: ArchiveRequest) => {
        setSelectedRequest(request)
        setDenyModalOpen(true)
    }

    const filteredRequests = requests.filter(req =>
        filterStatus === 'TODOS' ? true : req.status === filterStatus
    )

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <PageBanner
                title="Solicitações de Arquivamento"
                subtitle="Gerencie os pedidos de desativação de projetos"
                icon={<Archive />}
            />

            <div className="max-w-7xl mx-auto px-6 py-8 -mt-8 relative z-20">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">

                    {/* Header filtros */}
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex gap-4">
                        <button
                            onClick={() => setFilterStatus('PENDENTE')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'PENDENTE'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                                }`}
                        >
                            Pendentes
                        </button>
                        <button
                            onClick={() => setFilterStatus('TODOS')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'TODOS'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                                }`}
                        >
                            Histórico Completo
                        </button>
                    </div>

                    {/* Lista */}
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {isLoading ? (
                            <div className="p-8 text-center text-gray-500">Carregando solicitações...</div>
                        ) : filteredRequests.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tudo em dia!</h3>
                                <p className="text-gray-500">Nenhuma solicitação pendente no momento.</p>
                            </div>
                        ) : (
                            filteredRequests.map((req) => (
                                <div key={req.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${req.status === 'PENDENTE' ? 'bg-amber-100 text-amber-700' :
                                                    req.status === 'APROVADO' ? 'bg-green-100 text-green-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {req.status}
                                                </span>
                                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(req.criado_em).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                                {req.projeto.titulo}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                Solicitado por: <span className="font-medium">{req.aluno.nome}</span> ({req.aluno.email})
                                            </p>

                                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Justificativa do Aluno:</p>
                                                <p className="text-gray-600 dark:text-gray-400 italic">"{req.justificativa_aluno}"</p>
                                            </div>
                                        </div>

                                        {req.status === 'PENDENTE' && (
                                            <div className="flex flex-col gap-2 min-w-[140px]">
                                                <button
                                                    onClick={() => handleApprove(req)}
                                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm shadow-sm"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Aprovar
                                                </button>
                                                <button
                                                    onClick={() => handleDeny(req)}
                                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Negar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <ArchiveDenyModal
                isOpen={denyModalOpen}
                onClose={() => {
                    setDenyModalOpen(false)
                    setSelectedRequest(null)
                }}
                request={selectedRequest}
                onSuccess={fetchRequests}
            />
        </div>
    )
}
