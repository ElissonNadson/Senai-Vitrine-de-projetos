import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Mail, Plus, X, UserCheck, AlertCircle, CheckCircle, Crown } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

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
  const { user } = useAuth()
  const [newAutor, setNewAutor] = useState('')
  const [autorError, setAutorError] = useState('')
  const [orientadorInput, setOrientadorInput] = useState('')
  const [orientadorError, setOrientadorError] = useState('')

  // Adicionar automaticamente o email do líder (usuário logado) como primeiro autor
  useEffect(() => {
    if (user?.email && formData.autores.length === 0) {
      updateFormData({
        autores: [user.email],
        liderEmail: user.email,
        isLeader: true
      })
    }
  }, [user])

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
    const autorToRemove = formData.autores[index]
    
    // Não permitir remover o líder
    if (autorToRemove === formData.liderEmail) {
      setAutorError('O líder do projeto não pode ser removido. Escolha outro líder primeiro.')
      setTimeout(() => setAutorError(''), 3000)
      return
    }
    
    const newAutores = formData.autores.filter((_: any, i: number) => i !== index)
    updateFormData({ autores: newAutores })
  }

  const handleSetLeader = (email: string) => {
    updateFormData({ 
      liderEmail: email,
      isLeader: email === user?.email 
    })
  }

  const handleSetOrientador = () => {
    setOrientadorError('')
    
    if (!orientadorInput.trim()) {
      setOrientadorError('Digite um e-mail')
      return
    }
    
    if (!validateEmail(orientadorInput)) {
      setOrientadorError('E-mail inválido')
      return
    }

    // Verificar se o orientador já foi adicionado
    const orientadores = formData.orientador ? formData.orientador.split(',').map((o: string) => o.trim()) : []
    if (orientadores.includes(orientadorInput)) {
      setOrientadorError('Este orientador já foi adicionado')
      return
    }

    // Adicionar o novo orientador à lista (separados por vírgula)
    const novosOrientadores = [...orientadores, orientadorInput].join(', ')
    updateFormData({ orientador: novosOrientadores })
    setOrientadorInput('')
  }

  const handleRemoveOrientador = (emailToRemove: string) => {
    const orientadores = formData.orientador.split(',').map((o: string) => o.trim())
    const novosOrientadores = orientadores.filter((o: string) => o !== emailToRemove)
    updateFormData({ orientador: novosOrientadores.length > 0 ? novosOrientadores.join(', ') : '' })
  }

  const getOrientadores = (): string[] => {
    if (!formData.orientador) return []
    return formData.orientador.split(',').map((o: string) => o.trim()).filter((o: string) => o.length > 0)
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
                Você é o líder. Adicione os membros da equipe
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
                    {formData.autores.map((autor: string, index: number) => {
                      const isLeader = autor === formData.liderEmail
                      const hasLeader = formData.liderEmail && formData.liderEmail !== ''
                      return (
                        <motion.div
                          key={autor}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={`flex items-center justify-between p-4 rounded-xl group hover:shadow-md transition-all duration-300 ${
                            isLeader
                              ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-300 dark:border-yellow-700 opacity-100'
                              : hasLeader
                              ? 'bg-purple-50/50 dark:bg-purple-900/10 border border-purple-200/50 dark:border-purple-800/50 opacity-60 hover:opacity-100'
                              : 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 opacity-100'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md transition-all ${
                              isLeader
                                ? 'bg-gradient-to-br from-yellow-500 to-amber-600'
                                : 'bg-gradient-to-br from-purple-500 to-purple-600'
                            }`}>
                              {isLeader ? <Crown className="w-5 h-5" /> : autor.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                {autor}
                                {isLeader && (
                                  <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold rounded-full shadow-sm">
                                    👑 Líder
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {isLeader ? 'Líder do projeto' : `Membro ${index + 1}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Botão para definir líder - aparece no hover */}
                            {!isLeader && (
                              <button
                                onClick={() => handleSetLeader(autor)}
                                className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-semibold rounded-lg hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1"
                                title="Definir como líder"
                              >
                                <Crown className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Líder</span>
                              </button>
                            )}
                            {!isLeader && (
                              <button
                                onClick={() => handleRemoveAutor(index)}
                                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                title="Remover membro"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
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

          {/* Dica sobre o líder */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4"
          >
            <div className="flex gap-3">
              <Crown className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                  👑 Escolha o líder do projeto
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 leading-relaxed">
                  Passe o mouse sobre um membro e clique no botão <strong>Líder</strong> para defini-lo como líder do projeto. O líder terá permissões especiais de edição e não poderá ser removido.
                </p>
              </div>
            </div>
          </motion.div>
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
                Orientador(es)
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Adicione um ou mais professores orientadores
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Input para adicionar orientador */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                E-mail do orientador <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="email"
                    value={orientadorInput}
                    onChange={e => setOrientadorInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSetOrientador()}
                    placeholder="orientador@senai.br"
                    className={`w-full border-2 rounded-xl px-4 py-3 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${
                      orientadorError || errors.orientador
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  />
                  {orientadorError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-2 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {orientadorError}
                    </motion.p>
                  )}
                </div>
                <button
                  onClick={handleSetOrientador}
                  className="px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Adicionar</span>
                </button>
              </div>
            </div>

            {/* Lista de orientadores */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Orientadores adicionados ({getOrientadores().length})
              </p>
              
              {getOrientadores().length === 0 ? (
                <div className="text-center py-8 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <UserCheck className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nenhum orientador adicionado ainda
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Adicione pelo menos um professor orientador
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence>
                    {getOrientadores().map((orientador: string, index: number) => (
                      <motion.div
                        key={orientador}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl group hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                            {orientador.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                              {orientador}
                              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Orientador {index + 1}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveOrientador(orientador)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Remover orientador"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {errors.orientador && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs mt-3 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.orientador}
                </motion.p>
              )}
            </div>
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
                  Sobre os orientadores
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  Você pode adicionar um ou mais professores orientadores. Eles receberão notificações e poderão acompanhar o desenvolvimento do projeto dando feedback sobre o trabalho.
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
