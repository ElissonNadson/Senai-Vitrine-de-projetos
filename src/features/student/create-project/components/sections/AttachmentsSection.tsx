import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Lightbulb, Settings, Wrench, Rocket } from 'lucide-react'
import IdeacaoSection from './IdeacaoSection'
import ModelagemSection from './ModelagemSection'
import PrototipagemSection from './PrototipagemSection'
import ImplementacaoSection from './ImplementacaoSection'

interface Attachment {
  id: string
  file: File
  type: string
}

interface AttachmentsSectionProps {
  data: {
    banner: File | null | undefined
    ideacao: { descricao: string; anexos: Attachment[] }
    modelagem: { descricao: string; anexos: Attachment[] }
    prototipagem: { descricao: string; anexos: Attachment[] }
    implementacao: { descricao: string; anexos: Attachment[] }
  }
  onUpdate: (field: string, value: any) => void
}

const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({ data, onUpdate }) => {
  const [currentPhase, setCurrentPhase] = useState(0)

  const phases = [
    {
      id: 'ideacao',
      number: 1,
      title: 'Ideação',
      icon: Lightbulb,
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      description: 'Descoberta e brainstorming'
    },
    {
      id: 'modelagem',
      number: 2,
      title: 'Modelagem',
      icon: Settings,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      description: 'Planejamento e estruturação'
    },
    {
      id: 'prototipagem',
      number: 3,
      title: 'Prototipagem',
      icon: Wrench,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      description: 'Design e validação'
    },
    {
      id: 'implementacao',
      number: 4,
      title: 'Implementação',
      icon: Rocket,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
      borderColor: 'border-green-200 dark:border-green-800',
      description: 'Desenvolvimento e resultados'
    }
  ]

  const handlePhaseUpdate = (phase: string, field: string, value: any) => {
    const currentData = data[phase as keyof typeof data] || { descricao: '', anexos: [] }
    onUpdate(phase, { ...currentData, [field]: value })
  }

  // Garantir que as fases sempre tenham dados válidos
  const safeData = {
    banner: data.banner,
    ideacao: data.ideacao || { descricao: '', anexos: [] },
    modelagem: data.modelagem || { descricao: '', anexos: [] },
    prototipagem: data.prototipagem || { descricao: '', anexos: [] },
    implementacao: data.implementacao || { descricao: '', anexos: [] }
  }

  const currentPhaseData = phases[currentPhase]
  const Icon = currentPhaseData.icon

  const goToPhase = (index: number) => {
    setCurrentPhase(index)
  }

  return (
    <div className="space-y-6">
      {/* Header com Navegação de Fases */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6">
        {/* Título Principal */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-4 bg-gradient-to-br ${currentPhaseData.color} rounded-2xl shadow-xl`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Fases do Desenvolvimento
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Documentação das etapas seguindo a metodologia do SENAI
            </p>
          </div>
        </div>

        {/* Indicadores de Fase */}
        <div className="grid grid-cols-4 gap-3">
          {phases.map((phase, index) => {
            const PhaseIcon = phase.icon
            const isCurrent = currentPhase === index
            
            return (
              <button
                key={phase.id}
                onClick={() => goToPhase(index)}
                className={`relative p-4 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? `bg-gradient-to-br ${phase.color} text-white shadow-lg scale-105 transform`
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <PhaseIcon className="w-5 h-5" />
                    <span className="text-lg font-bold">{phase.number}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold">{phase.title}</p>
                    <p className="text-xs opacity-80 mt-0.5 hidden md:block">{phase.description}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Slide de Conteúdo da Fase */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            {currentPhase === 0 && (
              <IdeacaoSection
                data={safeData.ideacao}
                onUpdate={(field, value) => handlePhaseUpdate('ideacao', field, value)}
              />
            )}

            {currentPhase === 1 && (
              <ModelagemSection
                data={safeData.modelagem}
                onUpdate={(field, value) => handlePhaseUpdate('modelagem', field, value)}
              />
            )}

            {currentPhase === 2 && (
              <PrototipagemSection
                data={safeData.prototipagem}
                onUpdate={(field, value) => handlePhaseUpdate('prototipagem', field, value)}
              />
            )}

            {currentPhase === 3 && (
              <ImplementacaoSection
                data={safeData.implementacao}
                onUpdate={(field, value) => handlePhaseUpdate('implementacao', field, value)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dica Informativa */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800"
      >
        <div className="flex gap-3">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">
              💡 Dica sobre a fase de {currentPhaseData.title}
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              {currentPhase === 0 && 'Documente o processo criativo, identificação do problema e geração de ideias através de técnicas como brainstorming, mapas mentais e personas.'}
              {currentPhase === 1 && 'Planeje o modelo de negócio, analise viabilidade financeira, identifique riscos e crie um cronograma detalhado de execução do projeto.'}
              {currentPhase === 2 && 'Crie protótipos visuais e funcionais, desde wireframes de baixa fidelidade até mockups interativos para validar conceitos com usuários.'}
              {currentPhase === 3 && 'Documente a implementação técnica, testes realizados, feedbacks dos usuários e resultados alcançados com o projeto finalizado.'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AttachmentsSection
