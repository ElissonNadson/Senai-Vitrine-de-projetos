
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, UserCheck, Plus, X, AlertCircle, Crown, CheckCircle, User as UserIcon } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { UserSearchInput, UserOption } from '@/components/ui/UserSearchInput'

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
  const [autorError, setAutorError] = useState('')
  const [orientadorError, setOrientadorError] = useState('')

  // Adicionar automaticamente o email do líder (usuário logado) como primeiro autor
  useEffect(() => {
    // Só executa se tiver usuário logado
    if (!user?.email) return

    // Verifica se precisa adicionar o líder:
    // 1. Se lista vazia
    // 2. OU se lista existe mas não tem líder definido
    const needsLeader = formData.autores.length === 0 || !formData.liderEmail

    if (needsLeader) {
      // Tenta pegar URL do avatar (compatibilidade snake_case e camelCase)
      const avatarUrl = (user as any).avatar_url || (user as any).avatarUrl || user.avatarUrl

      const newAutores = formData.autores.includes(user.email)
        ? formData.autores
        : [user.email, ...formData.autores]

      updateFormData({
        autores: newAutores,
        liderEmail: user.email,
        isLeader: true,
        // Mantém metadata existente e adiciona/atualiza o do user atual
        autoresMetadata: {
          ...formData.autoresMetadata,
          [user.email]: {
            uuid: user.uuid,
            nome: user.nome,
            email: user.email,
            avatar_url: avatarUrl,
            tipo: user.tipo
          }
        }
      })
    }
  }, [user, formData.autores.length, formData.liderEmail])

  const handleAddAutor = (selectedUser: UserOption) => {
    setAutorError('')

    if (formData.autores.includes(selectedUser.email)) {
      setAutorError('Este autor já foi adicionado')
      return
    }

    // Se usuário selecionou um professor como autor, alerta (opcional, já filtrado no busca)
    if (selectedUser.tipo === 'PROFESSOR') {
      setAutorError('Professores devem ser adicionados como orientadores')
      return
    }

    updateFormData({
      autores: [...formData.autores, selectedUser.email],
      autoresMetadata: {
        ...formData.autoresMetadata,
        [selectedUser.email]: selectedUser
      }
    })
  }

  const handleRemoveAutor = (emailToRemove: string) => {
    // Não permitir remover o líder
    if (emailToRemove === formData.liderEmail) {
      setAutorError('O líder do projeto não pode ser removido. Escolha outro líder primeiro.')
      setTimeout(() => setAutorError(''), 3000)
      return
    }

    const newAutores = formData.autores.filter((email: string) => email !== emailToRemove)
    // Opcional: limpar metadata (não estritamente necessário, mas bom pra limpeza)
    const newMetadata = { ...formData.autoresMetadata }
    delete newMetadata[emailToRemove]

    updateFormData({
      autores: newAutores,
      autoresMetadata: newMetadata
    })
  }

  const handleSetLeader = (email: string) => {
    updateFormData({
      liderEmail: email,
      isLeader: email === user?.email
    })
  }

  const handleAddOrientador = (selectedUser: UserOption) => {
    setOrientadorError('')

    // Verificar se o orientador já foi adicionado
    const orientadores = formData.orientador ? formData.orientador.split(',').map((o: string) => o.trim()) : []

    if (orientadores.includes(selectedUser.email)) {
      setOrientadorError('Este orientador já foi adicionado')
      return
    }

    if (selectedUser.tipo === 'ALUNO') {
      setOrientadorError('Alunos não podem ser orientadores')
      return
    }

    // Adicionar o novo orientador à lista (separados por vírgula)
    const novosOrientadores = [...orientadores, selectedUser.email].join(', ')

    updateFormData({
      orientador: novosOrientadores,
      orientadoresMetadata: {
        ...formData.orientadoresMetadata,
        [selectedUser.email]: selectedUser
      }
    })
  }

  const handleRemoveOrientador = (emailToRemove: string) => {
    const orientadores = formData.orientador.split(',').map((o: string) => o.trim())
    const novosOrientadores = orientadores.filter((o: string) => o !== emailToRemove)

    const newMetadata = { ...formData.orientadoresMetadata }
    delete newMetadata[emailToRemove]

    updateFormData({
      orientador: novosOrientadores.length > 0 ? novosOrientadores.join(', ') : '',
      orientadoresMetadata: newMetadata
    })
  }

  const getOrientadores = (): string[] => {
    if (!formData.orientador) return []
    return formData.orientador.split(',').map((o: string) => o.trim()).filter((o: string) => o.length > 0)
  }

  // Função auxiliar para obter dados do usuário (metadata ou fallback)
  const getUserData = (email: string, metadataMap: any) => {
    return metadataMap?.[email] || { nome: email.split('@')[0], email, avatar_url: null }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Autores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700 h-fit"
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
                Adicionar autor <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <UserSearchInput
                  onSelect={handleAddAutor}
                  typeFilter="ALUNO"
                  placeholder="Buscar aluno por nome ou e-mail"
                  excludeEmails={formData.autores}
                />
                {autorError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-2 flex items-center gap-1 absolute top-full left-0 z-10 bg-white dark:bg-gray-800 p-1 rounded shadow-sm"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {autorError}
                  </motion.p>
                )}
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
                    {formData.autores.map((autorEmail: string, index: number) => {
                      const isLeader = autorEmail === formData.liderEmail
                      const hasLeader = formData.liderEmail && formData.liderEmail !== ''
                      const userData = getUserData(autorEmail, formData.autoresMetadata)

                      return (
                        <motion.div
                          key={autorEmail}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={`flex items-center justify-between p-3 rounded-xl group hover:shadow-md transition-all duration-300 ${isLeader
                            ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-300 dark:border-yellow-700 opacity-100'
                            : hasLeader
                              ? 'bg-purple-50/50 dark:bg-purple-900/10 border border-purple-200/50 dark:border-purple-800/50 opacity-100' // Increased opacity for readability
                              : 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 opacity-100'
                            }`}
                        >
                          <div className="flex items-center gap-3 flex-1 overflow-hidden">
                            {userData.avatar_url ? (
                              <img src={userData.avatar_url} alt={userData.nome} className={`w-10 h-10 rounded-full object-cover border-2 ${isLeader ? 'border-yellow-400' : 'border-purple-200'}`} />
                            ) : (
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md transition-all ${isLeader
                                ? 'bg-gradient-to-br from-yellow-500 to-amber-600'
                                : 'bg-gradient-to-br from-purple-500 to-purple-600'
                                }`}>
                                {isLeader ? <Crown className="w-5 h-5" /> : (userData.nome?.[0]?.toUpperCase() || <UserIcon className="w-5 h-5" />)}
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2 truncate">
                                {userData.nome || autorEmail}
                                {isLeader && (
                                  <span className="shrink-0 px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-[10px] font-bold rounded-full shadow-sm">
                                    👑 Líder
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {autorEmail}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {/* Botão para definir líder - aparece no hover */}
                            {!isLeader && (
                              <button
                                onClick={() => handleSetLeader(autorEmail)}
                                className="px-2 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-[10px] font-semibold rounded-lg hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1"
                                title="Definir como líder"
                              >
                                <Crown className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Líder</span>
                              </button>
                            )}
                            {!isLeader && (
                              <button
                                onClick={() => handleRemoveAutor(autorEmail)}
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
                  Passe o mouse sobre um membro e clique no botão <strong>Líder</strong> para defini-lo como líder do projeto.
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
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700 h-fit"
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
                Adicionar orientador <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <UserSearchInput
                  onSelect={handleAddOrientador}
                  typeFilter="PROFESSOR"
                  placeholder="Buscar professor por nome ou e-mail"
                  excludeEmails={getOrientadores()}
                />
                {orientadorError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-2 flex items-center gap-1 absolute top-full left-0 z-10 bg-white dark:bg-gray-800 p-1 rounded shadow-sm"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {orientadorError}
                  </motion.p>
                )}
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
                    {getOrientadores().map((orientadorEmail: string, index: number) => {
                      const userData = getUserData(orientadorEmail, formData.orientadoresMetadata)
                      return (
                        <motion.div
                          key={orientadorEmail}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl group hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            {userData.avatar_url ? (
                              <img src={userData.avatar_url} alt={userData.nome} className="w-10 h-10 rounded-full object-cover border-2 border-green-200 dark:border-green-700" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                {userData.nome?.[0]?.toUpperCase() || <UserIcon className="w-5 h-5" />}
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2 truncate">
                                {userData.nome || orientadorEmail}
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {orientadorEmail}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveOrientador(orientadorEmail)}
                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                            title="Remover orientador"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </motion.div>
                      )
                    })}
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
        </motion.div>

      </div>
    </div>
  )
}

export default TeamStep
