import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Lightbulb,
  FileText,
  Wrench,
  Rocket,
  GraduationCap,
  Users,
  Layers,
  MapPin,
  BookOpen,
  Award,
  Code,
  Globe,
  Lock,
  Shield,
  Calendar,
  Clock,
  Edit,
  Plus,
  Trash2,
  ExternalLink,
  Eye,
  ChevronRight,
  Paperclip,
  Download,
  FileIcon,
  LogIn,
  Share2,
  Copy,
  Check,
  Link,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Crown,
  Mail
} from 'lucide-react'

// Tipos de dados
interface ProjectLeader {
  nome: string
  email: string
  matricula?: string
}

interface TeamMember {
  nome: string
  email: string
  papel: 'Desenvolvedor' | 'Designer' | 'Pesquisador' | 'Analista'
}

interface Advisor {
  nome: string
  email: string
  especialidade: string
}

interface UnidadeCurricular {
  nome: string
  descricao?: string
  cargaHoraria?: string
}

interface ProjectStage {
  id: string
  nome: string
  descricao?: string
  dataInicio?: string
  dataFim?: string
  status?: string
  anexos?: Array<{
    id: string
    nome: string
    url: string
    tipo: string
  }>
}

interface UnifiedProject {
  id: string
  nome: string
  descricao: string
  bannerUrl?: string
  status?: string
  faseAtual: 1 | 2 | 3 | 4
  
  // Dados básicos
  curso?: string
  turma?: string
  categoria?: string
  modalidade?: string
  
  // Tags
  itinerario?: boolean
  labMaker?: boolean
  participouSaga?: boolean
  
  // UC e Líder
  unidadeCurricular?: UnidadeCurricular
  liderProjeto?: ProjectLeader
  equipe?: TeamMember[]
  orientadores?: Advisor[]
  
  // Visibilidade
  codigo?: string
  visibilidadeCodigo?: 'publico' | 'privado'
  visibilidadeAnexos?: 'publico' | 'privado'
  
  // Datas
  criadoEm?: string
  atualizadoEm?: string
  
  // Etapas por fase
  etapas?: {
    ideacao?: ProjectStage[]
    modelagem?: ProjectStage[]
    prototipagem?: ProjectStage[]
    validacao?: ProjectStage[]
  }
}

interface UnifiedProjectModalProps {
  project: UnifiedProject
  isOpen: boolean
  onClose: () => void
  isGuest?: boolean
  mode?: 'view' | 'edit'
  onEdit?: () => void
  onAddStage?: (phase: number) => void
  readOnly?: boolean // Impede votação (para projetos próprios)
  isOwner?: boolean // Indica se o projeto pertence ao usuário logado
}

const UnifiedProjectModal: React.FC<UnifiedProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  isGuest = false,
  mode = 'view',
  onEdit,
  onAddStage,
  readOnly = false,
  isOwner = false
}) => {
  const [activePhase, setActivePhase] = useState<number>(project.faseAtual)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Gerar dados mockados para equipe e orientadores
  const generateMockTeam = (): { equipe: TeamMember[], orientadores: Advisor[] } => {
    const nomesBrasileiros = [
      'Ana Silva', 'Carlos Oliveira', 'Maria Santos', 'João Costa',
      'Pedro Almeida', 'Juliana Ferreira', 'Lucas Rodrigues', 'Fernanda Lima',
      'Rafael Martins', 'Beatriz Souza', 'Gabriel Pereira', 'Camila Barbosa'
    ]
    const papeis: TeamMember['papel'][] = ['Desenvolvedor', 'Designer', 'Pesquisador', 'Analista']
    const especialidades = [
      'Engenharia de Software', 'Design de Interfaces', 'Gestão de Projetos',
      'Análise de Dados', 'Desenvolvimento Web', 'UX/UI Design'
    ]

    const numMembros = Math.floor(Math.random() * 3) + 2 // 2-4 membros
    const numOrientadores = Math.floor(Math.random() * 2) + 1 // 1-2 orientadores

    const equipe: TeamMember[] = Array.from({ length: numMembros }, (_, i) => {
      const nome = nomesBrasileiros[Math.floor(Math.random() * nomesBrasileiros.length)]
      const papel = papeis[Math.floor(Math.random() * papeis.length)]
      return {
        nome: `${nome} ${i + 1}`,
        email: `${nome.toLowerCase().replace(' ', '.')}@senai.br`,
        papel
      }
    })

    const orientadores: Advisor[] = Array.from({ length: numOrientadores }, (_, i) => {
      const nome = nomesBrasileiros[Math.floor(Math.random() * nomesBrasileiros.length)]
      const especialidade = especialidades[Math.floor(Math.random() * especialidades.length)]
      return {
        nome: `Prof. ${nome} ${i + 1}`,
        email: `prof.${nome.toLowerCase().replace(' ', '.')}@senai.br`,
        especialidade
      }
    })

    return { equipe, orientadores }
  }

  const mockTeam = generateMockTeam()
  const equipe = project.equipe || mockTeam.equipe
  const orientadores = project.orientadores || mockTeam.orientadores

  // Função para mostrar toast
  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  // Funções de compartilhamento
  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      showToastMessage('Link copiado com sucesso!')
    })
  }

  const handleCopyEmbed = () => {
    const url = window.location.href
    const embedCode = `<iframe src="${url}" width="800" height="600" frameborder="0" allowfullscreen></iframe>`
    navigator.clipboard.writeText(embedCode).then(() => {
      showToastMessage('Código incorporado copiado!')
    })
  }

  const handleSocialShare = (platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp') => {
    const url = window.location.href
    const text = `${project.nome} - Projeto SENAI`
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

  if (!isOpen) return null

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Configuração das fases
  const phases = [
    {
      id: 1,
      name: 'Ideação',
      icon: Lightbulb,
      gradient: 'from-blue-500 to-cyan-500',
      badge: 'bg-blue-600',
      bg: 'bg-blue-50',
      darkBg: 'dark:bg-blue-950/20',
      border: 'border-blue-500',
      stages: project.etapas?.ideacao || []
    },
    {
      id: 2,
      name: 'Modelagem',
      icon: FileText,
      gradient: 'from-yellow-500 to-orange-500',
      badge: 'bg-yellow-600',
      bg: 'bg-yellow-50',
      darkBg: 'dark:bg-yellow-950/20',
      border: 'border-yellow-500',
      stages: project.etapas?.modelagem || []
    },
    {
      id: 3,
      name: 'Prototipagem',
      icon: Wrench,
      gradient: 'from-orange-500 to-red-500',
      badge: 'bg-orange-600',
      bg: 'bg-orange-50',
      darkBg: 'dark:bg-orange-950/20',
      border: 'border-orange-500',
      stages: project.etapas?.prototipagem || []
    },
    {
      id: 4,
      name: 'Validação',
      icon: Rocket,
      gradient: 'from-green-500 to-emerald-500',
      badge: 'bg-green-600',
      bg: 'bg-green-50',
      darkBg: 'dark:bg-green-950/20',
      border: 'border-green-500',
      stages: project.etapas?.validacao || []
    }
  ]

  const currentPhase = phases.find((p) => p.id === activePhase) || phases[0]
  const PhaseIcon = currentPhase.icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-4xl my-8 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border-2 ${currentPhase.border} max-h-[90vh] flex flex-col`}
        >
          {/* Header com Banner */}
          <div className="relative">
            {project.bannerUrl ? (
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.bannerUrl}
                  alt={project.nome}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Status Badge */}
                {project.status && (
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg">
                      <div className={`w-2 h-2 rounded-full ${project.status === 'ativo' ? 'bg-green-500' : 'bg-gray-400'} animate-pulse`} />
                      <span className="text-xs font-semibold text-gray-900 dark:text-white capitalize">{project.status}</span>
                    </div>
                  </div>
                )}

                {/* Botão Fechar */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onClose()
                  }}
                  className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-lg group z-[60]"
                >
                  <X className="w-5 h-5 text-gray-900 dark:text-white group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Título e Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {/* Badge "Meu Projeto" */}
                  {isOwner && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 rounded-full shadow-lg backdrop-blur-sm mb-4">
                      <Crown className="w-4 h-4" />
                      <span className="font-bold text-sm">Meu Projeto</span>
                    </div>
                  )}
                  
                  <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    {project.nome}
                  </h2>
                  <p className="text-white/90 text-xs mb-3 drop-shadow-lg line-clamp-2">
                    {project.descricao}
                  </p>

                  {/* Visualizações */}
                  <div className="flex items-center gap-6 flex-wrap">
                    {'visualizacoes' in project && typeof project.visualizacoes === 'number' && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-full">
                        <Eye className="w-5 h-5 text-white" />
                        <span className="text-white font-semibold">{project.visualizacoes}</span>
                        <span className="text-white/80 text-sm">visualizações</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className={`relative p-6 ${currentPhase.bg} ${currentPhase.darkBg}`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onClose()
                  }}
                  className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg group"
                >
                  <X className="w-5 h-5 text-gray-900 dark:text-white group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <div className="max-w-3xl">
                  {/* Badge "Meu Projeto" */}
                  {isOwner && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 rounded-full shadow-lg mb-4">
                      <Crown className="w-4 h-4" />
                      <span className="font-bold text-sm">Meu Projeto</span>
                    </div>
                  )}

                  {project.status && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg ml-3 mb-4">
                      <div className={`w-2 h-2 rounded-full ${project.status === 'ativo' ? 'bg-green-500' : 'bg-gray-400'} animate-pulse`} />
                      <span className="text-xs font-semibold text-gray-900 dark:text-white capitalize">{project.status}</span>
                    </div>
                  )}
                  
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {project.nome}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                    {project.descricao}
                  </p>

                  {/* Visualizações */}
                  <div className="flex items-center gap-6 flex-wrap">
                    {'visualizacoes' in project && typeof project.visualizacoes === 'number' && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-900 dark:text-white font-semibold">{project.visualizacoes}</span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">visualizações</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Banner informativo para guests */}
          {isGuest && (
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Modo Visitante</p>
                    <p className="text-white/80 text-xs">Faça login para acessar todas as funcionalidades</p>
                  </div>
                </div>
                <button
                  onClick={() => window.location.href = '/login'}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
                >
                  Fazer Login
                </button>
              </div>
            </div>
          )}

          {/* Tabs de Fases - Apenas para usuários autenticados */}
          {!isGuest && (
            <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-700 px-6 overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                {phases.map((phase) => {
                const Icon = phase.icon
                const isActive = activePhase === phase.id
                const isCompleted = phase.id < project.faseAtual
                const isLocked = phase.id > project.faseAtual

                return (
                  <button
                    key={phase.id}
                    onClick={() => setActivePhase(phase.id)}
                    disabled={isLocked}
                    className={`relative flex items-center gap-2 px-4 py-4 transition-all duration-300 ${
                      isActive
                        ? `${phase.badge} text-white shadow-lg`
                        : isCompleted
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        : isLocked
                        ? 'bg-gray-50 dark:bg-gray-900 text-gray-400 cursor-not-allowed'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-transparent'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sm">{phase.name}</div>
                      <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                        {phase.stages.length} {phase.stages.length === 1 ? 'etapa' : 'etapas'}
                      </div>
                    </div>
                    {isLocked && <Lock className="w-4 h-4 ml-2" />}
                  </button>
                )
              })}
            </div>
          </div>
          )}

          {/* Conteúdo Principal */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="space-y-6">
              {/* Grid de Informações Básicas */}
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Informações do Projeto
                </h3>
                
                <div className="grid grid-cols-2 gap-2.5 mb-3">
                  {project.curso && (
                    <div className="flex items-center gap-2 p-2.5 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                      <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Curso</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {project.curso}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.turma && (
                    <div className="flex items-center gap-2 p-2.5 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                      <Users className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Turma</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {project.turma}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.categoria && (
                    <div className="flex items-center gap-2 p-2.5 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                      <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Categoria</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {project.categoria}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.modalidade && (
                    <div className="flex items-center gap-2 p-2.5 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                      <MapPin className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Modalidade</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {project.modalidade}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Badges */}
                {(project.itinerario || project.labMaker || project.participouSaga) && (
                  <div className="flex flex-wrap gap-2">
                    {project.itinerario && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                        <BookOpen className="w-3.5 h-3.5" />
                        Itinerário
                      </div>
                    )}
                    {project.labMaker && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">
                        <Wrench className="w-3.5 h-3.5" />
                        SENAI Lab
                      </div>
                    )}
                    {project.participouSaga && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-semibold">
                        <Award className="w-3.5 h-3.5" />
                        SAGA SENAI
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Unidade Curricular */}
              <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="font-bold text-gray-900 dark:text-white">Unidade Curricular</h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
                    {project.unidadeCurricular?.nome || '—'}
                  </p>
                  {project.unidadeCurricular?.descricao && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {project.unidadeCurricular.descricao}
                    </p>
                  )}
                  {project.unidadeCurricular?.cargaHoraria && (
                    <div className="flex items-center gap-1 mt-2">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {project.unidadeCurricular.cargaHoraria}
                      </span>
                    </div>
                  )}
                </div>

              {/* Líder do Projeto */}
              {project.liderProjeto && (
                <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">Líder do Projeto</h4>
                    </div>
                    {(isGuest || !onEdit) && (
                      <a
                        href={`mailto:${project.liderProjeto.email}?subject=${encodeURIComponent(`Sobre: ${project.nome} - Fase ${currentPhase.name}`)}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Contato
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
                    {project.liderProjeto.nome}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {project.liderProjeto.email}
                  </p>
                  {project.liderProjeto.matricula && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Matrícula: {project.liderProjeto.matricula}
                    </p>
                  )}
                </div>
              )}

              {/* Equipe do Projeto */}
              {equipe && equipe.length > 0 && (
                <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Equipe</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {equipe.map((membro, index) => (
                      <div key={index} className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {membro.nome}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {membro.email}
                            </p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-medium">
                              {membro.papel}
                            </span>
                          </div>
                          {(isGuest || !onEdit) && (
                            <a
                              href={`mailto:${membro.email}?subject=${encodeURIComponent(`Sobre: ${project.nome} - Fase ${currentPhase.name}`)}`}
                              className="flex items-center justify-center p-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex-shrink-0"
                              onClick={(e) => e.stopPropagation()}
                              title="Entrar em contato"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Orientadores */}
              {orientadores && orientadores.length > 0 && (
                <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Orientadores</h4>
                  </div>
                  <div className="space-y-2">
                    {orientadores.map((orientador, index) => (
                      <div key={index} className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {orientador.nome}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {orientador.email}
                            </p>
                            <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                              {orientador.especialidade}
                            </p>
                          </div>
                          {(isGuest || !onEdit) && (
                            <a
                              href={`mailto:${orientador.email}?subject=${encodeURIComponent(`Sobre: ${project.nome} - Fase ${currentPhase.name}`)}`}
                              className="flex items-center justify-center p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex-shrink-0"
                              onClick={(e) => e.stopPropagation()}
                              title="Entrar em contato"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Visibilidade */}
              <div className="grid grid-cols-2 gap-3">
                {project.codigo && project.visibilidadeCodigo && (
                  <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">Código</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.visibilidadeCodigo === 'publico' ? (
                        <Globe className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-gray-600" />
                      )}
                      <span className="text-xs text-gray-700 dark:text-gray-300 capitalize">
                        {project.visibilidadeCodigo}
                      </span>
                    </div>
                  </div>
                )}

                {project.visibilidadeAnexos && (
                  <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">Anexos</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.visibilidadeAnexos === 'publico' ? (
                        <Globe className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-gray-600" />
                      )}
                      <span className="text-xs text-gray-700 dark:text-gray-300 capitalize">
                        {project.visibilidadeAnexos}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline */}
              {(project.criadoEm || project.atualizadoEm) && (
                <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">Timeline</h4>
                  </div>
                  <div className="space-y-2">
                    {project.criadoEm && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Criado em:</span>
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                          {formatDate(project.criadoEm)}
                        </span>
                      </div>
                    )}
                    {project.atualizadoEm && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Atualizado em:</span>
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                          {formatDate(project.atualizadoEm)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Etapas da Fase Atual - Apenas para usuários autenticados */}
              {!isGuest && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <PhaseIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                      Etapas - {currentPhase.name}
                    </h3>
                    {mode === 'view' && onAddStage && (
                    <button
                      onClick={() => onAddStage(activePhase)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Etapa
                    </button>
                  )}
                </div>

                {currentPhase.stages.length > 0 ? (
                  <div className="space-y-3">
                    {currentPhase.stages.map((stage, index) => (
                      <div
                        key={stage.id}
                        className="p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                Etapa {index + 1}
                              </span>
                              {stage.status && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  stage.status === 'concluida' 
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                }`}>
                                  {stage.status}
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                              {stage.nome}
                            </h4>
                            {stage.descricao && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {stage.descricao}
                              </p>
                            )}
                          </div>
                        </div>

                        {(stage.dataInicio || stage.dataFim) && (
                          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mt-3">
                            {stage.dataInicio && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Início: {formatDate(stage.dataInicio)}</span>
                              </div>
                            )}
                            {stage.dataFim && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Fim: {formatDate(stage.dataFim)}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Anexos da Etapa */}
                        {stage.anexos && stage.anexos.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-2">
                              <Paperclip className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Anexos ({stage.anexos.length})
                              </span>
                            </div>
                            
                            {isGuest && project.visibilidadeAnexos === 'privado' ? (
                              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                                    {stage.anexos.length} {stage.anexos.length === 1 ? 'anexo restrito' : 'anexos restritos'} 🔒
                                  </p>
                                  <p className="text-xs text-amber-700 dark:text-amber-400">
                                    Faça login para visualizar os anexos deste projeto
                                  </p>
                                </div>
                                <button 
                                  onClick={() => window.location.href = '/login'}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
                                >
                                  <LogIn className="w-3.5 h-3.5" />
                                  Login
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {stage.anexos.map((anexo) => (
                                  <a
                                    key={anexo.id}
                                    href={anexo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                                  >
                                    <FileIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="flex-1 text-xs text-gray-700 dark:text-gray-300 truncate">
                                      {anexo.nome}
                                    </span>
                                    <Download className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                    <PhaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 font-semibold mb-1">
                      Nenhuma etapa cadastrada
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Este projeto ainda não possui etapas na fase de {currentPhase.name}
                    </p>
                    {onAddStage && (
                      <button
                        onClick={() => onAddStage(activePhase)}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar Primeira Etapa
                      </button>
                    )}
                  </div>
                )}
              </div>
              )}
            </div>
          </div>

          {/* Footer com Ações */}
          {!isGuest && mode === 'view' && onEdit && isOwner && (
            <div className="sticky bottom-0 p-6 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900 dark:to-transparent border-t-2 border-gray-200 dark:border-gray-700">
              <div className="flex gap-3">
                <button
                  onClick={onEdit}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Edit className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Editar Projeto</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold transition-all duration-300"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}

          {/* Footer para visualização pública (sem botão Editar) */}
          {!isGuest && mode === 'view' && !onEdit && (
            <div className="sticky bottom-0 p-6 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900 dark:to-transparent border-t-2 border-gray-200 dark:border-gray-700">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold transition-all duration-300"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Compartilhar</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}

          {/* Footer Guest */}
          {isGuest && (
            <div className="sticky bottom-0 p-6 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900 dark:to-transparent border-t-2 border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Gostou deste projeto? Faça login para interagir e ver mais detalhes!
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold transition-all duration-300"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Compartilhar</span>
                  </button>
                  <button
                    onClick={() => window.location.href = '/login'}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Fazer Login</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold transition-all duration-300"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Modal de Compartilhamento Estilo Behance */}
      <AnimatePresence>
        {showShareModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
              onClick={() => setShowShareModal(false)}
            />
            
            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Compartilhar Projeto</h3>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Preview do Projeto */}
                <div className="p-6">
                  <div className="relative rounded-xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800">
                    {project.bannerUrl ? (
                      <img
                        src={project.bannerUrl}
                        alt={project.nome}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center">
                        <Lightbulb className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-white font-bold text-lg">{project.nome}</p>
                      <p className="text-white/80 text-sm">{currentPhase.name}</p>
                    </div>
                  </div>

                  {/* Redes Sociais - Grid 2x2 */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Compartilhar nas redes sociais:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleSocialShare('facebook')}
                        className="flex items-center justify-center gap-2 p-3 bg-[#1877F2] hover:bg-[#0c63d4] text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <Facebook className="w-5 h-5" />
                        <span>Facebook</span>
                      </button>

                      <button
                        onClick={() => handleSocialShare('twitter')}
                        className="flex items-center justify-center gap-2 p-3 bg-[#1DA1F2] hover:bg-[#0c8bd9] text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <Twitter className="w-5 h-5" />
                        <span>Twitter</span>
                      </button>

                      <button
                        onClick={() => handleSocialShare('linkedin')}
                        className="flex items-center justify-center gap-2 p-3 bg-[#0A66C2] hover:bg-[#004c8e] text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <Linkedin className="w-5 h-5" />
                        <span>LinkedIn</span>
                      </button>

                      <button
                        onClick={() => handleSocialShare('whatsapp')}
                        className="flex items-center justify-center gap-2 p-3 bg-[#25D366] hover:bg-[#1da851] text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>WhatsApp</span>
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
              </div>
            </motion.div>
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
    </AnimatePresence>
  )
}

export default UnifiedProjectModal
