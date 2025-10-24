import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Edit,
  Trash2,
  Plus,
  Eye,
  Calendar,
  Users,
  GraduationCap,
  Lightbulb,
  FileText,
  Wrench,
  Rocket,
  Code,
  BookOpen,
  MapPin,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Shield,
  Lock,
  Globe,
  Award,
  Layers,
  Clock,
  Github,
  Sparkles,
  Share2,
  Copy,
  Check,
  Link,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Crown,
  X as CloseIcon
} from 'lucide-react'
import { Projeto } from '@/types/types-queries'
import { useNavigate } from 'react-router-dom'
import RatingDisplay from '../RatingDisplay'

// Tipo unificado que suporta ambas estruturas (Projeto da API autenticada e projeto público)
type UnifiedProject = Projeto | {
  id: string
  nome: string
  descricao: string
  autorNome: string
  tecnologias?: string[]
  status: string
  publicadoEm: string
  visualizacoes: number
  bannerUrl?: string
  curso?: string
  turma?: string
  categoria?: string
  modalidade?: string
  itinerario?: boolean
  labMaker?: boolean
  participouSaga?: boolean
  unidadeCurricular?: {
    nome: string
    descricao?: string
    cargaHoraria?: string
  }
  liderProjeto?: {
    nome: string
    email: string
    matricula?: string
  }
  codigo?: string
  visibilidadeCodigo?: string
  visibilidadeAnexos?: string
  criadoEm?: string
  atualizadoEm?: string
}

interface UnifiedProjectCardProps {
  project: UnifiedProject
  variant?: 'compact' | 'summary' | 'detailed'
  showActions?: boolean
  actions?: {
    onEdit?: (projectId: string) => void
    onDelete?: (projectId: string) => void
    onView?: (projectId: string) => void
    onAddStage?: (projectId: string) => void
  }
  isGuest?: boolean
  isOwner?: boolean
  onClick?: (project: UnifiedProject) => void
  githubUrl?: string
}

const UnifiedProjectCard: React.FC<UnifiedProjectCardProps> = ({
  project,
  variant = 'compact',
  showActions = false,
  actions,
  isGuest = false,
  isOwner = false,
  onClick,
  githubUrl
}) => {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Normalizar dados do projeto para ambas estruturas
  const projectId = 'uuid' in project ? project.uuid : project.id
  const projectTitle = 'titulo' in project ? project.titulo : project.nome
  const projectDescription = project.descricao
  const projectBanner = 'bannerUrl' in project ? project.bannerUrl : undefined
  const projectCourse = project.curso
  const projectClass = project.turma
  const projectCategory = project.categoria
  const projectModality = project.modalidade
  const projectStatus = project.status
  const projectCode = 'codigo' in project ? project.codigo : project.codigo
  const projectCreatedAt = 'criadoEm' in project ? project.criadoEm : project.criadoEm
  const projectUpdatedAt = 'atualizadoEm' in project ? project.atualizadoEm : project.atualizadoEm
  const projectVisibility = 'visibilidadeCodigo' in project ? project.visibilidadeCodigo : project.visibilidadeCodigo
  const projectAttachmentsVisibility = 'visibilidadeAnexos' in project ? project.visibilidadeAnexos : project.visibilidadeAnexos
  const projectItinerario = 'itinerario' in project ? project.itinerario : project.itinerario
  const projectLabMaker = 'labMaker' in project ? project.labMaker : project.labMaker
  const projectSaga = 'participouSaga' in project ? project.participouSaga : project.participouSaga
  const projectUC = 'unidadeCurricular' in project ? project.unidadeCurricular : project.unidadeCurricular
  const projectLeader = 'liderProjeto' in project ? project.liderProjeto : project.liderProjeto
  const projectAuthorName = 'autorNome' in project ? project.autorNome : (projectLeader ? ('usuarios' in projectLeader ? projectLeader.usuarios.usuario : projectLeader.nome) : '')
  const projectViews = 'visualizacoes' in project ? project.visualizacoes : 0
  const projectPublishedAt = 'publicadoEm' in project ? project.publicadoEm : projectCreatedAt
  const projectTechnologies = 'tecnologias' in project ? project.tecnologias : []

  // Determinar fase do projeto
  const getProjectPhase = () => {
  const phases = [
    { 
      name: 'Ideação', 
      icon: Lightbulb, 
      color: 'yellow',
      gradient: 'from-yellow-400 to-amber-500',
      bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
      darkBg: 'dark:from-yellow-900/20 dark:to-amber-900/20',
      border: 'border-yellow-400 dark:border-yellow-500',
      badge: 'bg-yellow-500'
    },
    { 
      name: 'Modelagem', 
      icon: FileText, 
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      darkBg: 'dark:from-blue-900/20 dark:to-indigo-900/20',
      border: 'border-blue-400 dark:border-blue-500',
      badge: 'bg-blue-500'
    },
    { 
      name: 'Prototipagem', 
      icon: Wrench, 
      color: 'purple',
      gradient: 'from-purple-500 to-pink-600',
      bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
      darkBg: 'dark:from-purple-900/20 dark:to-pink-900/20',
      border: 'border-purple-400 dark:border-purple-500',
      badge: 'bg-purple-500'
    },
    { 
      name: 'Implementação', 
      icon: Rocket, 
      color: 'green',
      gradient: 'from-green-500 to-emerald-600',
      bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
      darkBg: 'dark:from-green-900/20 dark:to-emerald-900/20',
      border: 'border-green-400 dark:border-green-500',
      badge: 'bg-green-500'
    }
  ];
  
    return phases[0]; // Mock - sempre retorna Ideação
  }

  const phase = getProjectPhase()
  const PhaseIcon = phase.icon

  const handleEdit = () => {
    if (actions?.onEdit) {
      actions.onEdit(projectId)
    } else {
      navigate(`/app/edit-project/${projectId}`)
    }
  }

  const handleAddStage = () => {
    if (actions?.onAddStage) {
      actions.onAddStage(projectId)
    } else {
      navigate(`/app/projects/${projectId}/add-stage`)
    }
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (actions?.onDelete) {
      actions.onDelete(projectId)
    }
    setShowDeleteConfirm(false)
  }

  const handleView = () => {
    if (actions?.onView) {
      actions.onView(projectId)
    } else if (onClick) {
      onClick(project)
    } else {
      // Navegar para nova página de visualização
      navigate(`/app/projects/${projectId}/view`)
    }
  }

  // Funções de compartilhamento
  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/app/projects/${projectId}/view`
    navigator.clipboard.writeText(url).then(() => {
      showToastMessage('Link copiado com sucesso!')
    })
  }

  const handleCopyEmbed = () => {
    const url = `${window.location.origin}/app/projects/${projectId}/view`
    const embedCode = `<iframe src="${url}" width="800" height="600" frameborder="0" allowfullscreen></iframe>`
    navigator.clipboard.writeText(embedCode).then(() => {
      showToastMessage('Código incorporado copiado!')
    })
  }

  const handleSocialShare = (platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp') => {
    const url = `${window.location.origin}/app/projects/${projectId}/view`
    const text = `${projectTitle} - Projeto SENAI`
    let shareUrl = ''

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} - ${url}`)}`
        break
    }

    window.open(shareUrl, '_blank', 'width=600,height=400')
    showToastMessage(`Compartilhando no ${platform.charAt(0).toUpperCase() + platform.slice(1)}...`)
  }

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowShareModal(true)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // Verificar se é projeto novo (< 7 dias)
  const isNewProject = () => {
    if (!projectPublishedAt) return false
    const publishDate = new Date(projectPublishedAt)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays < 7
  }

  // Variante COMPACT - Para Dashboard e Guest (Visualização Pública) (Visualização Pública)
  if (variant === 'compact') {
    return (
      <div
        className={`border-4 ${phase.border} rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group bg-white dark:bg-gray-800 flex flex-col h-full cursor-pointer transform hover:-translate-y-1`}
        onClick={handleView}
      >
        {/* Banner */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
          {projectBanner ? (
            <img 
              src={projectBanner} 
              alt={projectTitle}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <BookOpen className="h-20 w-20 text-gray-300 dark:text-gray-600" />
            </div>
          )}
          
          {/* Overlay gradiente no hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badge "Meu Projeto" */}
          {isOwner && (
            <div className="absolute top-3 right-3 z-10">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 rounded-full shadow-lg backdrop-blur-sm">
                <Crown className="h-4 w-4" />
                <span className="text-xs font-bold">Meu Projeto</span>
              </div>
            </div>
          )}
          
          {/* Badge "Novo" para projetos recentes */}
          {isNewProject() && (
            <div className="absolute top-3 left-3 z-10">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full shadow-lg backdrop-blur-sm animate-pulse">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="text-xs font-bold">Novo</span>
              </div>
            </div>
          )}

          {/* Badge de status - aparece apenas no hover */}
          {projectStatus && (
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg capitalize backdrop-blur-sm">
                {projectStatus}
              </span>
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors min-h-[3.5rem]">
            {projectTitle}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">
            {projectDescription}
          </p>

          {/* Rating */}
          <div className="mb-3" onClick={(e) => e.stopPropagation()}>
            <RatingDisplay projectId={projectId} />
          </div>

          {/* Autor */}
          {projectAuthorName && (
            <div className="flex items-center gap-2 mb-3 text-sm text-gray-500 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span>{projectAuthorName}</span>
            </div>
          )}

          {/* Data e visualizações */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(projectPublishedAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              <span className="font-medium">{projectViews || 0}</span>
            </div>
          </div>

          {/* Categoria */}
          {projectCategory && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                <span 
                  className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-lg font-semibold border border-indigo-200 dark:border-indigo-800"
                >
                  {projectCategory}
                </span>
              </div>
            </div>
          )}

          <div className="flex-1"></div>

          {/* Botões de ação */}
          <div className="flex gap-2 mt-auto">
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleShareClick(e);
              }}
              className="flex-shrink-0 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg font-semibold group/share"
            >
              <Share2 className="h-4 w-4 group-hover/share:scale-110 transition-transform duration-300" />
            </button>
            <button 
              onClick={handleView}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-xl font-semibold group/btn"
            >
              <span className="text-sm">Ver Detalhes</span>
              <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Variante SUMMARY - Para My Projects (expandível com ações)
  if (variant === 'summary') {
    return (
      <>
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`relative overflow-hidden rounded-3xl shadow-xl border-4 ${phase.border} ${phase.bg} ${phase.darkBg} transition-all duration-300 hover:shadow-2xl`}
        >
          {/* Banner */}
          {projectBanner && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={projectBanner}
                alt={projectTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Badge "Meu Projeto" */}
              {isOwner && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 rounded-full shadow-lg backdrop-blur-sm">
                    <Crown className="w-4 h-4" />
                    <span className="font-bold text-sm">Meu Projeto</span>
                  </div>
                </div>
              )}

              {projectStatus && (
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg">
                    <div className={`w-2 h-2 rounded-full ${projectStatus === 'ativo' ? 'bg-green-500' : 'bg-gray-400'} animate-pulse`} />
                    <span className="text-xs font-semibold text-gray-900 dark:text-white capitalize">{projectStatus}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {!projectBanner && (
            <div className="relative p-6 pb-0">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-4 bg-gradient-to-br ${phase.gradient} rounded-2xl shadow-xl`}>
                  <PhaseIcon className="w-8 h-8 text-white" />
                </div>
                {/* Badge "Meu Projeto" quando não tem banner */}
                {isOwner && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 rounded-full shadow-lg">
                    <Crown className="w-4 h-4" />
                    <span className="font-bold text-sm">Meu Projeto</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {projectTitle}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {projectDescription}
              </p>

              {/* Rating */}
              <div className="mt-3">
                <RatingDisplay projectId={projectId} />
              </div>
            </div>

            {/* Grid 2x2 */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {projectCourse && (
                <div className="flex items-center gap-2 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                  <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Curso</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {projectCourse}
                    </p>
                  </div>
                </div>
              )}

              {projectClass && (
                <div className="flex items-center gap-2 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                  <Users className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Turma</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {projectClass}
                    </p>
                  </div>
                </div>
              )}

              {projectCategory && (
                <div className="flex items-center gap-2 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                  <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Categoria</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {projectCategory}
                    </p>
                  </div>
                </div>
              )}

              {projectModality && (
                <div className="flex items-center gap-2 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                  <MapPin className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Modalidade</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {projectModality}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {projectItinerario && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                  <BookOpen className="w-3.5 h-3.5" />
                  Itinerário
                </div>
              )}
              {projectLabMaker && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">
                  <Wrench className="w-3.5 h-3.5" />
                  SENAI Lab
                </div>
              )}
              {projectSaga && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-semibold">
                  <Award className="w-3.5 h-3.5" />
                  SAGA SENAI
                </div>
              )}
            </div>

            {/* Botão Expandir */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-center gap-2 py-3 mb-4 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-700"
            >
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {isExpanded ? 'Ver Menos' : 'Ver Mais Detalhes'}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            {/* Seção Expandível */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                    {projectUC && (
                      <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          <h4 className="font-bold text-gray-900 dark:text-white">Unidade Curricular</h4>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
                          {projectUC.nome}
                        </p>
                        {projectUC.descricao && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {projectUC.descricao}
                          </p>
                        )}
                        {projectUC.cargaHoraria && (
                          <div className="flex items-center gap-1 mt-2">
                            <Clock className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {projectUC.cargaHoraria}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {projectLeader && (
                      <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                          <h4 className="font-bold text-gray-900 dark:text-white">Líder do Projeto</h4>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
                          {'usuarios' in projectLeader ? projectLeader.usuarios.usuario : projectLeader.nome}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {'usuarios' in projectLeader ? projectLeader.usuarios.email : projectLeader.email}
                        </p>
                        {projectLeader.matricula && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Matrícula: {projectLeader.matricula}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      {projectCode && projectVisibility && (
                        <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Code className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                            <h4 className="text-xs font-bold text-gray-900 dark:text-white">Código</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            {projectVisibility === 'publico' ? (
                              <Globe className="w-3.5 h-3.5 text-green-600" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-gray-600" />
                            )}
                            <span className="text-xs text-gray-700 dark:text-gray-300 capitalize">
                              {projectVisibility}
                            </span>
                          </div>
                        </div>
                      )}

                      {projectAttachmentsVisibility && (
                        <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            <h4 className="text-xs font-bold text-gray-900 dark:text-white">Anexos</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            {projectAttachmentsVisibility === 'publico' ? (
                              <Globe className="w-3.5 h-3.5 text-green-600" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-gray-600" />
                            )}
                            <span className="text-xs text-gray-700 dark:text-gray-300 capitalize">
                              {projectAttachmentsVisibility}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {(projectCreatedAt || projectUpdatedAt) && (
                      <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white">Timeline</h4>
                        </div>
                        <div className="space-y-2">
                          {projectCreatedAt && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600 dark:text-gray-400">Criado em:</span>
                              <span className="text-xs font-semibold text-gray-900 dark:text-white">
                                {formatDate(projectCreatedAt)}
                              </span>
                            </div>
                          )}
                          {projectUpdatedAt && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600 dark:text-gray-400">Atualizado em:</span>
                              <span className="text-xs font-semibold text-gray-900 dark:text-white">
                                {formatDate(projectUpdatedAt)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ações */}
            {showActions && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleEdit}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Edit className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Editar</span>
                </button>

                {actions?.onAddStage && (
                  <button
                    onClick={handleAddStage}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Nova Etapa</span>
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareClick(e);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                  title="Compartilhar projeto"
                >
                  <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                </button>

                <button
                  onClick={handleDelete}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                </button>
              </div>
            )}

            {/* Link para Ver Detalhes */}
            {!isGuest && (
              <button
                onClick={handleView}
                className="w-full flex items-center justify-center gap-2 mt-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Ver página completa do projeto
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Modal de Confirmação de Exclusão */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowDeleteConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
              >
                <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <Trash2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Excluir Projeto</h3>
                      <p className="text-white/90 text-sm">Esta ação não pode ser desfeita</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Tem certeza que deseja excluir o projeto{' '}
                    <strong className="text-gray-900 dark:text-white">"{projectTitle}"</strong>?
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Todos os dados, etapas e anexos serão permanentemente removidos.
                  </p>
                </div>

                <div className="flex gap-3 p-6 pt-0">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-semibold transition-all duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Sim, Excluir
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  }

  // Variante DETAILED - Estilo antigo ProjectCard (legado)
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div
        className="h-32 bg-cover bg-center relative"
        style={{ backgroundImage: projectBanner ? `url(${projectBanner})` : 'none' }}
      >
        <div className="absolute top-2 right-2">
          <div className={`w-8 h-8 ${phase.badge} rounded-lg flex items-center justify-center`}>
            <PhaseIcon className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {projectItinerario && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              Itinerário
            </span>
          )}
          {projectSaga && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              SAGA
            </span>
          )}
          {projectLabMaker && (
            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
              Lab Maker
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2 flex-1">
            {projectTitle}
          </h3>
          {projectCode && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 shrink-0">
              {projectCode}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {projectDescription}
        </p>

        {/* Rating */}
        <div className="mb-3">
          <RatingDisplay projectId={projectId} />
        </div>

        <div className="space-y-2 mb-3">
          {projectCourse && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Curso:</span>
              <span className="text-gray-700 dark:text-gray-200 font-medium">{projectCourse}</span>
            </div>
          )}

          {projectClass && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Turma:</span>
              <span className="text-gray-700 dark:text-gray-200">{projectClass}</span>
            </div>
          )}

          {projectAuthorName && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Líder:</span>
              <span className="text-gray-700 dark:text-gray-200">{projectAuthorName}</span>
            </div>
          )}
        </div>

        <div className="border-t dark:border-gray-700 pt-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {projectCreatedAt && <div>Criado em: {formatDate(projectCreatedAt)}</div>}
              {projectUC && <div className="mt-1">UC: {projectUC.nome}</div>}
            </div>

            <div className="flex items-center gap-2">
              {projectVisibility && (
                <div className="flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      projectVisibility === 'publico' ? 'bg-green-400' : 'bg-orange-400'
                    }`}
                  ></span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {projectVisibility === 'publico' ? 'Público' : 'Privado'}
                  </span>
                </div>
              )}

              {githubUrl && (
                <div
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(githubUrl, '_blank', 'noopener,noreferrer')
                  }}
                >
                  <Github size={18} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ShareModal */}
      <AnimatePresence>
        {showShareModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
              onClick={() => setShowShareModal(false)}
            />
            
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-5 relative">
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <CloseIcon className="w-5 h-5 text-white" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <Share2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Compartilhar Projeto</h3>
                      <p className="text-white/90 text-sm">Divulgue este projeto</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Nome do Projeto */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Projeto</p>
                    <p className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {projectTitle}
                    </p>
                  </div>

                  {/* Redes Sociais */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Compartilhar em:
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                      <button
                        onClick={() => handleSocialShare('facebook')}
                        className="flex flex-col items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-all duration-300 group"
                      >
                        <Facebook className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Facebook</span>
                      </button>

                      <button
                        onClick={() => handleSocialShare('twitter')}
                        className="flex flex-col items-center gap-2 p-3 bg-sky-50 dark:bg-sky-900/30 hover:bg-sky-100 dark:hover:bg-sky-900/50 rounded-xl transition-all duration-300 group"
                      >
                        <Twitter className="w-6 h-6 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium text-sky-700 dark:text-sky-300">Twitter</span>
                      </button>

                      <button
                        onClick={() => handleSocialShare('linkedin')}
                        className="flex flex-col items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-all duration-300 group"
                      >
                        <Linkedin className="w-6 h-6 text-blue-700 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium text-blue-800 dark:text-blue-300">LinkedIn</span>
                      </button>

                      <button
                        onClick={() => handleSocialShare('whatsapp')}
                        className="flex flex-col items-center gap-2 p-3 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-xl transition-all duration-300 group"
                      >
                        <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium text-green-700 dark:text-green-300">WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  {/* Botões Principais */}
                  <div className="space-y-3">
                    <button
                      onClick={handleCopyLink}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Link className="w-5 h-5" />
                      <span>Copiar link</span>
                    </button>

                    <button
                      onClick={handleCopyEmbed}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold transition-all duration-300"
                    >
                      <Code className="w-5 h-5" />
                      <span>Copiar código incorporado</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Toast de Notificação */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-8 right-8 z-[70] bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 flex items-center gap-3 border-2 border-green-500 max-w-sm"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  // Retorno padrão caso nenhuma variant seja especificada
  return null
}

export default UnifiedProjectCard
