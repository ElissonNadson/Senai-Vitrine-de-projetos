import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, X, Crown, UserCheck, Mail, AlertCircle, GraduationCap } from 'lucide-react'
import { UserSearchInput } from '../UserSearchInput'
import { useAuth } from '@/contexts/auth-context'

interface TeamSectionProps {
  data: {
    autores: string[]
    orientador: string
    liderEmail: string
    isLeader: boolean
    // Adicionando metadados se existirem
    autoresMetadata?: Record<string, any>
    orientadoresMetadata?: Record<string, any>
  }
  onUpdate: (field: string, value: any) => void
}

const TeamSection: React.FC<TeamSectionProps> = ({ data, onUpdate }) => {
  const { user } = useAuth()
  const [autorError, setAutorError] = useState('')
  const [orientadorError, setOrientadorError] = useState('')

  // Adicionar automaticamente o email do líder (usuário logado) como primeiro autor
  useEffect(() => {
    // Só executa se tiver usuário logado e dados carregados
    if (!user?.email || !data) return

    // Verifica se precisa adicionar o líder:
    // 1. Se lista de autores está vazia
    // 2. OU se lista existe mas não tem líder definido
    const needsLeader = data.autores.length === 0 || !data.liderEmail

    if (needsLeader) {
      // Tenta pegar URL do avatar (compatibilidade snake_case e camelCase)
      const avatarUrl = (user as any).avatar_url || (user as any).avatarUrl || user.avatarUrl

      const newAutores = data.autores.includes(user.email)
        ? data.autores
        : [user.email, ...data.autores]

      // Atualiza autores
      onUpdate('autores', newAutores)

      // Define como líder
      onUpdate('liderEmail', user.email)
      onUpdate('isLeader', true)

      // Atualiza metadata do líder
      const currentUserData = {
        nome: user.nome,
        email: user.email,
        avatar_url: avatarUrl,
        tipo: user.tipo,
        uuid: user.uuid
      }

      const newMetadata = { ...data.autoresMetadata, [user.email]: currentUserData }
      onUpdate('autoresMetadata', newMetadata)
    }
  }, [user, data?.autores?.length, data?.liderEmail])

  // Função auxiliar para obter dados do usuário (metadata ou fallback)
  const getUserData = (email: string, metadataMap: any) => {
    return metadataMap?.[email] || { nome: email.split('@')[0], email, avatar_url: null, tipo: 'ALUNO' }
  }

  const handleAddAutor = (selectedUser: any) => {
    setAutorError('')

    // Verifica se selectedUser é string (email) vindo do componente antigo ou objeto
    const emailToAdd = typeof selectedUser === 'string' ? selectedUser : selectedUser.email

    if (!emailToAdd) return

    if (data.autores.includes(emailToAdd)) {
      setAutorError('Este autor já foi adicionado')
      return
    }

    // Se usuário selecionou um professor como autor
    if (typeof selectedUser !== 'string' && selectedUser.tipo === 'PROFESSOR') {
      setAutorError('Professores devem ser adicionados como orientadores')
      return
    }

    onUpdate('autores', [...data.autores, emailToAdd])

    // Se for objeto completo, atualiza metadata
    if (typeof selectedUser !== 'string') {
      const newMetadata = { ...data.autoresMetadata, [emailToAdd]: selectedUser }
      // Precisamos de uma forma de atualizar metadata no pai. 
      // O onUpdate atual só aceita (field, value).
      // Se create-project-form não tiver handler para 'autoresMetadata', isso vai falhar ou ser ignorado.
      // Assumindo que o pai foi atualizado para aceitar qualquer campo do ProjectFormData.
      onUpdate('autoresMetadata', newMetadata)
    }
  }

  const handleAddOrientador = (selectedUser: any) => {
    setOrientadorError('')

    const emailToAdd = typeof selectedUser === 'string' ? selectedUser : selectedUser.email
    if (!emailToAdd) return

    const orientadores = data.orientador ? data.orientador.split(',').map((o: string) => o.trim()) : []
    if (orientadores.includes(emailToAdd)) {
      setOrientadorError('Este orientador já foi adicionado')
      return
    }

    // Validação de tipo
    if (typeof selectedUser !== 'string' && selectedUser.tipo === 'ALUNO') {
      setOrientadorError('Alunos não podem ser orientadores')
      return
    }

    const novosOrientadores = [...orientadores, emailToAdd].join(', ')
    onUpdate('orientador', novosOrientadores)

    if (typeof selectedUser !== 'string') {
      const newMetadata = { ...data.orientadoresMetadata, [emailToAdd]: selectedUser }
      onUpdate('orientadoresMetadata', newMetadata)
    }
  }

  const handleRemoveAutor = (index: number) => {
    const autorToRemove = data.autores[index]
    if (autorToRemove === data.liderEmail) {
      setAutorError('O líder do projeto não pode ser removido.')
      setTimeout(() => setAutorError(''), 3000)
      return
    }
    const newAutores = data.autores.filter((_, i) => i !== index)
    onUpdate('autores', newAutores)

    // Opcional: limpar metadata
    if (data.autoresMetadata) {
      const newMetadata = { ...data.autoresMetadata }
      delete newMetadata[autorToRemove]
      onUpdate('autoresMetadata', newMetadata)
    }
  }

  const handleRemoveOrientador = (emailToRemove: string) => {
    const orientadores = data.orientador.split(',').map((o: string) => o.trim())
    const novosOrientadores = orientadores.filter((o: string) => o !== emailToRemove)
    onUpdate('orientador', novosOrientadores.length > 0 ? novosOrientadores.join(', ') : '')

    if (data.orientadoresMetadata) {
      const newMetadata = { ...data.orientadoresMetadata }
      delete newMetadata[emailToRemove]
      onUpdate('orientadoresMetadata', newMetadata)
    }
  }

  const handleSetLeader = (email: string) => {
    onUpdate('liderEmail', email)
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
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700 h-fit"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-500/10 dark:bg-purple-500/20 rounded-xl">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Autores do Projeto
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Equipe que desenvolveu o projeto
              </p>
            </div>
          </div>

          {/* Input para adicionar autor */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Adicionar Integrante
              </label>

              <UserSearchInput
                placeholder="Busque pelo nome ou digite o e-mail"
                type="ALUNO"
                excludeEmails={data.autores}
                onSelect={(user) => handleAddAutor(user)}
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
                {data.autores.map((autorEmail, index) => {
                  const isLeader = autorEmail === data.liderEmail
                  const hasLeader = data.liderEmail && data.liderEmail !== ''
                  const userData = getUserData(autorEmail, data.autoresMetadata)

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-300 border-2 ${isLeader
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800 opacity-100'
                        : hasLeader
                          ? 'bg-gray-50/50 dark:bg-gray-700/30 border-gray-200/50 dark:border-gray-600/50 opacity-100 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                          : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 opacity-100'
                        }`}
                    >
                      <div className="flex items-center gap-3 flex-1 overflow-hidden">
                        {userData.avatar_url ? (
                          <img src={userData.avatar_url} alt={userData.nome} className={`w-8 h-8 rounded-full object-cover border-2 ${isLeader ? 'border-blue-400' : 'border-gray-200'}`} />
                        ) : (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${isLeader ? 'bg-blue-500' : 'bg-gray-400'}`}>
                            {userData.nome?.[0]?.toUpperCase()}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-gray-900 dark:text-white block truncate">
                            {userData.nome || autorEmail}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 block truncate">
                            {autorEmail}
                          </span>
                          {isLeader && (
                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wide">
                              Líder do Projeto
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Botão para definir líder - aparece no hover */}
                        {!isLeader && (
                          <button
                            onClick={() => handleSetLeader(autorEmail)}
                            className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-semibold rounded hover:bg-blue-200 transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1"
                            title="Definir como líder"
                          >
                            <Crown className="w-3 h-3" />
                            <span className="hidden sm:inline">Líder</span>
                          </button>
                        )}
                        {!isLeader && (
                          <button
                            onClick={() => handleRemoveAutor(index)}
                            className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
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
            className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
          >
            <div className="flex gap-3">
              <Crown className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">
                  Sobre o Líder do Projeto
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
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
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700 h-fit"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-green-500/10 dark:bg-green-500/20 rounded-xl">
              <GraduationCap className="w-6 h-6 text-green-600 dark:text-green-400" />
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
                onSelect={(user) => handleAddOrientador(user)}
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
                {getOrientadores().map((orientadorEmail, index) => {
                  const userData = getUserData(orientadorEmail, data.orientadoresMetadata)
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-all"
                    >
                      <div className="flex items-center gap-3 flex-1 overflow-hidden">
                        {userData.avatar_url ? (
                          <img src={userData.avatar_url} alt={userData.nome} className="w-8 h-8 rounded-full object-cover border-2 border-green-300" />
                        ) : (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs bg-green-500">
                            {userData.nome?.[0]?.toUpperCase()}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-gray-900 dark:text-white block truncate">
                            {userData.nome || orientadorEmail}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 block truncate">
                            {orientadorEmail}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveOrientador(orientadorEmail)}
                        className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )
                })}
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
            className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4"
          >
            <div className="flex gap-3">
              <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm mb-1">
                  Sobre os Orientadores
                </h4>
                <p className="text-xs text-green-700 dark:text-green-300">
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
