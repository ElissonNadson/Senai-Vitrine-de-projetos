import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, CheckCircle, ChevronRight, ChevronLeft, Lightbulb, GraduationCap, Users, FileText, Shield, Check, AlertTriangle, X } from 'lucide-react'
import AcademicInfoSection from './sections/AcademicInfoSection'
import ProjectDetailsSection from './sections/ProjectDetailsSection'
import TeamSection from './sections/TeamSection'
import AttachmentsSection from './sections/AttachmentsSection'
import CodeSection from './sections/CodeSection'
import { Link } from 'react-router-dom'

import PanelSteps from './PanelSteps'
import { useAuth } from '@/contexts/auth-context'

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
  participouEdital: string
  ganhouPremio: string
  titulo: string
  descricao: string
  categoria: string
  modalidade: string
  autores: string[]
  autoresMetadata?: Record<string, any>
  orientador: string
  orientadoresMetadata?: Record<string, any>
  liderEmail: string
  isLeader: boolean
  banner?: File | null
  ideacao: PhaseData
  modelagem: PhaseData
  prototipagem: PhaseData
  implementacao: PhaseData
  hasRepositorio: boolean
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
  isStudent?: boolean
  isEditMode?: boolean
  onStepChange?: (step: number) => void
  targetStep?: number
  projetoUuid?: string | null
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
  data,
  updateData,
  onGoToReview,
  lastSavedAt,
  isAutoSaving,
  isStudent = false,
  isEditMode = false,
  onStepChange,
  targetStep,
  projetoUuid
}) => {
  const [showSaveIndicator, setShowSaveIndicator] = useState(false)
  const [currentStep, setCurrentStep] = useState(targetStep || 1)
  const totalSteps = 5
  const prevTargetStepRef = useRef<number | undefined>(targetStep)

  // Sincronizar com targetStep quando mudar (componente re-montado com novo key)
  useEffect(() => {
    if (targetStep !== undefined && targetStep !== prevTargetStepRef.current) {
      setCurrentStep(targetStep)
      prevTargetStepRef.current = targetStep
    }
  }, [targetStep])

  // Notificar mudanças de passo para o componente pai
  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep)
    }
  }, [currentStep, onStepChange])

  const { user } = useAuth()
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
    console.log(`[CreateProjectForm] Field updated: ${field}`, value)
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
        const mainContent = document.getElementById('main-content')
        if (mainContent) {
          mainContent.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }, 50)
    }
  }

  const goToStep = (step: number) => {
    console.log(`Navegando para etapa: ${steps[step - 1].title}`)
    setCurrentStep(step)
    // Scroll para o topo após a transição
    setTimeout(() => {
      const mainContent = document.getElementById('main-content')
      if (mainContent) {
        mainContent.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 50)
  }

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [validationModal, setValidationModal] = useState<{ open: boolean; errors: string[] }>({ open: false, errors: [] })

  // Validação por etapa
  const validateStep = (step: number): Record<string, string> => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1: // Detalhes
        if (!data.titulo.trim()) newErrors.titulo = 'O título do projeto é obrigatório.'
        else if (data.titulo.length < 10) newErrors.titulo = 'O título deve ter pelo menos 10 caracteres.'

        if (!data.descricao.trim()) newErrors.descricao = 'A descrição do projeto é obrigatória.'
        else if (data.descricao.length < 50) newErrors.descricao = 'A descrição deve ter pelo menos 50 caracteres.'

        if (!data.categoria) newErrors.categoria = 'Selecione uma categoria para o projeto.'

        if (!data.banner) newErrors.banner = 'O banner do projeto é obrigatório.'
        break

      case 2: // Acadêmico
        // Validar apenas se não estiver carregando (embora o usuário não deva conseguir avançar se estiver carregando)
        if (!data.curso) newErrors.curso = 'Selecione o seu curso.'
        if (!data.turma) newErrors.turma = 'Selecione a sua turma.'
        if (!data.modalidade) newErrors.modalidade = 'Selecione a modalidade do curso.'
        if (!data.unidadeCurricular) newErrors.unidadeCurricular = 'Selecione a unidade curricular.'
        break

      case 3: // Equipe
        if (data.autores.length === 0) newErrors.autores = 'Adicione pelo menos um autor ao projeto.'
        if (!data.orientador) newErrors.orientador = 'Adicione pelo menos um orientador ao projeto.'

        if ((user?.tipo === 'PROFESSOR' || user?.tipo === 'DOCENTE') && !data.liderEmail) {
          newErrors.lider = 'Defina um aluno como Líder do Projeto.'
        }
        break

      case 4: // Fases (Validar apenas se preenchido incorretamente)
        const phases = [
          { key: 'ideacao', label: 'Ideação' },
          { key: 'modelagem', label: 'Modelagem' },
          { key: 'prototipagem', label: 'Prototipagem' },
          { key: 'implementacao', label: 'Implementação' }
        ]

        phases.forEach(phase => {
          const phaseData = data[phase.key as keyof ProjectFormData] as PhaseData
          if (phaseData.descricao && phaseData.descricao.length > 0 && phaseData.descricao.length < MIN_DESCRIPTION_CHARS) {
            newErrors[phase.key] = `A descrição da fase de ${phase.label} está muito curta (mínimo ${MIN_DESCRIPTION_CHARS} caracteres).`
          }
        })
        break

      case 5: // Privacidade
        if (data.hasRepositorio && !data.linkRepositorio) {
          newErrors.linkRepositorio = 'Informe o link do repositório ou desmarque a opção.'
        }
        if (!data.aceitouTermos) {
          newErrors.aceitouTermos = 'Você precisa aceitar os Termos de Uso.'
        }
        break
    }

    return newErrors
  }

  const goToNextStep = () => {
    console.log('Tentativa de avançar etapa. Step atual:', currentStep)

    // Validar etapa atual
    const stepErrors = validateStep(currentStep)

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)

      // Abrir modal customizado de validação
      setValidationModal({
        open: true,
        errors: Object.values(stepErrors)
      })

      return
    }

    // Se válido, limpar erros e avançar
    setErrors({})

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      // Scroll para o topo após a transição
      setTimeout(() => {
        const mainContent = document.getElementById('main-content')
        if (mainContent) {
          mainContent.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }, 50)
    }
  }

  const canProceed = true // Agora sempre true visualmente, a validação ocorre no clique

  // Verificar se há rascunho salvo
  useEffect(() => {
    const hasDraft = localStorage.getItem('project_draft')
    if (hasDraft) {
      console.log('Rascunho detectado no localStorage')
    }
  }, [])

  return (
    <>
      <div className="space-y-6 pb-32">
        {/* Header with Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  {isEditMode ? 'Editar Projeto' : 'Criar Novo Projeto'}
                </h1>
                {isEditMode && (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    Modo Edição
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {isEditMode
                  ? `Editando etapa ${currentStep} de ${totalSteps}: ${steps[currentStep - 1].description}`
                  : `Etapa ${currentStep} de ${totalSteps}: ${steps[currentStep - 1].description}`
                }
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


          {/* Progress Bar (Custom Panel Design) */}
          <div className="mb-8">
            <PanelSteps
              steps={steps.map(s => ({
                number: s.number,
                title: s.title,
                description: s.description
              }))}
              currentStep={currentStep}
              allAccessible={isEditMode}
              onStepClick={(stepNumber) => {
                if (isEditMode) {
                  // Em modo edição, permite navegar para qualquer etapa
                  goToStep(stepNumber)
                } else if (stepNumber < currentStep) {
                  goToStep(stepNumber)
                }
              }}
            />
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
                errors={errors}
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
                  sagaSenai: data.sagaSenai,
                  participouEdital: data.participouEdital,
                  ganhouPremio: data.ganhouPremio
                }}
                errors={errors}
                onUpdate={handleInputChange}
                isStudent={isStudent}
              />
            )}

            {currentStep === 3 && (
              <TeamSection
                data={{
                  autores: data.autores,
                  autoresMetadata: data.autoresMetadata,
                  orientador: data.orientador,
                  orientadoresMetadata: data.orientadoresMetadata,
                  liderEmail: data.liderEmail,
                  isLeader: data.isLeader
                }}
                errors={errors}
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
                projetoUuid={projetoUuid}
                errors={errors}
                onUpdate={(field, value) => updateData({ [field]: value })}
              />
            )}

            {currentStep === 5 && (
              <CodeSection
                data={{
                  hasRepositorio: data.hasRepositorio,
                  codigo: data.codigo,
                  linkRepositorio: data.linkRepositorio,
                  codigoVisibilidade: data.codigoVisibilidade,
                  anexosVisibilidade: data.anexosVisibilidade,
                  aceitouTermos: data.aceitouTermos
                }}
                errors={errors}
                onUpdate={(field, value) => updateData({ [field]: value })}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Sticky Footer Navigation */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]"
          >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              {/* Left Side: Step Indicator or Back Button */}
              <div className="flex items-center gap-4">
                <button
                  onClick={goToPreviousStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${currentStep === 1
                    ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                    }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </button>

                <span className="hidden md:inline-block text-sm text-gray-500 dark:text-gray-400">
                  Etapa {currentStep} de {totalSteps}: <span className="font-medium text-gray-900 dark:text-white">{steps[currentStep - 1].title}</span>
                </span>
              </div>

              {/* Right Side: Next/Finish Button */}
              <div className="flex items-center gap-4">
                {currentStep < totalSteps ? (
                  <button
                    onClick={goToNextStep}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 dark:shadow-blue-900/20"
                  >
                    Próxima Etapa
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const finalErrors = validateStep(5)
                      if (Object.keys(finalErrors).length > 0) {
                        setErrors(finalErrors)
                        setValidationModal({
                          open: true,
                          errors: Object.values(finalErrors)
                        })
                        return
                      }
                      onGoToReview()
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm bg-green-600 hover:bg-green-700 text-white shadow-green-200 dark:shadow-green-900/20"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {isEditMode ? 'Revisar Alterações' : 'Ir para Revisão'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modal Customizado de Validação */}
      <AnimatePresence>
        {validationModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={() => setValidationModal({ open: false, errors: [] })}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-gray-700"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Verifique os campos</h3>
                </div>
                <button
                  onClick={() => setValidationModal({ open: false, errors: [] })}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Corrija os seguintes itens antes de avançar:
                </p>
                <div className="space-y-2">
                  {validationModal.errors.map((err, i) => (
                    <motion.div
                      key={err}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
                    >
                      <div className="w-5 h-5 mt-0.5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-300 font-medium">{err}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setValidationModal({ open: false, errors: [] })}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-amber-200 dark:shadow-amber-900/30"
                >
                  Entendi, vou corrigir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default CreateProjectForm
