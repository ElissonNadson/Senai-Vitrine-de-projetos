import React from 'react'
import { motion } from 'framer-motion'
import { Check, FileText, Upload, Eye } from 'lucide-react'
import { FormStep } from '../types'

interface StepIndicatorProps {
  currentStep: FormStep
  onStepClick?: (step: FormStep) => void
  className?: string
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onStepClick,
  className = ''
}) => {
  const steps = [
    {
      id: 'info' as FormStep,
      title: 'Informações',
      description: 'Dados básicos do projeto',
      icon: FileText
    },
    {
      id: 'attachments' as FormStep,
      title: 'Anexos',
      description: 'Arquivos e timeline',
      icon: Upload
    },
    {
      id: 'review' as FormStep,
      title: 'Revisão',
      description: 'Verificar e publicar',
      icon: Eye
    }
  ]

  const getStepIndex = (step: FormStep): number => {
    return steps.findIndex(s => s.id === step)
  }

  const getStepStatus = (stepId: FormStep) => {
    const currentIndex = getStepIndex(currentStep)
    const stepIndex = getStepIndex(stepId)

    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'current'
    return 'upcoming'
  }

  return (
    <div className={`w-full ${className}`}>
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between md:justify-center gap-4 md:gap-0">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id)
            const isClickable = onStepClick && (status === 'completed' || status === 'current')
            const Icon = step.icon

            return (
              <li key={step.id} className="relative flex items-center flex-1 md:flex-initial">
                {/* Linha conectora - Desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-1/2 top-5 h-0.5 w-24 -z-10">
                    <div className="h-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: status === 'completed' ? '0%' : '0%' }}
                        animate={{ width: status === 'completed' ? '100%' : '0%' }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      />
                    </div>
                  </div>
                )}

                {/* Container do step */}
                <motion.div
                  className={`relative flex flex-col items-center group ${
                    isClickable ? 'cursor-pointer' : ''
                  } w-full md:w-auto`}
                  onClick={() => isClickable && onStepClick!(step.id)}
                  whileHover={isClickable ? { scale: 1.05 } : {}}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                >
                  {/* Círculo do step com animação */}
                  <motion.div
                    className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border-2 transition-all duration-300 ${
                      status === 'completed'
                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30'
                        : status === 'current'
                        ? 'bg-white dark:bg-gray-800 border-primary text-primary shadow-lg ring-4 ring-primary/20'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                    }`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                    >
                      {status === 'completed' ? (
                        <Check className="w-6 h-6" strokeWidth={3} />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </motion.div>
                  </motion.div>

                  {/* Informações do step */}
                  <motion.div 
                    className="mt-3 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <p
                      className={`text-sm md:text-base font-semibold transition-colors ${
                        status === 'current'
                          ? 'text-primary dark:text-primary-light'
                          : status === 'completed'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">
                      {step.description}
                    </p>
                  </motion.div>

                  {/* Indicador de etapa atual com pulse */}
                  {status === 'current' && (
                    <motion.div 
                      className="absolute -top-1 -right-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                      </span>
                    </motion.div>
                  )}

                  {/* Badge de completado */}
                  {status === 'completed' && (
                    <motion.div
                      className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', delay: 0.3 }}
                    >
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </motion.div>

                {/* Espaçamento - Desktop */}
                {index < steps.length - 1 && <div className="hidden md:block w-24" />}
              </li>
            )
          })}
        </ol>
      </nav>

      {/* Barra de progresso móvel moderna */}
      <motion.div 
        className="mt-6 sm:hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
          <span>Etapa {getStepIndex(currentStep) + 1} de {steps.length}</span>
          <span>{Math.round(((getStepIndex(currentStep) + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
          <motion.div
            className="bg-gradient-to-r from-primary to-primary-dark h-full rounded-full shadow-lg"
            initial={{ width: 0 }}
            animate={{
              width: `${((getStepIndex(currentStep) + 1) / steps.length) * 100}%`
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default StepIndicator
