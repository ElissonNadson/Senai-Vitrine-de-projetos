import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Lightbulb,
  FileText,
  Wrench,
  Rocket,
  GraduationCap,
  Layers,
  BookOpen,
  Award,
  Calendar,
  Eye,
  Share2,
  X as CloseIcon,
  Sparkles,
  Tag,
  Heart,
  Edit,
  Shield,
  FileIcon,
  Facebook,
  Twitter,
  Linkedin,
  Github,
  Check,
  Paperclip,
  Download,
  Clock,
  Lock,
  ChevronRight,
  ExternalLink,
  MoreVertical,
  MessageCircle,
  Link,
  Copy
} from 'lucide-react'
import ProjectTimeline from '@/components/project-timeline'
import { useAuth } from '@/contexts/auth-context'
import { getBaseRoute } from '@/utils/routes'
import { getProjetoByUuid } from '@/api/queries'
import axiosInstance from '@/services/axios-instance'
import mockProjectsData from '@/data/mockProjects.json'

import { ProjectTeam } from '@/components/project/ProjectTeam'
import { ProjectBanner } from '@/components/project/ProjectBanner'
import { useTheme, AccentColor } from '@/contexts/theme-context'

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
  aluno_uuid?: string
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
  banner_url?: string
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
  participouEdital?: boolean
  ganhouPremio?: boolean

  // UC e Líder
  unidadeCurricular?: UnidadeCurricular | string
  liderProjeto?: ProjectLeader
  criado_por_nome?: string
  equipe?: TeamMember[]
  orientadores?: Advisor[]
  autores?: any[] // Array completo de autores da API

  // Visibilidade
  codigo?: string
  visibilidadeCodigo?: 'publico' | 'privado'
  visibilidadeAnexos?: 'publico' | 'privado'

  // Datas
  criadoEm?: string
  atualizadoEm?: string

  // Visualizações
  visualizacoes?: number
  curtidas?: number

  // Etapas por fase
  etapas?: {
    ideacao?: ProjectStage[]
    modelagem?: ProjectStage[]
    prototipagem?: ProjectStage[]
    validacao?: ProjectStage[]
  }
}

const ProjectViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { effectiveTheme: theme, accentColor } = useTheme()
  const baseRoute = useMemo(() => getBaseRoute(user?.tipo), [user?.tipo])

  const [activePhaseId, setActivePhaseId] = useState<number>(1)

  const getGradient = (color: AccentColor) => {
    switch (color) {
      case 'indigo': return 'from-indigo-600 to-purple-600'
      case 'blue': return 'from-blue-600 to-cyan-600'
      case 'purple': return 'from-purple-600 to-pink-600'
      case 'pink': return 'from-pink-600 to-rose-600'
      case 'green': return 'from-green-600 to-emerald-600'
      case 'orange': return 'from-orange-600 to-red-600'
      default: return 'from-blue-600 to-indigo-600'
    }
  }

  const [project, setProject] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [hasLiked, setHasLiked] = useState(false)

  // Incrementar visualizações ao montar
  useEffect(() => {
    if (id && !loading && project) {
      const viewedKey = `viewed_${id}`
      if (!sessionStorage.getItem(viewedKey)) {
        axiosInstance.post(`/projetos/${id}/visualizar`).catch(console.error)
        sessionStorage.setItem(viewedKey, 'true')
      }
    }
  }, [id, loading, project])

  const handleLike = async () => {
    if (!project || hasLiked) return
    try {
      await axiosInstance.post(`/projetos/${id}/curtir`)
      setProject(prev => prev ? ({ ...prev, curtidas: (prev.curtidas || 0) + 1 }) : null)
      setHasLiked(true)
      showToastMessage('Você curtiu este projeto!')
    } catch (error) {
      console.error('Erro ao curtir:', error)
      showToastMessage('Erro ao curtir projeto')
    }
  }

  // Buscar dados do projeto
  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return

      try {
        setLoading(true)

        // Verificação se é o dono (simulação com mock ou dados reais)
        // Em produção, isso viria da API

        let projectData = null;

        // Tentar API Real
        try {
          projectData = await getProjetoByUuid(id);
        } catch (e) {
          console.log("Tentando mocks...")
        }

        // Fallback para Mocks
        if (!projectData) {
          projectData = mockProjectsData.projects.find(
            (p: any) => p.id === id || p.id === `proj-${id}`
          ) as unknown as ProjectData
        }

        if (projectData) {
          // Log para debug
          // Log para debug
          // console.log('📊 Dados do projeto recebidos:', projectData);
          // Adaptar estrutura se necessário
          if (projectData.autores && Array.isArray(projectData.autores)) {
            // @ts-ignore
            const lider = projectData.autores.find((a: any) => a.papel === 'LIDER') || projectData.autores[0]
            // @ts-ignore
            const membros = projectData.autores.filter((a: any) => a.usuario_uuid !== lider?.usuario_uuid)
            projectData.liderProjeto = lider
            projectData.equipe = membros
          }

          // Mapear fases para etapas (formato esperado pelo ProjectTimeline)
          if (projectData.fases) {
            const mapearFaseParaEtapas = (fase: any) => {
              if (!fase || (!fase.descricao && (!fase.anexos || fase.anexos.length === 0))) return [];

              // Cada fase é um único "stage" com todos seus anexos
              return [{
                id: fase.uuid || 'fase-' + Math.random(),
                nome: fase.descricao || 'Documentação da fase',
                descricao: fase.descricao,
                anexos: Array.isArray(fase.anexos) ? fase.anexos.map((a: any) => ({
                  id: a.id,
                  nome: a.nome_arquivo,
                  url: a.url_arquivo,
                  tipo: a.tipo,
                  tamanho: a.tamanho_bytes,
                  mime_type: a.mime_type
                })) : []
              }];
            };

            // @ts-ignore
            projectData.etapas = {
              ideacao: mapearFaseParaEtapas(projectData.fases.ideacao),
              modelagem: mapearFaseParaEtapas(projectData.fases.modelagem),
              prototipagem: mapearFaseParaEtapas(projectData.fases.prototipagem),
              validacao: mapearFaseParaEtapas(projectData.fases.implementacao)
            };
          }

          // Normalizar ID (API usa uuid, Mocks usam id)
          if (!projectData.id && projectData.uuid) {
            // @ts-ignore
            projectData.id = projectData.uuid
          }

          // Helper para URL da imagem
          const getFullImageUrl = (url?: string) => {
            if (!url) return undefined;
            if (url.startsWith('http')) return url;
            const apiUrl = import.meta.env.VITE_API_URL || 'https://vitrinesenaifeira.cloud/api';
            const baseUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
            return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
          }


          // Mapear banner_url para bannerUrl e corrigir caminho
          projectData.bannerUrl = getFullImageUrl(projectData.banner_url || projectData.bannerUrl)

          // Mapear campos snake_case → camelCase para tags
          projectData.labMaker = projectData.senai_lab || projectData.lab_maker
          projectData.participouSaga = projectData.saga_senai || projectData.participou_saga
          projectData.participouEdital = projectData.participou_edital
          projectData.ganhouPremio = projectData.ganhou_premio
          if (projectData.unidade_curricular) {
            projectData.unidadeCurricular = projectData.unidade_curricular
          }

          // Converter fase_atual string para número
          const faseMap: Record<string, number> = { 'IDEACAO': 1, 'MODELAGEM': 2, 'PROTOTIPAGEM': 3, 'IMPLEMENTACAO': 4 }
          projectData.faseAtual = faseMap[projectData.fase_atual] || projectData.faseAtual || 1

          setProject(projectData)
          setActivePhaseId(projectData.faseAtual || 1)

          // Verificar Ownership
          const isLider = projectData.liderProjeto?.email === user?.email;
          const isMember = projectData.autores?.some((a: any) => a.email === user?.email) ||
            projectData.orientadores?.some((o: any) => o.email === user?.email);

          setIsOwner(isLider || isMember || false);
        }
      } catch (error) {
        console.error('Erro ao buscar projeto:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id, user])

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
          <button
            onClick={() => navigate(baseRoute || '/dashboard')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>
      </div>
    )
  }

  const projectTitle = project.titulo || project.nome

  // Permissão de Download: Qualquer usuário logado
  const canDownload = !!user;

  // Configuração das fases
  const phases = [
    {
      id: 1,
      name: 'Ideação',
      description: 'Fase de descoberta onde identificamos o problema e desenvolvemos a proposta de valor.',
      icon: Lightbulb,
      gradient: 'from-yellow-400 to-amber-500',
      badge: 'bg-yellow-600',
      solidColor: 'bg-yellow-500',
      color: 'yellow',
      stages: project.etapas?.ideacao || []
    },
    {
      id: 2,
      name: 'Modelagem',
      description: 'Estruturação completo do modelo de negócio e análise de viabilidade.',
      icon: FileText,
      gradient: 'from-blue-500 to-indigo-600',
      badge: 'bg-blue-600',
      solidColor: 'bg-blue-500',
      color: 'blue',
      stages: project.etapas?.modelagem || []
    },
    {
      id: 3,
      name: 'Prototipagem',
      description: 'Desenvolvimento de protótipos funcionais e MVP.',
      icon: Wrench,
      gradient: 'from-purple-500 to-pink-600',
      badge: 'bg-purple-600',
      solidColor: 'bg-purple-500',
      color: 'purple',
      stages: project.etapas?.prototipagem || []
    },
    {
      id: 4,
      name: 'Implementação',
      description: 'Testes finais, validação e lançamento.',
      icon: Rocket,
      gradient: 'from-emerald-500 to-green-600',
      badge: 'bg-green-600',
      solidColor: 'bg-green-500',
      color: 'green',
      stages: project.etapas?.validacao || []
    }
  ]
  const currentPhase = phases.find((p) => p.id === project.faseAtual) || phases[0]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header Fixo Moderno */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => {
              if (location.state?.from) {
                navigate(location.state.from)
              } else {
                navigate(baseRoute || '/dashboard')
              }
            }}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
          >
            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm">Voltar</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Status Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${project.status === 'PUBLICADO'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              }`}>
              {project.status === 'PUBLICADO' ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              {project.status || 'RASCUNHO'}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Actions Bar (Mobile/Desktop) */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            {/* Breadcrumbs or small title if needed */}
          </div>
          <div className="flex items-center gap-3">
            {isOwner && (
              <button
                onClick={() => navigate(`${baseRoute}/editar-projeto/${project.uuid || project.id}`, { state: { isEditing: true } })}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
              >
                <Edit className="w-4 h-4" />
                <span>Editar</span>
              </button>
            )}

            {project.curtidas !== undefined && (
              <button
                onClick={handleLike}
                disabled={hasLiked}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm border ${hasLiked
                  ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-gray-700 dark:text-gray-300 hover:text-rose-600'
                  }`}
              >
                <Heart className={`w-5 h-5 transition-transform ${hasLiked ? 'fill-current' : 'group-hover:scale-110'}`} />
                <span>{project.curtidas}</span>
              </button>
            )}

            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            >
              <Share2 className="w-5 h-5" />
              <span className="hidden sm:inline">Compartilhar</span>
            </button>
          </div>
        </div>

        {/* Hero Section */}
        {/* Hero Section */}
        <ProjectBanner.Root
          bannerUrl={project?.banner_url}
          accentColor={accentColor}
        >
          <ProjectBanner.Overlay>
            <div className="flex flex-col justify-end h-full">
              <ProjectBanner.Title>
                {projectTitle}
              </ProjectBanner.Title>
              <ProjectBanner.Leader
                name={project.criado_por_nome || project.liderProjeto?.nome || ''}
              />
            </div>
          </ProjectBanner.Overlay>
        </ProjectBanner.Root>

        {/* Sobre o Projeto + Informações Acadêmicas - Grid lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sobre o Projeto - Full Width -> Laranja */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-6 flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm shadow-md">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white text-shadow-sm">Sobre o Projeto</h2>
            </div>

            <div className="p-6">
              <div className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border-2 border-blue-100 dark:border-blue-800 overflow-hidden">
                <p className="text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-line text-sm break-words text-justify overflow-hidden">
                  {project.descricao || 'Sem descrição disponível.'}
                </p>
              </div>
            </div>
          </div>

          {/* Informações Acadêmicas */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 p-6 flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm shadow-md">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white text-shadow-sm">Informações Acadêmicas</h2>
            </div>

            <div className="p-6">
              {/* Grid de Informações */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {project.curso && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/50">
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Curso</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate" title={project.curso}>{project.curso}</p>
                  </div>
                )}
                {project.turma && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/50">
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Turma</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{project.turma}</p>
                  </div>
                )}
                {project.categoria && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/50">
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Categoria</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate" title={project.categoria}>{project.categoria}</p>
                  </div>
                )}
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/50">
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Unidade Curricular</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate" title={typeof project.unidadeCurricular === 'string' ? project.unidadeCurricular : project.unidadeCurricular?.nome}>{typeof project.unidadeCurricular === 'string' ? project.unidadeCurricular : (project.unidadeCurricular?.nome || '—')}</p>
                  </div>
              </div>

              {/* Tags de Participação */}
              <div className="flex flex-wrap gap-2">
                {project.itinerario && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-bold text-xs border border-blue-200 dark:border-blue-800">
                    <BookOpen className="w-3.5 h-3.5" />
                    Itinerário
                  </div>
                )}
                {project.labMaker && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-bold text-xs border border-purple-200 dark:border-purple-800">
                    <Wrench className="w-3.5 h-3.5" />
                    SENAI Lab
                  </div>
                )}
                {project.participouSaga && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full font-bold text-xs border border-yellow-200 dark:border-yellow-800">
                    <Award className="w-3.5 h-3.5" />
                    SAGA SENAI
                  </div>
                )}
                {project.participouEdital && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full font-bold text-xs border border-amber-200 dark:border-amber-800">
                    <Award className="w-3.5 h-3.5" />
                    Edital
                  </div>
                )}
                {project.ganhouPremio && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full font-bold text-xs border border-yellow-200 dark:border-yellow-800">
                    <Award className="w-3.5 h-3.5" />
                    Prêmio
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>



        {/* Equipe do Projeto */}
        <ProjectTeam
          autores={project.autores}
          orientadores={project.orientadores}
          showContactInfo={true}
          showEmail={false}
        />

        {/* Etapas do Projeto - Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm shadow-md">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white text-shadow-sm">Linha do Tempo</h2>
                <p className="text-orange-100 text-sm">Progresso detalhado do projeto</p>
              </div>
            </div>
          </div>

          <div className="p-8 relative min-h-[400px]">
            <ProjectTimeline
              phases={phases}
              currentPhaseId={project.faseAtual}
              isGuest={false}
              visibilidadeAnexos={project.visibilidadeAnexos}
              allowDownload={canDownload}
              onLoginClick={() => { }}
            />
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

                <div className="p-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Compartilhe este projeto nas redes sociais ou copie o link direto.
                  </p>

                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <button onClick={() => handleSocialShare('facebook')} className="flex flex-col items-center gap-2 group">
                      <div className="w-12 h-12 bg-[#1877F2] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                        <Facebook className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Facebook</span>
                    </button>
                    <button onClick={() => handleSocialShare('twitter')} className="flex flex-col items-center gap-2 group">
                      <div className="w-12 h-12 bg-[#1DA1F2] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                        <Twitter className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Twitter</span>
                    </button>
                    <button onClick={() => handleSocialShare('linkedin')} className="flex flex-col items-center gap-2 group">
                      <div className="w-12 h-12 bg-[#0A66C2] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                        <Linkedin className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Linkedin</span>
                    </button>
                    <button onClick={() => handleSocialShare('whatsapp')} className="flex flex-col items-center gap-2 group">
                      <div className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">WhatsApp</span>
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={window.location.href}
                      className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-600 dark:text-gray-300"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors"
                      title="Copiar link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-50 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <Check className="w-5 h-5 text-green-400" />
            <span className="font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  )
}

export default ProjectViewPage
