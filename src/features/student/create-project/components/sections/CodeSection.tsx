import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileCode, Shield, CheckCircle2, ExternalLink, Link2, Github } from 'lucide-react'
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
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <Github className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Código e Visibilidade
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie como seu projeto será acessado
            </p>
          </div>
        </div>

        <div className="space-y-8">
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
                        className={`w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border-2 rounded-xl transition-all ${errors.linkRepositorio
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

          {/* Configurações de Privacidade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Shield className="w-4 h-4" />
                Visibilidade do Código
              </label>
              <select
                value={data.codigoVisibilidade}
                onChange={e => onUpdate('codigoVisibilidade', e.target.value)}
                className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="public">Público (Qualquer um pode ver)</option>
                <option value="private">Privado (Apenas equipe e docentes)</option>
                <option value="internal">Interno (Apenas alunos SENAI)</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <FileCode className="w-4 h-4" />
                Visibilidade dos Anexos
              </label>
              <select
                value={data.anexosVisibilidade}
                onChange={e => onUpdate('anexosVisibilidade', e.target.value)}
                className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="public">Público</option>
                <option value="private">Privado</option>
                <option value="internal">Interno</option>
              </select>
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
