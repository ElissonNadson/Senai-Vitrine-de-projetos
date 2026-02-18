import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts'
import {
  Filter, Download, ChevronDown, ChevronUp, Check, X,
  TrendingUp, BarChart3, RefreshCw, AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  useFilterOptions, useProjetosPorCurso, useProjetosPorModalidade,
  useProjetosPorUnidadeCurricular, useProjetosPorTurma,
  useDistribuicaoFases, useTaxaAvancoFases, useTaxaParticipacao,
  useSenaiLabPorFase, useTimelineCriacao, useProjetosPorDocente,
} from '@/hooks/use-admin-reports'
import { adminReportsApi, ReportFilters } from '@/api/admin-reports'
import { useTheme } from '@/contexts/theme-context'
import { useQueryClient } from '@tanstack/react-query'

const CHART_COLORS = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#EC4899', '#06B6D4', '#F97316', '#84CC16', '#F43F5E']

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

interface Indicator {
  id: string
  label: string
  group: string
}

const INDICATORS: Indicator[] = [
  { id: 'distribuicao-fases', label: 'Distribuição por Fase', group: 'Projetos' },
  { id: 'projetos-por-curso', label: 'Projetos por Curso', group: 'Projetos' },
  { id: 'projetos-por-modalidade', label: 'Projetos por Modalidade', group: 'Projetos' },
  { id: 'projetos-por-uc', label: 'Projetos por Unidade Curricular', group: 'Projetos' },
  { id: 'projetos-por-turma', label: 'Projetos por Turma', group: 'Projetos' },
  { id: 'projetos-por-docente', label: 'Top Orientadores', group: 'Docentes' },
  { id: 'taxa-avanco-fases', label: 'Taxa de Avanço entre Fases', group: 'Avançado' },
  { id: 'taxa-participacao', label: 'Taxa de Participação (Lab, Saga, Editais)', group: 'Avançado' },
  { id: 'senai-lab-por-fase', label: 'SENAI Lab por Fase', group: 'Avançado' },
  { id: 'timeline-criacao', label: 'Timeline de Criação', group: 'Temporal' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg text-sm">
      <p className="font-medium text-gray-900 dark:text-white mb-1">{label}</p>
      {payload.map((e: { name: string; value: number; color: string }, i: number) => (
        <p key={i} style={{ color: e.color }}>
          {e.name}: <span className="font-bold">{e.value}</span>
        </p>
      ))}
    </div>
  )
}

function FilterPanel({ filters, onChange }: { filters: ReportFilters; onChange: (f: ReportFilters) => void }) {
  const { data: options } = useFilterOptions()
  const [open, setOpen] = useState(false)

  const activeCount = Object.values(filters).filter(v => v !== undefined && v !== '').length

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-900 dark:text-white">Filtros</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
              {activeCount} ativo{activeCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Período início</label>
                <input
                  type="date"
                  value={filters.periodo_inicio || ''}
                  onChange={e => onChange({ ...filters, periodo_inicio: e.target.value || undefined })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Período fim</label>
                <input
                  type="date"
                  value={filters.periodo_fim || ''}
                  onChange={e => onChange({ ...filters, periodo_fim: e.target.value || undefined })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
                <select
                  value={filters.status || ''}
                  onChange={e => onChange({ ...filters, status: e.target.value || undefined })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Todos</option>
                  {options?.status?.map((s: string) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Fase Atual</label>
                <select
                  value={filters.fase_atual || ''}
                  onChange={e => onChange({ ...filters, fase_atual: e.target.value || undefined })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Todas</option>
                  {options?.fases?.map((f: string) => <option key={f} value={f}>{FASE_LABELS[f] || f}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Curso</label>
                <select
                  value={filters.curso || ''}
                  onChange={e => onChange({ ...filters, curso: e.target.value || undefined })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Todos</option>
                  {options?.cursos?.map((c: { nome: string }) => <option key={c.nome} value={c.nome}>{c.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Modalidade</label>
                <select
                  value={filters.modalidade || ''}
                  onChange={e => onChange({ ...filters, modalidade: e.target.value || undefined })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Todas</option>
                  {options?.modalidades?.map((m: { nome: string }) => <option key={m.nome} value={m.nome}>{m.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Departamento</label>
                <select
                  value={filters.departamento_uuid || ''}
                  onChange={e => onChange({ ...filters, departamento_uuid: e.target.value || undefined })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Todos</option>
                  {options?.departamentos?.map((d: { uuid: string; nome: string }) => <option key={d.uuid} value={d.uuid}>{d.nome}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => onChange({})}
                  className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  Limpar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function IndicatorSelector({ selected, onChange }: { selected: string[]; onChange: (s: string[]) => void }) {
  const groups = useMemo(() => {
    const map = new Map<string, Indicator[]>()
    INDICATORS.forEach(ind => {
      const g = map.get(ind.group) || []
      g.push(ind)
      map.set(ind.group, g)
    })
    return map
  }, [])

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id])
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-900 dark:text-white">Indicadores</span>
          <span className="text-xs text-gray-400">({selected.length} selecionados)</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onChange(INDICATORS.map(i => i.id))} className="text-xs text-blue-600 hover:underline">Selecionar todos</button>
          <button onClick={() => onChange([])} className="text-xs text-red-500 hover:underline">Limpar</button>
        </div>
      </div>
      <div className="space-y-3">
        {Array.from(groups.entries()).map(([group, items]) => (
          <div key={group}>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">{group}</p>
            <div className="flex flex-wrap gap-2">
              {items.map(ind => (
                <button
                  key={ind.id}
                  onClick={() => toggle(ind.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    selected.includes(ind.id)
                      ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-600 dark:text-blue-300'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                  }`}
                >
                  {selected.includes(ind.id) && <Check className="h-3 w-3" />}
                  {ind.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function IndicatorChart({ id, filters }: { id: string; filters: ReportFilters }) {
  const { data: fases, isLoading: l1 } = useDistribuicaoFases(id === 'distribuicao-fases' ? filters : {})
  const { data: cursos, isLoading: l2 } = useProjetosPorCurso(id === 'projetos-por-curso' ? filters : {})
  const { data: modalidades, isLoading: l3 } = useProjetosPorModalidade(id === 'projetos-por-modalidade' ? filters : {})
  const { data: ucs, isLoading: l4 } = useProjetosPorUnidadeCurricular(id === 'projetos-por-uc' ? filters : {})
  const { data: turmas, isLoading: l5 } = useProjetosPorTurma(id === 'projetos-por-turma' ? filters : {})
  const { data: docentes, isLoading: l6 } = useProjetosPorDocente(id === 'projetos-por-docente' ? filters : {}, 15)
  const { data: avanco, isLoading: l7 } = useTaxaAvancoFases(id === 'taxa-avanco-fases' ? filters : {})
  const { data: participacao, isLoading: l8 } = useTaxaParticipacao(id === 'taxa-participacao' ? filters : {})
  const { data: labFase, isLoading: l9 } = useSenaiLabPorFase(id === 'senai-lab-por-fase' ? filters : {})
  const { data: timeline, isLoading: l10 } = useTimelineCriacao(id === 'timeline-criacao' ? filters : {})

  const loading = { 'distribuicao-fases': l1, 'projetos-por-curso': l2, 'projetos-por-modalidade': l3, 'projetos-por-uc': l4, 'projetos-por-turma': l5, 'projetos-por-docente': l6, 'taxa-avanco-fases': l7, 'taxa-participacao': l8, 'senai-lab-por-fase': l9, 'timeline-criacao': l10 }[id]

  if (loading) return (
    <div className="h-[300px] flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  )

  switch (id) {
    case 'distribuicao-fases': {
      const d = (fases || []).map((f: { fase: string; total: string; percentual: string }) => ({
        name: FASE_LABELS[f.fase] || f.fase, value: parseInt(f.total), fill: FASE_COLORS[f.fase] || '#94A3B8'
      }))
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={d} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={4} dataKey="value"
                 label={({ name, value }) => `${name}: ${value}`}>
              {d.map((e: { fill: string }, i: number) => <Cell key={i} fill={e.fill} />)}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )
    }
    case 'projetos-por-curso':
    case 'projetos-por-modalidade':
    case 'projetos-por-uc':
    case 'projetos-por-turma': {
      const raw = { 'projetos-por-curso': cursos, 'projetos-por-modalidade': modalidades, 'projetos-por-uc': ucs, 'projetos-por-turma': turmas }[id] || []
      const d = (raw as { nome: string; total: string }[]).slice(0, 15).map((r, i) => ({
        name: r.nome.length > 20 ? r.nome.substring(0, 18) + '...' : r.nome,
        fullName: r.nome, total: parseInt(r.total), fill: CHART_COLORS[i % CHART_COLORS.length]
      }))
      return (
        <ResponsiveContainer width="100%" height={Math.max(250, d.length * 35)}>
          <BarChart data={d} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" tick={{ fill: '#6B7280', fontSize: 12 }} />
            <YAxis type="category" dataKey="name" width={130} tick={{ fill: '#6B7280', fontSize: 11 }} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="total" name="Total" radius={[0, 4, 4, 0]}>
              {d.map((e: { fill: string }, i: number) => <Cell key={i} fill={e.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )
    }
    case 'projetos-por-docente': {
      const d = (docentes || []).map((doc: { nome: string; total_projetos: string; projetos_ativos: string; projetos_concluidos: string }) => ({
        name: doc.nome.split(' ').slice(0, 2).join(' '),
        total: parseInt(doc.total_projetos), ativos: parseInt(doc.projetos_ativos), concluidos: parseInt(doc.projetos_concluidos)
      }))
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={d} margin={{ bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 11 }} angle={-30} textAnchor="end" />
            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            <Bar dataKey="ativos" name="Ativos" fill="#3B82F6" stackId="s" radius={[4, 4, 0, 0]} />
            <Bar dataKey="concluidos" name="Concluídos" fill="#10B981" stackId="s" />
          </BarChart>
        </ResponsiveContainer>
      )
    }
    case 'taxa-avanco-fases': {
      const d = (avanco || []).map((a: { fase_anterior: string; fase_nova: string; total_transicoes: string; tipo_mudanca: string }) => ({
        name: `${FASE_LABELS[a.fase_anterior] || a.fase_anterior} → ${FASE_LABELS[a.fase_nova] || a.fase_nova}`,
        total: parseInt(a.total_transicoes), tipo: a.tipo_mudanca
      }))
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={d} margin={{ bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 10 }} angle={-25} textAnchor="end" />
            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="total" name="Transições" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )
    }
    case 'taxa-participacao': {
      if (!participacao) return null
      const d = [
        { name: 'Itinerário', value: parseFloat(participacao.taxa_itinerario) || 0, total: parseInt(participacao.itinerario) },
        { name: 'SENAI Lab', value: parseFloat(participacao.taxa_senai_lab) || 0, total: parseInt(participacao.senai_lab) },
        { name: 'SAGA SENAI', value: parseFloat(participacao.taxa_saga) || 0, total: parseInt(participacao.saga_senai) },
        { name: 'Editais', value: parseFloat(participacao.taxa_editais) || 0, total: parseInt(participacao.participou_edital) },
        { name: 'Prêmios', value: parseFloat(participacao.taxa_premiacao) || 0, total: parseInt(participacao.ganhou_premio) },
      ]
      return (
        <div>
          <div className="grid grid-cols-5 gap-3 mb-4">
            {d.map((item, i) => (
              <div key={i} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xl font-bold text-gray-900 dark:text-white">{item.value}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.name}</p>
                <p className="text-xs text-gray-400">({item.total})</p>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={d}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} unit="%" />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" name="Taxa (%)" radius={[4, 4, 0, 0]}>
                {d.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    }
    case 'senai-lab-por-fase': {
      const d = (labFase || []).map((f: { fase: string; total: string; com_lab: string; percentual_lab: string }) => ({
        name: FASE_LABELS[f.fase] || f.fase, total: parseInt(f.total), comLab: parseInt(f.com_lab), pctLab: parseFloat(f.percentual_lab)
      }))
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={d}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            <Bar dataKey="total" name="Total" fill="#94A3B8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="comLab" name="Com SENAI Lab" fill="#14B8A6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )
    }
    case 'timeline-criacao': {
      const d = (timeline || []).map((t: { periodo: string; total: string }) => ({
        name: t.periodo, total: parseInt(t.total)
      }))
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={d}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 11 }} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="total" name="Projetos" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      )
    }
    default:
      return <p className="text-gray-400 text-sm text-center py-8">Indicador não implementado</p>
  }
}

export default function AdminReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>({})
  const [selected, setSelected] = useState<string[]>(['distribuicao-fases', 'projetos-por-curso', 'projetos-por-docente'])
  const [exporting, setExporting] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const queryClient = useQueryClient()

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
      await adminReportsApi.exportExcel(selected, filters)
      toast.success('Relatório exportado com sucesso!')
    } catch {
      toast.error('Erro ao exportar relatório')
    } finally {
      setExporting(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await queryClient.invalidateQueries()
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
                  <TrendingUp className="h-6 w-6" />
                </span>
                Relatórios & Indicadores
              </h1>
              <p className="text-white/80 text-lg max-w-2xl font-light">
                Selecione indicadores e aplique filtros para análises personalizadas
              </p>
            </div>
            <div className="flex items-center gap-3">
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
                disabled={exporting || selected.length === 0}
                className={`group flex items-center gap-2 px-6 py-3 font-bold rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 ${getButtonStyle(accentColor)}`}
              >
                <Download className="h-4 w-4" />
                {exporting ? 'Exportando...' : 'Exportar Excel'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">

      {/* Filters + Indicators */}
      <FilterPanel filters={filters} onChange={setFilters} />
      <IndicatorSelector selected={selected} onChange={setSelected} />

      {/* Charts Grid */}
      {selected.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium">Nenhum indicador selecionado</p>
          <p className="text-sm">Selecione indicadores acima para visualizar os gráficos</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${selected.length === 1 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
          {selected.map(id => {
            const ind = INDICATORS.find(i => i.id === id)
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
              >
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">{ind?.label || id}</h3>
                <IndicatorChart id={id} filters={filters} />
              </motion.div>
            )
          })}
        </div>
      )}
      </div>
    </div>
  )
}
