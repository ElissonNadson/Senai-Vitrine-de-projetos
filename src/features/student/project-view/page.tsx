import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
  ExternalLink,
  Eye,
  Paperclip,
  Download,
  FileIcon,
  Share2,
  Github
} from 'lucide-react'
import mockProjectsData from '@/data/mockProjects.json'

const ProjectViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activePhase, setActivePhase] = useState<number>(1)
  
  // Buscar projeto do mock data
  const project = mockProjectsData.projects.find(p => p.id === id)

  useEffect(() => {
    if (project) {
      setActivePhase(project.faseAtual)
    }
  }, [project])

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
          <Link
            to="/app/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Configurações de fases
  const phases = [
    {
      id: 1,
      name: 'Ideação',
      icon: Lightbulb,
      color: 'yellow',
      bg: 'bg-yellow-500',
      border: 'border-yellow-500',
      gradient: 'from-yellow-400 to-amber-500',
      stages: project.etapas?.ideacao || []
    },
    {
      id: 2,
      name: 'Modelagem',
      icon: FileText,
      color: 'blue',
      bg: 'bg-blue-500',
      border: 'border-blue-500',
      gradient: 'from-blue-500 to-indigo-600',
      stages: project.etapas?.modelagem || []
    },
    {
      id: 3,
      name: 'Prototipagem',
      icon: Wrench,
      color: 'purple',
      bg: 'bg-purple-500',
      border: 'border-purple-500',
      gradient: 'from-purple-500 to-pink-600',
      stages: project.etapas?.prototipagem || []
    },
    {
      id: 4,
      name: 'Implementação',
      icon: Rocket,
      color: 'green',
      bg: 'bg-green-500',
      border: 'border-green-500',
      gradient: 'from-green-500 to-emerald-600',
      stages: project.etapas?.validacao || []
    }
  ]

  const currentPhase = phases.find(p => p.id === activePhase) || phases[0]
  const PhaseIcon = currentPhase.icon

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const equipe = project.equipe || []
  const orientadores = project.orientadores || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header com Botão Voltar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Voltar</span>
            </button>
            
            <div className="flex items-center gap-3">
              <Link
                to={`/app/edit-project/${project.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Edit className="w-5 h-5" />
                <span>Editar</span>
              </Link>
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
              alt={project.nome}
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
              <div className={`p-4 ${currentPhase.bg} rounded-2xl shadow-xl`}>
                <PhaseIcon className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {project.nome}
                </h1>
                <div className="flex items-center gap-4 text-white/90">
                  {project.liderProjeto && (
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      <span>{project.liderProjeto.nome}</span>
                    </div>
                  )}
                  {'visualizacoes' in project && project.visualizacoes > 0 && (
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      <span>{project.visualizacoes} visualizações</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação de Fases - Sticky */}
      <div className="sticky top-[73px] z-30 bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-700 px-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 min-w-max">
            {phases.map((phase) => {
              const Icon = phase.icon
              const isActive = activePhase === phase.id
              const hasStages = phase.stages.length > 0
              const isLocked = phase.id > project.faseAtual

              return (
                <button
                  key={phase.id}
                  onClick={() => !isLocked && setActivePhase(phase.id)}
                  disabled={isLocked}
                  className={`relative flex items-center gap-2 px-4 py-4 transition-all duration-300 ${
                    isActive
                      ? `${phase.bg} text-white shadow-lg`
                      : isLocked
                      ? 'bg-gray-50 dark:bg-gray-900 text-gray-400 cursor-not-allowed'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-transparent'}`}>
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm">{phase.name}</div>
                    <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                      {phase.stages.length} {phase.stages.length === 1 ? 'anexo' : 'anexos'}
                    </div>
                  </div>
                  {isLocked && (
                    <Lock className="w-4 h-4 ml-2" aria-hidden="true" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal - Descrição e Etapas */}
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

            {/* Visualizações */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Visualizações
              </h3>
              {'visualizacoes' in project && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Eye className="w-5 h-5" />
                  <span className="font-semibold">{project.visualizacoes}</span>
                  <span className="text-sm">visualizações</span>
                </div>
              )}
            </div>

            {/* Etapas da Fase Atual */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <PhaseIcon className="w-6 h-6" />
                  Etapas - {currentPhase.name}
                </h3>
                <Link
                  to={`/app/projects/${project.id}/add-stage`}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Etapa
                </Link>
              </div>

              {currentPhase.stages.length > 0 ? (
                <div className="space-y-4">
                  {currentPhase.stages.map((stage, index) => (
                    <div
                      key={stage.id}
                      className="p-5 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                              Etapa {index + 1}
                            </span>
                            {stage.status && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                stage.status === 'concluido' 
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                              }`}>
                                {stage.status === 'concluido' ? 'Concluída' : 'Em andamento'}
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
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
                        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          {stage.dataInicio && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Início: {formatDate(stage.dataInicio)}</span>
                            </div>
                          )}
                          {stage.dataFim && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Fim: {formatDate(stage.dataFim)}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Anexos */}
                      {stage.anexos && stage.anexos.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2 mb-3">
                            <Paperclip className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Anexos ({stage.anexos.length})
                            </span>
                          </div>
                          <div className="space-y-2">
                            {stage.anexos.map((anexo) => (
                              <a
                                key={anexo.id}
                                href={anexo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group border border-gray-200 dark:border-gray-700"
                              >
                                <FileIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">
                                  {anexo.nome}
                                </span>
                                <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                              </a>
                            ))}
                          </div>
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
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                    Este projeto ainda não possui etapas na fase de {currentPhase.name}
                  </p>
                  <Link
                    to={`/app/projects/${project.id}/add-stage`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Primeira Etapa
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Informações do Projeto */}
          <div className="space-y-6">
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

            {/* Equipe */}
            {equipe.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Equipe
                  </h3>
                </div>
                <div className="space-y-3">
                  {equipe.map((membro, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {membro.nome}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {membro.email}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Repositório */}
            {project.codigo && (
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectViewPage
