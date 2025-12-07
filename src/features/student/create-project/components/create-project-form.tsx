import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, CheckCircle, ChevronRight, ChevronLeft, Lightbulb, GraduationCap, Users, FileText, Shield, Check } from 'lucide-react'
import AcademicInfoSection from './sections/AcademicInfoSection'
import ProjectDetailsSection from './sections/ProjectDetailsSection'
import TeamSection from './sections/TeamSection'
import AttachmentsSection from './sections/AttachmentsSection'
import CodeSection from './sections/CodeSection'
import ValidationModal from '@/components/ui/ValidationModal'

interface Attachment {
  id: string
  file: File
  type: string
}

interface PhaseData {
  descricao: string
  anexos: Attachment[]
}

interface ProjectFormData {
  curso: string
  turma: string
  itinerario: string
  unidadeCurricular: string
  senaiLab: string
  sagaSenai: string
  titulo: string
  descricao: string
  categoria: string
  modalidade: string
  autores: string[]
  orientador: string
  liderEmail: string
  isLeader: boolean
  banner?: File | null
  ideacao: PhaseData
  modelagem: PhaseData
  prototipagem: PhaseData
  implementacao: PhaseData
  hasRepositorio: boolean
  tipoRepositorio: 'arquivo' | 'link'
  codigo?: File | null
  linkRepositorio: string
  codigoVisibilidade: string
  anexosVisibilidade: string
  aceitouTermos: boolean
}

interface CreateProjectFormProps {
  data: ProjectFormData
  updateData: (update: Partial<ProjectFormData>) => void
  onGoToReview: () => void
  lastSavedAt?: Date | null
  isAutoSaving?: boolean
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
  data,
  updateData,
  onGoToReview,
  lastSavedAt,
  isAutoSaving
}) => {
  const [showSaveIndicator, setShowSaveIndicator] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [validationModal, setValidationModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    type: 'error' | 'warning' | 'info'
  }>({ isOpen: false, title: '', message: '', type: 'error' })
  const totalSteps = 5

  const MIN_DESCRIPTION_CHARS = 50

  // Definição das etapas
  const steps = [
    {
      number: 1,
      title: 'Detalhes do Projeto',
      icon: Lightbulb,
      color: 'from-yellow-400 to-orange-500',
      description: 'Informações básicas'
    },
    {
      number: 2,
      title: 'Informações Acadêmicas',
      icon: GraduationCap,
      color: 'from-blue-500 to-indigo-600',
      description: 'Curso e turma'
    },
    {
      number: 3,
      title: 'Equipe',
      icon: Users,
      color: 'from-emerald-500 to-green-600',
      description: 'Autores e orientador'
    },
    {
      number: 4,
      title: 'Fases do Projeto',
      icon: FileText,
      color: 'from-purple-500 to-pink-600',
      description: 'Ideação, modelagem...'
    },
    {
      number: 5,
      title: 'Privacidade',
      icon: Shield,
      color: 'from-red-500 to-rose-600',
      description: 'Repositório e termos'
    }
  ]

  const handleInputChange = (field: string, value: string | boolean | string[] | File | null) => {
    updateData({ [field]: value as any })
    // Mostrar indicador de salvamento
    setShowSaveIndicator(true)
    setTimeout(() => setShowSaveIndicator(false), 2000)
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      // Scroll para o topo após a transição
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      }, 50)
    }
  }

  const goToStep = (step: number) => {
    setCurrentStep(step)
    // Scroll para o topo após a transição
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }, 50)
  }

  // Validação básica por etapa
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(data.titulo && data.descricao && data.categoria)
      case 2:
        return !!(data.curso && data.turma && data.modalidade)
      case 3:
        return !!(data.autores.length > 0 && data.orientador)
      case 4:
        // Validar caracteres mínimos nas descrições das fases
        return true // Validação mais detalhada é feita no goToNextStep
      case 5:
        return !data.hasRepositorio || data.aceitouTermos
      default:
        return true
    }
  }

  // Validar fases do projeto (step 4)
  const validatePhases = (): { valid: boolean; message?: string } => {
    const phases = [
      { name: 'Ideação', data: data.ideacao },
      { name: 'Modelagem', data: data.modelagem },
      { name: 'Prototipagem', data: data.prototipagem },
      { name: 'Implementação', data: data.implementacao }
    ]

    for (const phase of phases) {
      if (phase.data.descricao && phase.data.descricao.length > 0 && phase.data.descricao.length < MIN_DESCRIPTION_CHARS) {
        return {
          valid: false,
          message: `A descrição da fase "${phase.name}" deve ter pelo menos ${MIN_DESCRIPTION_CHARS} caracteres. Atualmente tem ${phase.data.descricao.length} caracteres.`
        }
      }
    }

    return { valid: true }
  }

  const goToNextStep = () => {
    // Validação especial para step 4 (Fases do Projeto)
    if (currentStep === 4) {
      const validation = validatePhases()
      if (!validation.valid) {
        setValidationModal({
          isOpen: true,
          title: 'Descrição Insuficiente',
          message: validation.message || 'A descrição deve ter pelo menos 50 caracteres.',
          type: 'warning'
        })
        return
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      // Scroll para o topo após a transição
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      }, 50)
    }
  }

  const canProceed = isStepValid(currentStep)

  // Verificar se há rascunho salvo
  useEffect(() => {
    const hasDraft = localStorage.getItem('project_draft')
    if (hasDraft) {
      console.log('Rascunho detectado no localStorage')
    }
  }, [])

  return (
    <>
    {/* Modal de Validação */}
    <ValidationModal
      isOpen={validationModal.isOpen}
      onClose={() => setValidationModal(prev => ({ ...prev, isOpen: false }))}
      title={validationModal.title}
      message={validationModal.message}
      type={validationModal.type}
    />

    <div className="space-y-6">
      {/* Header with Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Criar Novo Projeto
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Etapa {currentStep} de {totalSteps}: {steps[currentStep - 1].description}
            </p>
          </div>
          
          {/* Indicador de Salvamento Automático na API */}
          <div className="flex items-center gap-2">
            {isAutoSaving && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <Save className="w-4 h-4 animate-pulse" />
                <span className="text-sm font-medium">Salvando...</span>
              </motion.div>
            )}
            
            {!isAutoSaving && lastSavedAt && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Salvo às {lastSavedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </motion.div>
            )}
            
            {/* Indicador de Salvamento Local */}
            {showSaveIndicator && !lastSavedAt && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Salvo</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Progresso
            </span>
            <span className="text-xs font-medium text-gray-900 dark:text-white">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="grid grid-cols-5 gap-2">
          {steps.map((step) => {
            const Icon = step.icon
            const isCompleted = currentStep > step.number
            const isCurrent = currentStep === step.number
            const isValid = isStepValid(step.number)
            
            return (
              <button
                key={step.number}
                onClick={() => goToStep(step.number)}
                className={`relative p-3 rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-br ' + step.color + ' text-white shadow-lg scale-105'
                    : isCompleted
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-2 border-green-500'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                  <span className="text-xs font-medium text-center hidden md:block">
                    {step.title}
                  </span>
                  <span className="text-xs font-medium text-center md:hidden">
                    {step.number}
                  </span>
                </div>
                
                {/* Validation indicator */}
                {!isCurrent && !isCompleted && (
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                    isValid ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Step Content with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <ProjectDetailsSection
              data={{
                titulo: data.titulo,
                descricao: data.descricao,
                categoria: data.categoria,
                banner: data.banner
              }}
              onUpdate={handleInputChange}
            />
          )}

          {currentStep === 2 && (
            <AcademicInfoSection
              data={{
                curso: data.curso,
                turma: data.turma,
                modalidade: data.modalidade,
                itinerario: data.itinerario,
                unidadeCurricular: data.unidadeCurricular,
                senaiLab: data.senaiLab,
                sagaSenai: data.sagaSenai
              }}
              onUpdate={handleInputChange}
            />
          )}

          {currentStep === 3 && (
            <TeamSection
              data={{
                autores: data.autores,
                orientador: data.orientador,
                liderEmail: data.liderEmail,
                isLeader: data.isLeader
              }}
              onUpdate={handleInputChange}
            />
          )}

          {currentStep === 4 && (
            <AttachmentsSection
              data={{
                banner: data.banner,
                ideacao: data.ideacao,
                modelagem: data.modelagem,
                prototipagem: data.prototipagem,
                implementacao: data.implementacao
              }}
              onUpdate={(field, value) => updateData({ [field]: value })}
            />
          )}

          {currentStep === 5 && (
            <CodeSection
              data={{
                hasRepositorio: data.hasRepositorio,
                tipoRepositorio: data.tipoRepositorio,
                codigo: data.codigo,
                linkRepositorio: data.linkRepositorio,
                codigoVisibilidade: data.codigoVisibilidade,
                anexosVisibilidade: data.anexosVisibilidade,
                aceitouTermos: data.aceitouTermos
              }}
              onUpdate={(field, value) => updateData({ [field]: value })}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
              currentStep === 1
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </button>

          <div className="flex items-center gap-3">
            {!canProceed && currentStep < totalSteps && (
              <span className="text-sm text-amber-600 dark:text-amber-400">
                Complete os campos obrigatórios
              </span>
            )}
            
            {currentStep < totalSteps ? (
              <button
                onClick={goToNextStep}
                disabled={!canProceed}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                  canProceed
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                Próxima Etapa
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onGoToReview}
                disabled={!canProceed}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                  canProceed
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Ir para Revisão
              </button>
            )}
          </div>
        </div>

        {/* Step Info */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {steps[currentStep - 1].title}
            </span>
            <span className="text-gray-500 dark:text-gray-500">
              {currentStep} / {totalSteps}
            </span>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default CreateProjectForm
