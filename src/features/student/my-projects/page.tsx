import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Plus, Filter, Lightbulb, FileText, Wrench, Rocket, Trash2,
  Eye, AlertTriangle, FolderOpen, Archive, Clock, CheckCircle,
  XCircle, ChevronDown, ChevronUp, BookOpen, RotateCcw
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { getBaseRoute } from '@/utils/routes'
import UnifiedProjectCard from '@/components/cards/UnifiedProjectCard'
import { PageBanner } from '@/components/common/PageBanner'
import { ArchiveRequestModal } from '@/components/modals/ArchiveRequestModal'
import { ArchiveDenyModal } from '@/components/modals/ArchiveDenyModal'
import { api } from '@/services/api'
import { toast } from 'react-hot-toast'

import { useMeusProjetos } from '@/hooks/use-meus-projetos'

// ─── Interfaces para aba desativados ────────────────────────────

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
  tipo?: 'EXCLUSAO' | 'REATIVACAO'
  created_at: string
  respondido_em?: string
}

// ─── Status Badge ───────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    PENDENTE: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', label: 'Pendente' },
    APROVADO: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Aprovado' },
    NEGADO: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Negado' },
    ARQUIVADO: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Excluído' },
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

function ConfirmActionModal({
  isOpen, onClose, onConfirm, title, message, confirmLabel, confirmColor, requireJustification,
}: {
  isOpen: boolean; onClose: () => void; onConfirm: (j: string) => void
  title: string; message: string; confirmLabel: string; confirmColor: string; requireJustification?: boolean
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
          <button onClick={onClose} className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium" disabled={loading}>
            Cancelar
          </button>
          <button onClick={handleConfirm} className={`flex-1 px-4 py-2.5 text-white rounded-lg text-sm font-medium disabled:opacity-50 ${confirmColor}`} disabled={loading || (requireJustification && justificativa.length < 10)}>
            {loading ? 'Processando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper para transformar projeto para o formato unificado
const transformarProjeto = (projeto: any, isRascunho: boolean = false) => {
  if (!projeto) return null

  return {
    ...projeto,
    id: projeto.uuid || projeto.id,
    titulo: projeto.titulo || 'Sem título',
    descricao: projeto.descricao || 'Sem descrição',
    bannerUrl: projeto.banner_url || projeto.bannerUrl,
    faseAtual: projeto.fase_atual ? (
      ['IDEACAO', 'MODELAGEM', 'PROTOTIPAGEM', 'IMPLEMENTACAO'].indexOf(projeto.fase_atual) + 1
    ) : 1,
    status: isRascunho ? 'Rascunho' : (projeto.status || 'Publicado'),
    autorNome: projeto.autores?.[0]?.nome || 'Você',
    criadoEm: projeto.criado_em || new Date().toISOString(),
    publicadoEm: projeto.data_publicacao || projeto.publicado_em || projeto.criado_em,
    visualizacoes: projeto.visualizacoes || 0,
    itinerario: projeto.itinerario,
    participouSaga: projeto.saga_senai || projeto.participou_saga,
    labMaker: projeto.senai_lab || projeto.lab_maker,
    curso: typeof projeto.curso === 'object' ? projeto.curso?.nome : projeto.curso,
    departamento_nome: projeto.departamento?.nome || projeto.departamento_nome,
  }
}

type TabType = 'publicados' | 'rascunhos' | 'desativados' | 'pendentes'

function MyProjects() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const baseRoute = useMemo(() => getBaseRoute(user?.tipo), [user?.tipo])
  const isDocente = user?.tipo?.toUpperCase() === 'DOCENTE' || user?.tipo?.toUpperCase() === 'PROFESSOR'
  const isAdmin = user?.tipo?.toUpperCase() === 'ADMIN'
  const isAluno = user?.tipo?.toUpperCase() === 'ALUNO'

  const [selectedFase, setSelectedFase] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const state = location.state as { activeTab?: string } | null
    if (state?.activeTab === 'rascunhos') return 'rascunhos'
    if (state?.activeTab === 'desativados') return 'desativados'
    if (state?.activeTab === 'pendentes') return 'pendentes'
    return 'publicados'
  })
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<any>(null)
  const [archiveModalOpen, setArchiveModalOpen] = useState(false)
  const [projectToArchive, setProjectToArchive] = useState<any>(null)
  const [deleteJustification, setDeleteJustification] = useState('')

  // Meus projetos (publicados + rascunhos)
  const { publicados, rascunhos, loading: isLoading, error, deleteProjeto, isDeleting, refetch } = useMeusProjetos()

  // Desativados & Solicitações
  const [projetosDesativados, setProjetosDesativados] = useState<ProjetoDesativado[]>([])
  const [solicitacoesPendentes, setSolicitacoesPendentes] = useState<SolicitacaoArquivamento[]>([])
  const [minhasSolicitacoes, setMinhasSolicitacoes] = useState<SolicitacaoArquivamento[]>([])
  const [loadingDesativados, setLoadingDesativados] = useState(false)

  // Modal states para aba desativados
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean; title: string; message: string; confirmLabel: string; confirmColor: string
    requireJustification: boolean; onConfirm: (j: string) => void
  }>({ open: false, title: '', message: '', confirmLabel: '', confirmColor: '', requireJustification: false, onConfirm: () => {} })
  const [denyModalOpen, setDenyModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)

  // ─── Fetch dados de desativados ───────────────────────────────

  const fetchDesativados = useCallback(async () => {
    try {
      const resp = await api.get('/projetos-arquivados/desativados')
      setProjetosDesativados(resp.data.projetos || [])
    } catch (err) {
      console.error('Erro ao buscar projetos desativados:', err)
    }
  }, [])

  const fetchPendentes = useCallback(async () => {
    if (!isDocente && !isAdmin) return
    try {
      const resp = await api.get('/projetos-arquivados/pendentes')
      setSolicitacoesPendentes(resp.data.solicitacoes || [])
    } catch (err) {
      console.error('Erro ao buscar pendentes:', err)
    }
  }, [isDocente, isAdmin])

  const fetchMinhas = useCallback(async () => {
    if (!isAluno) return
    try {
      const resp = await api.get('/projetos-arquivados/minhas')
      setMinhasSolicitacoes(resp.data.solicitacoes || [])
    } catch (err) {
      console.error('Erro ao buscar minhas solicitações:', err)
    }
  }, [isAluno])

  const fetchAllDesativados = useCallback(async () => {
    setLoadingDesativados(true)
    await Promise.all([fetchDesativados(), fetchPendentes(), fetchMinhas()])
    setLoadingDesativados(false)
  }, [fetchDesativados, fetchPendentes, fetchMinhas])

  // Carregar desativados quando a tab é selecionada
  useEffect(() => {
    if (activeTab === 'desativados' || activeTab === 'pendentes') {
      fetchAllDesativados()
    }
  }, [activeTab, fetchAllDesativados])

  // Selecionar projetos baseado na tab ativa
  const currentProjects = activeTab === 'publicados' ? publicados : rascunhos

  useEffect(() => {
    const state = location.state as { activeTab?: string } | null
    if (state?.activeTab) {
      const tab = state.activeTab as TabType
      if (['publicados', 'rascunhos', 'desativados', 'pendentes'].includes(tab) && tab !== activeTab) {
        setActiveTab(tab)
      }
      setSelectedFase(null)
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [activeTab, location.pathname, location.state, navigate])

  // Transformar projetos para o formato do card unificado
  const projectsList = useMemo(() => {
    return activeTab === 'publicados'
      ? publicados.map(p => transformarProjeto(p, false))
      : rascunhos.map(p => transformarProjeto(p, true))
  }, [activeTab, publicados, rascunhos])

  // Filtrar projetos por fase
  const filteredProjects = useMemo(() => {
    if (!selectedFase) return projectsList
    return projectsList.filter((p: any) => {
      const mapNumToName = ['Ideação', 'Modelagem', 'Prototipagem', 'Implementação']
      const pFaseNum = p.faseAtual ? p.faseAtual - 1 : 0
      const pFaseName = mapNumToName[pFaseNum] || 'Ideação'
      return pFaseName === selectedFase
    })
  }, [projectsList, selectedFase])

  const contarPorFase = (faseName: string) => {
    const mapNumToName = ['Ideação', 'Modelagem', 'Prototipagem', 'Implementação']
    return projectsList.filter((p: any) => {
      const pFaseNum = p.faseAtual ? p.faseAtual - 1 : 0
      const pFaseName = mapNumToName[pFaseNum] || 'Ideação'
      return pFaseName === faseName
    }).length
  }

  // ─── Handlers ─────────────────────────────────────────────────

  const handleEditProject = (projectId: string) => {
    navigate(`${baseRoute}/editar-projeto/${projectId}`)
  }

  const handleContinueEditing = (projectId: string) => {
    navigate(`${baseRoute}/criar-projeto?rascunho=${projectId}`)
  }

  const handleDeleteProject = (project: any) => {
    const isPublicado = project.status === 'Publicado' || project.status === 'PUBLICADO'

    // Aluno + publicado: não pode excluir (botão não aparece, mas segurança extra)
    if (isAluno && isPublicado) {
      toast.error('Alunos não podem excluir projetos publicados.')
      return
    }

    // Docente + publicado: desativa diretamente com justificativa
    if (isDocente && isPublicado) {
      setConfirmModal({
        open: true,
        title: 'Desativar Projeto',
        message: `Deseja desativar o projeto "${project.titulo}"? Ele não aparecerá mais na vitrine pública.`,
        confirmLabel: 'Desativar',
        confirmColor: 'bg-yellow-600 hover:bg-yellow-700',
        requireJustification: true,
        onConfirm: async (justificativa: string) => {
          try {
            await api.post(`/projetos-arquivados/desativar/${project.uuid}`, { justificativa })
            toast.success('Projeto desativado com sucesso!')
            setConfirmModal(prev => ({ ...prev, open: false }))
            refetch()
            fetchAllDesativados()
          } catch (err: any) {
            toast.error(err.response?.data?.message || 'Erro ao desativar projeto')
          }
        },
      })
      return
    }

    // Demais casos (rascunho, admin): exclusão direta
    setProjectToDelete(project)
    setDeleteJustification('')
    setDeleteModalOpen(true)
  }

  const handleArchiveProject = (project: any) => {
    setProjectToArchive(project)
    setArchiveModalOpen(true)
  }

  const confirmDelete = async () => {
    if (projectToDelete) {
      try {
        await deleteProjeto(projectToDelete.uuid)
        localStorage.removeItem('project_draft')
        localStorage.removeItem('project_draft_timestamp')
        setDeleteModalOpen(false)
        setProjectToDelete(null)
      } catch (err: any) {
        console.error('Erro ao excluir projeto:', err)
        alert(err.message || 'Erro ao excluir projeto')
      }
    }
  }

  const handleViewProject = (projectId: string) => {
    navigate(`${baseRoute}/projetos/${projectId}/visualizar`)
  }

  // ─── Ações de desativados (docente) ───────────────────────────

  const handleApprove = async (solicitacao: SolicitacaoArquivamento) => {
    setConfirmModal({
      open: true,
      title: 'Aprovar arquivamento',
      message: `Tem certeza que deseja arquivar o projeto "${solicitacao.projeto_titulo}"?`,
      confirmLabel: 'Aprovar',
      confirmColor: 'bg-green-600 hover:bg-green-700',
      requireJustification: false,
      onConfirm: async () => {
        try {
          await api.post('/projetos-arquivados/aprovar', { solicitacao_uuid: solicitacao.uuid })
          toast.success('Solicitação aprovada! Projeto arquivado.')
          setConfirmModal(prev => ({ ...prev, open: false }))
          fetchAllDesativados()
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Erro ao aprovar')
        }
      },
    })
  }

  const handleDeny = (solicitacao: SolicitacaoArquivamento) => {
    setSelectedRequest({
      uuid: solicitacao.uuid,
      projeto_uuid: solicitacao.projeto_uuid,
      projeto: { titulo: solicitacao.projeto_titulo },
    })
    setDenyModalOpen(true)
  }

  const handleExcluirDesativado = (projeto: ProjetoDesativado) => {
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
          fetchAllDesativados()
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Erro ao excluir')
        }
      },
    })
  }

  const handleReativarDesativado = (projeto: ProjetoDesativado) => {
    setConfirmModal({
      open: true,
      title: 'Reativar projeto',
      message: `Deseja reativar o projeto "${projeto.titulo}"? Ele voltará a ficar visível na vitrine.`,
      confirmLabel: 'Reativar',
      confirmColor: 'bg-green-600 hover:bg-green-700',
      requireJustification: false,
      onConfirm: async () => {
        try {
          await api.post(`/projetos-arquivados/reativar/${projeto.uuid}`)
          toast.success('Projeto reativado com sucesso!')
          setConfirmModal(prev => ({ ...prev, open: false }))
          fetchAllDesativados()
          refetch()
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Erro ao reativar')
        }
      },
    })
  }

  const handleSolicitarReativacao = (projeto: ProjetoDesativado) => {
    setConfirmModal({
      open: true,
      title: 'Solicitar Reativação',
      message: `Deseja solicitar a reativação do projeto "${projeto.titulo}"? O orientador e os administradores serão notificados.`,
      confirmLabel: 'Enviar Solicitação',
      confirmColor: 'bg-indigo-600 hover:bg-indigo-700',
      requireJustification: true,
      onConfirm: async (justificativa: string) => {
        try {
          await api.post(`/projetos-arquivados/solicitar-reativacao/${projeto.uuid}`, { justificativa })
          toast.success('Solicitação de reativação enviada com sucesso!')
          setConfirmModal(prev => ({ ...prev, open: false }))
          fetchAllDesativados()
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Erro ao solicitar reativação')
        }
      },
    })
  }

  // ─── Page title baseado no perfil ─────────────────────────────

  const pageTitle = isDocente ? 'Minhas Orientações' : 'Meus Projetos'
  const pageSubtitle = isDocente ? 'Gerencie os projetos que você orienta' : 'Gerencie e acompanhe seus projetos'
  const pageIcon = isDocente ? <BookOpen /> : <FolderOpen />

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageBanner
        title={pageTitle}
        subtitle={pageSubtitle}
        icon={pageIcon}
        action={
          <Link
            to={`${baseRoute}/criar-projeto`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all shadow-lg backdrop-blur-sm transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Novo Projeto
          </Link>
        }
      />

      <div className="max-w-7xl mx-auto px-6 py-8 -mt-8 relative z-20">

        {/* Tabs */}
        <div className="mb-6 flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('publicados'); setSelectedFase(null) }}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'publicados'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            Publicados ({publicados.length})
          </button>
          <button
            onClick={() => { setActiveTab('rascunhos'); setSelectedFase(null) }}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'rascunhos'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            Rascunhos ({rascunhos.length})
          </button>
          {isAdmin && (
          <button
            onClick={() => { setActiveTab('desativados'); setSelectedFase(null) }}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'desativados'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            <Archive className="w-4 h-4" />
            Excluídos {projetosDesativados.length > 0 && `(${projetosDesativados.length})`}
          </button>
          )}
          {(isDocente || isAdmin) && (
            <button
              onClick={() => { setActiveTab('pendentes'); setSelectedFase(null) }}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'pendentes'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              <Clock className="w-4 h-4" />
              Solicitações Pendentes
              {solicitacoesPendentes.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  {solicitacoesPendentes.length}
                </span>
              )}
            </button>
          )}
        </div>

        {/* ═══════ CONTEÚDO: Publicados / Rascunhos ═══════ */}
        {(activeTab === 'publicados' || activeTab === 'rascunhos') && (
          <>
            {/* Contador */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedFase ? (
                  <>
                    Mostrando <strong>{filteredProjects.length}</strong> {filteredProjects.length === 1 ? 'projeto' : 'projetos'} em <strong>{selectedFase}</strong>
                  </>
                ) : (
                  <>
                    Você tem <strong>{currentProjects.length}</strong> {currentProjects.length === 1 ? 'projeto' : 'projetos'} {activeTab === 'publicados' ? 'publicados' : 'em rascunho'}
                  </>
                )}
              </p>
              {selectedFase && (
                <button
                  onClick={() => setSelectedFase(null)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  Limpar filtro
                </button>
              )}
            </div>

            {/* Filtros por Fase de Desenvolvimento - só mostra para publicados */}
            {activeTab === 'publicados' && (
              <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Filtrar por Etapa de Desenvolvimento
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { name: 'Ideação', icon: Lightbulb, color: 'yellow' },
                    { name: 'Modelagem', icon: FileText, color: 'blue' },
                    { name: 'Prototipagem', icon: Wrench, color: 'purple' },
                    { name: 'Implementação', icon: Rocket, color: 'green' },
                  ].map(({ name, icon: Icon, color }) => (
                    <button
                      key={name}
                      onClick={() => setSelectedFase(selectedFase === name ? null : name)}
                      className={`relative overflow-hidden border-2 rounded-xl p-4 transition-all duration-300 ${selectedFase === name
                        ? `border-${color}-400 bg-gradient-to-br from-${color}-50 to-${color}-100 dark:from-${color}-900/40 dark:to-${color}-800/40 shadow-lg scale-105`
                        : `border-${color}-200 dark:border-${color}-800 bg-gradient-to-br from-${color}-50 to-${color}-100 dark:from-${color}-900/20 dark:to-${color}-800/20 hover:shadow-md hover:scale-102`
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-10 h-10 bg-${color}-400 dark:bg-${color}-500 rounded-full flex-shrink-0`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-left flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm">{name}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{contarPorFase(name)} projetos</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Grid de Projetos */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 text-center">
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Tentar novamente
                </button>
              </div>
            ) : currentProjects.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
                <div className="flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto mb-4">
                  <Plus className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {activeTab === 'publicados' ? 'Nenhum projeto publicado' : 'Nenhum rascunho'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {activeTab === 'publicados'
                    ? 'Crie seu primeiro projeto e comece a construir seu portfólio'
                    : 'Você não tem projetos em rascunho no momento'}
                </p>
                <Link
                  to={`${baseRoute}/criar-projeto`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Criar Novo Projeto</span>
                </Link>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
                <Filter className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhum projeto nesta fase
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Você não possui projetos em <strong>{selectedFase}</strong>
                </p>
                <button
                  onClick={() => setSelectedFase(null)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  Ver todos os projetos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project: any) => (
                  <UnifiedProjectCard
                    key={project.id}
                    project={project}
                    variant="compact"
                    showActions={true}
                    isOwner={true}
                    actions={{
                      onEdit: (id) => {
                        if (activeTab === 'rascunhos') {
                          handleContinueEditing(id)
                        } else {
                          handleEditProject(id)
                        }
                      },
                      onDelete: isAluno && activeTab === 'publicados' ? undefined : (id) => handleDeleteProject(project),
                      onArchive: isAluno ? undefined : (id) => handleArchiveProject(project),
                      onView: (id) => handleViewProject(id)
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ═══════ CONTEÚDO: Desativados ═══════ */}
        {activeTab === 'desativados' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {loadingDesativados ? (
              <div className="p-12 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
              </div>
            ) : (
              <>
                {/* Projetos desativados */}
                {projetosDesativados.length === 0 && (!isAluno || minhasSolicitacoes.length === 0) ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nenhum projeto excluído</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Todos os seus projetos estão ativos.</p>
                  </div>
                ) : (
                  <>
                    {/* Minhas solicitações (aluno) — sempre no topo */}
                    {isAluno && minhasSolicitacoes.length > 0 && (
                      <div>
                        <div className="px-5 py-3 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800/40">
                          <h4 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Minhas Solicitações
                            <span className="ml-auto text-xs font-normal text-indigo-500 dark:text-indigo-400/70">
                              {minhasSolicitacoes.filter(s => s.status === 'PENDENTE').length > 0
                                ? `${minhasSolicitacoes.filter(s => s.status === 'PENDENTE').length} pendente(s)`
                                : 'Nenhuma pendente'}
                            </span>
                          </h4>
                        </div>
                        <MinhasSolicitacoesInline solicitacoes={minhasSolicitacoes} />
                      </div>
                    )}

                    {/* Lista de projetos desativados */}
                    {projetosDesativados.length > 0 && (
                      <div>
                        {isAluno && minhasSolicitacoes.length > 0 && (
                          <div className="px-5 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <Archive className="w-4 h-4" /> Projetos Excluídos
                            </h4>
                          </div>
                        )}
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                          {projetosDesativados.map((projeto) => (
                            <div key={projeto.uuid} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-2">
                                    <StatusBadge status={projeto.status} />
                                    {projeto.categoria && (
                                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{projeto.categoria}</span>
                                    )}
                                    <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {new Date(projeto.atualizado_em || projeto.criado_em).toLocaleDateString('pt-BR')}
                                    </span>
                                  </div>
                                  <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">{projeto.titulo}</h3>
                                  {projeto.descricao && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{projeto.descricao}</p>
                                  )}
                                </div>
                                <div className="flex flex-col gap-2 flex-shrink-0">
                                  <button
                                    onClick={() => navigate(`${baseRoute}/projetos/${projeto.uuid}/visualizar`)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                  >
                                    <Eye className="w-3.5 h-3.5" /> Ver
                                  </button>
                                  {isAdmin && (
                                    <button
                                      onClick={() => handleReativarDesativado(projeto)}
                                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5" /> Reativar
                                    </button>
                                  )}
                                  {isAdmin && projeto.status !== 'EXCLUIDO' && (
                                    <button
                                      onClick={() => handleExcluirDesativado(projeto)}
                                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" /> Excluir
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* ═══════ CONTEÚDO: Solicitações Pendentes (Docente) ═══════ */}
        {activeTab === 'pendentes' && (isDocente || isAdmin) && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {loadingDesativados ? (
              <div className="p-12 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
              </div>
            ) : solicitacoesPendentes.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tudo em dia!</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Nenhuma solicitação pendente no momento.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {solicitacoesPendentes.map((sol) => (
                  <div key={sol.uuid} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <StatusBadge status={sol.status} />
                          <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(sol.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">{sol.projeto_titulo}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Solicitado por: <span className="font-medium text-gray-700 dark:text-gray-300">{sol.aluno_nome}</span>
                          {sol.aluno_email && <span className="text-xs text-gray-400 dark:text-gray-500"> ({sol.aluno_email})</span>}
                        </p>
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800 mt-3">
                          <p className="text-xs font-medium text-indigo-700 dark:text-indigo-400 mb-1">Justificativa:</p>
                          <p className="text-sm text-indigo-600 dark:text-indigo-300 italic">"{sol.justificativa}"</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0 min-w-[130px]">
                        <button
                          onClick={() => handleApprove(sol)}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm shadow-sm"
                        >
                          <CheckCircle className="w-4 h-4" /> Aprovar
                        </button>
                        <button
                          onClick={() => handleDeny(sol)}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium text-sm"
                        >
                          <XCircle className="w-4 h-4" /> Negar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {deleteModalOpen && projectToDelete && (() => {
        const isDraft = projectToDelete.status === 'Rascunho' || projectToDelete.status === 'RASCUNHO'
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {isDraft ? 'Excluir Rascunho' : 'Excluir Projeto'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Esta ação não pode ser desfeita</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Tem certeza que deseja excluir {isDraft ? 'o rascunho' : 'o projeto'} <strong>"{projectToDelete.titulo}"</strong>?
              </p>
              {!isDraft && (
                <div className="mb-6">
                  <label htmlFor="delete-justification" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Justificativa da exclusão *
                  </label>
                  <textarea
                    id="delete-justification"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Por que você está excluindo este projeto?"
                    value={deleteJustification}
                    onChange={(e) => setDeleteJustification(e.target.value)}
                  />
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => { setDeleteModalOpen(false); setProjectToDelete(null) }}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isDeleting || (!isDraft && !deleteJustification.trim())}
                >
                  {isDeleting ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Modal de Solicitação de Arquivamento */}
      <ArchiveRequestModal
        isOpen={archiveModalOpen}
        onClose={() => { setArchiveModalOpen(false); setProjectToArchive(null) }}
        project={projectToArchive}
        onSuccess={() => {
          refetch()
          // Mudar para aba desativados para mostrar a solicitação pendente
          setActiveTab('desativados')
          fetchAllDesativados()
        }}
      />

      {/* Modais de ações (desativados) */}
      <ConfirmActionModal
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
        onSuccess={() => { fetchAllDesativados(); setDenyModalOpen(false); setSelectedRequest(null) }}
      />
    </div>
  )
}

// ─── Minhas Solicitações (inline para Aluno na aba desativados) ──

function MinhasSolicitacoesInline({ solicitacoes }: { solicitacoes: SolicitacaoArquivamento[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Ordenar: PENDENTE primeiro, depois NEGADO, depois APROVADO
  const sorted = [...solicitacoes].sort((a, b) => {
    const order: Record<string, number> = { PENDENTE: 0, NEGADO: 1, APROVADO: 2 }
    return (order[a.status] ?? 3) - (order[b.status] ?? 3)
  })

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-700">
      {sorted.map((sol) => (
        <div key={sol.uuid} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          <div
            className="flex items-start justify-between gap-4 cursor-pointer"
            onClick={() => setExpandedId(expandedId === sol.uuid ? null : sol.uuid)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge status={sol.status} />
                {sol.tipo === 'REATIVACAO' ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                    Reativação
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    Exclusão
                  </span>
                )}
                <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(sol.created_at).toLocaleDateString('pt-BR')}
                </span>
                {sol.respondido_em && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    → Respondido em {new Date(sol.respondido_em).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">{sol.projeto_titulo}</h3>
              {sol.orientador_nome && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Orientador: {sol.orientador_nome}</p>
              )}
            </div>
            <div className="flex-shrink-0 text-gray-400 dark:text-gray-500">
              {expandedId === sol.uuid ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>

          {expandedId === sol.uuid && (
            <div className="mt-3 space-y-3">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <p className="text-xs font-medium text-indigo-700 dark:text-indigo-400 mb-1">Sua justificativa:</p>
                <p className="text-sm text-indigo-600 dark:text-indigo-300 italic">"{sol.justificativa}"</p>
              </div>
              {sol.status === 'NEGADO' && sol.justificativa_negacao && (
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">Motivo da negação:</p>
                  <p className="text-sm text-red-600 dark:text-red-300 italic">"{sol.justificativa_negacao}"</p>
                </div>
              )}
              {sol.status === 'APROVADO' && (
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {sol.tipo === 'REATIVACAO'
                      ? 'Solicitação aprovada. O projeto foi reativado.'
                      : 'Solicitação aprovada. O projeto foi excluído.'}
                  </p>
                </div>
              )}
              {sol.status === 'PENDENTE' && (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Aguardando resposta do orientador.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default MyProjects
