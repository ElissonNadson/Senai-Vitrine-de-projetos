import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Lightbulb,
  FileText,
  Wrench,
  Rocket,
  GraduationCap,
  Users,
  Layers,
  MapPin,
  BookOpen,
  Award,
  Code,
  Globe,
  Lock,
  Shield,
  Calendar,
  Clock,
  Edit,
  Plus,
  Trash2,
  ExternalLink,
  Eye,
  ChevronRight,
  Paperclip,
  Download,
  FileIcon,
  LogIn
} from 'lucide-react'
import RatingDisplay from '@/components/RatingDisplay'

// Tipos de dados
interface ProjectLeader {
  nome: string
  email: string
  matricula?: string
}

interface UnidadeCurricular {
  nome: string
  descricao?: string
  cargaHoraria?: string
}

interface ProjectStage {
  id: string
  nome: string
  descricao?: string
  dataInicio?: string
  dataFim?: string
  status?: string
  anexos?: Array<{
    id: string
    nome: string
    url: string
    tipo: string
  }>
}

interface UnifiedProject {
  id: string
  nome: string
  descricao: string
  bannerUrl?: string
  status?: string
  faseAtual: 1 | 2 | 3 | 4
  
  // Dados básicos
  curso?: string
  turma?: string
  categoria?: string
  modalidade?: string
  
  // Tags
  itinerario?: boolean
  labMaker?: boolean
  participouSaga?: boolean
  
  // UC e Líder
  unidadeCurricular?: UnidadeCurricular
  liderProjeto?: ProjectLeader
  
  // Visibilidade
  codigo?: string
  visibilidadeCodigo?: 'publico' | 'privado'
  visibilidadeAnexos?: 'publico' | 'privado'
  
  // Datas
  criadoEm?: string
  atualizadoEm?: string
  
  // Etapas por fase
  etapas?: {
    ideacao?: ProjectStage[]
    modelagem?: ProjectStage[]
    prototipagem?: ProjectStage[]
    validacao?: ProjectStage[]
  }
}

interface UnifiedProjectModalProps {
  project: UnifiedProject
  isOpen: boolean
  onClose: () => void
  isGuest?: boolean
  mode?: 'view' | 'edit'
  onEdit?: () => void
  onAddStage?: (phase: number) => void
}

const UnifiedProjectModal: React.FC<UnifiedProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  isGuest = false,
  mode = 'view',
  onEdit,
  onAddStage
}) => {
  const [activePhase, setActivePhase] = useState<number>(project.faseAtual)

  if (!isOpen) return null

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Configuração das fases
  const phases = [
    {
      id: 1,
      name: 'Ideação',
      icon: Lightbulb,
      gradient: 'from-blue-500 to-cyan-500',
      badge: 'bg-blue-600',
      bg: 'bg-blue-50',
      darkBg: 'dark:bg-blue-950/20',
      border: 'border-blue-500',
      stages: project.etapas?.ideacao || []
    },
    {
      id: 2,
      name: 'Modelagem',
      icon: FileText,
      gradient: 'from-yellow-500 to-orange-500',
      badge: 'bg-yellow-600',
      bg: 'bg-yellow-50',
      darkBg: 'dark:bg-yellow-950/20',
      border: 'border-yellow-500',
      stages: project.etapas?.modelagem || []
    },
    {
      id: 3,
      name: 'Prototipagem',
      icon: Wrench,
      gradient: 'from-orange-500 to-red-500',
      badge: 'bg-orange-600',
      bg: 'bg-orange-50',
      darkBg: 'dark:bg-orange-950/20',
      border: 'border-orange-500',
      stages: project.etapas?.prototipagem || []
    },
    {
      id: 4,
      name: 'Validação',
      icon: Rocket,
      gradient: 'from-green-500 to-emerald-500',
      badge: 'bg-green-600',
      bg: 'bg-green-50',
      darkBg: 'dark:bg-green-950/20',
      border: 'border-green-500',
      stages: project.etapas?.validacao || []
    }
  ]

  const currentPhase = phases.find((p) => p.id === activePhase) || phases[0]
  const PhaseIcon = currentPhase.icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border-2 ${currentPhase.border}`}
        >
          {/* Header com Banner */}
          <div className="relative">
            {project.bannerUrl ? (
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.bannerUrl}
                  alt={project.nome}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Status Badge */}
                {project.status && (
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg">
                      <div className={`w-2 h-2 rounded-full ${project.status === 'ativo' ? 'bg-green-500' : 'bg-gray-400'} animate-pulse`} />
                      <span className="text-xs font-semibold text-gray-900 dark:text-white capitalize">{project.status}</span>
                    </div>
                  </div>
                )}

                {/* Botão Fechar */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-lg group"
                >
                  <X className="w-5 h-5 text-gray-900 dark:text-white group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Título e Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 ${currentPhase.badge} text-white rounded-full shadow-lg backdrop-blur-sm mb-4`}>
                    <PhaseIcon className="w-4 h-4" />
                    <span className="font-bold text-sm">{currentPhase.name}</span>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    {project.nome}
                  </h2>
                  <p className="text-white/90 text-sm mb-3 drop-shadow-lg line-clamp-2">
                    {project.descricao}
                  </p>

                  {/* Rating */}
                  <div className="inline-block">
                    <RatingDisplay projectId={project.id} />
                  </div>
                </div>
              </div>
            ) : (
              <div className={`relative p-6 ${currentPhase.bg} ${currentPhase.darkBg}`}>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg group"
                >
                  <X className="w-5 h-5 text-gray-900 dark:text-white group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <div className="max-w-3xl">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 ${currentPhase.badge} text-white rounded-full shadow-lg mb-4`}>
                    <PhaseIcon className="w-4 h-4" />
                    <span className="font-bold text-sm">{currentPhase.name}</span>
                  </div>

                  {project.status && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg ml-3 mb-4">
                      <div className={`w-2 h-2 rounded-full ${project.status === 'ativo' ? 'bg-green-500' : 'bg-gray-400'} animate-pulse`} />
                      <span className="text-xs font-semibold text-gray-900 dark:text-white capitalize">{project.status}</span>
                    </div>
                  )}
                  
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {project.nome}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {project.descricao}
                  </p>

                  {/* Rating */}
                  <div className="inline-block">
                    <RatingDisplay projectId={project.id} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tabs de Fases */}
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-700 px-6 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {phases.map((phase) => {
                const Icon = phase.icon
                const isActive = activePhase === phase.id
                const isCompleted = phase.id < project.faseAtual
                const isLocked = phase.id > project.faseAtual

                return (
                  <button
                    key={phase.id}
                    onClick={() => setActivePhase(phase.id)}
                    disabled={isLocked}
                    className={`relative flex items-center gap-2 px-4 py-4 transition-all duration-300 ${
                      isActive
                        ? `${phase.badge} text-white shadow-lg`
                        : isCompleted
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        : isLocked
                        ? 'bg-gray-50 dark:bg-gray-900 text-gray-400 cursor-not-allowed'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-transparent'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sm">{phase.name}</div>
                      <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                        {phase.stages.length} {phase.stages.length === 1 ? 'etapa' : 'etapas'}
                      </div>
                    </div>
                    {isLocked && <Lock className="w-4 h-4 ml-2" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Grid de Informações Básicas */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Informações do Projeto
                </h3>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {project.curso && (
                    <div className="flex items-center gap-2 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                      <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Curso</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {project.curso}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.turma && (
                    <div className="flex items-center gap-2 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                      <Users className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Turma</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {project.turma}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.categoria && (
                    <div className="flex items-center gap-2 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                      <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Categoria</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {project.categoria}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.modalidade && (
                    <div className="flex items-center gap-2 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                      <MapPin className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Modalidade</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {project.modalidade}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Badges */}
                {(project.itinerario || project.labMaker || project.participouSaga) && (
                  <div className="flex flex-wrap gap-2">
                    {project.itinerario && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                        <BookOpen className="w-3.5 h-3.5" />
                        Itinerário
                      </div>
                    )}
                    {project.labMaker && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">
                        <Wrench className="w-3.5 h-3.5" />
                        SENAI Lab
                      </div>
                    )}
                    {project.participouSaga && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-semibold">
                        <Award className="w-3.5 h-3.5" />
                        SAGA SENAI
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Unidade Curricular */}
              {project.unidadeCurricular && (
                <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="font-bold text-gray-900 dark:text-white">Unidade Curricular</h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
                    {project.unidadeCurricular.nome}
                  </p>
                  {project.unidadeCurricular.descricao && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {project.unidadeCurricular.descricao}
                    </p>
                  )}
                  {project.unidadeCurricular.cargaHoraria && (
                    <div className="flex items-center gap-1 mt-2">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {project.unidadeCurricular.cargaHoraria}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Líder do Projeto */}
              {project.liderProjeto && (
                <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    <h4 className="font-bold text-gray-900 dark:text-white">Líder do Projeto</h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
                    {project.liderProjeto.nome}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {project.liderProjeto.email}
                  </p>
                  {project.liderProjeto.matricula && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Matrícula: {project.liderProjeto.matricula}
                    </p>
                  )}
                </div>
              )}

              {/* Visibilidade */}
              <div className="grid grid-cols-2 gap-3">
                {project.codigo && project.visibilidadeCodigo && (
                  <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">Código</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.visibilidadeCodigo === 'publico' ? (
                        <Globe className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-gray-600" />
                      )}
                      <span className="text-xs text-gray-700 dark:text-gray-300 capitalize">
                        {project.visibilidadeCodigo}
                      </span>
                    </div>
                  </div>
                )}

                {project.visibilidadeAnexos && (
                  <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">Anexos</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.visibilidadeAnexos === 'publico' ? (
                        <Globe className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-gray-600" />
                      )}
                      <span className="text-xs text-gray-700 dark:text-gray-300 capitalize">
                        {project.visibilidadeAnexos}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline */}
              {(project.criadoEm || project.atualizadoEm) && (
                <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">Timeline</h4>
                  </div>
                  <div className="space-y-2">
                    {project.criadoEm && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Criado em:</span>
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                          {formatDate(project.criadoEm)}
                        </span>
                      </div>
                    )}
                    {project.atualizadoEm && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Atualizado em:</span>
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                          {formatDate(project.atualizadoEm)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Etapas da Fase Atual */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <PhaseIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    Etapas - {currentPhase.name}
                  </h3>
                  {!isGuest && mode === 'view' && onAddStage && (
                    <button
                      onClick={() => onAddStage(activePhase)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Etapa
                    </button>
                  )}
                </div>

                {currentPhase.stages.length > 0 ? (
                  <div className="space-y-3">
                    {currentPhase.stages.map((stage, index) => (
                      <div
                        key={stage.id}
                        className="p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                Etapa {index + 1}
                              </span>
                              {stage.status && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  stage.status === 'concluida' 
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                }`}>
                                  {stage.status}
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                              {stage.nome}
                            </h4>
                            {stage.descricao && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {stage.descricao}
                              </p>
                            )}
                          </div>
                        </div>

                        {(stage.dataInicio || stage.dataFim) && (
                          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mt-3">
                            {stage.dataInicio && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Início: {formatDate(stage.dataInicio)}</span>
                              </div>
                            )}
                            {stage.dataFim && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Fim: {formatDate(stage.dataFim)}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Anexos da Etapa */}
                        {stage.anexos && stage.anexos.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-2">
                              <Paperclip className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Anexos ({stage.anexos.length})
                              </span>
                            </div>
                            
                            {isGuest && project.visibilidadeAnexos === 'privado' ? (
                              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                <div className="flex-1">
                                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                                    Anexos Restritos
                                  </p>
                                  <p className="text-xs text-amber-700 dark:text-amber-400">
                                    Faça login para visualizar os anexos deste projeto
                                  </p>
                                </div>
                                <button className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors">
                                  <LogIn className="w-3.5 h-3.5" />
                                  Login
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {stage.anexos.map((anexo) => (
                                  <a
                                    key={anexo.id}
                                    href={anexo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                                  >
                                    <FileIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="flex-1 text-xs text-gray-700 dark:text-gray-300 truncate">
                                      {anexo.nome}
                                    </span>
                                    <Download className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                    <PhaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 font-semibold mb-1">
                      Nenhuma etapa cadastrada
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Este projeto ainda não possui etapas na fase de {currentPhase.name}
                    </p>
                    {!isGuest && onAddStage && (
                      <button
                        onClick={() => onAddStage(activePhase)}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar Primeira Etapa
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer com Ações */}
          {!isGuest && mode === 'view' && onEdit && (
            <div className="sticky bottom-0 p-6 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900 dark:to-transparent border-t-2 border-gray-200 dark:border-gray-700">
              <div className="flex gap-3">
                <button
                  onClick={onEdit}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Edit className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Editar Projeto</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold transition-all duration-300"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}

          {/* Footer Guest */}
          {isGuest && (
            <div className="sticky bottom-0 p-6 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900 dark:to-transparent border-t-2 border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Gostou deste projeto? Faça login para interagir e ver mais detalhes!
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => window.location.href = '/login'}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Fazer Login</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold transition-all duration-300"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default UnifiedProjectModal
