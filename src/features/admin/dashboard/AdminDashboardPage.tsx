import { useState } from 'react'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import toast from 'react-hot-toast'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import {
  FolderOpen, Users, GraduationCap, BookOpen, Award, Beaker,
  TrendingUp, Lightbulb, FileCheck, Download, Calendar, LayoutDashboard,
  RefreshCw, AlertCircle, BarChart3
} from 'lucide-react'
import { useAdminOverview, useDistribuicaoFases, useProjetosPorCurso, useProjetosPorDocente } from '@/hooks/use-admin-reports'
import { adminReportsApi, ReportFilters } from '@/api/admin-reports'
import { useTheme } from '@/contexts/theme-context'
import { useQueryClient } from '@tanstack/react-query'

const FASE_COLORS: Record<string, string> = {
  IDEACAO: '#3B82F6',
  MODELAGEM: '#8B5CF6',
  PROTOTIPAGEM: '#F59E0B',
  IMPLEMENTACAO: '#10B981',
}

const FASE_LABELS: Record<string, string> = {
  IDEACAO: 'Ideação',
  MODELAGEM: 'Modelagem',
  PROTOTIPAGEM: 'Prototipagem',
  IMPLEMENTACAO: 'Implementação',
}

const CHART_COLORS = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#EC4899', '#06B6D4', '#F97316']

interface KPICardProps {
  title: string
  value: number
  suffix?: string
  icon: React.ElementType
  color: string
  subtitle?: string
}

function KPICard({ title, value, suffix, icon: Icon, color, subtitle }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            <CountUp end={value} duration={1.5} separator="." />
            {suffix && <span className="text-lg ml-1">{suffix}</span>}
          </p>
          {subtitle && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </motion.div>
  )
}

function ChartCard({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm ${className}`}
    >
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      {children}
    </motion.div>
  )
}

function PeriodSelector({ filters, onChange }: { filters: ReportFilters; onChange: (f: ReportFilters) => void }) {
  const presets = [
    { label: 'Tudo', value: {} },
    { label: '30 dias', value: { periodo_inicio: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0] } },
    { label: '90 dias', value: { periodo_inicio: new Date(Date.now() - 90 * 86400000).toISOString().split('T')[0] } },
    { label: '1 ano', value: { periodo_inicio: new Date(Date.now() - 365 * 86400000).toISOString().split('T')[0] } },
  ]

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-gray-400" />
      {presets.map(p => (
        <button
          key={p.label}
          onClick={() => onChange({ ...filters, ...p.value, periodo_fim: undefined })}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            (filters.periodo_inicio || '') === (p.value.periodo_inicio || '')
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
      <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
      {payload.map((entry: { name: string; value: number; color: string }, i: number) => (
        <p key={i} className="text-xs mt-1" style={{ color: entry.color }}>
          {entry.name}: <span className="font-semibold">{entry.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function AdminDashboardPage() {
  const [filters, setFilters] = useState<ReportFilters>({})
  const [exporting, setExporting] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const queryClient = useQueryClient()

  const { data: overview, isLoading: loadingOverview, isError: errorOverview } = useAdminOverview(filters)
  const { data: fases, isLoading: loadingFases } = useDistribuicaoFases(filters)
  const { data: cursos, isLoading: loadingCursos } = useProjetosPorCurso(filters)
  const { data: docentes, isLoading: loadingDocentes } = useProjetosPorDocente(filters, 10)

  const handleRefresh = async () => {
    setRefreshing(true)
    await queryClient.invalidateQueries({ queryKey: ['admin-overview'] })
    await queryClient.invalidateQueries({ queryKey: ['admin-distribuicao-fases'] })
    await queryClient.invalidateQueries({ queryKey: ['admin-projetos-por-curso'] })
    await queryClient.invalidateQueries({ queryKey: ['admin-projetos-por-docente'] })
    setRefreshing(false)
    toast.success('Dados atualizados')
  }

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

  const getButtonStyle = (color: string) => {
    const styles: Record<string, string> = {
      indigo: 'bg-white text-indigo-900 hover:bg-indigo-50',
      blue: 'bg-white text-blue-900 hover:bg-blue-50',
      purple: 'bg-white text-purple-900 hover:bg-purple-50',
      pink: 'bg-white text-pink-900 hover:bg-pink-50',
      green: 'bg-white text-green-900 hover:bg-green-50',
      orange: 'bg-white text-orange-900 hover:bg-orange-50',
    }
    return styles[color] || styles.indigo
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      await adminReportsApi.exportExcel(
        ['overview', 'distribuicao-fases', 'projetos-por-curso', 'projetos-por-docente'],
        filters
      )
      toast.success('Relatório exportado com sucesso!')
    } catch {
      toast.error('Erro ao exportar relatório')
    } finally {
      setExporting(false)
    }
  }

  const isLoading = loadingOverview || loadingFases || loadingCursos || loadingDocentes

  const fasesData = (fases || []).map((f: { fase: string; total: string; percentual: string }) => ({
    name: FASE_LABELS[f.fase] || f.fase,
    value: parseInt(f.total),
    percentual: parseFloat(f.percentual),
    fill: FASE_COLORS[f.fase] || '#94A3B8',
  }))

  const cursosData = (cursos || []).slice(0, 10).map((c: { nome: string; total: string }, i: number) => ({
    name: c.nome.length > 25 ? c.nome.substring(0, 22) + '...' : c.nome,
    fullName: c.nome,
    total: parseInt(c.total),
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }))

  const docentesData = (docentes || []).map((d: { nome: string; total_projetos: string; projetos_concluidos: string; projetos_ativos: string }) => ({
    name: d.nome.split(' ').slice(0, 2).join(' '),
    fullName: d.nome,
    total: parseInt(d.total_projetos),
    concluidos: parseInt(d.projetos_concluidos),
    ativos: parseInt(d.projetos_ativos),
  }))

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
                  <LayoutDashboard className="h-6 w-6" />
                </span>
                Painel Administrativo
              </h1>
              <p className="text-white/80 text-lg max-w-2xl font-light">
                Visão geral dos indicadores da Vitrine Tecnológica
              </p>
            </div>
            <div className="flex items-center gap-3">
              <PeriodSelector filters={filters} onChange={setFilters} />
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2.5 bg-white/10 backdrop-blur-sm text-white/90 rounded-lg hover:bg-white/20 transition-all"
                title="Atualizar dados"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleExport}
                disabled={exporting}
                className={`group flex items-center gap-2 px-6 py-3 font-bold rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 ${getButtonStyle(accentColor)}`}
              >
                <Download className="h-4 w-4" />
                {exporting ? 'Exportando...' : 'Excel'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">

      {/* Error State */}
      {errorOverview && !isLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-center gap-4"
        >
          <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-red-800 dark:text-red-300">Erro ao carregar dados</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">Verifique sua conexão e tente novamente.</p>
          </div>
          <button onClick={handleRefresh} className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
            Tentar novamente
          </button>
        </motion.div>
      )}

      {/* Skeleton or KPI Cards */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3" />
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3" />
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      ) : overview && (
        <>
          {/* Section: Visão Geral */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Visão Geral
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <KPICard title="Total de Projetos" value={parseInt(overview.total_projetos)} icon={FolderOpen} color="bg-blue-500" />
              <KPICard title="Alunos Ativos" value={parseInt(overview.total_alunos)} icon={GraduationCap} color="bg-purple-500" />
              <KPICard title="Docentes Ativos" value={parseInt(overview.total_docentes)} icon={Users} color="bg-indigo-500" />
              <KPICard title="Cursos" value={parseInt(overview.total_cursos)} icon={BookOpen} color="bg-cyan-500" />
              <KPICard title="Departamentos" value={parseInt(overview.total_departamentos)} icon={TrendingUp} color="bg-emerald-500" />
            </div>
          </div>

          {/* Section: Participação & Premiações */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Participação & Premiações
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <KPICard title="Itinerário" value={parseInt(overview.total_itinerario)} icon={Lightbulb} color="bg-amber-500" subtitle={`${overview.taxa_itinerario}% dos projetos`} />
              <KPICard title="SENAI Lab" value={parseInt(overview.total_senai_lab)} icon={Beaker} color="bg-teal-500" subtitle={`${overview.taxa_senai_lab}% dos projetos`} />
              <KPICard title="SAGA SENAI" value={parseInt(overview.total_saga)} icon={FileCheck} color="bg-pink-500" subtitle={`${overview.taxa_saga}% dos projetos`} />
              <KPICard title="Editais" value={parseInt(overview.total_editais)} icon={FileCheck} color="bg-orange-500" subtitle={`${overview.taxa_editais}% dos projetos`} />
              <KPICard title="Premiações" value={parseInt(overview.total_premiacoes)} icon={Award} color="bg-yellow-500" subtitle={`${overview.taxa_premiacoes}% dos projetos`} />
            </div>
          </div>
        </>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Distribuição por Fase (Pie) */}
        <ChartCard title="Distribuição por Fase">
          {loadingFases ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : fasesData.length === 0 ? (
            <div className="h-[300px] flex flex-col items-center justify-center text-gray-400">
              <BarChart3 className="h-10 w-10 mb-2 opacity-40" />
              <p className="text-sm">Sem dados para o período selecionado</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fasesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, payload }) => `${name} (${(payload as { percentual?: number })?.percentual ?? 0}%)`}
                >
                  {fasesData.map((entry: { fill: string }, index: number) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Chart 2: Projetos por Curso (Horizontal BarChart) */}
        <ChartCard title="Projetos por Curso (Top 10)">
          {loadingCursos ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
            </div>
          ) : cursosData.length === 0 ? (
            <div className="h-[300px] flex flex-col items-center justify-center text-gray-400">
              <BarChart3 className="h-10 w-10 mb-2 opacity-40" />
              <p className="text-sm">Sem dados para o período selecionado</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cursosData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fill: '#6B7280', fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const d = payload[0].payload
                    return (
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{d.fullName}</p>
                        <p className="text-xs text-blue-600 mt-1">Projetos: <span className="font-bold">{d.total}</span></p>
                      </div>
                    )
                  }}
                />
                <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                  {cursosData.map((entry: { fill: string }, index: number) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Chart 3: Top 10 Orientadores (Full Width) */}
      <ChartCard title="Top 10 Orientadores">
        {loadingDocentes ? (
          <div className="h-[350px] flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
          </div>
        ) : docentesData.length === 0 ? (
          <div className="h-[350px] flex flex-col items-center justify-center text-gray-400">
            <Users className="h-10 w-10 mb-2 opacity-40" />
            <p className="text-sm">Nenhum orientador encontrado para o período</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={docentesData} margin={{ bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 11 }} angle={-35} textAnchor="end" />
              <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const d = payload[0].payload
                  return (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{d.fullName}</p>
                      <p className="text-xs text-blue-600 mt-1">Total: <span className="font-bold">{d.total}</span></p>
                      <p className="text-xs text-green-600">Ativos: <span className="font-bold">{d.ativos}</span></p>
                      <p className="text-xs text-emerald-600">Concluídos: <span className="font-bold">{d.concluidos}</span></p>
                    </div>
                  )
                }}
              />
              <Legend />
              <Bar dataKey="ativos" name="Ativos" fill="#3B82F6" radius={[4, 4, 0, 0]} stackId="stack" />
              <Bar dataKey="concluidos" name="Concluídos" fill="#10B981" radius={[4, 4, 0, 0]} stackId="stack" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
      </div>
    </div>
  )
}
