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
  Check
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { getBaseRoute } from '@/utils/routes'
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
  const baseRoute = useMemo(() => getBaseRoute(user?.tipo), [user?.tipo])

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
          console.log('📊 Dados do projeto recebidos:', projectData);
          console.log('👥 Autores encontrados:', projectData.autores);
          console.log('📁 Fases recebidas:', projectData.fases);

          // Adaptar estrutura se necessário
          if (projectData.autores && Array.isArray(projectData.autores)) {
            // @ts-ignore
            const lider = projectData.autores.find((a: any) => a.papel === 'LIDER') || projectData.autores[0]
            // @ts-ignore
            const membros = projectData.autores.filter((a: any) => a.usuario_uuid !== lider?.usuario_uuid)
            projectData.liderProjeto = lider
            projectData.equipe = membros
            // Manter o array de autores completo para exibição
            // projectData.autores já está disponível
            console.log('✅ Líder:', lider);
            console.log('✅ Membros filtrados:', membros);
            console.log('✅ Total de autores preservados:', projectData.autores?.length);
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

            console.log('✅ Etapas mapeadas:', projectData.etapas);
          }

          // Normalizar ID (API usa uuid, Mocks usam id)
          if (!projectData.id && projectData.uuid) {
            // @ts-ignore
            projectData.id = projectData.uuid
          }

          // Helper para URL da imagem (mesma lógica do GuestProjectViewPage)
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
          // Comparar email ou UUID se disponível
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

  // Permissão de Download: Docs (Docentes) ou Donos (Alunos autores)
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header com Botão Voltar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(baseRoute || '/dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Voltar</span>
            </button>

            <div className="flex items-center gap-3">
              {/* Botão de Editar para Donos */}
              {isOwner && (
                <button
                  onClick={() => navigate(`${baseRoute}/edit-project/${project.uuid || project.id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors shadow-sm"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar Projeto</span>
                </button>
              )}

              {project.curtidas !== undefined && (
                <button
                  onClick={handleLike}
                  disabled={hasLiked}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors group ${hasLiked
                    ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-gray-600 hover:text-rose-600 dark:text-gray-300'
                    }`}
                >
                  <Heart className={`w-5 h-5 transition-transform ${hasLiked ? 'fill-current' : 'group-hover:scale-110'}`} />
                  <span className="font-semibold">{project.curtidas}</span>
                </button>
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

      {/* Conteúdo Principal */}
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
              {/* Overlay Gradiente */}
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
                  </div>
                  <h1 className="text-3xl md:text-5xl font-extrabold text-white text-shadow-lg leading-tight mb-2">
                    {projectTitle}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Sobre o Projeto */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-6 flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm shadow-md">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white text-shadow-sm">Sobre o Projeto</h2>
            </div>

            <div className="p-8">
              <div className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border-2 border-blue-100 dark:border-blue-800 mb-8">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {project.categoria && (
                  <div className="p-5 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-800 hover:border-purple-300 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Categoria</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{project.categoria}</p>
                  </div>
                )}
                {project.modalidade && (
                  <div className="p-5 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800 hover:border-blue-300 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Modalidade</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{project.modalidade}</p>
                  </div>
                )}
                {project.curso && (
                  <div className="p-5 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-800 hover:border-green-300 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">Curso</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{project.curso}</p>
                  </div>
                )}
              </div>

              {/* Informações Acadêmicas Integradas */}
              <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-8">
                <div className="flex items-center gap-2 mb-6">
                  <GraduationCap className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Informações Acadêmicas</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.turma && (
                    <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Turma</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{project.turma}</p>
                    </div>
                  )}

                  {project.unidadeCurricular && (
                    <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 lg:col-span-2 hover:border-blue-300 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unidade Curricular</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {typeof project.unidadeCurricular === 'string' ? project.unidadeCurricular : project.unidadeCurricular.nome}
                      </p>
                    </div>
                  )}
                  {project.itinerario !== undefined && (
                    <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Itinerário</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{project.itinerario ? 'Sim' : 'Não'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Equipe do Projeto */}
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
                  </div>

                  <div className="space-y-4">
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
                              <span>Email</span>
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Orientadores */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Award className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Orientação</h3>
                  </div>

                  <div className="space-y-4">
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
                              <span>Email</span>
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

            <div className="p-8">
              {!canDownload && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl flex items-center gap-3 border border-blue-200 dark:border-blue-800">
                  <Shield className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">
                    <strong>Modo Visualização:</strong> Como aluno visitante, você pode visualizar a timeline e os nomes dos arquivos, mas o download é restrito aos autores e docentes.
                  </p>
                </div>
              )}

              <ProjectTimeline
                phases={phases}
                currentPhaseId={project.faseAtual}
                isGuest={false}
                allowDownload={canDownload}
                visibilidadeAnexos={project.visibilidadeAnexos}
              />
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
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">LinkedIn</span>
                    </button>
                    <button onClick={() => handleSocialShare('whatsapp')} className="flex flex-col items-center gap-2 group">
                      <div className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">WhatsApp</span>
                    </button>
                  </div>

                  <div className="relative">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <Link className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        readOnly
                        value={window.location.href}
                        className="flex-1 bg-transparent border-none text-sm text-gray-600 dark:text-gray-300 focus:ring-0 p-0"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors text-blue-600 dark:text-blue-400"
                        title="Copiar link"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
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
            className="fixed bottom-8 right-8 z-50 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-lg shadow-xl flex items-center gap-3"
          >
            <Check className="w-5 h-5 text-green-500" />
            <span className="font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProjectViewPage
