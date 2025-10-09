import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { useGuest } from '@/contexts/guest-context'
import { useAuth } from '@/contexts/auth-context'
import { useProjectForm } from './hooks'
import {
  StepIndicator,
  StepNavigation,
  NewProjectInfoSection,
  AttachmentsSection,
  ReviewSection
} from './components'

const NewCreateProjectPage = () => {
  const navigate = useNavigate()
  const { isGuest } = useGuest()
  const { isAuthenticated } = useAuth()
  
  const {
    state,
    updateData,
    nextStep,
    prevStep,
    validateStep,
    setSubmitting,
    canProceed,
    isFirstStep,
    isLastStep,
    addAuthor,
    removeAuthor
  } = useProjectForm()

  // Redirecionar visitantes para o dashboard
  useEffect(() => {
    if (isGuest || !isAuthenticated) {
      navigate('/app/dashboard', { replace: true })
    }
  }, [isGuest, isAuthenticated, navigate])

  const handleStepChange = (newStep: any) => {
    // Validar etapa atual antes de mudar
    if (validateStep(state.currentStep)) {
      // Lógica customizada para mudar de etapa
      if (newStep === 'attachments' && state.currentStep === 'info') {
        nextStep()
      } else if (newStep === 'info' && state.currentStep === 'attachments') {
        prevStep()
      } else if (newStep === 'review' && state.currentStep === 'attachments') {
        nextStep()
      } else if (newStep === 'attachments' && state.currentStep === 'review') {
        prevStep()
      }
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    
    try {
      // Aqui faria a chamada para a API
      console.log('Dados do projeto para envio:', state.data)
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Após sucesso, redirecionar
      navigate('/app/projects', { 
        state: { 
          message: 'Projeto criado com sucesso!',
          type: 'success'
        }
      })
    } catch (error) {
      console.error('Erro ao criar projeto:', error)
      // Aqui você poderia mostrar uma notificação de erro
    } finally {
      setSubmitting(false)
    }
  }

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 'info':
        return (
          <NewProjectInfoSection
            data={state.data}
            updateData={updateData}
            errors={state.errors}
          />
        )
      case 'attachments':
        return (
          <AttachmentsSection
            data={state.data}
            updateData={updateData}
            errors={state.errors}
          />
        )
      case 'review':
        return (
          <ReviewSection
            data={state.data}
            updateData={updateData}
            errors={state.errors}
            onSubmit={handleSubmit}
            isSubmitting={state.isSubmitting}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Container principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header com gradiente */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Botão voltar */}
          <button
            onClick={() => navigate('/app')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors mb-6 group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Voltar ao Dashboard</span>
          </button>

          {/* Hero Section */}
          <div className="relative bg-gradient-to-r from-primary to-primary-dark dark:from-primary-dark dark:to-primary rounded-2xl p-8 md:p-12 shadow-xl overflow-hidden">
            {/* Decoração de fundo */}
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                  Novo Projeto
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Publique seu Projeto
              </h1>
              <p className="text-white/90 text-lg max-w-2xl">
                Compartilhe sua criação com a comunidade SENAI e mostre todo o seu talento
              </p>
            </div>
          </div>
        </motion.div>

        {/* Indicador de Progresso */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8"
        >
          <StepIndicator
            currentStep={state.currentStep}
            onStepClick={handleStepChange}
            className="max-w-3xl mx-auto"
          />
        </motion.div>

        {/* Conteúdo das etapas com animação */}
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navegação entre etapas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <StepNavigation
            currentStep={state.currentStep}
            onStepChange={handleStepChange}
            canProceed={canProceed && Object.keys(state.errors).length === 0}
            isSubmitting={state.isSubmitting}
          />
        </motion.div>
      </div>
    </div>
  )
}

export default NewCreateProjectPage
