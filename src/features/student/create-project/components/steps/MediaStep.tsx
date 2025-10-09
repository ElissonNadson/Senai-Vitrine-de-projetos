import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as ImageIcon, Upload, X, AlertCircle, CheckCircle, FileCode, Eye, EyeOff } from 'lucide-react'

interface MediaStepProps {
  formData: any
  updateFormData: (updates: any) => void
  errors: Record<string, string>
}

const MediaStep: React.FC<MediaStepProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannerPreview(reader.result as string)
        updateFormData({ banner: file, bannerPreview: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeBanner = () => {
    setBannerPreview(null)
    updateFormData({ banner: null, bannerPreview: undefined })
    if (bannerInputRef.current) {
      bannerInputRef.current.value = ''
    }
  }

  const handleTimelineChange = (index: number, field: string, value: string) => {
    const newTimeline = [...formData.timelineSteps]
    newTimeline[index] = { ...newTimeline[index], [field]: value }
    updateFormData({ timelineSteps: newTimeline })
  }

  return (
    <div className="space-y-6">
      
      {/* Upload de Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-pink-500/10 dark:bg-pink-500/20 rounded-xl">
            <ImageIcon className="w-6 h-6 text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Banner do Projeto
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Imagem de capa (Recomendado: 1920x1080px)
            </p>
          </div>
        </div>

        <div>
          {!bannerPreview ? (
            <div
              onClick={() => bannerInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all hover:border-primary hover:bg-primary/5 ${
                errors.banner ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <Upload className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Clique para fazer upload
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                PNG, JPG ou WEBP até 5MB
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
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-2xl overflow-hidden group"
            >
              <img
                src={bannerPreview}
                alt="Banner preview"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  onClick={() => bannerInputRef.current?.click()}
                  className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Trocar Imagem
                </button>
                <button
                  onClick={removeBanner}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Remover
                </button>
              </div>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                className="hidden"
              />
            </motion.div>
          )}
          {errors.banner && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-xs mt-2 flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3" />
              {errors.banner}
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Timeline do Projeto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl">
            <FileCode className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Timeline do Projeto (Opcional)
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Descreva as etapas de desenvolvimento
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.timelineSteps.map((step: any, index: number) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => handleTimelineChange(index, 'title', e.target.value)}
                  className="flex-1 bg-transparent border-none text-sm font-semibold text-gray-900 dark:text-white focus:outline-none"
                  placeholder="Nome da etapa"
                />
              </div>
              <textarea
                value={step.description}
                onChange={(e) => handleTimelineChange(index, 'description', e.target.value)}
                rows={3}
                className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Descreva o que foi feito nesta etapa..."
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Configurações de Visibilidade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-500/10 dark:bg-green-500/20 rounded-xl">
            <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Configurações de Privacidade
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Defina quem pode ver seus arquivos
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Visibilidade do Código */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Visibilidade do Código
            </label>
            <div className="flex gap-3">
              {['Público', 'Privado'].map(option => (
                <label key={option} className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10 border-gray-200 dark:border-gray-600 flex-1">
                  <input
                    type="radio"
                    name="codigoVisibilidade"
                    value={option}
                    checked={formData.codigoVisibilidade === option}
                    onChange={e => updateFormData({ codigoVisibilidade: e.target.value })}
                    className="accent-primary"
                  />
                  <div className="flex items-center gap-2">
                    {option === 'Público' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{option}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Visibilidade dos Anexos */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Visibilidade dos Anexos
            </label>
            <div className="flex gap-3">
              {['Público', 'Privado'].map(option => (
                <label key={option} className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10 border-gray-200 dark:border-gray-600 flex-1">
                  <input
                    type="radio"
                    name="anexosVisibilidade"
                    value={option}
                    checked={formData.anexosVisibilidade === option}
                    onChange={e => updateFormData({ anexosVisibilidade: e.target.value })}
                    className="accent-primary"
                  />
                  <div className="flex items-center gap-2">
                    {option === 'Público' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{option}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  )
}

export default MediaStep
