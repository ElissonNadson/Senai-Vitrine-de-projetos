import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowLeft, FiSave, FiAlertCircle, FiCheckCircle, FiCheck } from 'react-icons/fi'
import { useCreateEtapaProjeto } from '../../../hooks/use-mutation'
import { useEtapasProjetos } from '../../../hooks/use-queries'
import { useQueryClient } from '@tanstack/react-query'

interface FormData {
  nomeEtapa: string
  descricao: string
  ordem: number
  status: string
}

interface EtapaPadrao {
  nome: string
  ordem: number
  descricao: string
  cor: string
  bgColor: string
  icon: string
}

const ETAPAS_PADRAO: EtapaPadrao[] = [
  {
    nome: 'Ideação',
    ordem: 1,
    descricao: 'Fase de brainstorming, definição de conceitos e planejamento inicial do projeto.',
    cor: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    icon: '💡'
  },
  {
    nome: 'Modelagem',
    ordem: 2,
    descricao: 'Criação de modelos, diagramas, arquitetura e especificações técnicas.',
    cor: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    icon: '📐'
  },
  {
    nome: 'Prototipagem',
    ordem: 3,
    descricao: 'Desenvolvimento de protótipos, testes iniciais e validações.',
    cor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    icon: '🔧'
  },
  {
    nome: 'Implementação',
    ordem: 4,
    descricao: 'Desenvolvimento final, implantação e entrega do projeto completo.',
    cor: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    icon: '🚀'
  }
]

const AddStagePage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Buscar etapas existentes do projeto
  const { data: etapasData } = useEtapasProjetos()
  const etapasExistentes = etapasData?.filter((e: any) => e.projeto?.uuid === projectId) || []

  const [formData, setFormData] = useState<FormData>({
    nomeEtapa: '',
    descricao: '',
    ordem: 1,
    status: 'EM_ANDAMENTO'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [etapaSelecionada, setEtapaSelecionada] = useState<EtapaPadrao | null>(null)

  // Verificar quais etapas padrão já foram criadas
  const etapasConcluidas = ETAPAS_PADRAO.map(etapa => {
    const existe = etapasExistentes.find((e: any) => 
      e.nomeEtapa.toLowerCase().includes(etapa.nome.toLowerCase())
    )
    return {
      ...etapa,
      concluida: !!existe
    }
  })

  // Sugerir próxima etapa
  const proximaEtapaSugerida = etapasConcluidas.find(e => !e.concluida) || null

  useEffect(() => {
    // Se há uma próxima etapa sugerida, selecionar automaticamente
    if (proximaEtapaSugerida && !etapaSelecionada) {
      handleSelecionarEtapa(proximaEtapaSugerida)
    }
  }, [proximaEtapaSugerida])

  const createEtapaMutation = useCreateEtapaProjeto({
    onSuccess: () => {
      handleSuccess()
    },
    onError: (error) => {
      console.error('Erro ao criar etapa:', error)
      setIsSubmitting(false)
      setErrors({ submit: 'Erro ao criar etapa. Tente novamente.' })
    }
  })

  const handleSelecionarEtapa = (etapa: EtapaPadrao) => {
    setEtapaSelecionada(etapa)
    setFormData({
      nomeEtapa: etapa.nome,
      descricao: etapa.descricao,
      ordem: etapa.ordem,
      status: 'EM_ANDAMENTO'
    })
  }

  const handleSuccess = () => {
    setIsSubmitting(false)
    setShowSuccessModal(true)
    queryClient.invalidateQueries({ queryKey: ['getEtapasProjetos'] })
    
    setTimeout(() => {
      navigate(`/app/projects/${projectId}`)
    }, 2000)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'A descrição é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!projectId) {
      setErrors({ submit: 'ID do projeto não encontrado' })
      return
    }

    setIsSubmitting(true)
    setErrors({})

    const payload = {
      projeto: { uuid: projectId },
      nomeEtapa: formData.nomeEtapa,
      descricao: formData.descricao,
      ordem: formData.ordem,
      status: formData.status,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    }

    createEtapaMutation.mutate(payload)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    // Limpar erro do campo ao digitar
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FiSave className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Nova Etapa do Projeto
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Selecione a etapa e documente o progresso do seu projeto
              </p>
            </div>
          </div>
        </motion.div>

        {/* Checklist de Etapas Padrão */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>📋</span>
              Selecione a Etapa
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Escolha uma das 4 etapas padrão do projeto
            </p>
          </div>

          <div className="p-6">
            {/* Grid de Etapas Padrão */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {etapasConcluidas.map((etapa, index) => (
                <motion.button
                  key={index}
                  type="button"
                  onClick={() => !etapa.concluida && handleSelecionarEtapa(etapa)}
                  disabled={etapa.concluida}
                  whileHover={!etapa.concluida ? { scale: 1.02 } : {}}
                  whileTap={!etapa.concluida ? { scale: 0.98 } : {}}
                  className={`relative p-5 border-2 rounded-2xl text-left transition-all ${
                    etapa.concluida
                      ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700'
                      : etapaSelecionada?.nome === etapa.nome
                      ? `${etapa.bgColor} border-current shadow-xl ring-2 ring-blue-500/20`
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  {/* Badge de Concluída */}
                  {etapa.concluida && (
                    <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                      <FiCheck className="w-6 h-6 text-white" />
                    </div>
                  )}

                  {/* Badge de Sugerida */}
                  {!etapa.concluida && proximaEtapaSugerida?.nome === etapa.nome && (
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                      Próxima
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className={`text-4xl ${etapa.concluida ? 'grayscale opacity-50' : ''}`}>
                      {etapa.icon}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-extrabold text-gray-400 dark:text-gray-500 tracking-wider">
                          ETAPA {etapa.ordem}
                        </span>
                      </div>
                      <h3 className={`text-xl font-bold mb-2 ${
                        etapa.concluida ? 'text-gray-400 dark:text-gray-600' : etapa.cor
                      }`}>
                        {etapa.nome}
                      </h3>
                      <p className={`text-sm leading-relaxed ${
                        etapa.concluida 
                          ? 'text-gray-400 dark:text-gray-600' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {etapa.descricao}
                      </p>
                    </div>
                  </div>

                  {/* Borda de Seleção Animada */}
                  {etapaSelecionada?.nome === etapa.nome && (
                    <motion.div
                      layoutId="etapa-selected"
                      className="absolute inset-0 border-3 border-blue-500 rounded-2xl pointer-events-none"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center gap-3">
              {etapaSelecionada && (
                <>
                  <div className="text-3xl">{etapaSelecionada.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {etapaSelecionada.nome}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Etapa {etapaSelecionada.ordem} de 4
                    </p>
                  </div>
                </>
              )}
              {!etapaSelecionada && (
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Selecione uma Etapa Acima
                </h2>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Descrição */}
            <div>
              <label
                htmlFor="descricao"
                className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"
              >
                <span className="text-xl">📝</span>
                O que foi desenvolvido nesta etapa?
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                rows={8}
                placeholder="Descreva detalhadamente:&#10;• Objetivos alcançados&#10;• Atividades realizadas&#10;• Resultados obtidos&#10;• Aprendizados importantes&#10;• Desafios enfrentados"
                className={`w-full px-5 py-4 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none text-base ${
                  errors.descricao
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <span>💡</span>
                Seja específico e detalhe o que foi feito nesta fase do projeto
              </p>
              {errors.descricao && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-500 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg"
                >
                  <FiAlertCircle className="w-4 h-4" />
                  {errors.descricao}
                </motion.p>
              )}
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"
              >
                <span className="text-xl">🎯</span>
                Status da Etapa
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base font-medium"
              >
                <option value="PLANEJADA">📋 Planejada</option>
                <option value="EM_ANDAMENTO">⚡ Em Andamento</option>
                <option value="CONCLUIDA">✅ Concluída</option>
                <option value="PAUSADA">⏸️ Pausada</option>
              </select>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <FiAlertCircle className="w-5 h-5" />
                  {errors.submit}
                </p>
              </motion.div>
            )}

            {/* Aviso se nenhuma etapa selecionada */}
            {!etapaSelecionada && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-300 dark:border-yellow-800 rounded-xl"
              >
                <p className="text-base text-yellow-700 dark:text-yellow-400 flex items-center gap-3 font-medium">
                  <FiAlertCircle className="w-6 h-6" />
                  Selecione uma das etapas acima para começar
                </p>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-8 border-t-2 border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                className="flex-1 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-base"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !etapaSelecionada}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-bold text-base"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Salvando Etapa...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="w-6 h-6" />
                    <span>Salvar Etapa</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Etapa Criada!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  A etapa foi adicionada ao projeto com sucesso.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AddStagePage
