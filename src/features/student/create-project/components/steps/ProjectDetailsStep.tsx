import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, Image as ImageIcon, Upload, X, AlertCircle, Sparkles, Tag, MapPin } from 'lucide-react'
import { PROJECT_CATEGORIES, PROJECT_MODALITIES } from '../../types'

interface ProjectDetailsStepProps {
  formData: any
  updateFormData: (updates: any) => void
  errors: Record<string, string>
}

const ProjectDetailsStep: React.FC<ProjectDetailsStepProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(formData.bannerPreview || null)

  const handleInputChange = (field: string, value: string) => {
    updateFormData({ [field]: value })
  }

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

  return (
    <div className="space-y-6">
      
      {/* Hero - Título e Descrição */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-3xl p-8 md:p-12 shadow-lg border-2 border-yellow-200 dark:border-yellow-800"
      >
        <div className="flex items-center gap-4 mb-8">
          <motion.div 
            className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Lightbulb className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Conte-nos sobre seu Projeto! 🚀
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Esta é a parte mais importante - mostre sua ideia ao mundo
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Título do Projeto */}
          <div>
            <label className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-3">
              <Sparkles className="w-5 h-5 text-yellow-600" />
              Título do Projeto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={e => handleInputChange('titulo', e.target.value)}
              placeholder="Ex: Sistema de Gestão Inteligente para Bibliotecas"
              className={`w-full border-2 rounded-2xl px-6 py-4 text-lg font-medium transition-all focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${
                errors.titulo
                  ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
            />
            {errors.titulo && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 dark:text-red-400 text-sm mt-2 flex items-center gap-2 font-medium"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.titulo}
              </motion.p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              💡 Dica: Use um título claro e atraente que desperte curiosidade
            </p>
          </div>

          {/* Descrição do Projeto */}
          <div>
            <label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">
              Descrição Completa do Projeto <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.descricao}
              onChange={e => handleInputChange('descricao', e.target.value)}
              placeholder="Descreva seu projeto de forma detalhada:&#10;&#10;• Qual problema ele resolve?&#10;• Quais tecnologias foram usadas?&#10;• Quais são os principais recursos?&#10;• O que torna seu projeto especial?"
              rows={10}
              maxLength={500}
              className={`w-full border-2 rounded-2xl px-6 py-4 text-base transition-all focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 resize-none ${
                errors.descricao
                  ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
            />
            <div className="flex items-center justify-between mt-3">
              {errors.descricao ? (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2 font-medium"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.descricao}
                </motion.p>
              ) : (
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${
                    formData.descricao.length >= 50 ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mínimo de 50 caracteres para uma boa descrição
                  </p>
                </div>
              )}
              <p className={`text-sm font-bold ${
                formData.descricao.length >= 50
                  ? 'text-green-600 dark:text-green-400'
                  : formData.descricao.length > 0
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {formData.descricao.length}/500
              </p>
            </div>
          </div>

          {/* Categoria do Projeto */}
          <div>
            <label className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-3">
              <Tag className="w-5 h-5 text-blue-600" />
              Categoria do Projeto <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.categoria}
              onChange={e => handleInputChange('categoria', e.target.value)}
              className={`w-full border-2 rounded-2xl px-6 py-4 text-base font-medium transition-all focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:text-white ${
                errors.categoria
                  ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
            >
              <option value="">Selecione uma categoria</option>
              {PROJECT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.categoria && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 dark:text-red-400 text-sm mt-2 flex items-center gap-2 font-medium"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.categoria}
              </motion.p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              💡 Dica: Escolha a categoria que melhor representa seu projeto
            </p>
          </div>

          {/* Modalidade do Projeto */}
          <div>
            <label className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-3">
              <MapPin className="w-5 h-5 text-green-600" />
              Modalidade do Projeto <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.modalidade}
              onChange={e => handleInputChange('modalidade', e.target.value)}
              className={`w-full border-2 rounded-2xl px-6 py-4 text-base font-medium transition-all focus:ring-4 focus:ring-green-500/20 focus:border-green-500 dark:bg-gray-800 dark:text-white ${
                errors.modalidade
                  ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
            >
              <option value="">Selecione uma modalidade</option>
              {PROJECT_MODALITIES.map((modality) => (
                <option key={modality} value={modality}>
                  {modality}
                </option>
              ))}
            </select>
            {errors.modalidade && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 dark:text-red-400 text-sm mt-2 flex items-center gap-2 font-medium"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.modalidade}
              </motion.p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              📍 Indique se o projeto foi desenvolvido de forma presencial ou semi presencial
            </p>
          </div>
        </div>
      </motion.div>

      {/* Banner do Projeto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-10 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl shadow-lg">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Banner do Projeto
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Uma imagem vale mais que mil palavras! 📸
            </p>
          </div>
        </div>

        <div>
          {!bannerPreview ? (
            <div
              onClick={() => bannerInputRef.current?.click()}
              className={`relative border-3 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 group ${
                errors.banner 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/10' 
                  : 'border-gray-300 dark:border-gray-600 hover:shadow-lg'
              }`}
            >
              <div className="space-y-4">
                <motion.div
                  className="inline-block p-6 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-full"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Upload className="w-16 h-16 text-pink-600 dark:text-pink-400" />
                </motion.div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Arraste ou clique para fazer upload
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Recomendamos 1920x1080px para melhor visualização
                  </p>
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-medium shadow-lg group-hover:shadow-xl transition-shadow">
                    <Upload className="w-5 h-5" />
                    Selecionar Imagem
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    PNG, JPG ou WEBP até 5MB
                  </p>
                </div>
              </div>
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
              className="relative rounded-3xl overflow-hidden group shadow-2xl"
            >
              <img
                src={bannerPreview}
                alt="Banner preview"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => bannerInputRef.current?.click()}
                    className="px-6 py-3 bg-white text-gray-900 rounded-xl font-bold shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Trocar Imagem
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={removeBanner}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-red-700 transition-all flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Remover
                  </motion.button>
                </div>
                <p className="text-white text-sm font-medium">
                  ✨ Banner carregado com sucesso!
                </p>
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
              className="text-red-600 dark:text-red-400 text-sm mt-4 flex items-center gap-2 font-medium"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.banner}
            </motion.p>
          )}
        </div>

        {/* Dica sobre o banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6"
        >
          <div className="flex gap-4">
            <ImageIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-base font-bold text-blue-900 dark:text-blue-100 mb-2">
                📸 Dicas para um banner impactante
              </p>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 leading-relaxed">
                <li>• Evite imagens muito escuras ou com muito texto</li>
                <li>• Pode ser uma captura de tela da interface, logo ou arte relacionada</li>
                <li>• O banner será exibido em destaque na vitrine de projetos</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>

    </div>
  )
}

export default ProjectDetailsStep
