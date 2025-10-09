import React from 'react'
import { motion } from 'framer-motion'
import { Check, Lightbulb, GraduationCap, Users, TrendingUp, Eye } from 'lucide-react'
import { ImprovedStep } from '../ImprovedPage'

interface ImprovedStepIndicatorProps {
  currentStep: ImprovedStep
  onStepClick?: (step: ImprovedStep) => void
}

const ImprovedStepIndicator: React.FC<ImprovedStepIndicatorProps> = ({
  currentStep,
  onStepClick
}) => {
  const steps = [
    {
      id: 'details' as ImprovedStep,
      title: 'Detalhes',
      description: 'Seu projeto',
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'academic' as ImprovedStep,
      title: 'Acadêmico',
      description: 'Curso e turma',
      icon: GraduationCap,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'team' as ImprovedStep,
      title: 'Equipe',
      description: 'Autores e orientador',
      icon: Users,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'timeline' as ImprovedStep,
      title: 'Timeline',
      description: 'Progresso do projeto',
      icon: TrendingUp,
      color: 'from-indigo-500 to-blue-600'
    },
    {
      id: 'review' as ImprovedStep,
      title: 'Revisão',
      description: 'Verificar e publicar',
      icon: Eye,
      color: 'from-green-500 to-green-600'
    }
  ]

  const getStepIndex = (step: ImprovedStep): number => {
    return steps.findIndex(s => s.id === step)
  }

  const getStepStatus = (stepId: ImprovedStep) => {
    const currentIndex = getStepIndex(currentStep)
    const stepIndex = getStepIndex(stepId)

    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'current'
    return 'upcoming'
  }

  return (
    <div className="w-full">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-center">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id)
              const isClickable = onStepClick && (status === 'completed' || status === 'current')
              const Icon = step.icon

              return (
                <li key={step.id} className="relative flex items-center">
                  {/* Linha conectora */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-1/2 top-8 h-1 w-32 -z-10 ml-8">
                      <div className="h-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${step.color}`}
                          initial={{ width: '0%' }}
                          animate={{ width: status === 'completed' ? '100%' : '0%' }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Container do step */}
                  <motion.div
                    className={`relative flex flex-col items-center ${
                      isClickable ? 'cursor-pointer' : ''
                    } w-40`}
                    onClick={() => isClickable && onStepClick!(step.id)}
                    whileHover={isClickable ? { scale: 1.05 } : {}}
                    whileTap={isClickable ? { scale: 0.95 } : {}}
                  >
                    {/* Círculo do step */}
                    <motion.div
                      className={`flex items-center justify-center w-16 h-16 rounded-2xl border-2 transition-all duration-300 ${
                        status === 'completed'
                          ? `bg-gradient-to-br ${step.color} border-transparent text-white shadow-xl`
                          : status === 'current'
                          ? `bg-white dark:bg-gray-800 border-transparent text-white bg-gradient-to-br ${step.color} shadow-xl ring-4 ring-primary/20`
                          : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                      }`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1, type: 'spring' }}
                    >
                      {status === 'completed' ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                        >
                          <Check className="w-8 h-8" strokeWidth={3} />
                        </motion.div>
                      ) : (
                        <Icon className="w-7 h-7" />
                      )}
                    </motion.div>

                    {/* Informações do step */}
                    <motion.div 
                      className="mt-4 text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      <p
                        className={`text-sm font-bold mb-1 transition-colors ${
                          status === 'current'
                            ? 'text-primary dark:text-primary-light'
                            : status === 'completed'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {step.description}
                      </p>
                    </motion.div>

                    {/* Badge de completado */}
                    {status === 'completed' && (
                      <motion.div
                        className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1.5 shadow-lg"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', delay: 0.3 }}
                      >
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </motion.div>
                    )}

                    {/* Indicador de etapa atual */}
                    {status === 'current' && (
                      <motion.div 
                        className="absolute -top-2 -right-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <span className="relative flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
                        </span>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Espaçamento */}
                  {index < steps.length - 1 && <div className="w-32" />}
                </li>
              )
            })}
          </ol>
        </nav>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="space-y-4">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id)
            const Icon = step.icon

            return (
              <motion.div
                key={step.id}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  status === 'current'
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : status === 'completed'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-xl ${
                    status === 'completed'
                      ? `bg-gradient-to-br ${step.color} text-white`
                      : status === 'current'
                      ? `bg-gradient-to-br ${step.color} text-white`
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                  }`}
                >
                  {status === 'completed' ? (
                    <Check className="w-6 h-6" strokeWidth={3} />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${
                    status === 'current' ? 'text-primary' : status === 'completed' ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
                {status === 'current' && (
                  <span className="px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                    Atual
                  </span>
                )}
                {status === 'completed' && (
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                    Concluído
                  </span>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ImprovedStepIndicator
