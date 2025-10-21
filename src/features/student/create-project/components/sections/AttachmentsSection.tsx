import React from 'react'
import { motion } from 'framer-motion'
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Conte-nos sobre seu Projeto
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Descreva cada fase do desenvolvimento seguindo a metodologia do SENAI
            </p>
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="mt-6 grid grid-cols-4 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">1</div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Ideação</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">2</div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Modelagem</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">3</div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Prototipagem</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">4</div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Implementação</span>
          </div>
        </div>
      </div>

      {/* Etapas do Projeto */}
      <div className="space-y-6">
        <IdeacaoSection
          data={safeData.ideacao}
          onUpdate={(field, value) => handlePhaseUpdate('ideacao', field, value)}
        />

        <ModelagemSection
          data={safeData.modelagem}
          onUpdate={(field, value) => handlePhaseUpdate('modelagem', field, value)}
        />

        <PrototipagemSection
          data={safeData.prototipagem}
          onUpdate={(field, value) => handlePhaseUpdate('prototipagem', field, value)}
        />

        <ImplementacaoSection
          data={safeData.implementacao}
          onUpdate={(field, value) => handlePhaseUpdate('implementacao', field, value)}
        />
      </div>

    </motion.div>
  )
}

export default AttachmentsSection
