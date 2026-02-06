import React, { useEffect, useState } from 'react'
import { Lightbulb, Tag, Sparkles, AlertCircle, Image } from 'lucide-react'
import { motion } from 'framer-motion'
import { ModernBannerUploader } from '@/components/ui/ModernBannerUploader'

interface ProjectDetailsSectionProps {
  data: {
    titulo: string
    descricao: string
    categoria: string
    banner?: File | null
    bannerUrl?: string
  }
  errors?: Record<string, string>
  onUpdate: (field: string, value: string | File | null) => void
}

const ProjectDetailsSection: React.FC<ProjectDetailsSectionProps> = ({ data, errors = {}, onUpdate }) => {
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)

  useEffect(() => {
    if (data.banner) {
      const objectUrl = URL.createObjectURL(data.banner)
      setBannerPreview(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    }

    if (data.bannerUrl) {
      setBannerPreview(data.bannerUrl)
      return
    }

    setBannerPreview(null)
  }, [data.banner, data.bannerUrl])

  const handleBannerChange = (file: File) => {
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setBannerPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    onUpdate('banner', file)
  }

  const handleRemoveBanner = () => {
    setBannerPreview(null)
    onUpdate('banner', null)
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
            className={`w-full border-2 rounded-xl px-6 py-4 text-base font-medium transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 hover:border-gray-400 ${errors.titulo || (data.titulo && (data.titulo.length < 10 || data.titulo.length > 200))
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-gray-300'
              }`}
            maxLength={200}
          />
          {errors.titulo && (
            <p className="text-red-500 text-sm mt-1 mb-1">{errors.titulo}</p>
          )}
          <div className="flex items-center justify-between mt-2">
            <p className={`text-sm ${data.titulo && data.titulo.length < 10 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
              }`}>
              {data.titulo && data.titulo.length < 10
                ? `Mínimo de 10 caracteres (atual: ${data.titulo.length})`
                : 'Dica: Use um título claro e atraente'}
            </p>
            <span className={`text-sm font-medium ${data.titulo && data.titulo.length < 10 ? 'text-red-500' : 'text-gray-400'
              }`}>
              {data.titulo.length}/200
            </span>
          </div>
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
            maxLength={5000}
            className={`w-full border-2 rounded-xl px-6 py-4 text-base transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 resize-none dark:border-gray-600 hover:border-gray-400 ${errors.descricao || (data.descricao && data.descricao.length < 50)
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-gray-300'
              }`}
          />
          {errors.descricao && (
            <p className="text-red-500 text-sm mt-1 mb-1">{errors.descricao}</p>
          )}
          <div className="flex items-center justify-between mt-3">
            <p className={`text-sm ${data.descricao && data.descricao.length < 50 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
              }`}>
              {data.descricao && data.descricao.length < 50
                ? `Mínimo de 50 caracteres para garantir qualidade (atual: ${data.descricao.length})`
                : 'Dica: Seja detalhado! Uma boa descrição ajuda a destacar seu projeto'}
            </p>
            <span className={`text-sm font-medium ${data.descricao.length < 50 ? 'text-red-500' :
              data.descricao.length >= 900 ? 'text-amber-500' : 'text-gray-500 dark:text-gray-400'
              }`}>
              {data.descricao.length}/5000
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
            className={`w-full border-2 rounded-xl px-6 py-4 text-base font-medium transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 hover:border-gray-400 ${errors.categoria ? 'border-red-300 focus:border-red-500' : 'border-gray-300'
              }`}
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
          {errors.categoria && (
            <p className="text-red-500 text-sm mt-1">{errors.categoria}</p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Dica: Escolha a categoria que melhor representa seu projeto
          </p>
        </div>

        {/* Banner do Projeto (Modern Uploader) */}
        <div>
          <label className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white mb-3">
            <Image className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            Banner do Projeto <span className="text-red-500">*</span>
          </label>

          <ModernBannerUploader
            currentBanner={bannerPreview}
            onBannerChange={handleBannerChange}
            onRemove={handleRemoveBanner}
          />
          {errors.banner && (
            <p className="text-red-500 text-sm mt-1">{errors.banner}</p>
          )}

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

    </motion.div>
  )
}

export default ProjectDetailsSection
