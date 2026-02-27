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
    orientadorAtualEmail?: string
    // Adicionando metadados se existirem
    autoresMetadata?: Record<string, any>
    orientadoresMetadata?: Record<string, any>
    historicoOrientadores?: any[]
  }
  onUpdate: (field: string, value: any) => void
  errors?: Record<string, string>
}

const TeamSection: React.FC<TeamSectionProps> = ({ data, errors = {}, onUpdate }) => {
  console.log('[TeamSection] Rendering', { numAutores: data.autores.length, hasOrientador: !!data.orientador })

  const { user } = useAuth()
  const [autorError, setAutorError] = useState('')
  const [orientadorError, setOrientadorError] = useState('')

  // Ref para controlar se já tentamos adicionar o usuário automaticamente
  const hasAutoAddedUser = React.useRef(false)

  // Adicionar automaticamente o email do usuário
  useEffect(() => {
    // Só executa se tiver usuário logado e dados carregados
    if (!user?.email || !data) return

    if (user.tipo === 'DOCENTE') {
      // Se já verificamos/adicionamos, não força novamente (permite remover)
      if (hasAutoAddedUser.current) return

      // Lógica para DOCENTE
      const orientadores = data.orientador ? data.orientador.split(',').map(o => o.trim()) : []

      // Se não estiver na lista de orientadores, adiciona
      if (!orientadores.includes(user.email)) {
        const novosOrientadores = [...orientadores, user.email].join(', ')
        onUpdate('orientador', novosOrientadores)

        // Se for o primeiro, define como atual
        if (!data.orientadorAtualEmail) {
          onUpdate('orientadorAtualEmail', user.email)
        }

        // Metadata
        const avatarUrl = (user as any).avatar_url || (user as any).avatarUrl || user.avatarUrl || null
        const currentUserData = {
          nome: user.nome,
          email: user.email,
          avatar_url: avatarUrl,
          tipo: user.tipo,
          uuid: user.uuid
        }
        const newMetadata = { ...data.orientadoresMetadata, [user.email]: currentUserData }
        onUpdate('orientadoresMetadata', newMetadata)
      }

      // Marca como processado
      hasAutoAddedUser.current = true
    } else {
      // Lógica existente para ALUNO (Author/Leader)
      // Verifica se precisa adicionar o líder:
      // 1. Se lista de autores está vazia
      // 2. OU se lista existe mas não tem líder definido
      const needsLeader = data.autores.length === 0 || !data.liderEmail

      if (needsLeader) {
        // Tenta pegar URL do avatar (compatibilidade snake_case e camelCase)
        const avatarUrl = (user as any).avatar_url || (user as any).avatarUrl || user.avatarUrl || null

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
    }
  }, [user, data?.autores?.length, data?.liderEmail, data?.orientador])

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

    // Se usuário selecionou um docente como autor
    if (typeof selectedUser !== 'string' && selectedUser.tipo === 'DOCENTE') {
      setAutorError('Docentes devem ser adicionados como orientadores')
      return
    }

    onUpdate('autores', [...data.autores, emailToAdd])

    // Se for objeto completo, atualiza metadata
    if (typeof selectedUser !== 'string') {
      const newMetadata = { ...data.autoresMetadata, [emailToAdd]: selectedUser }
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

    // Se não tem orientador atual, define o novo como atual
    if (!data.orientadorAtualEmail) {
      onUpdate('orientadorAtualEmail', emailToAdd)
    }

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

  // Alternar status (Ativo/Inativo) via Badge
  const handleToggleStatus = (email: string, userMeta: any) => {
    const ativos = getOrientadoresAtivos()
    const isAtivo = ativos.includes(email)

    if (isAtivo) {
      // Bloquear se for o único ativo (REGRA DE NEGÓCIO)
      if (ativos.length <= 1) {
        setOrientadorError('O projeto precisa ter pelo menos um orientador ativo. Adicione outro antes de desativar este.')
        setTimeout(() => setOrientadorError(''), 6000)
        return
      }

      // Desativar: Remove de ativos, garante em histórico (fica cinza)
      const novosAtivos = ativos.filter(a => a !== email).join(', ')
      onUpdate('orientador', novosAtivos)

      const historico = data.historicoOrientadores || []
      if (!historico.some((h: any) => h.email === email)) {
        // Se não tem meta, tenta usar o userMeta passado
        const metaParaSalvar = userMeta || { email, nome: email }
        onUpdate('historicoOrientadores', [...historico, { ...metaParaSalvar, email, ativo: false }])
      }
      setOrientadorError('')
    } else {
      // Ativar: Adiciona em ativos (fica verde)
      // Verifica limite se necessário (opcional - aqui só permitimos toggle livre)
      const novosAtivos = [...ativos, email].join(', ')
      onUpdate('orientador', novosAtivos)
      setOrientadorError('')
    }
  }

  // Botão X: Remove da lista do projeto
  const handleRemoveOrientadorTotalmente = (email: string) => {
    const ativos = getOrientadoresAtivos()

    // Se estiver removendo e for o único, bloqueia
    if (ativos.length <= 1) {
      setOrientadorError('O projeto precisa ter pelo menos um orientador. Adicione outro antes de remover este.')
      setTimeout(() => setOrientadorError(''), 6000)
      return
    }

    if (ativos.includes(email)) {
      const novosAtivos = ativos.filter(a => a !== email)
      onUpdate('orientador', novosAtivos.join(', '))

      // Se removeu o atual, passa para o primeiro disponível
      if (email === data.orientadorAtualEmail && novosAtivos.length > 0) {
        onUpdate('orientadorAtualEmail', novosAtivos[0])
      } else if (email === data.orientadorAtualEmail) {
        onUpdate('orientadorAtualEmail', '')
      }
    }

    // Remove de histórico se existir lá
    if (data.historicoOrientadores) {
      onUpdate('historicoOrientadores', data.historicoOrientadores.filter((h: any) => h.email !== email))
    }
    setOrientadorError('')
  }

  const handleSetLeader = (email: string) => {
    onUpdate('liderEmail', email)
  }

  const handleSetOrientadorAtual = (email: string) => {
    onUpdate('orientadorAtualEmail', email)
  }

  const getOrientadoresAtivos = (): string[] => {
    if (!data.orientador) return []
    return data.orientador.split(',').map((o: string) => o.trim()).filter((o: string) => o.length > 0)
  }

  // Filtrar orientadores do histórico que NÃO estão ativos
  const getOrientadoresInativos = () => {
    const ativos = getOrientadoresAtivos()
    if (!data.historicoOrientadores) return []
    return data.historicoOrientadores.filter((h: any) => !ativos.includes(h.email))
  }

  const orientadoresInativos = getOrientadoresInativos();
  const orientadoresAtivosCount = getOrientadoresAtivos().length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Autores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`bg-green-50/50 dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg border ${errors.autores ? 'border-red-300 ring-2 ring-red-500/20' : 'border-green-200 dark:border-gray-700'} h-fit`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-500/10 dark:bg-green-500/20 rounded-xl">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Autores do Projeto <span className="text-red-500">*</span>
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Equipe que desenvolveu o projeto
              </p>
            </div>
          </div>

          {errors.autores && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 text-red-500 text-sm bg-red-50 p-3 rounded-lg flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.autores}
            </motion.div>
          )}

          {/* Alerta para Docente */}
          {user?.tipo === 'DOCENTE' && !data.liderEmail && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`mb-6 p-4 ${errors.lider ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'} border-2 rounded-xl flex gap-3`}
            >
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${errors.lider ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`} />
              <div className="text-sm">
                <p className={`font-bold mb-1 ${errors.lider ? 'text-red-800 dark:text-red-200' : 'text-amber-800 dark:text-amber-200'}`}>
                  {errors.lider ? '⚠️ Líder obrigatório!' : 'Atenção: Defina um Líder'}
                </p>
                <p className={`text-xs ${errors.lider ? 'text-red-700 dark:text-red-300' : 'text-amber-700 dark:text-amber-300'}`}>
                  {errors.lider || 'Adicione um aluno e defina-o como líder do projeto para poder publicar.'}
                </p>
              </div>
            </motion.div>
          )}

          {/* Erro de líder quando não é docente (o alerta acima não aparece) */}
          {errors.lider && user?.tipo !== 'DOCENTE' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg flex items-center gap-2 border border-red-200 dark:border-red-700"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.lider}
            </motion.div>
          )}

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
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-800 opacity-100'
                        : hasLeader
                          ? 'bg-white/70 dark:bg-gray-700/30 border-gray-200/50 dark:border-gray-600/50 opacity-100 hover:opacity-100 hover:bg-white dark:hover:bg-gray-700'
                          : 'bg-white/70 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 opacity-100'
                        }`}
                    >
                      <div className="flex items-center gap-3 flex-1 overflow-hidden">
                        {userData.avatar_url ? (
                          <img src={userData.avatar_url} alt={userData.nome} className={`w-8 h-8 rounded-full object-cover border-2 ${isLeader ? 'border-indigo-400' : 'border-gray-200'}`} />
                        ) : (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${isLeader ? 'bg-indigo-500' : 'bg-gray-400'}`}>
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
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wide">
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
                            className="px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 text-xs font-semibold rounded hover:bg-indigo-200 transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1"
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
            className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4"
          >
            <div className="flex gap-3">
              <Crown className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 text-sm mb-1">
                  Sobre o Líder do Projeto
                </h4>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">
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
          className={`bg-green-50/50 dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg border ${errors.orientador ? 'border-red-300 ring-2 ring-red-500/20' : 'border-green-200 dark:border-gray-700'} h-fit`}
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
                Docente(s) responsável(is) pelo projeto
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
                type="DOCENTE"
                excludeEmails={getOrientadoresAtivos()}
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

            {/* Lista Unificada de Orientadores */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Orientadores ({orientadoresAtivosCount + orientadoresInativos.length})
              </label>

              <div className="space-y-2">
                <AnimatePresence mode='popLayout'>
                  {/* Combina ativos e inativos numa única renderização visual */}
                  {[
                    ...getOrientadoresAtivos().map(email => ({ ...getUserData(email, data.orientadoresMetadata), email, ativo: true })),
                    ...orientadoresInativos.map((h: any) => ({ ...h, ativo: false }))
                  ].map((orientador) => {
                    const isAtual = orientador.email === data.orientadorAtualEmail && orientador.ativo
                    const hasAtual = data.orientadorAtualEmail && data.orientadorAtualEmail !== ''

                    return (
                      <motion.div
                        layout
                        key={orientador.email}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`group flex items-center justify-between p-3 border rounded-xl transition-all shadow-sm ${isAtual
                          ? 'bg-green-100 dark:bg-green-900/40 border-green-400 dark:border-green-600 shadow-md ring-1 ring-green-400 dark:ring-green-500 hover:bg-green-50 dark:hover:bg-green-900/50'
                          : orientador.ativo
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30'
                            : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 grayscale hover:grayscale-0'
                          }`}
                      >
                        <div className={`flex items-center gap-3 flex-1 overflow-hidden transition-opacity ${orientador.ativo ? '' : 'opacity-60 group-hover:opacity-100'}`}>
                          {orientador.avatar_url ? (
                            <img src={orientador.avatar_url} alt={orientador.nome} className={`w-8 h-8 rounded-full object-cover border-2 ${isAtual ? 'border-green-400' : 'border-gray-300'}`} />
                          ) : (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${isAtual ? 'bg-green-500' : 'bg-gray-400'}`}>
                              {orientador.nome?.[0]?.toUpperCase()}
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <span className={`text-sm font-medium block truncate ${orientador.ativo ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                              {orientador.nome || orientador.email}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 block truncate">
                              {orientador.email}
                            </span>
                            {isAtual && (
                              <span className="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase tracking-wide">
                                Orientador Atual
                              </span>
                            )}
                            {!isAtual && orientador.ativo && (
                              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wide">
                                Coorientador
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Botão/Badge para definir como Atual */}
                          {orientador.ativo && (
                            <button
                              onClick={() => !isAtual && handleSetOrientadorAtual(orientador.email)}
                              disabled={isAtual}
                              className={`px-3 py-1.5 flex items-center gap-1.5 font-bold rounded-lg transition-all ${isAtual
                                ? 'bg-green-500 text-white shadow hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 cursor-default'
                                : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 hover:bg-green-200 cursor-pointer opacity-0 group-hover:opacity-100 '
                                }`}
                              title={isAtual ? "Este é o orientador principal" : "Definir como orientador atual"}
                            >
                              <Crown className={isAtual ? "w-4 h-4" : "w-3 h-3"} />
                              <span className="text-xs">{isAtual ? 'Atual' : 'Tornar Atual'}</span>
                            </button>
                          )}

                          {/* Badge de Histórico para inativos */}
                          {!orientador.ativo && (
                            <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide text-gray-600 bg-gray-200 dark:text-gray-300 dark:bg-gray-700">
                              Histórico
                            </span>
                          )}

                          {/* Botão X para remover TOTALMENTE */}
                          {!isAtual && (
                            <button
                              onClick={() => handleRemoveOrientadorTotalmente(orientador.email)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              title="Remover da lista"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>

              {orientadoresAtivosCount === 0 && orientadoresInativos.length === 0 && (
                <div className={`text-center py-6 ${errors.orientador ? 'text-red-400 dark:text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
                  <UserCheck className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum orientador adicionado</p>
                </div>
              )}

              {errors.orientador && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg flex items-center gap-2 border border-red-200 dark:border-red-700"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.orientador}
                </motion.div>
              )}
            </div>
          </div>

          {/* Dica sobre orientadores */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4"
          >
            <div className="flex gap-3">
              <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 text-sm mb-1">
                  Gerenciamento da Equipe e Orientadores
                </h4>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">
                  O projeto deve ter sempre <strong>pelo menos um orientador atual</strong>. Passe o mouse sobre o membro desejado e clique no botão <strong>Atual</strong> para defini-lo como orientador principal.<br /><br />
                  Você pode adicionar múltiplos docentes como <strong>Coorientadores</strong> do projeto.
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
