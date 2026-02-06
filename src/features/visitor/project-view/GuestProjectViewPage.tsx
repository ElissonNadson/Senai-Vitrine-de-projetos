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
  AlertCircle,
  Heart,
  User,
  CheckCircle,
  Sparkles,
  Image as ImageIcon,
  Tag
} from 'lucide-react'
import { getProjetoByUuid } from '@/api/queries'
import axiosInstance from '@/services/axios-instance'
import mockProjectsData from '@/data/mockProjects.json'
import ProjectTimeline from '@/components/project-timeline'

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
  autores?: any[] // Array completo de autores da API

  // Visibilidade
  codigo?: string
  visibilidadeCodigo?: 'publico' | 'privado'
  visibilidadeAnexos?: 'publico' | 'privado'

  // Datas
  criadoEm?: string
  atualizadoEm?: string

  // Visualizações
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
          const projectData = await getProjetoByUuid(id)

          if (projectData) {
            // Adaptar estrutura e corrigir URL da imagem
            const getFullImageUrl = (url?: string) => {
              if (!url) return undefined;
              if (url.startsWith('http')) return url;
              const apiUrl = import.meta.env.VITE_API_URL || 'https://vitrinesenaifeira.cloud/api';
              const baseUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
              return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
            }

            if (projectData.autores && Array.isArray(projectData.autores)) {
              const lider = projectData.autores.find((a: any) => a.papel === 'LIDER') || projectData.autores[0]
              const membros = projectData.autores.filter((a: any) => a.usuario_uuid !== lider?.usuario_uuid)
              projectData.liderProjeto = lider
              projectData.equipe = membros
              // Manter o array de autores completo para exibição
              // projectData.autores já está disponível
            }

            // Mapear banner_url para bannerUrl e corrigir caminho
            projectData.bannerUrl = getFullImageUrl(projectData.banner_url || projectData.bannerUrl)

            // Mapear fases para etapas (se existir)
            if (projectData.fases) {
              console.log('📁 Fases recebidas da API:', projectData.fases)

              const mapearFaseParaEtapas = (fase: any) => {
                if (!fase || (!fase.descricao && (!fase.anexos || fase.anexos.length === 0))) return [];

                return [{
                  id: fase.uuid || 'fase-' + Math.random(),
                  nome: fase.descricao || 'Documentação da fase',
                  descricao: fase.descricao,
                  anexos: fase.anexos?.filter((a: any) => a.url_arquivo).map((a: any) => ({
                    id: a.id,
                    nome: a.nome_arquivo,
                    url: getFullImageUrl(a.url_arquivo),
                    tipo: a.tipo,
                    tamanho: a.tamanho_bytes,
                    mime_type: a.mime_type
                  })) || []
                }];
              };

              projectData.etapas = {
                ideacao: mapearFaseParaEtapas(projectData.fases.ideacao),
                modelagem: mapearFaseParaEtapas(projectData.fases.modelagem),
                prototipagem: mapearFaseParaEtapas(projectData.fases.prototipagem),
                validacao: mapearFaseParaEtapas(projectData.fases.implementacao)
              };

              console.log('✅ Etapas mapeadas:', projectData.etapas)
            }

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

  const handleLike = () => {
    showToastMessage('Faça login para curtir este projeto')
    setTimeout(() => {
      navigate('/login')
    }, 1500)
  }

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
      description: 'Fase de descoberta onde identificamos o problema do acesso limitado a produtos sustentáveis confiáveis. Através de técnicas criativas como Crazy 8, Mapa Mental e Value Proposition Canvas, desenvolvemos a proposta de valor de conectar consumidores conscientes com produtores locais verificados, garantindo transparência e rastreabilidade.',
      icon: Lightbulb,
      gradient: 'from-blue-500 to-blue-500',
      badge: 'bg-blue-600',
      solidColor: 'bg-blue-500',
      stages: project.etapas?.ideacao || []
    },
    {
      id: 2,
      name: 'Modelagem',
      description: 'Estruturação completa do modelo de negócio utilizando Business Model Canvas, análise de viabilidade financeira e identificação de riscos. Definimos parceiros-chave (produtores, certificadoras), fontes de receita (comissão de 12%), e criamos cronograma detalhado com marcos de desenvolvimento MVP, onboarding de produtores e lançamento oficial.',
      icon: FileText,
      gradient: 'from-yellow-500 to-yellow-500',
      badge: 'bg-yellow-600',
      solidColor: 'bg-yellow-500',
      stages: project.etapas?.modelagem || []
    },
    {
      id: 3,
      name: 'Prototipagem',
      description: 'Desenvolvimento de protótipos funcionais incluindo wireframes de alta fidelidade, MVP da plataforma web com funcionalidades core (cadastro de produtos, sistema de busca, checkout, rastreamento de carbono) e testes com usuários reais para validação da experiência.',
      icon: Wrench,
      gradient: 'from-purple-500 to-purple-500',
      badge: 'bg-purple-600',
      solidColor: 'bg-purple-500',
      stages: project.etapas?.prototipagem || []
    },
    {
      id: 4,
      name: 'Implementação',
      description: 'Testes finais com grupo de early adopters (produtores e consumidores), coleta de métricas de uso, ajustes baseados em feedback, validação de hipóteses de negócio e preparação para lançamento oficial no mercado.',
      icon: Rocket,
      gradient: 'from-green-500 to-green-500',
      badge: 'bg-green-600',
      solidColor: 'bg-green-500',
      stages: project.etapas?.validacao || []
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
              {project.curtidas !== undefined && (
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-gray-600 hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-400 rounded-lg transition-colors group"
                >
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">{project.curtidas}</span>
                </button>
              )}

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
      {/* Banner informativo para guests - MODO VITRINE */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b-4 border-amber-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-sm font-medium text-gray-200">
                <span className="text-amber-400 font-bold mr-1">Modo Vitrine:</span>
                Você está visualizando uma versão pública deste projeto. Documentos técnicos estão protegidos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Banner do Projeto */}
      {/* Conteúdo Principal - ESTILO REVIEW PAGE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">

          {/* Header do Projeto - Banner + Título */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="relative h-64 md:h-80 bg-gray-100 dark:bg-gray-900">
              {project?.bannerUrl ? (
                <img
                  src={project.bannerUrl}
                  alt={projectTitle}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${currentPhase.gradient} opacity-80`} />
              )}
              {/* Overlay Gradiente para texto legível */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end">
                <div className="p-8 w-full">
                  <div className="flex flex-wrap gap-3 mb-4">
                    {project?.modalidade && (
                      <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-bold rounded-full uppercase tracking-wide">
                        {project.modalidade}
                      </span>
                    )}
                    {project?.curso && (
                      <span className="px-4 py-1.5 bg-blue-500/40 backdrop-blur-md text-white border border-blue-400/30 text-xs font-bold rounded-full uppercase tracking-wide">
                        {project.curso}
                      </span>
                    )}
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-green-500/80 backdrop-blur-md text-white border border-green-400/30 text-xs font-bold rounded-full uppercase tracking-wide shadow-lg">
                      <Eye className="w-3 h-3" />
                      Visualização Pública
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-extrabold text-white text-shadow-lg leading-tight mb-2">
                    {projectTitle}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Sobre o Projeto + Informações Acadêmicas - Grid lado a lado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sobre o Projeto - Card Laranja */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-6 flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm shadow-md">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white text-shadow-sm">Sobre o Projeto</h2>
              </div>

              <div className="p-6">
                <div className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border-2 border-blue-100 dark:border-blue-800">
                  <div className="absolute top-4 right-4 p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pr-12">
                    {project?.titulo}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-base break-words">
                    {project.descricao || 'Sem descrição disponível.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Informações Acadêmicas - Card Amarelo Destacado */}
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
                  {project.modalidade && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/50">
                      <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Modalidade</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{project.modalidade}</p>
                    </div>
                  )}
                </div>

                {/* Tags de Participação */}
                <div className="flex flex-wrap gap-3">
                  {project.itinerario && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-bold text-sm border border-blue-200 dark:border-blue-800">
                      <BookOpen className="w-4 h-4" />
                      Itinerário
                    </div>
                  )}
                  {project.labMaker && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-bold text-sm border border-purple-200 dark:border-purple-800">
                      <Wrench className="w-4 h-4" />
                      SENAI Lab
                    </div>
                  )}
                  {project.participouSaga && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full font-bold text-sm border border-yellow-200 dark:border-yellow-800">
                      <Award className="w-4 h-4" />
                      SAGA SENAI
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>



          {/* Equipe do Projeto - Card Verde */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 p-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm shadow-md">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white text-shadow-sm">Equipe do Projeto</h2>
                  <p className="text-green-100 text-sm mt-1 font-medium">
                    {project.autores?.length || 0} membros no total
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Autores */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Autores</h3>
                    <span className="px-3 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold rounded-full">
                      {project.autores?.length || 0}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Todos os Autores */}
                    {project.autores && project.autores.map((autor: any, idx: number) => {
                      const isLider = autor.papel === 'LIDER';

                      return (
                        <div key={idx} className={`flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl border shadow-sm relative overflow-hidden group ${isLider
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800'
                          : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors'
                          }`}>
                          {isLider && (
                            <div className="absolute right-0 top-0 p-2 bg-yellow-400 text-yellow-900 rounded-bl-xl shadow-sm z-10">
                              <Crown className="w-3 h-3" />
                            </div>
                          )}

                          <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className={`${isLider ? 'w-12 h-12' : 'w-10 h-10'} rounded-full ${isLider
                              ? 'bg-gradient-to-br from-blue-600 to-indigo-600 border-2 border-white dark:border-gray-700'
                              : 'bg-gray-300 dark:bg-gray-600'
                              } flex items-center justify-center text-white font-bold ${isLider ? 'text-lg' : 'text-sm'} shadow-md flex-shrink-0`}>
                              {autor.nome.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className={`${isLider ? 'text-base' : 'text-sm'} font-bold text-gray-900 dark:text-white flex items-center gap-2 truncate`}>
                                {autor.nome}
                              </p>
                              <p className={`${isLider ? 'text-sm' : 'text-xs'} text-gray-600 dark:text-gray-400 truncate`}>{autor.email}</p>
                              {isLider && (
                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-1 block">Líder do Projeto</span>
                              )}
                            </div>
                          </div>

                          {isLider && (
                            <a
                              href={`mailto:${autor.email}`}
                              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-xl font-bold shadow-sm border border-blue-100 dark:border-blue-900 hover:scale-105 transition-transform whitespace-nowrap"
                            >
                              <Mail className="w-4 h-4" />
                              <span>Falar com o Líder</span>
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Orientadores + Contato */}
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <Award className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Orientação</h3>
                  </div>

                  <div className="space-y-4 mb-8">
                    {project.orientadores && project.orientadores.length > 0 ? (
                      project.orientadores.map((orientador: any, idx: number) => (
                        <div key={idx} className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-200 dark:border-purple-800">
                          <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white dark:border-gray-700 flex-shrink-0">
                              {orientador.nome.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-base font-bold text-gray-900 dark:text-white truncate">{orientador.nome}</p>
                              <p className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">Docente Orientador</p>
                              {orientador.email && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{orientador.email}</p>}
                            </div>
                          </div>

                          {orientador.email && (
                            <a
                              href={`mailto:${orientador.email}`}
                              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-xl font-bold shadow-sm border border-purple-100 dark:border-purple-900 hover:scale-105 transition-transform whitespace-nowrap"
                            >
                              <Mail className="w-4 h-4" />
                              <span>Contato</span>
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center border-dashed border-2 border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500">Orientador não informado</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Etapas do Projeto - Card Vermelho/Laranja */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm shadow-md">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white text-shadow-sm">Linha do Tempo</h2>
                  <p className="text-orange-100 text-sm">Progresso e desenvolvimento</p>
                </div>
              </div>
            </div>

            <div className="p-8 relative min-h-[400px]">
              <ProjectTimeline
                phases={phases}
                currentPhaseId={project.faseAtual}
                isGuest={true}
                visibilidadeAnexos={project.visibilidadeAnexos}
                onLoginClick={() => navigate('/login')}
              />

              {/* Overlay de bloqueio parcial (Modo Vitrine) - CENTRALIZADO */}
              {/* Alerta de Anexos Protegidos (Não bloqueia a visualização da timeline) */}
              <div className="mt-6 mx-8 mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-800/40 rounded-lg">
                    <Lock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Anexos Protegidos</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Faça login para visualizar arquivos técnicos.</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-800/40 hover:bg-yellow-200 dark:hover:bg-yellow-800/60 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm font-bold transition-colors whitespace-nowrap"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Fazer Login</span>
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
    </div >
  )
}

export default GuestProjectViewPage
