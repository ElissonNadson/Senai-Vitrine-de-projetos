import React, { useEffect, useState, useCallback } from 'react'
import { PageBanner } from '@/components/common/PageBanner'
import {
  Archive,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Power,
  PowerOff,
  Eye,
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { api } from '@/services/api'
import { useAuth } from '@/contexts/auth-context'
import { getBaseRoute } from '@/utils/routes'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { ArchiveDenyModal } from '@/components/modals/ArchiveDenyModal'

// ─── Interfaces ─────────────────────────────────────────────────

interface ProjetoDesativado {
  uuid: string
  titulo: string
  descricao: string
  status: string
  banner_url?: string
  categoria?: string
  criado_em: string
  atualizado_em: string
  criador_nome?: string
}

interface SolicitacaoArquivamento {
  uuid: string
  projeto_uuid: string
  projeto_titulo: string
  aluno_nome?: string
  aluno_email?: string
  orientador_nome?: string
  justificativa: string
  justificativa_negacao?: string
  status: 'PENDENTE' | 'APROVADO' | 'NEGADO'
  created_at: string
  respondido_em?: string
}

type TabType = 'desativados' | 'minhas'

// ─── Status Badge ───────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    PENDENTE: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', label: 'Pendente' },
    APROVADO: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Aprovado' },
    NEGADO: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Negado' },
    ARQUIVADO: { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-400', label: 'Arquivado' },
    EXCLUIDO: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Excluído' },
  }
  const c = config[status] || config.ARQUIVADO

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  )
}

// ─── Confirm Modal ──────────────────────────────────────────────

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  confirmColor,
  requireJustification,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: (justificativa: string) => void
  title: string
  message: string
  confirmLabel: string
  confirmColor: string
  requireJustification?: boolean
}) {
  const [justificativa, setJustificativa] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleConfirm = async () => {
    if (requireJustification && justificativa.length < 10) {
      toast.error('A justificativa deve ter pelo menos 10 caracteres')
      return
    }
    setLoading(true)
    await onConfirm(justificativa)
    setLoading(false)
    setJustificativa('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
        </div>
        {requireJustification && (
          <div className="px-6 pb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Justificativa</label>
            <textarea
              rows={3}
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Explique o motivo..."
            />
          </div>
        )}
        <div className="flex gap-3 p-6 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 px-4 py-2.5 text-white rounded-lg text-sm font-medium disabled:opacity-50 ${confirmColor}`}
            disabled={loading || (requireJustification && justificativa.length < 10)}
          >
            {loading ? 'Processando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Tab Button ─────────────────────────────────────────────────

function TabButton({
  active,
  label,
  count,
  icon: Icon,
  onClick,
}: {
  active: boolean
  label: string
  count?: number
  icon: React.ElementType
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${active
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
        }`}
    >
      <Icon className="w-4 h-4" />
      {label}
      {count !== undefined && count > 0 && (
        <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${active ? 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200' : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
          }`}>
          {count}
        </span>
      )}
    </button>
  )
}

// ─── Main Page ──────────────────────────────────────────────────

export default function ProjetosDesativadosPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const baseRoute = getBaseRoute(user?.tipo)
  const isDocente = user?.tipo?.toUpperCase() === 'DOCENTE'
  const isAdmin = user?.tipo?.toUpperCase() === 'ADMIN'
  const isAluno = user?.tipo?.toUpperCase() === 'ALUNO'

  const [activeTab, setActiveTab] = useState<TabType>('desativados')
  const [projetosDesativados, setProjetosDesativados] = useState<ProjetoDesativado[]>([])
  const [minhasSolicitacoes, setMinhasSolicitacoes] = useState<SolicitacaoArquivamento[]>([])
  const [loading, setLoading] = useState(true)

  // Modal states
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean
    title: string
    message: string
    confirmLabel: string
    confirmColor: string
    requireJustification: boolean
    onConfirm: (j: string) => void
  }>({ open: false, title: '', message: '', confirmLabel: '', confirmColor: '', requireJustification: false, onConfirm: () => { } })

  const [denyModalOpen, setDenyModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)

  // ─── Fetch Data ───────────────────────────────────────────────

  const fetchDesativados = useCallback(async () => {
    try {
      const resp = await api.get('/projetos-arquivados/desativados')
      setProjetosDesativados(resp.data.projetos || [])
    } catch (err) {
      console.error('Erro ao buscar projetos desativados:', err)
    }
  }, [])



  const fetchMinhas = useCallback(async () => {
    if (!isAluno) return
    try {
      const resp = await api.get('/projetos-arquivados/minhas')
      setMinhasSolicitacoes(resp.data.solicitacoes || [])
    } catch (err) {
      console.error('Erro ao buscar minhas solicitações:', err)
    }
  }, [isAluno])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    await Promise.all([fetchDesativados(), fetchMinhas()])
    setLoading(false)
  }, [fetchDesativados, fetchMinhas])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // Set initial tab based on role
  useEffect(() => {
    if (isAluno) setActiveTab('minhas')
    else setActiveTab('desativados')
  }, [isAluno])

  // ─── Actions ──────────────────────────────────────────────────



  const handleDesativar = (projeto: ProjetoDesativado) => {
    setConfirmModal({
      open: true,
      title: 'Desativar projeto',
      message: `Deseja desativar o projeto "${projeto.titulo}"? Ele não ficará mais visível na vitrine.`,
      confirmLabel: 'Desativar',
      confirmColor: 'bg-amber-600 hover:bg-amber-700',
      requireJustification: true,
      onConfirm: async (justificativa: string) => {
        try {
          await api.post(`/projetos-arquivados/desativar/${projeto.uuid}`, { justificativa })
          toast.success('Projeto desativado com sucesso')
          setConfirmModal(prev => ({ ...prev, open: false }))
          fetchAll()
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Erro ao desativar')
        }
      },
    })
  }

  const handleExcluir = (projeto: ProjetoDesativado) => {
    setConfirmModal({
      open: true,
      title: 'Excluir projeto',
      message: `ATENÇÃO: Deseja excluir permanentemente o projeto "${projeto.titulo}"? Esta ação não pode ser desfeita.`,
      confirmLabel: 'Excluir permanentemente',
      confirmColor: 'bg-red-600 hover:bg-red-700',
      requireJustification: true,
      onConfirm: async (justificativa: string) => {
        try {
          await api.post(`/projetos-arquivados/excluir/${projeto.uuid}`, { justificativa })
          toast.success('Projeto excluído permanentemente')
          setConfirmModal(prev => ({ ...prev, open: false }))
          fetchAll()
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Erro ao excluir')
        }
      },
    })
  }

  // ─── Tabs Configuration ───────────────────────────────────────

  const tabs: { key: TabType; label: string; icon: React.ElementType; count?: number; visible: boolean }[] = [
    { key: 'desativados', label: 'Projetos Desativados', icon: Archive, count: projetosDesativados.length, visible: true },
    { key: 'minhas', label: 'Minhas Solicitações', icon: FileText, count: minhasSolicitacoes.length, visible: isAluno },
  ]

  // ─── Render ───────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageBanner
        title="Projetos Desativados"
        subtitle={
          isDocente
            ? 'Gerencie solicitações de arquivamento e desative projetos'
            : isAluno
              ? 'Acompanhe suas solicitações de arquivamento'
              : 'Visualize todos os projetos arquivados e excluídos'
        }
        icon={<Archive />}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 -mt-8 relative z-20">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">

          {/* Tabs */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-wrap gap-2">
            {tabs.filter(t => t.visible).map((tab) => (
              <TabButton
                key={tab.key}
                active={activeTab === tab.key}
                label={tab.label}
                count={tab.count}
                icon={tab.icon}
                onClick={() => setActiveTab(tab.key)}
              />
            ))}
          </div>

          {/* Content */}
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <LoadingState />
            ) : activeTab === 'desativados' ? (
              <DesativadosTab
                projetos={projetosDesativados}
                isDocente={isDocente}
                isAdmin={isAdmin}
                baseRoute={baseRoute}
                navigate={navigate}
                onExcluir={handleExcluir}
              />
            ) : (
              <MinhasSolicitacoesTab solicitacoes={minhasSolicitacoes} />
            )}
          </div>
        </div>
      </div>

      {/* Modais */}
      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal(prev => ({ ...prev, open: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        confirmColor={confirmModal.confirmColor}
        requireJustification={confirmModal.requireJustification}
      />

      <ArchiveDenyModal
        isOpen={denyModalOpen}
        onClose={() => { setDenyModalOpen(false); setSelectedRequest(null) }}
        request={selectedRequest}
        onSuccess={() => { fetchAll(); setDenyModalOpen(false); setSelectedRequest(null) }}
      />
    </div>
  )
}

// ─── Sub-components ─────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="p-12 text-center">
      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
      <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
    </div>
  )
}

function EmptyState({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div className="p-12 text-center">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
    </div>
  )
}

// ─── Tab: Projetos Desativados ──────────────────────────────────

function DesativadosTab({
  projetos,
  isDocente,
  isAdmin,
  baseRoute,
  navigate,
  onExcluir,
}: {
  projetos: ProjetoDesativado[]
  isDocente: boolean
  isAdmin: boolean
  baseRoute: string
  navigate: (path: string) => void
  onExcluir: (p: ProjetoDesativado) => void
}) {
  if (projetos.length === 0) {
    return <EmptyState icon={CheckCircle} title="Nenhum projeto desativado" subtitle="Todos os seus projetos estão ativos." />
  }

  return (
    <>
      {projetos.map((projeto) => (
        <div key={projeto.uuid} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge status={projeto.status} />
                {projeto.categoria && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                    {projeto.categoria}
                  </span>
                )}
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(projeto.atualizado_em || projeto.criado_em).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">{projeto.titulo}</h3>
              {projeto.descricao && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{projeto.descricao}</p>
              )}
              {projeto.criador_nome && (
                <p className="text-xs text-gray-400 mt-2">Criado por: {projeto.criador_nome}</p>
              )}
            </div>

            <div className="flex flex-col gap-2 flex-shrink-0">
              <button
                onClick={() => navigate(`${baseRoute}/projetos/${projeto.uuid}/visualizar`)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Ver
              </button>
              {(isDocente || isAdmin) && projeto.status !== 'EXCLUIDO' && (
                <button
                  onClick={() => onExcluir(projeto)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Excluir
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  )
}



// ─── Tab: Minhas Solicitações (Aluno) ───────────────────────────

function MinhasSolicitacoesTab({ solicitacoes }: { solicitacoes: SolicitacaoArquivamento[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (solicitacoes.length === 0) {
    return <EmptyState icon={FileText} title="Nenhuma solicitação" subtitle="Você ainda não fez nenhuma solicitação de arquivamento." />
  }

  return (
    <>
      {solicitacoes.map((sol) => (
        <div key={sol.uuid} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
          <div
            className="flex items-start justify-between gap-4 cursor-pointer"
            onClick={() => setExpandedId(expandedId === sol.uuid ? null : sol.uuid)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge status={sol.status} />
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(sol.created_at).toLocaleDateString('pt-BR')}
                </span>
                {sol.respondido_em && (
                  <span className="text-xs text-gray-400">
                    → Respondido em {new Date(sol.respondido_em).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">{sol.projeto_titulo}</h3>
              {sol.orientador_nome && (
                <p className="text-xs text-gray-500 mt-1">Orientador: {sol.orientador_nome}</p>
              )}
            </div>
            <div className="flex-shrink-0 text-gray-400">
              {expandedId === sol.uuid ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>

          {/* Expandido */}
          {expandedId === sol.uuid && (
            <div className="mt-3 space-y-3">
              <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Sua justificativa:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{sol.justificativa}"</p>
              </div>
              {sol.status === 'NEGADO' && sol.justificativa_negacao && (
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800">
                  <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">Motivo da negação:</p>
                  <p className="text-sm text-red-600 dark:text-red-300 italic">"{sol.justificativa_negacao}"</p>
                </div>
              )}
              {sol.status === 'APROVADO' && (
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Solicitação aprovada. O projeto foi arquivado.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </>
  )
}
