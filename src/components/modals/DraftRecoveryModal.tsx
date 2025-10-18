import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, RefreshCw, Trash2, Clock, X } from 'lucide-react'

interface DraftRecoveryModalProps {
  isOpen: boolean
  onContinue: () => void
  onStartFresh: () => void
  draftDate?: Date
}

const DraftRecoveryModal: React.FC<DraftRecoveryModalProps> = ({
  isOpen,
  onContinue,
  onStartFresh,
  draftDate
}) => {
  if (!isOpen) return null

  const formatDate = (date?: Date) => {
    if (!date) return 'recentemente'
    
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'agora mesmo'
    if (minutes < 60) return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`
    if (hours < 24) return `há ${hours} hora${hours > 1 ? 's' : ''}`
    if (days < 7) return `há ${days} dia${days > 1 ? 's' : ''}`
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop com blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                onStartFresh()
              }
            }}
          >
            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative"
            >
              {/* Decoração de fundo */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl -z-0" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl -z-0" />
              
              {/* Conteúdo do Modal */}
              <div className="relative z-10">
                {/* Header com gradiente */}
                <div className="bg-gradient-to-r from-primary via-primary-dark to-indigo-700 px-8 py-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div
                        initial={{ rotate: -10, scale: 0.9 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl"
                      >
                        <FileText className="w-7 h-7 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                          Rascunho Encontrado!
                        </h3>
                        <div className="flex items-center gap-2 text-white/90 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>Salvo {formatDate(draftDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="px-8 py-6">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-8"
                  >
                    Encontramos um rascunho salvo do seu projeto. 
                    Você pode continuar de onde parou ou começar um novo projeto do zero.
                  </motion.p>

                  {/* Opções com cards */}
                  <div className="grid gap-4 mb-6">
                    {/* Opção: Continuar */}
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onContinue}
                      className="group relative bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-indigo-700 text-white rounded-2xl p-5 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
                    >
                      {/* Efeito de brilho no hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      
                      <div className="relative flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                          <RefreshCw className="w-6 h-6" />
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="font-bold text-lg mb-1">
                            Continuar de onde parei
                          </h4>
                          <p className="text-white/90 text-sm">
                            Retomar o progresso do rascunho salvo
                          </p>
                        </div>
                        <motion.div
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.div>
                      </div>
                    </motion.button>

                    {/* Opção: Começar do Zero */}
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onStartFresh}
                      className="group relative bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-2 border-gray-200 dark:border-gray-600 rounded-2xl p-5 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden"
                    >
                      <div className="relative flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl">
                          <Trash2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">
                            Começar do zero
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Descartar o rascunho e criar um novo projeto
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  </div>

                  {/* Info adicional */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
                  >
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                      <strong className="font-semibold">Dica:</strong> Seus rascunhos são salvos automaticamente enquanto você trabalha no projeto.
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default DraftRecoveryModal
