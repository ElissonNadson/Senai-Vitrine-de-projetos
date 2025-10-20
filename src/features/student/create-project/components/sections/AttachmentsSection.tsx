import React from 'react'
import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
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
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-700 space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <FileText className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Conte-nos sobre seu projeto
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Descreva as etapas do desenvolvimento do seu projeto
          </p>
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
