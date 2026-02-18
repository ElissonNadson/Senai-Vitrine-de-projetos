import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { motion, AnimatePresence } from 'framer-motion'
import CountUp from 'react-countup'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  Users, Award, TrendingUp, Clock, X, ExternalLink, ChevronRight,
  RefreshCw, AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { DataTable } from '@/components/ui/data-table'
import { useComportamentoOrientadores, useHistoricoOrientador } from '@/hooks/use-admin-reports'
import { ReportFilters } from '@/api/admin-reports'
import { useTheme } from '@/contexts/theme-context'
import { useQueryClient } from '@tanstack/react-query'

const FASE_LABELS: Record<string, string> = {
  IDEACAO: 'Ideação',
  MODELAGEM: 'Modelagem',
  PROTOTIPAGEM: 'Prototipagem',
  IMPLEMENTACAO: 'Implementação',
}

const FASE_COLORS: Record<string, string> = {
  IDEACAO: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  MODELAGEM: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  PROTOTIPAGEM: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  IMPLEMENTACAO: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
}

const STATUS_COLORS: Record<string, string> = {
  PUBLICADO: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  RASCUNHO: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  ARQUIVADO: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  DESATIVADO: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

interface Orientador {
  nome: string
  email: string
  departamento: string | null
  total_projetos: string
  projetos_ativos: string
  projetos_concluidos: string
  taxa_conclusao: string
  primeira_orientacao: string
  ultima_orientacao: string
  media_dias_projeto: string
}

interface HistoricoProjeto {
  uuid: string
  titulo: string
  fase_atual: string
  status: string
  criado_em: string
  curso: string
  turma: string
  papel: string
  adicionado_em: string
  total_alunos: string
  etapas_concluidas: string
  total_etapas: string
}

function KPI({ title, value, suffix, icon: Icon, color }: { title: string; value: number; suffix?: string; icon: React.ElementType; color: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            <CountUp end={value} duration={1.2} separator="." />{suffix}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}><Icon className="h-5 w-5 text-white" /></div>
      </div>
    </motion.div>
  )
}

function OrientadorDrawer({ email, onClose }: { email: string; onClose: () => void }) {
  const { data: orientadores } = useComportamentoOrientadores({})
  const orientador = (orientadores || []).find((o: Orientador) => o.email === email)

  // We need to find orientador UUID from another approach - use email to find from historico
  // Actually the DAO uses usuario_uuid, let me use a workaround: search by email
  // The hook useHistoricoOrientador expects a UUID. Let's get it from another source.
  // For now, we'll show the orientador's project list from the comportamento data.
  // Actually we need to get the UUID. Let's search in the data.

  // Since we don't have the UUID directly in comportamento data, let's add a placeholder
  // The drawer will show summary info from the table row data

  if (!orientador) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex justify-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-white dark:bg-gray-800 w-full max-w-lg shadow-2xl overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{orientador.nome}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{orientador.email}</p>
              {orientador.departamento && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{orientador.departamento}</p>
              )}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Metrics */}
          <div className="p-6 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{orientador.total_projetos}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">Projetos Totais</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{orientador.projetos_concluidos}</p>
              <p className="text-xs text-green-600 dark:text-green-400">Concluídos</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{orientador.taxa_conclusao || 0}%</p>
              <p className="text-xs text-purple-600 dark:text-purple-400">Taxa Conclusão</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{orientador.media_dias_projeto || 0}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400">Dias Médios/Projeto</p>
            </div>
          </div>

          {/* Timeline info */}
          <div className="px-6 pb-6 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Histórico</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Primeira orientação</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {orientador.primeira_orientacao ? new Date(orientador.primeira_orientacao).toLocaleDateString('pt-BR') : '-'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Última orientação</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {orientador.ultima_orientacao ? new Date(orientador.ultima_orientacao).toLocaleDateString('pt-BR') : '-'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Projetos ativos</span>
                <span className="text-gray-900 dark:text-white font-medium">{orientador.projetos_ativos}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function AdminOrientadoresPage() {
  const [filters] = useState<ReportFilters>({})
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const { data: orientadores, isLoading, isError } = useComportamentoOrientadores(filters)
  const queryClient = useQueryClient()

  const { accentColor } = useTheme()

  const handleRefresh = async () => {
    setRefreshing(true)
    await queryClient.invalidateQueries({ queryKey: ['admin-comportamento-orientadores'] })
    setRefreshing(false)
    toast.success('Dados atualizados')
  }

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

  const list: Orientador[] = orientadores || []

  // Summary metrics
  const totalOrientadores = list.length
  const totalProjetos = list.reduce((s, o) => s + parseInt(o.total_projetos), 0)
  const avgProjetos = totalOrientadores > 0 ? (totalProjetos / totalOrientadores) : 0
  const avgTaxaConclusao = totalOrientadores > 0
    ? list.reduce((s, o) => s + (parseFloat(o.taxa_conclusao) || 0), 0) / totalOrientadores
    : 0

  const columns: ColumnDef<Orientador>[] = [
    {
      accessorKey: 'nome',
      header: 'Nome',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{row.original.nome}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: 'departamento',
      header: 'Departamento',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{row.original.departamento || '-'}</span>
      ),
    },
    {
      accessorKey: 'total_projetos',
      header: 'Projetos',
      cell: ({ row }) => (
        <span className="text-sm font-bold text-gray-900 dark:text-white">{row.original.total_projetos}</span>
      ),
    },
    {
      accessorKey: 'projetos_ativos',
      header: 'Ativos',
      cell: ({ row }) => (
        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
          {row.original.projetos_ativos}
        </span>
      ),
    },
    {
      accessorKey: 'projetos_concluidos',
      header: 'Concluídos',
      cell: ({ row }) => (
        <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full">
          {row.original.projetos_concluidos}
        </span>
      ),
    },
    {
      accessorKey: 'taxa_conclusao',
      header: 'Taxa Conclusão',
      cell: ({ row }) => {
        const taxa = parseFloat(row.original.taxa_conclusao) || 0
        const color = taxa >= 60 ? 'text-green-600' : taxa >= 30 ? 'text-amber-600' : 'text-red-500'
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full" style={{ width: `${Math.min(taxa, 100)}%` }} />
            </div>
            <span className={`text-sm font-medium ${color}`}>{taxa}%</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'media_dias_projeto',
      header: 'Dias Médios',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{row.original.media_dias_projeto || '-'} dias</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <button
          onClick={() => setSelectedEmail(row.original.email)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          title="Ver detalhes"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      ),
    },
  ]

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
                  <Users className="h-6 w-6" />
                </span>
                Orientadores
              </h1>
              <p className="text-white/80 text-lg max-w-2xl font-light">
                Análise comportamental e desempenho dos orientadores
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2.5 bg-white/10 backdrop-blur-sm text-white/90 rounded-lg hover:bg-white/20 transition-all"
              title="Atualizar dados"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">

      {/* Error State */}
      {isError && !isLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-center gap-4"
        >
          <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-red-800 dark:text-red-300">Erro ao carregar orientadores</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">Verifique sua conexão e tente novamente.</p>
          </div>
          <button onClick={handleRefresh} className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
            Tentar novamente
          </button>
        </motion.div>
      )}

      {/* KPIs */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI title="Orientadores" value={totalOrientadores} icon={Users} color="bg-indigo-500" />
        <KPI title="Projetos Orientados" value={totalProjetos} icon={Award} color="bg-blue-500" />
        <KPI title="Média por Orientador" value={parseFloat(avgProjetos.toFixed(1))} icon={TrendingUp} color="bg-purple-500" />
        <KPI title="Taxa Conclusão Média" value={parseFloat(avgTaxaConclusao.toFixed(1))} suffix="%" icon={Clock} color="bg-emerald-500" />
      </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <DataTable
          columns={columns}
          data={list}
          isLoading={isLoading}
          searchKey="nome"
          searchPlaceholder="Buscar orientador..."
        />
      </div>
      </div>

      {/* Drawer */}
      {selectedEmail && (
        <OrientadorDrawer email={selectedEmail} onClose={() => setSelectedEmail(null)} />
      )}
    </div>
  )
}
