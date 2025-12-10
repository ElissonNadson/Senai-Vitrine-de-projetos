import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Eye, EyeOff, FileCode, Shield, Calendar, CheckCircle2, ExternalLink, Link2, Archive } from 'lucide-react'
import TermsModal from '@/components/modals/TermsModal'

interface CodeSectionProps {
  data: {
    hasRepositorio: boolean
    tipoRepositorio: 'arquivo' | 'link'
    codigo: File | null | undefined
    linkRepositorio: string
    codigoVisibilidade: string
    anexosVisibilidade: string
    aceitouTermos: boolean
  }
  onUpdate: (field: string, value: any) => void
}

const CodeSection: React.FC<CodeSectionProps> = ({ data, onUpdate }) => {
  const codeInputRef = useRef<HTMLInputElement>(null)
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    onUpdate('codigo', file)
  }

  const removeCode = () => {
    onUpdate('codigo', null)
    if (codeInputRef.current) {
      codeInputRef.current.value = ''
    }
  }

  const handleAcceptTerms = () => {
    onUpdate('aceitouTermos', true)
  }

  return (
    <div className="space-y-6">

      {/* Checkbox: Tem Repositório? */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 rounded-2xl p-6 shadow-lg border-2 border-slate-200 dark:border-slate-700"
      >
        <label className="flex items-start gap-4 cursor-pointer group">
          <div className="flex items-center h-6">
            <input
              type="checkbox"
              checked={data.hasRepositorio}
              onChange={e => {
                onUpdate('hasRepositorio', e.target.checked)
                if (e.target.checked) {
                  onUpdate('tipoRepositorio', 'link')
                }
              }}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <FileCode className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-base font-semibold text-gray-900 dark:text-white">
                Este projeto possui repositório de código fonte?
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Marque esta opção se seu projeto envolve programação e você deseja compartilhar o código fonte.
              Projetos de outras áreas (design, modelagem de negócio, protótipos físicos, etc.) não precisam de repositório.
            </p>
          </div>
        </label>
      </motion.div>

      {/* Seção de Link do Repositório (só aparece se hasRepositorio = true) */}
      {data.hasRepositorio && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 rounded-2xl p-8 md:p-10 shadow-lg border-2 border-violet-200 dark:border-violet-700"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl shadow-lg">
              <Link2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Repositório de Código
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Informe o link do repositório
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Link do Repositório
              </label>
              <div className="relative">
                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={data.linkRepositorio || ''}
                  onChange={e => onUpdate('linkRepositorio', e.target.value)}
                  placeholder="https://github.com/usuario/projeto"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            {data.linkRepositorio && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl"
              >
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Link do repositório adicionado!
                </p>
                <a
                  href={data.linkRepositorio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto p-2 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            )}
          </div>

          {/* Dica sobre repositório */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4"
          >
            <div className="flex gap-3">
              <Link2 className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 text-sm mb-1">
                  🌐 Plataformas Suportadas
                </h4>
                <p className="text-xs text-purple-700 dark:text-purple-300 mb-2">
                  Você pode usar qualquer plataforma de hospedagem de código:
                </p>
                <ul className="text-xs text-purple-700 dark:text-purple-300 space-y-1">
                  <li>• GitHub, GitLab, Bitbucket</li>
                  <li>• Azure DevOps, SourceForge</li>
                  <li>• Ou qualquer outro repositório público</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Seção de Privacidade (sempre visível) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: data.hasRepositorio ? 0.2 : 0.1 }}
        className="bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 rounded-3xl p-8 shadow-lg border-2 border-rose-200 dark:border-rose-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Privacidade e Termos
            </h3>
          </div>
        </div>

        <div className="space-y-6">
          {/* Visibilidade dos Anexos */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
              <FileCode className="w-4 h-4" />
              Visibilidade dos Anexos da Timeline
            </label>
            <div className="space-y-2">
              <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${data.anexosVisibilidade === 'Público'
                  ? 'bg-green-500/10 border-green-500 dark:border-green-600'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}>
                <input
                  type="radio"
                  name="anexosVisibilidade"
                  value="Público"
                  checked={data.anexosVisibilidade === 'Público'}
                  onChange={e => onUpdate('anexosVisibilidade', e.target.value)}
                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <div className="flex items-center gap-2 flex-1">
                  <Eye className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Público
                  </span>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${data.anexosVisibilidade === 'Privado'
                  ? 'bg-orange-500/10 border-orange-500 dark:border-orange-600'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}>
                <input
                  type="radio"
                  name="anexosVisibilidade"
                  value="Privado"
                  checked={data.anexosVisibilidade === 'Privado'}
                  onChange={e => onUpdate('anexosVisibilidade', e.target.value)}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                />
                <div className="flex items-center gap-2 flex-1">
                  <EyeOff className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Privado
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Aceite de Termos */}
          <div className={`p-5 rounded-xl border-2 transition-all ${data.aceitouTermos
              ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-600'
              : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800'
            }`}>
            <div className="space-y-3">
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="flex items-center h-6">
                  <input
                    type="checkbox"
                    checked={data.aceitouTermos}
                    onChange={e => onUpdate('aceitouTermos', e.target.checked)}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className={`w-5 h-5 ${data.aceitouTermos ? 'text-green-600' : 'text-red-600'}`} />
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      Aceite os Termos de Uso e Política de Privacidade <span className="text-red-500">*</span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Ao marcar esta opção, você declara que leu e concorda com os termos, incluindo a{' '}
                    <strong>cessão de direitos autorais ao SENAI</strong> e a possibilidade de{' '}
                    <strong>continuação do projeto por outros alunos</strong> caso não seja concluído.
                  </p>
                </div>
              </label>

              {/* Botão para abrir modal completo */}
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
              >
                <FileCode className="w-4 h-4" />
                Ler Termos Completos e Política de Privacidade
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card de Data */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Data de Criação
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                  {new Date().toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Modal de Termos */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={handleAcceptTerms}
      />

    </div>
  )
}

export default CodeSection
