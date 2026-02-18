import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderKanban, MoreVertical, Edit, Trash2, ArrowRightLeft, Shield,
  Eye, UserMinus, X, AlertTriangle, ExternalLink, FolderOpen, RefreshCw, Plus
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { DataTable } from '@/components/ui/data-table'
import ValidationModal from '@/components/ui/ValidationModal'
import {
  useAdminProjetos, useAlterarStatusProjeto,
  useExcluirProjeto
} from '@/hooks/use-admin-projetos'
import { useTheme } from '@/contexts/theme-context'
import { useQueryClient } from '@tanstack/react-query'

const FASES = ['IDEACAO', 'MODELAGEM', 'PROTOTIPAGEM', 'IMPLEMENTACAO'] as const
const STATUS_LIST = ['RASCUNHO', 'PUBLICADO', 'DESATIVADO'] as const

const STATUS_LABELS: Record<string, string> = {
  RASCUNHO: 'Rascunho',
  PUBLICADO: 'Publicado',
  DESATIVADO: 'Desativado',
  ARQUIVADO: 'Arquivado',
}

const FASE_LABELS: Record<string, string> = {
  IDEACAO: 'Ideação',
  MODELAGEM: 'Modelagem',
  PROTOTIPAGEM: 'Prototipagem',
  IMPLEMENTACAO: 'Implementação',
}

const FASE_BADGE: Record<string, string> = {
  IDEACAO: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  MODELAGEM: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  PROTOTIPAGEM: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  IMPLEMENTACAO: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
}

const STATUS_BADGE: Record<string, string> = {
  PUBLICADO: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  RASCUNHO: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  DESATIVADO: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300',
  ARQUIVADO: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
}

interface Projeto {
  uuid: string
  titulo: string
  fase_atual: string
  status: string
  curso: string
  turma: string
  criado_em: string
  atualizado_em: string
  total_alunos: string
  total_docentes: string
  criador_nome: string
}

function ActionMenu({ projeto, onAction }: {
  projeto: Projeto
  onAction: (action: string, data?: Record<string, string>) => void
}) {
  const [open, setOpen] = useState(false)
  const [subMenu, setSubMenu] = useState<'status' | null>(null)

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(!open); setSubMenu(null) }}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setSubMenu(null) }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              {!subMenu && (
                <>
                  <button
                    onClick={() => { onAction('view'); setOpen(false) }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Eye className="h-4 w-4" /> Visualizar
                  </button>
                  <button
                    onClick={() => { onAction('edit'); setOpen(false) }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Edit className="h-4 w-4" /> Editar Projeto
                  </button>
                  <button
                    onClick={() => setSubMenu('status')}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Shield className="h-4 w-4" /> Alterar Status
                  </button>
                  <button
                    onClick={() => { onAction('fase'); setOpen(false) }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <ArrowRightLeft className="h-4 w-4" /> Alterar Fase
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={() => { onAction('delete'); setOpen(false); setSubMenu(null) }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" /> Excluir
                  </button>
                </>
              )}
              {subMenu === 'status' && (
                <>
                  <button onClick={() => { setSubMenu(null) }} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                    ← Voltar
                  </button>
                  {STATUS_LIST.map(s => (
                    <button
                      key={s}
                      disabled={projeto.status === s}
                      onClick={() => { onAction('status', { status: s }); setOpen(false); setSubMenu(null) }}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        projeto.status === s ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${s === 'PUBLICADO' ? 'bg-green-500' : s === 'RASCUNHO' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                      {STATUS_LABELS[s] || s}
                    </button>
                  ))}
                </>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AdminProjetosPage() {
  const navigate = useNavigate()
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterFase, setFilterFase] = useState<string>('')
  const queryClient = useQueryClient()
  const [refreshing, setRefreshing] = useState(false)

  const { accentColor } = useTheme()

  const getBannerGradient = (color: string) => {
    const gradients: Record<string, string> = {
      indigo: 'from-indigo-900 via-indigo-800 to-indigo-900',
      blue: 'from-blue-900 via-blue-800 to-blue-900',
      purple: 'from-purple-900 via-purple-800 to-purple-900',
      pink: 'from-pink-900 via-pink-800 to-pink-900',
      green: 'from-green-900 via-green-800 to-green-900',
      orange: 'from-orange-900 via-orange-800 to-orange-900',
    }
    return gradients[color] || gradients.indigo
  }

  const getIconBg = (color: string) => {
    const bgs: Record<string, string> = {
      indigo: 'bg-indigo-500/20 text-indigo-200',
      blue: 'bg-blue-500/20 text-blue-200',
      purple: 'bg-purple-500/20 text-purple-200',
      pink: 'bg-pink-500/20 text-pink-200',
      green: 'bg-green-500/20 text-green-200',
      orange: 'bg-orange-500/20 text-orange-200',
    }
    return bgs[color] || bgs.indigo
  }

  const { data, isLoading } = useAdminProjetos({
    status: filterStatus || undefined,
    fase_atual: filterFase || undefined,
    limit: 200,
  })

  const projetos: Projeto[] = data?.projetos || data?.data || (Array.isArray(data) ? data : [])

  const alterarStatus = useAlterarStatusProjeto()
  const excluirProjeto = useExcluirProjeto()

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; uuid: string; titulo: string }>({ open: false, uuid: '', titulo: '' })
  const [statusModal, setStatusModal] = useState<{ open: boolean; uuid: string; titulo: string; statusAtual: string; novoStatus: string; observacao: string }>({ open: false, uuid: '', titulo: '', statusAtual: '', novoStatus: '', observacao: '' })

  const handleAction = (projeto: Projeto, action: string, extra?: Record<string, string>) => {
    switch (action) {
      case 'view':
        window.open(`/admin/projetos/${projeto.uuid}/visualizar`, '_blank')
        break
      case 'edit':
        navigate(`/admin/editar-projeto/${projeto.uuid}`)
        break
      case 'status':
        if (extra?.status) {
          setStatusModal({ open: true, uuid: projeto.uuid, titulo: projeto.titulo, statusAtual: projeto.status, novoStatus: extra.status, observacao: '' })
        }
        break
      case 'fase':
        toast('Redirecionando para a página de edição...\nA fase só pode ser alterada completando os dados da fase atual.', { icon: 'ℹ️', duration: 4000 })
        navigate(`/admin/editar-projeto/${projeto.uuid}`)
        break
      case 'delete':
        setDeleteModal({ open: true, uuid: projeto.uuid, titulo: projeto.titulo })
        break
    }
  }

  const handleConfirmStatus = async () => {
    if (statusModal.uuid && statusModal.novoStatus && statusModal.observacao.trim().length >= 10) {
      await alterarStatus.mutateAsync({ uuid: statusModal.uuid, status: statusModal.novoStatus, observacao: statusModal.observacao.trim() })
      setStatusModal({ open: false, uuid: '', titulo: '', statusAtual: '', novoStatus: '', observacao: '' })
    }
  }

  const handleConfirmDelete = async () => {
    if (deleteModal.uuid) {
      await excluirProjeto.mutateAsync(deleteModal.uuid)
      setDeleteModal({ open: false, uuid: '', titulo: '' })
    }
  }

  const columns: ColumnDef<Projeto>[] = [
    {
      accessorKey: 'titulo',
      header: 'Projeto',
      cell: ({ row }) => (
        <div className="max-w-xs">
          <p className="font-semibold text-gray-900 dark:text-white truncate">{row.original.titulo}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            por {row.original.criador_nome || 'N/A'} • {row.original.curso || 'Sem curso'}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${STATUS_BADGE[row.original.status] || 'bg-gray-100 text-gray-600'}`}>
          {STATUS_LABELS[row.original.status] || row.original.status}
        </span>
      ),
    },
    {
      accessorKey: 'fase_atual',
      header: 'Fase',
      cell: ({ row }) => (
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${FASE_BADGE[row.original.fase_atual] || 'bg-gray-100 text-gray-600'}`}>
          {FASE_LABELS[row.original.fase_atual] || row.original.fase_atual}
        </span>
      ),
    },
    {
      accessorKey: 'turma',
      header: 'Turma',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{row.original.turma || '-'}</span>
      ),
    },
    {
      accessorKey: 'total_alunos',
      header: 'Alunos',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{row.original.total_alunos || 0}</span>
      ),
    },
    {
      accessorKey: 'total_docentes',
      header: 'Docentes',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{row.original.total_docentes || 0}</span>
      ),
    },
    {
      accessorKey: 'criado_em',
      header: 'Criado em',
      cell: ({ row }) => (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {row.original.criado_em ? new Date(row.original.criado_em).toLocaleDateString('pt-BR') : '-'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <ActionMenu
          projeto={row.original}
          onAction={(action, data) => handleAction(row.original, action, data)}
        />
      ),
    },
  ]

  // Count by status
  const countByStatus = (projetos || []).reduce((acc: Record<string, number>, p: Projeto) => {
    acc[p.status] = (acc[p.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Count by fase
  const countByFase = (projetos || []).reduce((acc: Record<string, number>, p: Projeto) => {
    acc[p.fase_atual] = (acc[p.fase_atual] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const handleRefresh = async () => {
    setRefreshing(true)
    await queryClient.invalidateQueries({ queryKey: ['admin-projetos'] })
    setRefreshing(false)
    toast.success('Dados atualizados')
  }

  return (
    <div className="space-y-8">
      {/* Header Banner - Dynamic Theme */}
      <div className={`bg-gradient-to-r ${getBannerGradient(accentColor)} text-white overflow-hidden relative transition-colors duration-500 shadow-xl`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-3xl font-bold mb-3 flex items-center gap-4">
                <span className={`p-2 rounded-lg backdrop-blur-sm ${getIconBg(accentColor)}`}>
                  <FolderKanban className="h-6 w-6" />
                </span>
                Gerenciar Projetos
              </h1>
              <p className="text-white/80 text-lg max-w-2xl font-light">
                Modo administrativo — edite status, fases e membros de qualquer projeto
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => navigate('/admin/criar-projeto')}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all font-medium"
              >
                <Plus className="h-4 w-4" />
                Criar Projeto
              </button>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2.5 bg-white/10 backdrop-blur-sm text-white/90 rounded-lg hover:bg-white/20 transition-all"
                title="Atualizar lista"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white/90 font-medium">
                {projetos.length} projetos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl w-fit">
        <button
          onClick={() => { setFilterStatus(''); setFilterFase('') }}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
            !filterStatus && !filterFase
              ? 'bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-400 shadow-sm scale-105'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
          }`}
        >
          Todos
        </button>
        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1 self-stretch" />
        {STATUS_LIST.map(s => (
          <button
            key={s}
            onClick={() => { setFilterStatus(filterStatus === s ? '' : s); setFilterFase('') }}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
              filterStatus === s
                ? 'bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-400 shadow-sm scale-105'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
            }`}
          >
            {STATUS_LABELS[s] || s} {countByStatus[s] ? `(${countByStatus[s]})` : ''}
          </button>
        ))}
        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1 self-stretch" />
        {FASES.map(f => {
          const faseColors: Record<string, { active: string; dot: string }> = {
            IDEACAO: { active: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-blue-200 dark:ring-blue-800', dot: 'bg-blue-500' },
            MODELAGEM: { active: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 ring-1 ring-purple-200 dark:ring-purple-800', dot: 'bg-purple-500' },
            PROTOTIPAGEM: { active: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-800', dot: 'bg-amber-500' },
            IMPLEMENTACAO: { active: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 ring-1 ring-green-200 dark:ring-green-800', dot: 'bg-green-500' },
          }
          const fc = faseColors[f]
          return (
            <button
              key={f}
              onClick={() => { setFilterFase(filterFase === f ? '' : f); setFilterStatus('') }}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                filterFase === f
                  ? `${fc.active} shadow-sm scale-105`
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${filterFase === f ? fc.dot : 'bg-gray-400'}`} />
              {FASE_LABELS[f]}
              {countByFase[f] ? ` (${countByFase[f]})` : ''}
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <DataTable
          columns={columns}
          data={projetos}
          isLoading={isLoading || alterarStatus.isPending}
          searchKey="titulo"
          searchPlaceholder="Buscar projeto..."
        />
      </div>
      </div>

      {/* Delete Modal */}
      {deleteModal.open && (
        <ValidationModal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, uuid: '', titulo: '' })}
          onConfirm={handleConfirmDelete}
          title="Excluir projeto"
          message={`Tem certeza que deseja excluir o projeto "${deleteModal.titulo}"? Esta ação é irreversível.`}
          confirmText="Excluir"
          cancelText="Cancelar"
          type="error"
        />
      )}

      {/* Status Change Modal */}
      <AnimatePresence>
        {statusModal.open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setStatusModal({ ...statusModal, open: false })}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    Alterar Status do Projeto
                  </h3>
                  <button onClick={() => setStatusModal({ ...statusModal, open: false })} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Projeto: <span className="font-semibold text-gray-900 dark:text-white">{statusModal.titulo}</span>
                  </p>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${STATUS_BADGE[statusModal.statusAtual] || 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[statusModal.statusAtual] || statusModal.statusAtual}
                    </span>
                    <ArrowRightLeft className="h-4 w-4 text-gray-400" />
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${STATUS_BADGE[statusModal.novoStatus] || 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[statusModal.novoStatus] || statusModal.novoStatus}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Justificativa <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={statusModal.observacao}
                    onChange={e => setStatusModal({ ...statusModal, observacao: e.target.value })}
                    placeholder="Descreva o motivo da alteração de status (mínimo 10 caracteres)..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <p className={`text-xs mt-1 ${statusModal.observacao.trim().length >= 10 ? 'text-green-500' : 'text-gray-400'}`}>
                    {statusModal.observacao.trim().length}/10 caracteres mínimos
                  </p>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setStatusModal({ ...statusModal, open: false })}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmStatus}
                    disabled={statusModal.observacao.trim().length < 10 || alterarStatus.isPending}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {alterarStatus.isPending ? 'Alterando...' : 'Confirmar Alteração'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
