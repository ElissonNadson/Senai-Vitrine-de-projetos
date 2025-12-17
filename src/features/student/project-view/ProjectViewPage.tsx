import React, { useState, useEffect, useMemo } from 'react'
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
  BookOpen,
  Award,
  Calendar,
  Eye,
  Share2,
  Crown,
  Mail,
  X as CloseIcon,
  Sparkles,
  Tag,
  User,
  Heart,
  Edit,
  Shield,
  FileIcon,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Link,
  Copy,
  Check,
  Clock
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { getBaseRoute } from '@/utils/routes'
import { getProjetoByUuid } from '@/api/queries'
import axiosInstance from '@/services/axios-instance'
import mockProjectsData from '@/data/mockProjects.json'
import ProjectTimeline from '@/components/project-timeline'
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
  unidadeCurricular?: UnidadeCurricular | string
  liderProjeto?: ProjectLeader
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
  const { user } = useAuth()
  const { effectiveTheme: theme, accentColor } = useTheme()
  const baseRoute = useMemo(() => getBaseRoute(user?.tipo), [user?.tipo])

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
                anexos: fase.anexos?.map((a: any) => ({
                  id: a.id,
                  nome: a.nome_arquivo,
                  url: a.url_arquivo,
                  tipo: a.tipo,
                  tamanho: a.tamanho_bytes,
                  mime_type: a.mime_type
                })) || []
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

          setProject(projectData)

          // Verificar Ownership
          const isLider = projectData.liderProjeto?.email === user?.email;
          // @ts-ignore
          const isMember = projectData.equipe?.some(m => m.email === user?.email);

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

  // Permissão de Download: Docs (Professores) ou Donos (Alunos autores)
  const canDownload = user?.tipo === 'DOCENTE' || isOwner;

  // Configuração das fases
  const phases = [
    {
      id: 1,
      name: 'Ideação',
      description: 'Fase de descoberta onde identificamos o problema e desenvolvemos a proposta de valor.',
      icon: Lightbulb,
      gradient: 'from-blue-500 to-blue-500',
      badge: 'bg-blue-600',
      solidColor: 'bg-blue-500',
      stages: project.etapas?.ideacao || []
    },
    {
      id: 2,
      name: 'Modelagem',
      description: 'Estruturação completa do modelo de negócio e análise de viabilidade.',
      icon: FileText,
      gradient: 'from-yellow-500 to-yellow-500',
      badge: 'bg-yellow-600',
      solidColor: 'bg-yellow-500',
      stages: project.etapas?.modelagem || []
    },
    {
      id: 3,
      name: 'Prototipagem',
      description: 'Desenvolvimento de protótipos funcionais e MVP.',
      icon: Wrench,
      gradient: 'from-purple-500 to-purple-500',
      badge: 'bg-purple-600',
      solidColor: 'bg-purple-500',
      stages: project.etapas?.prototipagem || []
    },
    {
      id: 4,
      name: 'Implementação',
      description: 'Testes finais, validação e lançamento.',
      icon: Rocket,
      gradient: 'from-green-500 to-green-500',
      badge: 'bg-green-600',
      solidColor: 'bg-green-500',
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
            onClick={() => navigate(baseRoute || '/dashboard')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
          >
            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm">Voltar para Dashboard</span>
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
                onClick={() => navigate(`${baseRoute}/edit-project/${project.uuid || project.id}`)}
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="group relative rounded-3xl overflow-hidden shadow-2xl bg-gray-900 aspect-[16/9] md:aspect-[21/9]"
        >
          {project?.bannerUrl ? (
            <img
              src={project.bannerUrl}
              alt={projectTitle}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${getGradient(accentColor)} opacity-90`} />
          )}

          {/* Modern Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent flex flex-col justify-end p-6 md:p-10">
            <div className="max-w-4xl space-y-4">
              <div className="flex flex-wrap gap-2">
                {project?.modalidade && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-lg text-white text-xs font-bold uppercase tracking-wider">
                    {project.modalidade}
                  </span>
                )}
                {project?.curso && (
                  <span className="px-3 py-1 bg-blue-500/30 backdrop-blur-md border border-blue-400/30 rounded-lg text-blue-100 text-xs font-bold uppercase tracking-wider">
                    {project.curso}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                {projectTitle}
              </h1>
              {project.liderProjeto && (
                <div className="flex items-center gap-3 text-gray-300 pt-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold border-2 border-white/20">
                    {project.liderProjeto.nome.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium opacity-80">Liderado por</span>
                    <span className="font-bold text-white">{project.liderProjeto.nome}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content (Left Column) */}
          <div className="lg:col-span-2 space-y-8">

            {/* Sobre */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-${accentColor}-600 dark:text-${accentColor}-400`}>
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sobre o Projeto</h2>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {project.descricao || 'Nenhuma descrição fornecida.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {project.categoria && (
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Categoria</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{project.categoria}</span>
                  </div>
                )}
                {project.unidadeCurricular && (
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Unidade Curricular</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {typeof project.unidadeCurricular === 'string' ? project.unidadeCurricular : project.unidadeCurricular.nome}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ProjectTimeline
                phases={phases}
                currentPhaseId={project.faseAtual}
                isGuest={false}
                allowDownload={canDownload}
                visibilidadeAnexos={project.visibilidadeAnexos}
              />
            </motion.div>

          </div>

          {/* Sidebar Information (Right Column) */}
          <div className="space-y-8">

            {/* Team Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Equipe</h3>
              </div>

              <div className="space-y-4">
                {/* Authors */}
                {project.autores?.map((autor: any, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${autor.papel === 'LIDER' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gray-400'
                      }`}>
                      {autor.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{autor.nome}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{autor.email}</p>
                    </div>
                    {autor.papel === 'LIDER' && (
                      <Crown className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Academic Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Acadêmico</h3>
              </div>

              <div className="space-y-4">
                {project.turma && (
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">Turma</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{project.turma}</p>
                    </div>
                  </div>
                )}
                {project.orientadores?.map((orientador, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">Orientador</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{orientador.nome}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
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
    </div>
  )
}

export default ProjectViewPage
