import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Mail, Plus, X, UserCheck, AlertCircle, CheckCircle } from 'lucide-react'

interface TeamStepProps {
  formData: any
  updateFormData: (updates: any) => void
  errors: Record<string, string>
}

const TeamStep: React.FC<TeamStepProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  const [newAutor, setNewAutor] = useState('')
  const [autorError, setAutorError] = useState('')
  const [orientadorInput, setOrientadorInput] = useState('')

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleAddAutor = () => {
    setAutorError('')
    
    if (!newAutor.trim()) {
      setAutorError('Digite um e-mail')
      return
    }

    if (!validateEmail(newAutor)) {
      setAutorError('E-mail inválido')
      return
    }

    if (formData.autores.includes(newAutor)) {
      setAutorError('Este autor já foi adicionado')
      return
    }

    updateFormData({
      autores: [...formData.autores, newAutor]
    })
    setNewAutor('')
  }

  const handleRemoveAutor = (index: number) => {
    const newAutores = formData.autores.filter((_: any, i: number) => i !== index)
    updateFormData({ autores: newAutores })
  }

  const handleSetOrientador = () => {
    if (!orientadorInput.trim()) return
    
    if (!validateEmail(orientadorInput)) {
      return
    }

    updateFormData({ orientador: orientadorInput })
    setOrientadorInput('')
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Autores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-500/10 dark:bg-purple-500/20 rounded-xl">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Autores do Projeto
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Adicione todos os membros da equipe
              </p>
            </div>
          </div>

          {/* Input para adicionar autor */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                E-mail do autor <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="email"
                    value={newAutor}
                    onChange={e => setNewAutor(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleAddAutor()}
                    placeholder="autor@email.com"
                    className={`w-full border-2 rounded-xl px-4 py-3 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                      autorError
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                    }`}
                  />
                  {autorError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-2 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {autorError}
                    </motion.p>
                  )}
                </div>
                <button
                  onClick={handleAddAutor}
                  className="px-4 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Adicionar</span>
                </button>
              </div>
            </div>

            {/* Lista de autores */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Autores adicionados ({formData.autores.length})
              </p>
              
              {formData.autores.length === 0 ? (
                <div className="text-center py-8 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nenhum autor adicionado ainda
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Adicione pelo menos um autor para continuar
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence>
                    {formData.autores.map((autor: string, index: number) => (
                      <motion.div
                        key={autor}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl group hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                            {autor.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                              {autor}
                              {index === 0 && (
                                <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                                  Líder
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Autor {index + 1}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveAutor(index)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {errors.autores && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs mt-3 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.autores}
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Orientador */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-500/10 dark:bg-green-500/20 rounded-xl">
              <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Orientador
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Professor responsável pelo projeto
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {formData.orientador ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                      {formData.orientador.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Orientador Definido
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        {formData.orientador}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateFormData({ orientador: '' })}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Remover orientador"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    <Mail className="w-4 h-4 inline mr-1" />
                    O orientador receberá notificações sobre o projeto e poderá acompanhar o desenvolvimento.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  E-mail do orientador <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={orientadorInput}
                    onChange={e => setOrientadorInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSetOrientador()}
                    placeholder="orientador@senai.br"
                    className={`flex-1 border-2 rounded-xl px-4 py-3 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                      errors.orientador
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                    }`}
                  />
                  <button
                    onClick={handleSetOrientador}
                    disabled={!orientadorInput || !validateEmail(orientadorInput)}
                    className="px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-lg transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                  >
                    <UserCheck className="w-5 h-5" />
                    <span className="hidden sm:inline">Definir</span>
                  </button>
                </div>
                {errors.orientador && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-2 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.orientador}
                  </motion.p>
                )}

                {/* Área vazia com instruções */}
                <div className="mt-4 text-center py-8 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <UserCheck className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nenhum orientador definido
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Digite o e-mail do professor orientador acima
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Dica */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
          >
            <div className="flex gap-3">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Sobre o orientador
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  O orientador é o professor responsável por acompanhar o desenvolvimento do projeto. Ele receberá notificações e poderá dar feedback sobre o trabalho.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  )
}

export default TeamStep
