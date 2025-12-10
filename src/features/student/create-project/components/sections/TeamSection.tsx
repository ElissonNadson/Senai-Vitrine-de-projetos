import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, X, Crown, UserCheck, Mail, AlertCircle, GraduationCap } from 'lucide-react'
import { UserSearchInput } from '../UserSearchInput'

interface TeamSectionProps {
  data: {
    autores: string[]
    orientador: string
    liderEmail: string
    isLeader: boolean
  }
  onUpdate: (field: string, value: string | boolean | string[]) => void
}

const TeamSection: React.FC<TeamSectionProps> = ({ data, onUpdate }) => {
  const [autorError, setAutorError] = useState('')
  const [orientadorError, setOrientadorError] = useState('')

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleAddAutor = (emailToAdd: string) => {
    setAutorError('')

    if (!emailToAdd.trim()) {
      setAutorError('Digite um e-mail')
      return
    }

    if (!validateEmail(emailToAdd)) {
      setAutorError('E-mail inválido')
      return
    }

    if (data.autores.includes(emailToAdd)) {
      setAutorError('Este autor já foi adicionado')
      return
    }

    onUpdate('autores', [...data.autores, emailToAdd])
  }

  const handleRemoveAutor = (index: number) => {
    const autorToRemove = data.autores[index]

    // Não permitir remover o líder
    if (autorToRemove === data.liderEmail) {
      setAutorError('O líder do projeto não pode ser removido. Escolha outro líder primeiro.')
      setTimeout(() => setAutorError(''), 3000)
      return
    }

    const newAutores = data.autores.filter((_, i) => i !== index)
    onUpdate('autores', newAutores)
  }

  const handleSetLeader = (email: string) => {
    onUpdate('liderEmail', email)
  }

  const handleSetOrientador = (emailToAdd: string) => {
    setOrientadorError('')

    if (!emailToAdd.trim()) {
      setOrientadorError('Digite um e-mail')
      return
    }

    if (!validateEmail(emailToAdd)) {
      setOrientadorError('E-mail inválido')
      return
    }

    const orientadores = data.orientador ? data.orientador.split(',').map((o: string) => o.trim()) : []
    if (orientadores.includes(emailToAdd)) {
      setOrientadorError('Este orientador já foi adicionado')
      return
    }

    const novosOrientadores = [...orientadores, emailToAdd].join(', ')
    onUpdate('orientador', novosOrientadores)
  }

  const handleRemoveOrientador = (emailToRemove: string) => {
    const orientadores = data.orientador.split(',').map((o: string) => o.trim())
    const novosOrientadores = orientadores.filter((o: string) => o !== emailToRemove)
    onUpdate('orientador', novosOrientadores.length > 0 ? novosOrientadores.join(', ') : '')
  }

  const getOrientadores = (): string[] => {
    if (!data.orientador) return []
    return data.orientador.split(',').map((o: string) => o.trim()).filter((o: string) => o.length > 0)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Autores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-3xl p-8 md:p-10 shadow-lg border-2 border-emerald-200 dark:border-emerald-800"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Autores do Projeto
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
                Equipe que desenvolveu o projeto
              </p>
            </div>
          </div>

          {/* Input para adicionar autor */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Adicionar E-mail do Integrante
              </label>

              <UserSearchInput
                placeholder="Busque pelo nome ou digite o e-mail"
                type="ALUNO"
                excludeEmails={data.autores}
                onSelect={(email) => handleAddAutor(email)}
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

            {/* Lista de Autores */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Membros da Equipe ({data.autores.length})
              </label>

              <div className="space-y-2">
                {data.autores.map((autor, index) => {
                  const isLeader = autor === data.liderEmail
                  const hasLeader = data.liderEmail && data.liderEmail !== ''
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-300 border-2 ${isLeader
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800 opacity-100'
                        : hasLeader
                          ? 'bg-gray-50/50 dark:bg-gray-700/30 border-gray-200/50 dark:border-gray-600/50 opacity-60 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                          : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 opacity-100'
                        }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {isLeader ? (
                          <Crown className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        ) : (
                          <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white block">
                            {autor}
                          </span>
                          {isLeader && (
                            <span className="text-xs text-yellow-700 dark:text-yellow-400 font-semibold">
                              Líder do Projeto
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Botão para definir líder - aparece no hover */}
                        {!isLeader && (
                          <button
                            onClick={() => handleSetLeader(autor)}
                            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-lg hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1"
                            title="Definir como líder"
                          >
                            <Crown className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Líder</span>
                          </button>
                        )}
                        {!isLeader && (
                          <button
                            onClick={() => handleRemoveAutor(index)}
                            className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {data.autores.length === 0 && (
                <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum autor adicionado ainda</p>
                </div>
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
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 text-sm mb-1">
                  Sobre o Líder do Projeto
                </h4>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  Passe o mouse sobre um membro e clique no botão <strong>Líder</strong> para defini-lo como líder. O líder terá permissões especiais de edição e não poderá ser removido.
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
          className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-3xl p-8 md:p-10 shadow-lg border-2 border-emerald-200 dark:border-emerald-800"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-xl">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Orientador(es)
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
                Professor(es) responsável(is) pelo projeto
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Input para adicionar orientador */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Adicionar Orientador
              </label>
              <UserSearchInput
                placeholder="Busque pelo nome ou digite o e-mail"
                type="PROFESSOR"
                excludeEmails={getOrientadores()}
                onSelect={(email) => handleSetOrientador(email)}
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

            {/* Lista de Orientadores */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Orientadores ({getOrientadores().length})
              </label>

              <div className="space-y-2">
                {getOrientadores().map((orientador, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex items-center justify-between p-4 bg-green-500/5 dark:bg-green-500/10 border-2 border-green-200 dark:border-green-800 rounded-xl hover:bg-green-500/10 transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {orientador}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveOrientador(orientador)}
                      className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>

              {getOrientadores().length === 0 && (
                <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                  <UserCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum orientador adicionado ainda</p>
                </div>
              )}
            </div>
          </div>

          {/* Dica sobre orientadores */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
          >
            <div className="flex gap-3">
              <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">
                  Sobre os Orientadores
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Você pode adicionar um ou mais orientadores. Eles receberão notificações sobre o projeto.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  )
}

export default TeamSection
