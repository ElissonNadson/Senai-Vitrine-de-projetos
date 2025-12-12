import React, { useState, useEffect } from 'react'
import { useCursos, useTurmasByCurso } from '@/hooks/use-queries'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Mail, Phone, MapPin, Briefcase, Calendar, Save, Loader2, CheckCircle, XCircle, X, Edit3, User, Globe, Home, Building2, Users } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { IMaskInput } from 'react-imask'
import { buscarPerfil, atualizarPerfil } from '@/api/perfil'
import { useDepartamentos } from '@/hooks/use-departamentos'

interface PerfilFormData {
  nome: string
  email: string
  avatarUrl: string | null
  telefone: string
  bio: string
  linkedin: string
  github: string
  portfolio: string
  matricula?: string
  departamento?: string
  curso?: string
  turma?: string
  departamento_uuid?: string
  curso_uuid?: string // Added
  turma_uuid?: string // Added
  turma_outro?: string // Added for manual entry

  // Redes sociais
  instagram: string
  tiktok: string
  facebook: string
}

const ProfileTab: React.FC = () => {
  const { user } = useAuth()
  const isProfessor = user?.tipo?.toUpperCase() === 'PROFESSOR'
  const { data: departamentos = [], isLoading: isLoadingDepartamentos } = useDepartamentos()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [formData, setFormData] = useState<PerfilFormData>({
    nome: '',
    email: '',
    telefone: '',
    curso: '',
    turma: '',
    matricula: '',
    departamento: '',
    departamento_uuid: '',
    avatarUrl: '',
    portfolio: '', // Added
    curso_uuid: '', // Added
    turma_uuid: '', // Added
    turma_outro: '', // Added

    // Redes sociais
    linkedin: '',
    github: '',
    instagram: '',
    tiktok: '',
    facebook: '',
    bio: ''
  })

  // Carregar dados do perfil da API
  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        setIsLoading(true)
        const perfil = await buscarPerfil()

        // A API retorna campos como curso_nome, turma_codigo, linkedin_url, github_url
        setFormData({
          nome: perfil.nome || user?.nome || '',
          email: perfil.email || user?.email || '',
          telefone: perfil.telefone || '',
          // Campos que vêm da tabela de alunos
          curso: perfil.curso_nome || perfil.curso?.nome || '',
          turma: perfil.turma_codigo || perfil.turma?.codigo || '',
          curso_uuid: perfil.curso?.uuid || '', // Added
          turma_uuid: perfil.turma?.uuid || '', // Added
          matricula: perfil.matricula || '',
          // Campos que vêm da tabela de professores
          departamento: perfil.departamento?.nome || '',
          departamento_uuid: perfil.departamento?.uuid || '',
          avatarUrl: perfil.avatar_url || perfil.avatarUrl || '',

          // Redes sociais - campos específicos da API
          linkedin: perfil.linkedin_url || '',
          github: perfil.github_url || '',
          portfolio: perfil.portfolio_url || '', // Added
          instagram: perfil.instagram_url || '',
          tiktok: perfil.tiktok_url || '',
          facebook: perfil.facebook_url || '',
          bio: perfil.bio || ''
        })
      } catch (error) {
        console.error('Erro ao carregar perfil:', error)
        // Fallback para dados do contexto
        setFormData(prev => ({
          ...prev,
          nome: user?.nome || '',
          email: user?.email || '',
          telefone: user?.telefonePessoal || '',
          curso: user?.curso || '',
          matricula: user?.matricula || ''
        }))
      } finally {
        setIsLoading(false)
      }
    }

    carregarPerfil()
  }, [user])

  const handleSave = async () => {
    try {
      setIsSaving(true)

      const resultado = await atualizarPerfil({
        telefone: formData.telefone || undefined,
        bio: formData.bio || undefined,
        linkedin_url: formData.linkedin || undefined,
        github_url: formData.github || undefined,
        portfolio_url: formData.portfolio || undefined, // Added
        instagram_url: formData.instagram || undefined,
        tiktok_url: formData.tiktok || undefined,
        facebook_url: formData.facebook || undefined,
        // Campos opcionais de aluno
        ...(formData.curso_uuid && { curso_uuid: formData.curso_uuid }),
        ...(formData.turma_uuid && formData.turma_uuid !== 'outra' && { turma_uuid: formData.turma_uuid }),


      })

      // Atualiza o formData com os dados retornados da API
      if (resultado?.perfil) {
        const perfil = resultado.perfil
        setFormData(prev => ({
          ...prev,
          telefone: perfil.telefone || prev.telefone,
          bio: perfil.bio || prev.bio,

          linkedin: perfil.linkedin_url || prev.linkedin,
          github: perfil.github_url || prev.github,
          instagram: perfil.instagram_url || prev.instagram,
          tiktok: perfil.tiktok_url || prev.tiktok,
          facebook: perfil.facebook_url || prev.facebook,
        }))
      }

      setSaveSuccess(true)
      setTimeout(() => {
        setSaveSuccess(false)
        setIsEditing(false)
      }, 1500)
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Recarregar dados originais
    setIsEditing(false)
  }



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-24"
    >
      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">Carregando perfil...</span>
        </div>
      ) : (
        <>
          {/* Indicador de Modo de Edição */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-lg p-4 flex items-center gap-3"
              >
                <Edit3 className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary-dark dark:text-primary-light">
                    Modo de edição ativo
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Edite suas informações pessoais, endereço e redes sociais. Clique em "Salvar Todas as Alterações" quando terminar.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Profile Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-3xl shadow-lg overflow-hidden">
                  {formData.avatarUrl ? (
                    <img src={formData.avatarUrl} alt={formData.nome} className="w-full h-full object-cover" />
                  ) : (
                    formData.nome.charAt(0).toUpperCase()
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center shadow-lg transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {formData.nome || 'Usuário'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {isProfessor
                    ? (formData.departamento || 'Departamento não informado')
                    : (formData.curso || 'Curso não informado')
                  }
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary-dark dark:text-primary-light rounded-full text-xs font-medium">
                    {isProfessor ? 'Professor' : 'Estudante'}
                  </span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                    Ativo
                  </span>
                </div>
              </div>

              {/* Edit Button - Só mostra quando NÃO está editando */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  <Edit3 className="h-4 w-4" />
                  Editar Perfil
                </button>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 transition-colors ${isEditing ? 'border-primary/50 ring-1 ring-primary/20' : 'border-gray-200 dark:border-gray-700'
            }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Informações Pessoais
                </h3>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm font-medium text-primary hover:text-primary-dark hover:underline flex items-center gap-1"
                >
                  <Edit3 className="h-3 w-3" />
                  Editar
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome Completo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  disabled={!isEditing}
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Matrícula - apenas para alunos */}
              {!isProfessor && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Briefcase className="inline h-4 w-4 mr-1" />
                    Matrícula
                  </label>
                  <input
                    type="text"
                    value={formData.matricula || 'Não informado'}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              )}

              {/* Departamento - apenas para professores */}
              {isProfessor && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Building2 className="inline h-4 w-4 mr-1" />
                    Departamento
                  </label>
                  <input
                    type="text"
                    value={formData.departamento || 'Não informado'}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              )}

              {/* Curso - Dropdown para alunos */}
              {!isProfessor && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Curso
                  </label>
                  {isEditing ? (
                    <SelectCurso
                      disabled={false}
                      value={formData.curso_uuid}
                      onChange={(uuid, nome) => {
                        setFormData(prev => ({
                          ...prev,
                          curso_uuid: uuid,
                          curso: nome || prev.curso,
                          turma_uuid: '', // Limpa turma ao mudar curso
                          turma: ''
                        }))
                      }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData.curso || 'Clique em Editar para selecionar um curso'}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    />
                  )}
                </div>
              )}

              {/* Turma - Dropdown para alunos */}
              {!isProfessor && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Users className="inline h-4 w-4 mr-1" />
                    Turma
                  </label>
                  {isEditing ? (
                    <SelectTurma
                      disabled={!formData.curso_uuid}
                      cursoUuid={formData.curso_uuid}
                      value={formData.turma_uuid}
                      onChange={(uuid, codigo) => {
                        setFormData(prev => ({
                          ...prev,
                          turma_uuid: uuid,
                          turma: codigo || prev.turma,
                          turma_outro: uuid === 'outra' ? prev.turma_outro : '' // Limpa outro se selecionar válido
                        }))
                      }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData.turma || 'Clique em Editar para selecionar uma turma'}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    />
                  )}

                  {/* Campo de texto para turma manual */}
                  <AnimatePresence>
                    {formData.turma_uuid === 'outra' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2"
                      >
                        <input
                          type="text"
                          value={formData.turma_outro}
                          onChange={(e) => setFormData({ ...formData, turma_outro: e.target.value })}
                          disabled={!isEditing}
                          placeholder="Digite o nome/código da sua turma"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="Conte um pouco sobre você..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>



          {/* Social Links */}
          <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 transition-colors ${isEditing ? 'border-primary/50 ring-1 ring-primary/20' : 'border-gray-200 dark:border-gray-700'
            }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Redes Sociais
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  disabled={!isEditing}
                  placeholder="https://linkedin.com/in/seu-perfil"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GitHub
                </label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  disabled={!isEditing}
                  placeholder="https://github.com/seu-usuario"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  disabled={!isEditing}
                  placeholder="https://instagram.com/seu-usuario"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  TikTok
                </label>
                <input
                  type="url"
                  value={formData.tiktok}
                  onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                  disabled={!isEditing}
                  placeholder="https://tiktok.com/@seu-usuario"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  disabled={!isEditing}
                  placeholder="https://facebook.com/seu-perfil"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Barra de Ações Fixa */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg"
              >
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Edit3 className="h-4 w-4" />
                    <span>Editando perfil</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      Cancelar
                    </button>

                    <button
                      onClick={handleSave}
                      disabled={isSaving || saveSuccess}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm disabled:opacity-70 ${saveSuccess
                        ? 'bg-green-500 text-white'
                        : 'bg-primary hover:bg-primary-dark text-white'
                        }`}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : saveSuccess ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Salvo com sucesso!
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Salvar Todas as Alterações
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  )
}

// Subcomponentes para Selects (para manter o código principal limpo)
const SelectCurso = ({ disabled, value, onChange }: { disabled: boolean, value?: string, onChange: (uuid: string, nome?: string) => void }) => {
  const { data: cursos } = useCursos()

  return (
    <select
      value={value || ''}
      onChange={(e) => {
        const uuid = e.target.value
        const curso = cursos?.find(c => c.uuid === uuid)
        onChange(uuid, curso?.nome)
      }}
      disabled={disabled}
      className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent ${disabled ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed opacity-70' : 'bg-gray-50 dark:bg-gray-700'
        }`}
    >
      <option value="">Selecione um curso...</option>
      {cursos?.map(curso => (
        <option key={curso.uuid} value={curso.uuid}>{curso.nome}</option>
      ))}
    </select>
  )
}

const SelectTurma = ({ disabled, cursoUuid, value, onChange }: { disabled: boolean, cursoUuid?: string, value?: string, onChange: (uuid: string, codigo?: string) => void }) => {
  const { data: turmas } = useTurmasByCurso(cursoUuid || '')

  return (
    <select
      value={value || ''}
      onChange={(e) => {
        const uuid = e.target.value
        const turma = turmas?.find(t => t.uuid === uuid)
        onChange(uuid, turma?.codigo)
      }}
      disabled={disabled}
      className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent ${disabled ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed opacity-70' : 'bg-gray-50 dark:bg-gray-700'
        }`}
    >
      <option value="">{cursoUuid ? 'Selecione uma turma...' : 'Selecione um curso primeiro'}</option>
      {turmas?.map(turma => (
        <option key={turma.uuid} value={turma.uuid}>{turma.codigo}</option>
      ))}
      <option value="outra">Outra (Digitar manualmente)</option>
    </select>
  )
}

export default ProfileTab
