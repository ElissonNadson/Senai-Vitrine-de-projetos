import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Circle,
  Lightbulb,
  Wrench,
  Code,
  Rocket,
  AlertCircle,
  Info,
  Save,
  Loader2,
  Paperclip
} from 'lucide-react'
import { useEtapasProjeto } from '../../../../../hooks/use-etapas-projeto'
import type { CreateEtapaProjetoMutation } from '../../../../../types/types-mutations'
import StageAttachmentsManager from './StageAttachmentsManager'

interface TimelineProgressStepProps {
  formData: any
  updateFormData: (updates: any) => void
  errors: Record<string, string>
}

interface StageAttachment {
  id: string
  optionId: string
  type: 'file' | 'link'
  file?: File
  link?: string
  name: string
}

interface TimelineStep {
  id: string
  uuid?: string // UUID do backend (quando já salvo)
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  ordem: number
  isSaved?: boolean // Indica se já foi salvo no backend
  image?: File | null
  imagePreview?: string
  attachments?: StageAttachment[] // Arquivos/links anexados
}

const defaultSteps = [
  { icon: Lightbulb, title: 'Ideação', placeholder: 'Descreva como surgiu a ideia e o planejamento inicial...' },
  { icon: Wrench, title: 'Modelagem', placeholder: 'Explique a modelagem do negócio e análise de viabilidade...' },
  { icon: Code, title: 'Prototipagem', placeholder: 'Conte sobre os protótipos e testes realizados...' },
  { icon: Rocket, title: 'Implementação', placeholder: 'Descreva a implementação e resultados obtidos...' }
]

// Mapeia status do componente para status do backend
const mapStatusToBackend = (status: 'pending' | 'in-progress' | 'completed'): string => {
  switch (status) {
    case 'pending': return 'PENDENTE'
    case 'in-progress': return 'EM_ANDAMENTO'
    case 'completed': return 'CONCLUIDA'
    default: return 'PENDENTE'
  }
}

// Mapeia status do backend para status do componente
const mapStatusFromBackend = (status: string): 'pending' | 'in-progress' | 'completed' => {
  switch (status) {
    case 'PENDENTE': return 'pending'
    case 'EM_ANDAMENTO': return 'in-progress'
    case 'CONCLUIDA': return 'completed'
    default: return 'pending'
  }
}

const TimelineProgressStep: React.FC<TimelineProgressStepProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [customSteps, setCustomSteps] = useState<TimelineStep[]>(
    formData.timelineSteps || defaultSteps.map((step, index) => ({
      id: String(index + 1),
      title: step.title,
      description: '',
      status: 'pending' as const,
      ordem: index + 1,
      isSaved: false,
      attachments: []
    }))
  )
  const [savingSteps, setSavingSteps] = useState<Set<string>>(new Set())
  const [attachmentErrors, setAttachmentErrors] = useState<Record<number, string>>({})
  
  const { 
    createEtapa, 
    updateEtapa, 
    deleteEtapa,
    updateEtapaStatus,
    loading: apiLoading,
    error: apiError 
  } = useEtapasProjeto()

  // Atualiza formData sempre que customSteps mudar
  useEffect(() => {
    updateFormData({ timelineSteps: customSteps })
  }, [customSteps])

  // Validation function to check if at least one attachment exists per stage
  const validateAttachments = (): boolean => {
    const errors: Record<number, string> = {}
    let isValid = true

    customSteps.forEach((step, index) => {
      // Only validate steps that have the standard stage names AND have content
      const isStandardStage = ['Ideação', 'Modelagem', 'Prototipagem', 'Implementação'].includes(step.title)
      const hasContent = step.title && step.description // Step has been filled in
      
      if (isStandardStage && hasContent && (!step.attachments || step.attachments.length === 0)) {
        errors[index] = 'Adicione pelo menos um arquivo ou link para esta etapa'
        isValid = false
      }
    })

    setAttachmentErrors(errors)
    return isValid
  }

  // Expose validation function through formData
  useEffect(() => {
    updateFormData({ 
      timelineSteps: customSteps,
      validateTimelineAttachments: validateAttachments
    })
  }, [customSteps])

  const handleStepChange = (index: number, field: string, value: any) => {
    const updated = [...customSteps]
    updated[index] = { ...updated[index], [field]: value, isSaved: false }
    setCustomSteps(updated)
  }

  const addCustomStep = () => {
    const newStep: TimelineStep = {
      id: String(Date.now()),
      title: '',
      description: '',
      status: 'pending',
      ordem: customSteps.length + 1,
      isSaved: false,
      attachments: []
    }
    const updated = [...customSteps, newStep]
    setCustomSteps(updated)
    setEditingIndex(updated.length - 1)
  }

  const removeStep = async (index: number) => {
    if (customSteps.length <= 1) return // Manter pelo menos uma etapa
    
    const step = customSteps[index]
    
    // Se a etapa já foi salva no backend, deletar lá também
    if (step.uuid && step.isSaved) {
      try {
        await deleteEtapa(step.uuid)
      } catch (error) {
        console.error('Erro ao deletar etapa do backend:', error)
        // Continua removendo localmente mesmo se falhar no backend
      }
    }
    
    const updated = customSteps.filter((_, i) => i !== index)
    // Reordena as etapas restantes
    const reordered = updated.map((step, idx) => ({ ...step, ordem: idx + 1 }))
    setCustomSteps(reordered)
  }

  const toggleStatus = async (index: number) => {
    const step = customSteps[index]
    const current = step.status
    const nextStatus = current === 'pending' ? 'in-progress' : current === 'in-progress' ? 'completed' : 'pending'
    
    // Se a etapa já foi salva no backend, atualiza o status lá também
    if (step.uuid && step.isSaved && formData.projetoUuid) {
      try {
        setSavingSteps(prev => new Set(prev).add(step.id))
        await updateEtapaStatus(step.uuid, mapStatusToBackend(nextStatus))
      } catch (error) {
        console.error('Erro ao atualizar status no backend:', error)
      } finally {
        setSavingSteps(prev => {
          const newSet = new Set(prev)
          newSet.delete(step.id)
          return newSet
        })
      }
    }
    
    handleStepChange(index, 'status', nextStatus)
  }

  // Função para salvar uma etapa no backend
  const saveStepToBackend = async (step: TimelineStep, projetoUuid: string) => {
    if (!step.title || !step.description) return // Só salva se tiver título e descrição
    
    const etapaData: CreateEtapaProjetoMutation = {
      projeto: { uuid: projetoUuid },
      nomeEtapa: step.title,
      descricao: step.description,
      ordem: step.ordem,
      status: mapStatusToBackend(step.status),
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    }

    try {
      setSavingSteps(prev => new Set(prev).add(step.id))
      
      if (step.uuid && step.isSaved) {
        // Atualizar etapa existente
        const updated = await updateEtapa(step.uuid, etapaData)
        return { ...step, uuid: updated.uuid, isSaved: true }
      } else {
        // Criar nova etapa
        const created = await createEtapa(etapaData)
        return { ...step, uuid: created.uuid, isSaved: true }
      }
    } catch (error) {
      console.error('Erro ao salvar etapa:', error)
      throw error
    } finally {
      setSavingSteps(prev => {
        const newSet = new Set(prev)
        newSet.delete(step.id)
        return newSet
      })
    }
  }

  // Expõe função para salvar todas as etapas (será chamada ao publicar o projeto)
  useEffect(() => {
    if (formData.projetoUuid) {
      // Salva automaticamente quando tem UUID do projeto
      const saveAllSteps = async () => {
        const updatedSteps = [...customSteps]
        for (let i = 0; i < updatedSteps.length; i++) {
          const step = updatedSteps[i]
          if (step.title && step.description && !step.isSaved) {
            try {
              const saved = await saveStepToBackend(step, formData.projetoUuid)
              if (saved) {
                updatedSteps[i] = saved
              }
            } catch (error) {
              console.error(`Erro ao salvar etapa ${i + 1}:`, error)
            }
          }
        }
        setCustomSteps(updatedSteps)
      }
      
      // Só salva se alguma etapa não foi salva ainda
      const hasUnsaved = customSteps.some(s => !s.isSaved && s.title && s.description)
      if (hasUnsaved) {
        saveAllSteps()
      }
    }
  }, [formData.projetoUuid])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'from-green-500 to-emerald-600'
      case 'in-progress': return 'from-yellow-500 to-orange-600'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5" strokeWidth={3} />
      case 'in-progress': return <TrendingUp className="w-5 h-5" />
      default: return <Circle className="w-5 h-5" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída'
      case 'in-progress': return 'Em Andamento'
      default: return 'Não Iniciada'
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-3xl p-8 md:p-12 shadow-lg border-2 border-indigo-200 dark:border-indigo-800"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.div 
              className="p-4 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <TrendingUp className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Timeline do Projeto 📊
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Documente as etapas do desenvolvimento - você pode atualizar depois!
              </p>
            </div>
          </div>
          
          <motion.button
            onClick={addCustomStep}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden sm:flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Nova Etapa
          </motion.button>
        </div>

        {/* Informação sobre atualização */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-700 rounded-2xl p-6"
        >
          <div className="flex gap-4">
            <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-base font-bold text-blue-900 dark:text-blue-100 mb-2">
                💡 Como funciona a Timeline
              </p>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2 leading-relaxed">
                <li>• <strong>Comece simples:</strong> Adicione apenas a etapa atual (ex: Ideação)</li>
                <li>• <strong>Anexe evidências:</strong> Adicione pelo menos 1 arquivo ou link para cada etapa</li>
                <li>• <strong>Atualize conforme avança:</strong> Volte aqui quando completar uma fase</li>
                <li>• <strong>Marque o status:</strong> Clique no badge de status para atualizar o progresso</li>
                <li>• <strong>Mostre evolução:</strong> Visitantes verão como seu projeto se desenvolveu</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Timeline Steps */}
      <div className="space-y-4">
        <AnimatePresence>
          {customSteps.map((step, index) => {
            const StepIcon = defaultSteps[index]?.icon || Code
            const isEditing = editingIndex === index

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Header da Etapa */}
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
                  <div className="flex items-center gap-4">
                    {/* Ícone e Número */}
                    <div className="flex items-center gap-3">
                      <div className={`p-3 bg-gradient-to-br ${getStatusColor(step.status)} rounded-xl shadow-lg text-white`}>
                        <StepIcon className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />
                      </div>
                    </div>

                    {/* Título */}
                    <div className="flex-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={step.title}
                          onChange={e => handleStepChange(index, 'title', e.target.value)}
                          placeholder="Nome da etapa..."
                          className="w-full text-xl font-bold bg-transparent border-b-2 border-primary focus:outline-none text-gray-900 dark:text-white pb-1"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {step.title || 'Etapa sem título'}
                          </h3>
                          {step.attachments && step.attachments.length > 0 && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-medium">
                              <Paperclip className="w-3 h-3" />
                              {step.attachments.length}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <motion.button
                      onClick={() => toggleStatus(index)}
                      disabled={savingSteps.has(step.id)}
                      whileHover={{ scale: savingSteps.has(step.id) ? 1 : 1.05 }}
                      whileTap={{ scale: savingSteps.has(step.id) ? 1 : 0.95 }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getStatusColor(step.status)} text-white font-medium shadow-lg transition-all hover:shadow-xl ${savingSteps.has(step.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {savingSteps.has(step.id) ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        getStatusIcon(step.status)
                      )}
                      <span className="text-sm">{getStatusLabel(step.status)}</span>
                    </motion.button>

                    {/* Indicador de Salvamento */}
                    {step.isSaved && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium"
                        title="Salvo no servidor"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span className="hidden md:inline">Salvo</span>
                      </motion.div>
                    )}

                    {/* Ações */}
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => setEditingIndex(isEditing ? null : index)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title={isEditing ? 'Salvar' : 'Editar'}
                      >
                        {isEditing ? <CheckCircle className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                      </motion.button>
                      {customSteps.length > 1 && (
                        <motion.button
                          onClick={() => removeStep(index)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Remover etapa"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Conteúdo da Etapa */}
                <div className="p-6 space-y-6">
                  <div>
                    <textarea
                      value={step.description}
                      onChange={e => handleStepChange(index, 'description', e.target.value)}
                      placeholder={defaultSteps[index]?.placeholder || 'Descreva o que foi feito nesta etapa...'}
                      rows={4}
                      className="w-full bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-base text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                    {step.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {step.description.length} caracteres
                      </p>
                    )}
                  </div>

                  {/* Attachments Section */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <StageAttachmentsManager
                      stageType={step.title as 'Ideação' | 'Modelagem' | 'Prototipagem' | 'Implementação'}
                      attachments={step.attachments || []}
                      onChange={(attachments) => {
                        handleStepChange(index, 'attachments', attachments)
                        // Clear error when attachments are added
                        if (attachments.length > 0 && attachmentErrors[index]) {
                          setAttachmentErrors(prev => {
                            const newErrors = { ...prev }
                            delete newErrors[index]
                            return newErrors
                          })
                        }
                      }}
                      error={attachmentErrors[index]}
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Botão Adicionar Etapa (Mobile) */}
      <motion.button
        onClick={addCustomStep}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="sm:hidden w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
      >
        <Plus className="w-6 h-6" />
        Adicionar Nova Etapa
      </motion.button>

      {/* Dica Final */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-6"
      >
        <div className="flex gap-4">
          <Rocket className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
          <div>
            <p className="text-base font-bold text-purple-900 dark:text-purple-100 mb-2">
              📎 Importante sobre Anexos
            </p>
            <p className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed">
              Cada etapa preenchida deve ter <strong>pelo menos um arquivo ou link anexado</strong>. 
              Escolha entre as opções disponíveis (ex: Crazy 8, Mockups, Vídeo Pitch, etc.). 
              Não precisa anexar todos os tipos - apenas um já é suficiente! 
              Isso comprova o trabalho realizado em cada fase do projeto.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Erro da API */}
      {apiError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-2xl p-6"
        >
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-base font-bold text-red-900 dark:text-red-100 mb-2">
                ⚠️ Erro ao salvar etapa
              </p>
              <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed">
                {apiError}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {errors.timeline && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2 font-medium bg-red-50 dark:bg-red-900/20 p-4 rounded-xl"
        >
          <AlertCircle className="w-5 h-5" />
          {errors.timeline}
        </motion.p>
      )}

    </div>
  )
}

export default TimelineProgressStep
