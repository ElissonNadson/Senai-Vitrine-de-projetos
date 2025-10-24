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
  Github
} from 'lucide-react'
import { Projeto } from '@/types/types-queries'
import { useNavigate } from 'react-router-dom'
import RatingDisplay from '@/components/RatingDisplay'

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
  onClick?: (project: UnifiedProject) => void
  githubUrl?: string
}

const UnifiedProjectCard: React.FC<UnifiedProjectCardProps> = ({
  project,
  variant = 'compact',
  showActions = false,
  actions,
  isGuest = false,
  onClick,
  githubUrl
}) => {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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
        border: 'border-yellow-200 dark:border-yellow-800',
        badge: 'bg-yellow-500'
      },
      { 
        name: 'Modelagem', 
        icon: FileText, 
        color: 'blue',
        gradient: 'from-blue-500 to-indigo-600',
        bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
        darkBg: 'dark:from-blue-900/20 dark:to-indigo-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        badge: 'bg-blue-500'
      },
      { 
        name: 'Prototipagem', 
        icon: Wrench, 
        color: 'purple',
        gradient: 'from-purple-500 to-pink-600',
        bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
        darkBg: 'dark:from-purple-900/20 dark:to-pink-900/20',
        border: 'border-purple-200 dark:border-purple-800',
        badge: 'bg-purple-500'
      },
      { 
        name: 'Implementação', 
        icon: Rocket, 
        color: 'green',
        gradient: 'from-green-500 to-emerald-600',
        bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
        darkBg: 'dark:from-green-900/20 dark:to-emerald-900/20',
        border: 'border-green-200 dark:border-green-800',
        badge: 'bg-green-500'
      }
    ]
    
    return phases[0] // Mock - sempre retorna Ideação
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
      navigate(`/app/projects/${projectId}`)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // Variante COMPACT - Para Dashboard e Guest
  if (variant === 'compact') {
    return (
      <div
        className={`border-2 ${phase.border} rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group bg-white dark:bg-gray-800 flex flex-col h-full cursor-pointer`}
        onClick={handleView}
      >
        {/* Banner */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
          {projectBanner ? (
            <img 
              src={projectBanner} 
              alt={projectTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-500" />
            </div>
          )}
          
          {/* Badge de fase */}
          <div className="absolute top-3 left-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 ${phase.badge} text-white rounded-full shadow-lg`}>
              <PhaseIcon className="h-4 w-4" />
              <span className="text-xs font-bold">{phase.name}</span>
            </div>
          </div>
          
          {/* Badge de status */}
          {projectStatus && (
            <div className="absolute top-3 right-3">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg capitalize">
                {projectStatus}
              </span>
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-3">
            {projectTitle}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
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
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(projectPublishedAt)}</span>
            </div>
            {projectViews > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{projectViews}</span>
              </div>
            )}
          </div>

          {/* Tecnologias */}
          {projectTechnologies && projectTechnologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {projectTechnologies.slice(0, 3).map((tech: string, idx: number) => (
                <span 
                  key={idx}
                  className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-md font-medium"
                >
                  {tech}
                </span>
              ))}
              {projectTechnologies.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md">
                  +{projectTechnologies.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex-1"></div>

          {/* Botão de ação */}
          <button 
            className="w-full mt-auto py-2.5 px-4 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg font-medium"
          >
            <span className="text-sm">Ver Detalhes</span>
            <ExternalLink className="h-4 w-4" />
          </button>
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
          className={`relative overflow-hidden rounded-3xl shadow-xl border-2 ${phase.border} ${phase.bg} ${phase.darkBg} transition-all duration-300 hover:shadow-2xl`}
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
              
              <div className="absolute top-4 right-4">
                <div className={`flex items-center gap-2 px-4 py-2 ${phase.badge} text-white rounded-full shadow-lg backdrop-blur-sm`}>
                  <PhaseIcon className="w-4 h-4" />
                  <span className="font-bold text-sm">{phase.name}</span>
                </div>
              </div>

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
                <div className="flex gap-2">
                  <div className={`flex items-center gap-2 px-4 py-2 ${phase.badge} text-white rounded-full shadow-lg`}>
                    <PhaseIcon className="w-4 h-4" />
                    <span className="font-bold text-sm">{phase.name}</span>
                  </div>
                </div>
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
    </div>
  )
}

export default UnifiedProjectCard
