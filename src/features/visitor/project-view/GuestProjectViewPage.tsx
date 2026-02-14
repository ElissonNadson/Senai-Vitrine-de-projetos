import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ShareProjectModal from '@/components/modals/ShareProjectModal'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Lightbulb,
  FileText,
  Wrench,
  Rocket,
  GraduationCap,
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
import { ProjectTeam } from '@/components/project/ProjectTeam'
import { getProjetoByUuid } from '@/api/queries'
import axiosInstance from '@/services/axios-instance'
import mockProjectsData from '@/data/mockProjects.json'
import ProjectTimeline from '@/components/project-timeline'
import { ProjectBanner } from '@/components/project/ProjectBanner'

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
  participouEdital?: boolean
  ganhouPremio?: boolean

  // UC e Líder
  unidadeCurricular?: UnidadeCurricular
  liderProjeto?: ProjectLeader
  equipe?: TeamMember[]
  orientadores?: Advisor[]
  historicoOrientadores?: Advisor[] // Histórico completo
  autores?: any[] // Array completo de autores da API

  // Visibilidade
  codigo?: string
  visibilidadeCodigo?: 'publico' | 'privado'
  visibilidadeAnexos?: 'publico' | 'privado'

  // Datas
  criadoEm?: string
  atualizadoEm?: string
  dataPublicacao?: string

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

            // Mapear historico_orientadores se existir
            if (projectData.historico_orientadores) {
              projectData.historicoOrientadores = projectData.historico_orientadores
            }

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
                    nomeArquivo: a.nome_arquivo,
                    url: getFullImageUrl(a.url_arquivo),
                    tipo: a.tipo || a.tipo_anexo || '',
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

            // Mapear campos snake_case → camelCase para tags
            projectData.labMaker = projectData.senai_lab || projectData.lab_maker
            projectData.participouSaga = projectData.saga_senai || projectData.participou_saga
            projectData.participouEdital = projectData.participou_edital
            projectData.ganhouPremio = projectData.ganhou_premio
            projectData.criadoEm = projectData.criado_em || projectData.criadoEm
            projectData.atualizadoEm = projectData.atualizado_em || projectData.atualizadoEm
            projectData.dataPublicacao = projectData.data_publicacao || projectData.dataPublicacao
            if (projectData.unidade_curricular) {
              projectData.unidadeCurricular = projectData.unidade_curricular
            }

            // Converter fase_atual string para número
            const faseMap: Record<string, number> = { 'IDEACAO': 1, 'MODELAGEM': 2, 'PROTOTIPAGEM': 3, 'IMPLEMENTACAO': 4 }
            projectData.faseAtual = faseMap[projectData.fase_atual] || projectData.faseAtual || 1

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
    alert('Faça login para curtir este projeto')
    setTimeout(() => {
      navigate('/login')
    }, 1500)
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
            onClick={() => navigate('/explorar-vitrine')}
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
              onClick={() => navigate('/explorar-vitrine')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Voltar</span>
            </button>

            {/* Datas do projeto - Centro */}
            <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              {project.criadoEm && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Criado em: <span className="font-semibold text-gray-700 dark:text-gray-300">{new Date(project.criadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</span></span>
                </div>
              )}
              {project.atualizadoEm && project.atualizadoEm !== project.criadoEm && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Atualizado em: <span className="font-semibold text-gray-700 dark:text-gray-300">{new Date(project.atualizadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</span></span>
                </div>
              )}
            </div>

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
          <ProjectBanner.Root
            bannerUrl={project?.bannerUrl}
            // Use blue as default or derive from phase if needed, keeping it simple for now or mapping phases to accent colors
            accentColor="blue"
          >
            <ProjectBanner.Overlay>
              <div className="flex flex-col justify-end h-full">
                <ProjectBanner.Title>
                  {projectTitle}
                </ProjectBanner.Title>
              </div>
            </ProjectBanner.Overlay>
          </ProjectBanner.Root>

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
                <div className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border-2 border-blue-100 dark:border-blue-800 overflow-hidden">
                  <p className="text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-line text-sm break-words text-justify overflow-hidden">
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
            historicoOrientadores={project.historicoOrientadores}
            showContactInfo={true}
            showEmail={false}
          />

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
      <ShareProjectModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        projectTitle={project.nome || project.titulo}
        projectUuid={id!}
        bannerUrl={project.bannerUrl}
        description={project.descricao}
      />
    </div >
  )
}

export default GuestProjectViewPage
