import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
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
  Eye,
  Paperclip,
  Download,
  FileIcon,
  Share2,
  Copy,
  Check,
  Link,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Crown,
  Mail,
  LogIn,
  X as CloseIcon,
  Github,
  ExternalLink,
  AlertCircle
} from 'lucide-react'
import axiosInstance from '@/services/axios-instance'
import mockProjectsData from '@/data/mockProjects.json'

// Tipos
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

interface ProjectData {
  id: string
  uuid?: string
  nome: string
  titulo?: string
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
  
  // Visualizações
  visualizacoes?: number
  
  // Etapas por fase
  etapas?: {
    ideacao?: ProjectStage[]
    modelagem?: ProjectStage[]
    prototipagem?: ProjectStage[]
    validacao?: ProjectStage[]
  }
}

const GuestProjectViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [project, setProject] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Buscar dados do projeto
  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return

      try {
        setLoading(true)
        
        // Primeiro, tentar buscar dos dados mockados
        const mockProject = mockProjectsData.projects.find(
          (p: any) => p.id === id || p.id === `proj-${id}`
        )
        
        if (mockProject) {
          setProject(mockProject as any)
          setLoading(false)
          return
        }
        
        // Se não encontrar nos mocks, buscar projetos públicos da API
        try {
          const response = await axiosInstance.get('/projeto/findAll')
          const projectData = response.data.find((p: any) => p.id === id || p.uuid === id)
          
          if (projectData) {
            setProject(projectData)
          }
        } catch (apiError) {
          console.error('Erro ao buscar projetos públicos:', apiError)
        }
      } catch (error) {
        console.error('Erro ao buscar projeto:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  // Funções de compartilhamento
  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

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
    const text = `${project?.nome || project?.titulo} - Projeto SENAI`
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando projeto...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Projeto não encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            O projeto que você está procurando não existe.
          </p>
          <button
            onClick={() => navigate('/?guest=true')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar aos Projetos
          </button>
        </div>
      </div>
    )
  }

  const projectTitle = project.titulo || project.nome

  // Configuração das fases (apenas visual para visitantes)
  const phases = [
    {
      id: 1,
      name: 'Ideação',
      icon: Lightbulb,
      gradient: 'from-blue-500 to-cyan-500',
      badge: 'bg-blue-600',
    },
    {
      id: 2,
      name: 'Modelagem',
      icon: FileText,
      gradient: 'from-yellow-500 to-orange-500',
      badge: 'bg-yellow-600',
    },
    {
      id: 3,
      name: 'Prototipagem',
      icon: Wrench,
      gradient: 'from-orange-500 to-red-500',
      badge: 'bg-orange-600',
    },
    {
      id: 4,
      name: 'Validação',
      icon: Rocket,
      gradient: 'from-green-500 to-emerald-500',
      badge: 'bg-green-600',
    }
  ]

  const currentPhase = phases.find((p) => p.id === project.faseAtual) || phases[0]
  const PhaseIcon = currentPhase.icon

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header com Botão Voltar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/?guest=true')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Voltar</span>
            </button>
            
            <div className="flex items-center gap-3">
              {project.visualizacoes !== undefined && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Eye className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="font-semibold text-gray-900 dark:text-white">{project.visualizacoes}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">visualizações</span>
                </div>
              )}
              
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>Compartilhar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Banner informativo para guests - DESTAQUE */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700 border-b-4 border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-base">🔍 Modo Visitante - Visualização Limitada</p>
                <p className="text-white/90 text-sm">
                  Algumas informações estão ocultas. Faça login para acessar o conteúdo completo!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-semibold transition-colors backdrop-blur-sm border border-white/30"
              >
                Criar Conta
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 bg-white text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Fazer Login
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Banner do Projeto */}
      <div className="relative h-80 overflow-hidden">
        {project.bannerUrl ? (
          <>
            <img
              src={project.bannerUrl}
              alt={projectTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${currentPhase.gradient}`} />
        )}
        
        {/* Título sobre o banner */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start gap-4">
              <div className={`p-4 ${currentPhase.badge} rounded-2xl shadow-xl`}>
                <PhaseIcon className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/80 to-indigo-500/80 backdrop-blur-sm text-white rounded-full shadow-lg mb-3">
                  <Eye className="w-4 h-4" />
                  <span className="font-bold text-sm">Visualização Pública</span>
                </div>
                
                <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                  {projectTitle}
                </h1>
                
                {/* Fase Atual */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1.5 ${currentPhase.badge} text-white rounded-full text-sm font-semibold shadow-lg`}>
                    Fase: {currentPhase.name}
                  </span>
                </div>

                {/* Equipe do Projeto no Banner */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Líder */}
                  {project.liderProjeto && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full shadow-lg">
                      <Crown className="w-4 h-4 text-yellow-300" />
                      <span className="text-white font-medium text-sm">{project.liderProjeto.nome}</span>
                    </div>
                  )}
                  
                  {/* Membros da Equipe */}
                  {project.equipe && project.equipe.length > 0 && (
                    <>
                      {project.equipe.slice(0, 3).map((membro, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full shadow-lg">
                          <span className="text-white font-medium text-sm">{membro.nome}</span>
                        </div>
                      ))}
                      {project.equipe.length > 3 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full shadow-lg">
                          <span className="text-white font-medium text-sm">+{project.equipe.length - 3}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal - Descrição e Aviso */}
          <div className="lg:col-span-2 space-y-6">
            {/* Descrição do Projeto */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Sobre o Projeto
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {project.descricao}
              </p>
            </div>

            {/* Card de Restrição - ETAPAS BLOQUEADAS */}
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20 rounded-xl shadow-lg border-2 border-amber-300 dark:border-amber-700 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
                      <Lock className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-300 mb-3">
                      🔒 Conteúdo Exclusivo para Membros
                    </h3>
                    <p className="text-amber-800 dark:text-amber-200 mb-4 text-lg">
                      Como visitante, você tem acesso apenas à visão geral do projeto. 
                      <strong className="block mt-1">Faça login para desbloquear o conteúdo completo:</strong>
                    </p>
                    
                    <div className="grid gap-3 mb-5">
                      <div className="flex items-start gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
                        <div className="flex-shrink-0 p-2 bg-amber-500 rounded-lg">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-amber-900 dark:text-amber-300">Etapas Detalhadas por Fase</p>
                          <p className="text-sm text-amber-700 dark:text-amber-400">
                            Veja o progresso completo em cada fase: Ideação, Modelagem, Prototipagem e Validação
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
                        <div className="flex-shrink-0 p-2 bg-amber-500 rounded-lg">
                          <Paperclip className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-amber-900 dark:text-amber-300">Anexos e Documentos</p>
                          <p className="text-sm text-amber-700 dark:text-amber-400">
                            Acesse todos os arquivos, documentos e recursos de cada etapa do projeto
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
                        <div className="flex-shrink-0 p-2 bg-amber-500 rounded-lg">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-amber-900 dark:text-amber-300">Cronograma Completo</p>
                          <p className="text-sm text-amber-700 dark:text-amber-400">
                            Visualize todas as datas de início e fim de cada etapa
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
                        <div className="flex-shrink-0 p-2 bg-amber-500 rounded-lg">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-amber-900 dark:text-amber-300">Contato com a Equipe</p>
                          <p className="text-sm text-amber-700 dark:text-amber-400">
                            Entre em contato direto com orientadores e membros da equipe
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
                        <div className="flex-shrink-0 p-2 bg-amber-500 rounded-lg">
                          <Layers className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-amber-900 dark:text-amber-300">Navegação entre Fases</p>
                          <p className="text-sm text-amber-700 dark:text-amber-400">
                            Explore livremente todas as fases do projeto
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-3">
                      <button
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-base"
                      >
                        <LogIn className="w-5 h-5" />
                        Fazer Login Agora
                      </button>
                      <button
                        onClick={() => navigate('/register')}
                        className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-amber-900 dark:text-amber-300 border-2 border-amber-400 dark:border-amber-600 rounded-lg font-bold transition-all duration-300"
                      >
                        Criar Conta Grátis
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Informações do Projeto */}
          <div className="space-y-6">
            {/* Equipe do Projeto */}
            {(project.liderProjeto || (project.equipe && project.equipe.length > 0)) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Equipe</h3>
                </div>
                
                <div className="space-y-3">
                  {/* Líder do Projeto */}
                  {project.liderProjeto && (
                    <div className="p-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase">Líder do Projeto</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {project.liderProjeto.nome}
                      </p>
                      {project.liderProjeto.email && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {project.liderProjeto.email}
                        </p>
                      )}
                      {project.liderProjeto.matricula && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Mat: {project.liderProjeto.matricula}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Membros da Equipe */}
                  {project.equipe && project.equipe.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                        Membros ({project.equipe.length})
                      </p>
                      <div className="space-y-2">
                        {project.equipe.map((membro, index) => (
                          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {membro.nome}
                            </p>
                            {membro.email && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                {membro.email}
                              </p>
                            )}
                            {membro.papel && (
                              <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                                {membro.papel}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Orientadores */}
            {project.orientadores && project.orientadores.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Orientadores ({project.orientadores.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {project.orientadores.map((orientador, index) => (
                    <div key={index} className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                      <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                        {orientador.nome}
                      </p>
                      {orientador.especialidade && (
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-2">
                          {orientador.especialidade}
                        </p>
                      )}
                      {orientador.email && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 p-2 rounded">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{orientador.email}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Informações Básicas */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Informações
              </h3>

              {project.curso && (
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Curso</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {project.curso}
                    </p>
                  </div>
                </div>
              )}

              {project.turma && (
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Turma</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {project.turma}
                    </p>
                  </div>
                </div>
              )}

              {project.categoria && (
                <div className="flex items-start gap-3">
                  <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Categoria</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {project.categoria}
                    </p>
                  </div>
                </div>
              )}

              {project.modalidade && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Modalidade</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {project.modalidade}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Badges */}
            {(project.itinerario || project.labMaker || project.participouSaga) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Destaques
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.itinerario && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                      <BookOpen className="w-4 h-4" />
                      Itinerário
                    </div>
                  )}
                  {project.labMaker && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold">
                      <Wrench className="w-4 h-4" />
                      SENAI Lab
                    </div>
                  )}
                  {project.participouSaga && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-semibold">
                      <Award className="w-4 h-4" />
                      SAGA SENAI
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Unidade Curricular */}
            {project.unidadeCurricular && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Unidade Curricular
                  </h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
                  {project.unidadeCurricular.nome}
                </p>
              </div>
            )}

            {/* Repositório - Se público */}
            {project.codigo && project.visibilidadeCodigo === 'publico' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Github className="w-5 h-5 text-gray-900 dark:text-white" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Repositório
                  </h3>
                </div>
                <a
                  href={project.codigo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    Ver código-fonte
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
                </a>
              </div>
            )}

            {/* CTA para Login - Sidebar */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-xl shadow-lg p-6 text-white">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Crie sua conta!
                </h3>
                <p className="text-white/90 text-sm mb-4">
                  Acesse todo o conteúdo dos projetos, crie seus próprios projetos e conecte-se com a comunidade SENAI.
                </p>
                <button
                  onClick={() => navigate('/register')}
                  className="w-full px-4 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors mb-2"
                >
                  Criar Conta Grátis
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors border border-white/30"
                >
                  Já tenho conta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Compartilhamento */}
      <AnimatePresence>
        {showShareModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowShareModal(false)}
            />
            
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
                    <CloseIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Preview do Projeto */}
                <div className="p-6">
                  <div className="relative rounded-xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800">
                    {project.bannerUrl ? (
                      <img
                        src={project.bannerUrl}
                        alt={projectTitle}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center">
                        <Lightbulb className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-white font-bold text-lg">{projectTitle}</p>
                      <p className="text-white/80 text-sm">{currentPhase.name}</p>
                    </div>
                  </div>

                  {/* Redes Sociais */}
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
    </div>
  )
}

export default GuestProjectViewPage
