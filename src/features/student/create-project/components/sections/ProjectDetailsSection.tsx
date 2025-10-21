import React, { useRef, useState } from 'react'
import { Lightbulb, Tag, Sparkles, AlertCircle, Upload, X, Image, Edit2, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ImageCropModal from '../../../../../components/ImageCropModal'

interface ProjectDetailsSectionProps {
  data: {
    titulo: string
    descricao: string
    categoria: string
    banner?: File | null
  }
  onUpdate: (field: string, value: string | File | null) => void
}

const ProjectDetailsSection: React.FC<ProjectDetailsSectionProps> = ({ data, onUpdate }) => {
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    data.banner ? URL.createObjectURL(data.banner) : null
  )
  const [showActions, setShowActions] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [originalImage, setOriginalImage] = useState<string | null>(null)

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tamanho do arquivo (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('O arquivo é muito grande! O tamanho máximo é 5MB.')
        return
      }

      // Validar tipo do arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem (PNG, JPG, JPEG).')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setOriginalImage(result)
        setIsEditModalOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveCroppedImage = (croppedBlob: Blob) => {
    // Converter blob para File
    const file = new File([croppedBlob], 'banner.jpg', { type: 'image/jpeg' })
    
    // Criar preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setBannerPreview(reader.result as string)
    }
    reader.readAsDataURL(croppedBlob)
    
    onUpdate('banner', file)
  }

  const editBanner = () => {
    if (bannerPreview) {
      setOriginalImage(bannerPreview)
      setIsEditModalOpen(true)
    } else {
      bannerInputRef.current?.click()
    }
  }

  const removeBanner = () => {
    setBannerPreview(null)
    setOriginalImage(null)
    onUpdate('banner', null)
    if (bannerInputRef.current) {
      bannerInputRef.current.value = ''
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-3xl p-8 md:p-12 shadow-lg border-2 border-yellow-200 dark:border-yellow-800"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl">
          <Lightbulb className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Conte-nos sobre seu Projeto!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Esta é a parte mais importante - mostre sua ideia ao mundo
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Título do Projeto */}
        <div>
          <label className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white mb-3">
            <Sparkles className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            Título do Projeto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.titulo}
            onChange={e => onUpdate('titulo', e.target.value)}
            placeholder="Ex: Sistema de Gestão Inteligente para Bibliotecas"
            className="w-full border-2 rounded-xl px-6 py-4 text-base font-medium transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 hover:border-gray-400"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Dica: Use um título claro e atraente que desperte curiosidade
          </p>
        </div>

        {/* Descrição do Projeto */}
        <div>
          <label className="block text-base font-semibold text-gray-900 dark:text-white mb-3">
            Descrição Completa do Projeto <span className="text-red-500">*</span>
          </label>
          <textarea
            value={data.descricao}
            onChange={e => onUpdate('descricao', e.target.value)}
            placeholder="Descreva seu projeto de forma detalhada:&#10;&#10;• Qual problema ele resolve?&#10;• Quais tecnologias foram usadas?&#10;• Quais são os principais recursos?&#10;• O que torna seu projeto especial?"
            rows={10}
            maxLength={500}
            className="w-full border-2 rounded-xl px-6 py-4 text-base transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 resize-none border-gray-300 dark:border-gray-600 hover:border-gray-400"
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Dica: Seja detalhado! Uma boa descrição ajuda a destacar seu projeto
            </p>
            <span className={`text-sm font-medium ${
              data.descricao.length >= 450 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {data.descricao.length}/500
            </span>
          </div>
        </div>

        {/* Categoria */}
        <div>
          <label className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white mb-3">
            <Tag className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            Categoria do Projeto
            <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full border-2 rounded-xl px-6 py-4 text-base font-medium transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 hover:border-gray-400"
            value={data.categoria}
            onChange={e => onUpdate('categoria', e.target.value)}
          >
            <option value="">Selecione uma categoria</option>
            <option value="Aplicativo / Site">Aplicativo / Site</option>
            <option value="Automação de Processos">Automação de Processos</option>
            <option value="Bioprodutos">Bioprodutos</option>
            <option value="Chatbots e Automação Digital">Chatbots e Automação Digital</option>
            <option value="Dashboards e Análises de Dados">Dashboards e Análises de Dados</option>
            <option value="Economia Circular">Economia Circular</option>
            <option value="Educação">Educação</option>
            <option value="E-commerce e Marketplace">E-commerce e Marketplace</option>
            <option value="Eficiência Energética">Eficiência Energética</option>
            <option value="Impressão 3D">Impressão 3D</option>
            <option value="Impacto Social">Impacto Social</option>
            <option value="IoT">IoT</option>
            <option value="Manufatura Inteligente">Manufatura Inteligente</option>
            <option value="Modelo de Negócio">Modelo de Negócio</option>
            <option value="Sistemas de Gestão (ERP, CRM, etc.)">Sistemas de Gestão (ERP, CRM, etc.)</option>
            <option value="Sustentabilidade e Meio Ambiente">Sustentabilidade e Meio Ambiente</option>
            <option value="Tecnologias Assistivas e Acessibilidade">Tecnologias Assistivas e Acessibilidade</option>
            <option value="Outro">Outro</option>
          </select>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Dica: Escolha a categoria que melhor representa seu projeto
          </p>
        </div>

        {/* Banner do Projeto */}
        <div>
          <label className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white mb-3">
            <Image className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            Banner do Projeto <span className="text-red-500">*</span>
          </label>
          
          <AnimatePresence mode="wait">
            {bannerPreview ? (
              <motion.div
                key="banner-preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative group"
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
              >
                <img
                  src={bannerPreview}
                  alt="Banner do projeto"
                  className="w-full h-64 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-sm"
                />
                
                {/* Overlay escuro ao passar o mouse */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showActions ? 1 : 0 }}
                  className="absolute inset-0 bg-black/50 rounded-2xl transition-opacity flex items-center justify-center gap-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={editBanner}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg transition-all font-medium"
                  >
                    <Edit2 className="w-5 h-5" />
                    Editar
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={removeBanner}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-all font-medium"
                  >
                    <Trash2 className="w-5 h-5" />
                    Remover
                  </motion.button>
                </motion.div>

                {/* Mensagem de sucesso */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Banner carregado com sucesso! Passe o mouse para editar ou remover.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="banner-upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => bannerInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
              >
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl mb-4">
                  <Upload className="w-10 h-10 text-gray-600 dark:text-gray-400" />
                </div>
                <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Clique para adicionar o banner do projeto
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  PNG, JPG ou JPEG - Recomendado: 1920x1080px
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Máximo 5MB
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input oculto */}
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleBannerUpload}
            className="hidden"
          />
          
          <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">
                  Dica sobre o Banner
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  O banner é a primeira impressão do seu projeto! Use uma imagem de alta qualidade que represente bem sua ideia. 
                  Pode ser uma montagem, o logo, uma foto do protótipo ou qualquer imagem criativa relacionada ao projeto.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edição de Imagem */}
      {originalImage && (
        <ImageCropModal
          isOpen={isEditModalOpen}
          imageSrc={originalImage}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveCroppedImage}
          aspect={16 / 9}
        />
      )}
    </motion.div>
  )
}

export default ProjectDetailsSection
