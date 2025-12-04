import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Mail, Phone, MapPin, Briefcase, Calendar, Save, Loader2, CheckCircle, XCircle, X, Edit3, User, Globe, Home } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { IMaskInput } from 'react-imask'
import { buscarPerfil, atualizarPerfil } from '@/api/perfil'

const ProfileTab: React.FC = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [cepStatus, setCepStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    curso: '',
    turma: '',
    matricula: '',
    avatarUrl: '',
    // Endereço completo
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
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
          matricula: perfil.matricula || '',
          avatarUrl: perfil.avatar_url || perfil.avatarUrl || '',
          // Endereço (se existir)
          cep: perfil.cep || '',
          rua: perfil.rua || perfil.logradouro || '',
          numero: perfil.numero || '',
          complemento: perfil.complemento || '',
          bairro: perfil.bairro || '',
          cidade: perfil.cidade || '',
          estado: perfil.estado || perfil.uf || '',
          // Redes sociais - campos específicos da API
          linkedin: perfil.linkedin_url || '',
          github: perfil.github_url || '',
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
        instagram_url: formData.instagram || undefined,
        tiktok_url: formData.tiktok || undefined,
        facebook_url: formData.facebook || undefined,
        // Campos de endereço
        cep: formData.cep || undefined,
        logradouro: formData.rua || undefined,
        numero: formData.numero || undefined,
        complemento: formData.complemento || undefined,
        bairro: formData.bairro || undefined,
        cidade: formData.cidade || undefined,
        estado: formData.estado || undefined
      })
      
      // Atualiza o formData com os dados retornados da API
      if (resultado?.perfil) {
        const perfil = resultado.perfil
        setFormData(prev => ({
          ...prev,
          telefone: perfil.telefone || prev.telefone,
          bio: perfil.bio || prev.bio,
          cep: perfil.cep || prev.cep,
          rua: perfil.logradouro || prev.rua,
          numero: perfil.numero || prev.numero,
          complemento: perfil.complemento || prev.complemento,
          bairro: perfil.bairro || prev.bairro,
          cidade: perfil.cidade || prev.cidade,
          estado: perfil.estado || prev.estado,
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

  // Função para buscar CEP via API ViaCEP
  const buscarCEP = async (cep: string) => {
    // Remove caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, '')
    
    // Valida se tem 8 dígitos
    if (cepLimpo.length !== 8) {
      setCepStatus('idle')
      return
    }
    
    setCepStatus('loading')
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await response.json()
      
      if (data.erro) {
        setCepStatus('error')
        setTimeout(() => setCepStatus('idle'), 3000)
        return
      }
      
      // Preenche os campos automaticamente
      setFormData({
        ...formData,
        cep: cep,
        rua: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
        complemento: data.complemento || formData.complemento
      })
      
      setCepStatus('success')
      
      // Remove o status de sucesso após 2 segundos
      setTimeout(() => setCepStatus('idle'), 2000)
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
      setCepStatus('error')
      setTimeout(() => setCepStatus('idle'), 3000)
    }
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
              {formData.curso || 'Curso não informado'}
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary-dark dark:text-primary-light rounded-full text-xs font-medium">
                Estudante
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
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 transition-colors ${
        isEditing ? 'border-primary/50 ring-1 ring-primary/20' : 'border-gray-200 dark:border-gray-700'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Informações Pessoais
          </h3>
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

          {/* Matrícula */}
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

          {/* Curso */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Curso
            </label>
            <input
              type="text"
              value={formData.curso || 'Não informado'}
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

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

      {/* Address Section */}
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 transition-colors ${
        isEditing ? 'border-primary/50 ring-1 ring-primary/20' : 'border-gray-200 dark:border-gray-700'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
            <Home className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Endereço
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Digite o CEP para preenchimento automático
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* CEP */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              CEP
            </label>
            <div className="relative">
              <IMaskInput
                mask="00000-000"
                value={formData.cep}
                onAccept={(value: string) => {
                  setFormData({ ...formData, cep: value })
                  // Busca automática quando CEP está completo
                  if (value.replace(/\D/g, '').length === 8) {
                    buscarCEP(value)
                  }
                }}
                disabled={!isEditing}
                type="text"
                placeholder="00000-000"
                className={`w-full px-4 py-2 pr-10 border rounded-lg disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent ${
                  cepStatus === 'error' 
                    ? 'border-red-500 dark:border-red-400' 
                    : cepStatus === 'success'
                    ? 'border-green-500 dark:border-green-400'
                    : 'border-gray-300 dark:border-gray-600'
                } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
              
              {/* Indicadores de Status */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {cepStatus === 'loading' && (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                )}
                {cepStatus === 'success' && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {cepStatus === 'error' && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
            
            {cepStatus === 'error' && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                CEP não encontrado. Verifique e tente novamente.
              </p>
            )}
            {cepStatus === 'success' && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Endereço encontrado com sucesso!
              </p>
            )}
          </div>

          {/* Estado */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado
            </label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Selecione</option>
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              <option value="AM">Amazonas</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
              <option value="DF">Distrito Federal</option>
              <option value="ES">Espírito Santo</option>
              <option value="GO">Goiás</option>
              <option value="MA">Maranhão</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="PB">Paraíba</option>
              <option value="PR">Paraná</option>
              <option value="PE">Pernambuco</option>
              <option value="PI">Piauí</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="RO">Rondônia</option>
              <option value="RR">Roraima</option>
              <option value="SC">Santa Catarina</option>
              <option value="SP">São Paulo</option>
              <option value="SE">Sergipe</option>
              <option value="TO">Tocantins</option>
            </select>
          </div>

          {/* Cidade */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cidade
            </label>
            <input
              type="text"
              value={formData.cidade}
              onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
              disabled={!isEditing}
              placeholder="Digite a cidade"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Rua */}
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rua/Avenida
            </label>
            <input
              type="text"
              value={formData.rua}
              onChange={(e) => setFormData({ ...formData, rua: e.target.value })}
              disabled={!isEditing}
              placeholder="Digite o nome da rua"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Número */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Número
            </label>
            <input
              type="text"
              value={formData.numero}
              onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              disabled={!isEditing}
              placeholder="Nº"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Bairro */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bairro
            </label>
            <input
              type="text"
              value={formData.bairro}
              onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
              disabled={!isEditing}
              placeholder="Digite o bairro"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Complemento */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Complemento
              <span className="text-gray-500 dark:text-gray-400 font-normal ml-1">(opcional)</span>
            </label>
            <input
              type="text"
              value={formData.complemento}
              onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
              disabled={!isEditing}
              placeholder="Apto, bloco, etc"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 transition-colors ${
        isEditing ? 'border-primary/50 ring-1 ring-primary/20' : 'border-gray-200 dark:border-gray-700'
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
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm disabled:opacity-70 ${
                    saveSuccess 
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

export default ProfileTab
