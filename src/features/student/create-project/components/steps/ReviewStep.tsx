import React from 'react'
import { motion } from 'framer-motion'
import { Eye, CheckCircle, AlertTriangle, Sparkles, Users, GraduationCap, Image as ImageIcon, Lock, Unlock } from 'lucide-react'

interface ReviewStepProps {
  formData: any
  onSubmit: () => void
  isSubmitting: boolean
  errors: Record<string, string>
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  onSubmit,
  isSubmitting,
  errors
}) => {
  const completionChecks = [
    { label: 'Informações básicas preenchidas', completed: formData.titulo && formData.curso && formData.turma },
    { label: 'Descrição completa', completed: formData.descricao && formData.descricao.length >= 50 },
    { label: 'Autores adicionados', completed: formData.autores.length > 0 },
    { label: 'Orientador definido', completed: !!formData.orientador },
    { label: 'Banner do projeto', completed: !!formData.banner },
  ]

  const completionPercentage = (completionChecks.filter(check => check.completed).length / completionChecks.length) * 100

  return (
    <div className="space-y-6">

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 shadow-xl text-white"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
            <Eye className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Revisão Final</h2>
            <p className="text-white/80">Verifique todas as informações antes de publicar</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progresso de Conclusão</span>
            <span className="font-bold">{Math.round(completionPercentage)}%</span>
          </div>
          <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Completion Checks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          {completionChecks.map((check, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-lg ${check.completed ? 'bg-green-500/20' : 'bg-white/10'
                }`}
            >
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${check.completed ? 'bg-green-500' : 'bg-white/30'
                }`}>
                {check.completed && <CheckCircle className="w-4 h-4" strokeWidth={3} />}
              </div>
              <span className="text-sm font-medium">{check.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Preview do Projeto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
      >
        {/* Banner Preview */}
        {formData.bannerPreview && (
          <div className="relative h-64 bg-gray-100 dark:bg-gray-900">
            <img
              src={formData.bannerPreview}
              alt="Banner preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium flex items-center gap-2">
              <ImageIcon className="w-3 h-3" />
              Banner
            </div>
          </div>
        )}

        <div className="p-8">
          {/* Título e Descrição */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {formData.titulo || 'Título do Projeto'}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                    {formData.curso || 'Curso'}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-full">
                    {formData.turma || 'Turma'}
                  </span>
                  {formData.itinerario === 'Sim' && (
                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-sm font-medium rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Itinerário
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {formData.descricao || 'Descrição do projeto aparecerá aqui...'}
            </p>
          </div>

          {/* Equipe */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Autores</h3>
              </div>
              <div className="space-y-2">
                {formData.autores.length > 0 ? (
                  formData.autores.map((autor: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center font-semibold text-xs">
                        {autor.charAt(0).toUpperCase()}
                      </div>
                      <span>{autor}</span>
                      {index === 0 && (
                        <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-medium rounded-full">
                          Líder
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500">Nenhum autor adicionado</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Orientadores</h3>
              </div>
              {formData.orientador && formData.orientador.length > 0 ? (
                <div className="space-y-3">
                  {formData.orientador.split(',').map((emailRaw: string, idx: number) => {
                    const email = emailRaw.trim()
                    const meta = formData.orientadoresMetadata?.[email]
                    const nome = meta?.nome || email
                    const avatar = meta?.avatar_url || meta?.avatarUrl

                    return (
                      <div key={idx} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg">
                        {avatar ? (
                          <img src={avatar} alt={nome} className="w-8 h-8 rounded-full object-cover border border-green-200" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center font-semibold text-xs">
                            {nome.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-gray-900 dark:text-gray-100 truncate">{nome}</span>
                          {meta?.nome && <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{email}</span>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500">Nenhum orientador definido</p>
              )}
            </div>
          </div>

          {/* Configurações de Privacidade */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Configurações de Privacidade</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">Código</span>
                <div className="flex items-center gap-2 text-sm font-medium">
                  {formData.codigoVisibilidade === 'Público' ? (
                    <>
                      <Unlock className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-green-600 dark:text-green-400">Público</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Privado</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">Anexos</span>
                <div className="flex items-center gap-2 text-sm font-medium">
                  {formData.anexosVisibilidade === 'Público' ? (
                    <>
                      <Unlock className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-green-600 dark:text-green-400">Público</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Privado</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Avisos */}
      {completionPercentage < 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6"
        >
          <div className="flex gap-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                Atenção: Algumas informações estão faltando
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Complete todos os itens acima para garantir que seu projeto seja publicado com todas as informações necessárias.
              </p>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  )
}

export default ReviewStep
