import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ImageIcon, Upload, X, FileText } from 'lucide-react'
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
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannerPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onUpdate('banner', file)
    }
  }

  const removeBanner = () => {
    setBannerPreview(null)
    onUpdate('banner', null)
    if (bannerInputRef.current) {
      bannerInputRef.current.value = ''
    }
  }

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
        <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Banner e Anexos do Projeto
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Banner principal e documentos de todas as etapas
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700"></div>

      {/* Upload de Banner */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Banner do Projeto
          </h3>
        </div>

        {!bannerPreview ? (
          <div
            onClick={() => bannerInputRef.current?.click()}
            className="relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-gray-300 dark:border-gray-600"
          >
            <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Clique para adicionar o banner
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG ou GIF (máx. 5MB) - Recomendado: 1920x1080px
            </p>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              className="hidden"
            />
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden group">
            <img
              src={bannerPreview}
              alt="Banner preview"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
              <button
                onClick={removeBanner}
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white p-2.5 rounded-lg hover:bg-red-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700"></div>

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
