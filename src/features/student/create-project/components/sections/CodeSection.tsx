import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileCode, Shield, CheckCircle2, ExternalLink, Link2, Github, Globe } from 'lucide-react'
import TermsModal from '@/components/modals/TermsModal'


interface CodeSectionProps {
  data: {
    hasRepositorio: boolean
    codigo?: File | null
    linkRepositorio: string
    codigoVisibilidade: string
    anexosVisibilidade: string
    aceitouTermos: boolean
  }
  errors?: Record<string, string>
  onUpdate: (field: string, value: any) => void
}

const CodeSection: React.FC<CodeSectionProps> = ({ data, errors = {}, onUpdate }) => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)

  const handleAcceptTerms = () => {
    onUpdate('aceitouTermos', true)
    setIsTermsModalOpen(false)
  }

  return (
    <div className="space-y-8">
      {/* Container Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
            <Github className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Código e Visibilidade
            </h2>
            <p className="text-indigo-100">
              Gerencie como seu projeto será acessado
            </p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Opção de Repositório */}
          <div>
            <label className="flex items-center gap-3 p-4 border-2 border-gray-100 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <input
                type="checkbox"
                checked={data.hasRepositorio}
                onChange={e => onUpdate('hasRepositorio', e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="font-medium text-gray-900 dark:text-white">
                Este projeto possui repositório de código (GitHub, GitLab, etc)
              </span>
            </label>

            {/* Link do Repositório (Condicional) */}
            <AnimatePresence>
              {data.hasRepositorio && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Link do Repositório <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="url"
                        value={data.linkRepositorio}
                        onChange={e => onUpdate('linkRepositorio', e.target.value)}
                        placeholder="https://github.com/seu-usuario/seu-projeto"
                        className={`w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border-2 rounded-xl transition-all ${errors.linkRepositorio
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                          }`}
                      />
                    </div>
                    {errors.linkRepositorio && (
                      <p className="text-red-500 text-sm mt-1">{errors.linkRepositorio}</p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Cole o link completo para o repositório público do seu projeto
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700" />

          {/* Configurações de Privacidade - Refatorado para Cards Visuais */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Configurações de Privacidade
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Visibilidade do Código */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Visibilidade do Código
                </label>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => onUpdate('codigoVisibilidade', 'Público')}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${data.codigoVisibilidade === 'Público'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-400'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-gray-600'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 p-2 rounded-lg ${data.codigoVisibilidade === 'Público' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                        }`}>
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`font-bold ${data.codigoVisibilidade === 'Público' ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-900 dark:text-white'
                          }`}>
                          Público Interno
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Visível para alunos e docentes do SENAI
                        </p>
                      </div>
                      {data.codigoVisibilidade === 'Público' && (
                        <div className="absolute top-4 right-4 text-indigo-600 dark:text-indigo-400">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdate('codigoVisibilidade', 'Privado')}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${data.codigoVisibilidade === 'Privado'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-400'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-gray-600'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 p-2 rounded-lg ${data.codigoVisibilidade === 'Privado' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                        }`}>
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`font-bold ${data.codigoVisibilidade === 'Privado' ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-900 dark:text-white'
                          }`}>
                          Privado
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Apenas equipe e orientadores
                        </p>
                      </div>
                      {data.codigoVisibilidade === 'Privado' && (
                        <div className="absolute top-4 right-4 text-indigo-600 dark:text-indigo-400">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* Visibilidade dos Anexos */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Visibilidade dos Anexos
                </label>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => onUpdate('anexosVisibilidade', 'Público')}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${data.anexosVisibilidade === 'Público'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-400'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-gray-600'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 p-2 rounded-lg ${data.anexosVisibilidade === 'Público' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                        }`}>
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`font-bold ${data.anexosVisibilidade === 'Público' ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-900 dark:text-white'
                          }`}>
                          Público Interno
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Visível para alunos e docentes do SENAI
                        </p>
                      </div>
                      {data.anexosVisibilidade === 'Público' && (
                        <div className="absolute top-4 right-4 text-indigo-600 dark:text-indigo-400">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdate('anexosVisibilidade', 'Privado')}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${data.anexosVisibilidade === 'Privado'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-400'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-gray-600'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 p-2 rounded-lg ${data.anexosVisibilidade === 'Privado' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                        }`}>
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`font-bold ${data.anexosVisibilidade === 'Privado' ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-900 dark:text-white'
                          }`}>
                          Privado
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Apenas equipe e orientadores
                        </p>
                      </div>
                      {data.anexosVisibilidade === 'Privado' && (
                        <div className="absolute top-4 right-4 text-indigo-600 dark:text-indigo-400">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Termos de Uso */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-5 rounded-xl border-2 transition-all ${errors.aceitouTermos
          ? 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-800'
          : data.aceitouTermos
            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
            : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
          }`}
      >
        <div className="space-y-4">
          <label className="flex items-start gap-4 cursor-pointer">
            <div className="pt-1">
              <input
                type="checkbox"
                checked={data.aceitouTermos}
                onChange={e => onUpdate('aceitouTermos', e.target.checked)}
                className={`w-5 h-5 rounded focus:ring-offset-0 ${errors.aceitouTermos ? 'text-red-600 focus:ring-red-500' : 'text-green-600 focus:ring-green-500'
                  }`}
              />
            </div>
            <div className="flex-1">
              <p className={`font-medium ${errors.aceitouTermos ? 'text-red-800 dark:text-red-200' : 'text-gray-900 dark:text-white'}`}>
                Concordo com os Termos de Publicação <span className="text-red-500">*</span>
              </p>
              <p className={`text-sm mt-1 ${errors.aceitouTermos ? 'text-red-700 dark:text-red-300' : 'text-gray-500 dark:text-gray-400'}`}>
                Declaro que este projeto é de minha autoria (ou de minha equipe) e autorizo sua publicação na Vitrine de Projetos do SENAI.
                Estou ciente de que o conteúdo será visível para outros usuários conforme as configurações de privacidade escolhidas.
              </p>
              {errors.aceitouTermos && (
                <p className="text-red-600 text-sm font-bold mt-2 animate-pulse">
                  {errors.aceitouTermos}
                </p>
              )}
            </div>
          </label>

          <div className="pl-9">
            <button
              type="button"
              onClick={() => setIsTermsModalOpen(true)}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
            >
              Ler termos completos
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>

      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={handleAcceptTerms}
      />
    </div>
  )
}

export default CodeSection
