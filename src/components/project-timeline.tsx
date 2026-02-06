import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lightbulb,
  FileText,
  Wrench,
  Rocket,
  Calendar,
  Paperclip,
  Download,
  FileIcon,
  ChevronDown,
  ChevronUp,
  Lock,
  CheckCircle2,
  Circle,
  Clock,
  FileText as FileTextIcon,
  AlignLeft,
  Eye
} from 'lucide-react'

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

interface Phase {
  id: number
  name: string
  description?: string  // Descrição geral da fase
  icon: any
  gradient: string
  badge: string
  stages: ProjectStage[]
}

interface ProjectTimelineProps {
  phases: Phase[]
  currentPhaseId: number
  onPhaseClick?: (phaseId: number) => void
  isGuest?: boolean
  visibilidadeAnexos?: 'publico' | 'privado'
  onLoginClick?: () => void
  allowDownload?: boolean
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  phases,
  currentPhaseId,
  onPhaseClick,
  isGuest = false,
  visibilidadeAnexos = 'publico',
  onLoginClick,
  allowDownload = true
}) => {
  const [expandedPhases, setExpandedPhases] = useState<number[]>([currentPhaseId])

  const togglePhase = (phaseId: number) => {
    if (phaseId > currentPhaseId) return // Não permite expandir fases bloqueadas

    setExpandedPhases(prev =>
      prev.includes(phaseId)
        ? prev.filter(id => id !== phaseId)
        : [...prev, phaseId]
    )
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="relative pb-8">
      {/* Linha vertical principal */}
      <div className="absolute left-6 top-0 w-1 rounded-full overflow-hidden" style={{ height: 'calc(100% - 6rem)' }}>
        {/* Gradiente de cores seguindo as fases */}
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-400 via-blue-500 to-purple-500" style={{ height: '75%' }}></div>
        <div className="absolute bottom-0 w-full bg-gradient-to-b from-purple-500 to-green-500" style={{ height: '25%' }}></div>
      </div>

      {/* Fases */}
      <div className="space-y-6">
        {phases.map((phase, phaseIndex) => {
          const Icon = phase.icon
          const isExpanded = expandedPhases.includes(phase.id)
          const isLocked = phase.id > currentPhaseId
          const isCurrent = phase.id === currentPhaseId
          const isCompleted = phase.id < currentPhaseId

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: phaseIndex * 0.1 }}
              className="relative"
            >
              {/* Ícone da Fase */}
              <div className="relative z-10 flex items-start gap-4">
                <div
                  className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isLocked
                    ? 'bg-gray-300 dark:bg-gray-700'
                    : isCompleted
                      ? 'bg-green-500'
                      : phase.id === 1
                        ? 'bg-gradient-to-br from-yellow-400 to-amber-500 ring-4 ring-white dark:ring-gray-900 shadow-xl' + (isCurrent ? ' scale-110' : '')
                        : phase.id === 2
                          ? 'bg-gradient-to-br from-blue-500 to-indigo-600 ring-4 ring-white dark:ring-gray-900 shadow-xl' + (isCurrent ? ' scale-110' : '')
                          : phase.id === 3
                            ? 'bg-gradient-to-br from-purple-500 to-pink-600 ring-4 ring-white dark:ring-gray-900 shadow-xl' + (isCurrent ? ' scale-110' : '')
                            : phase.id === 4
                              ? 'bg-gradient-to-br from-green-500 to-emerald-600 ring-4 ring-white dark:ring-gray-900 shadow-xl' + (isCurrent ? ' scale-110' : '')
                              : `bg-gradient-to-br ${phase.gradient} ring-4 ring-white dark:ring-gray-900 shadow-xl` + (isCurrent ? ' scale-110' : '')
                    }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : isLocked ? (
                    <Lock className="w-6 h-6 text-gray-500" />
                  ) : (
                    <Icon className="w-6 h-6 text-white" />
                  )}

                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-blue-600"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Conteúdo da Fase */}
                <div className="flex-1 pb-6">
                  <button
                    onClick={() => togglePhase(phase.id)}
                    disabled={isLocked}
                    className={`w-full text-left transition-all duration-300 ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                      }`}
                  >
                    <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${isLocked
                      ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
                      : phase.id === 1
                        ? 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-400 dark:border-yellow-600 shadow-lg'
                        : phase.id === 2
                          ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-400 dark:border-blue-600 shadow-lg'
                          : phase.id === 3
                            ? 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-400 dark:border-purple-600 shadow-lg'
                            : phase.id === 4
                              ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-400 dark:border-green-600 shadow-lg'
                              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                      }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className={`text-lg font-bold ${isLocked
                              ? 'text-gray-500 dark:text-gray-600'
                              : 'text-gray-900 dark:text-white'
                              }`}>
                              {phase.name}
                            </h3>

                            {/* Badge de Status */}
                            {isCurrent && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                                <Clock className="w-3 h-3" />
                                Em Andamento
                              </span>
                            )}
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full">
                                <CheckCircle2 className="w-3 h-3" />
                                Concluída
                              </span>
                            )}
                            {isLocked && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-semibold rounded-full">
                                <Lock className="w-3 h-3" />
                                Bloqueada
                              </span>
                            )}
                          </div>

                          <p className={`text-sm ${isLocked
                            ? 'text-gray-400 dark:text-gray-600'
                            : 'text-gray-600 dark:text-gray-400'
                            }`}>
                            {phase.stages.length} {phase.stages.length === 1 ? 'anexo' : 'anexos'}
                          </p>
                        </div>

                        {!isLocked && (
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Etapas da Fase */}
                  <AnimatePresence>
                    {isExpanded && !isLocked && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 space-y-4 overflow-hidden"
                      >


                        {/* Documentos e Evidências */}
                        {phase.stages.length > 0 && (
                          <div className="ml-4">
                            <div className="flex items-center gap-2 mb-3 px-2">
                              <Paperclip className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                Documentos e Evidências da {phase.name}
                              </h4>
                            </div>
                          </div>
                        )}

                        {phase.stages.length > 0 ? (
                          phase.stages.map((stage, stageIndex) => (
                            <motion.div
                              key={stage.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: stageIndex * 0.05 }}
                              className="ml-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                    {stageIndex + 1}
                                  </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-base text-gray-900 dark:text-white mb-3">
                                    {stage.nome}
                                  </h4>

                                  {/* Datas */}
                                  {(stage.dataInicio || stage.dataFim) && (
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-500 mb-3">
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

                                  {/* Anexos */}
                                  {stage.anexos && stage.anexos.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Paperclip className="w-4 h-4 text-gray-500" />
                                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                          {stage.anexos.length} {stage.anexos.length === 1 ? 'anexo' : 'anexos'}
                                        </span>
                                      </div>

                                      {isGuest || !allowDownload ? (
                                        <div className="space-y-1">
                                          {stage.anexos.slice(0, 3).map((anexo) => (
                                            <div
                                              key={anexo.id}
                                              className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 opacity-75 cursor-not-allowed group"
                                              title={isGuest ? "Faça login para visualizar" : "Apenas visualização"}
                                            >
                                              <FileIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                              <span className="flex-1 text-gray-600 dark:text-gray-400 truncate text-xs">
                                                {anexo.nome}
                                              </span>
                                              {isGuest ? (
                                                <Lock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                                              ) : (
                                                <Eye className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                                              )}
                                            </div>
                                          ))}
                                          {stage.anexos.length > 3 && (
                                            <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-1">
                                              +{stage.anexos.length - 3} arquivos
                                            </p>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="space-y-1">
                                          {stage.anexos.slice(0, 3).map((anexo) => (
                                            <a
                                              key={anexo.id}
                                              href={anexo.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded border border-gray-200 dark:border-gray-700 transition-colors group text-xs"
                                            >
                                              <FileIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                              <span className="flex-1 text-gray-700 dark:text-gray-300 truncate">
                                                {anexo.nome}
                                              </span>
                                              <Download className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                                            </a>
                                          ))}
                                          {stage.anexos.length > 3 && (
                                            <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-1">
                                              +{stage.anexos.length - 3} mais
                                            </p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="ml-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                              Nenhuma etapa cadastrada
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default ProjectTimeline 