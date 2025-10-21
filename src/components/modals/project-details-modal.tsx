import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Eye, Users, ExternalLink, MapPin, Mail, BookOpen, Lightbulb, FileText, Wrench, CheckCircle2, Lock, LogIn, Paperclip, GraduationCap, Layers, Award, Code, Globe, Shield, Calendar, Clock } from 'lucide-react'

interface ProjectDetailsModalProps {
  project: {
    id: string
    nome: string
    descricao: string
    autorNome: string
    tecnologias: string[]
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
  isOpen: boolean
  onClose: () => void
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ project, isOpen, onClose }) => {
  const navigate = useNavigate()
  
  // Determinar fase de desenvolvimento baseado no ID do projeto (simulação)
  // TEMPORÁRIO: Retorna sempre fase 1 (Ideação) para todos os projetos
  const getProjectMaturityLevel = () => {
    return 1 // Sempre retorna Ideação
  }

  const currentMaturityLevel = getProjectMaturityLevel()
  const [activeTab, setActiveTab] = useState<number>(currentMaturityLevel)

  if (!isOpen) return null

  // Função para redirecionar para o login
  const handleVisitProject = () => {
    navigate('/login')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    })
  }

  const maturityLevels = [
    {
      id: 1,
      name: 'Ideação',
      description: 'Fase inicial de concepção do projeto',
      icon: Lightbulb,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-700',
      activeColor: 'bg-blue-600'
    },
    {
      id: 2,
      name: 'Modelagem',
      description: 'Definição de processos, recursos e documentação',
      icon: FileText,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-700',
      activeColor: 'bg-yellow-600'
    },
    {
      id: 3,
      name: 'Prototipagem',
      description: 'Desenvolvimento e testes do protótipo funcional',
      icon: Wrench,
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-700',
      activeColor: 'bg-orange-600'
    },
    {
      id: 4,
      name: 'Implementação',
      description: 'Aplicação da solução em contexto real ou simulado',
      icon: CheckCircle2,
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-700',
      activeColor: 'bg-green-600'
    }
  ]

  const renderTabContent = (level: number) => {
    const levelInfo = maturityLevels[level - 1]
    
    return (
      <div className="space-y-6">
        {/* Descrição do Projeto */}
        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-semibold text-gray-900 dark:text-white">Sobre o Projeto</h4>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{project.descricao}</p>
        </div>

        {/* Seção de Anexos - BLOQUEADA */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${levelInfo.activeColor} rounded-lg`}>
                {React.createElement(levelInfo.icon, { className: 'h-5 w-5 text-white' })}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  Anexos - {levelInfo.name}
                  <Lock className="h-4 w-4 text-gray-400" />
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Documentos e arquivos desta fase</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-medium">
              <Paperclip className="h-3 w-3" />
              Conteúdo Restrito
            </div>
          </div>

          {/* Área bloqueada */}
          <div className="text-center py-8 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-700 rounded-full mb-2 shadow-md">
              <Lock className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            
            <div className="max-w-md mx-auto">
              <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Faça login para ver os anexos
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Os documentos, imagens e arquivos deste projeto estão disponíveis apenas para usuários autenticados.
              </p>
              
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-800 transition-all shadow-md hover:shadow-lg"
              >
                <LogIn className="h-4 w-4" />
                Fazer Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Banner do Projeto (se existir) */}
        {project.bannerUrl && (
          <div className="relative h-64 overflow-hidden">
            <img
              src={project.bannerUrl}
              alt={project.nome}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            {/* Botão Fechar sobre o banner */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full transition-colors z-10"
              aria-label="Fechar"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            {/* Informações sobre o banner */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold uppercase">
                    {project.status}
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                    Projeto Público
                  </span>
                </div>
                
                {/* Visualizações discretas */}
                <div className="flex items-center gap-1 text-white/90 text-xs bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{project.visualizacoes}</span>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">{project.nome}</h2>
              <div className="flex items-center gap-2 text-white/90">
                <Users className="h-4 w-4" />
                <span className="text-sm">Por: {project.autorNome}</span>
              </div>
            </div>
          </div>
        )}

        {/* Header sem banner (fallback) */}
        {!project.bannerUrl && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 dark:hover:bg-white/10 rounded-full transition-colors"
              aria-label="Fechar"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="pr-12">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold uppercase">
                    {project.status}
                  </span>
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Projeto Público
                  </span>
                </div>
                
                {/* Informações discretas */}
                <div className="flex items-center gap-3 text-white/70 text-xs">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    <span>{project.visualizacoes}</span>
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2">{project.nome}</h2>
              <div className="flex items-center gap-2 text-blue-100">
                <Users className="h-4 w-4" />
                <span className="text-sm">Por: {project.autorNome}</span>
              </div>
            </div>
          </div>
        )}

        {/* Seção de Informações do Projeto */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
          {/* Grid de Informações Principais */}
          {(project.curso || project.turma || project.categoria || project.modalidade) && (
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Curso */}
                {project.curso && (
                  <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Curso</p>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                        {project.curso}
                      </p>
                    </div>
                  </div>
                )}

                {/* Turma */}
                {project.turma && (
                  <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Turma</p>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                        {project.turma}
                      </p>
                    </div>
                  </div>
                )}

                {/* Categoria */}
                {project.categoria && (
                  <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <Layers className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Categoria</p>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                        {project.categoria}
                      </p>
                    </div>
                  </div>
                )}

                {/* Modalidade */}
                {project.modalidade && (
                  <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Modalidade</p>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                        {project.modalidade}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Badges de Programas */}
          {(project.itinerario || project.labMaker || project.participouSaga) && (
            <div className="px-6 pb-6">
              <div className="flex flex-wrap gap-3">
                {project.itinerario && (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-md text-sm font-semibold">
                    <BookOpen className="w-4 h-4" />
                    Itinerário Formativo
                  </div>
                )}
                {project.labMaker && (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-md text-sm font-semibold">
                    <Wrench className="w-4 h-4" />
                    SENAI Lab Maker
                  </div>
                )}
                {project.participouSaga && (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-md text-sm font-semibold">
                    <Award className="w-4 h-4" />
                    SAGA SENAI
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Conteúdo scrollável */}
        <div className="overflow-y-auto max-h-[calc(90vh-320px)]">
          {/* Sistema de Abas para Etapas de Maturidade */}
          <div className="border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
            <div className="flex overflow-x-auto">
              {maturityLevels.map((level) => {
                const IconComponent = level.icon
                const isActive = activeTab === level.id
                const isCurrentLevel = level.id === currentMaturityLevel
                
                return (
                  <button
                    key={level.id}
                    onClick={() => setActiveTab(level.id)}
                    className={`flex-1 min-w-[200px] px-4 py-4 text-left border-b-2 transition-all ${
                      isActive 
                        ? `${level.borderColor} bg-gradient-to-b from-${level.color}-50 to-white dark:from-${level.color}-900/20 dark:to-gray-800` 
                        : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${isActive ? level.activeColor : 'bg-gray-200 dark:bg-gray-700'} ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'} transition-colors`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${isActive ? level.textColor : 'text-gray-700 dark:text-gray-300'}`}>
                            {level.name}
                          </span>
                          {isCurrentLevel && (
                            <span className="px-2 py-0.5 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded-full font-medium">
                              Atual
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Fase {level.id}</span>
                      </div>
                    </div>
                    <p className={`text-xs ${isActive ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                      {level.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Conteúdo da Aba Ativa */}
          <div className="p-6 bg-white dark:bg-gray-800">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {React.createElement(maturityLevels[activeTab - 1].icon, {
                    className: `h-6 w-6 ${maturityLevels[activeTab - 1].textColor}`
                  })}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {maturityLevels[activeTab - 1].name}
                  </h3>
                </div>
                {activeTab === currentMaturityLevel && (
                  <span className="px-3 py-1.5 bg-blue-600 dark:bg-blue-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Fase Atual
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{maturityLevels[activeTab - 1].description}</p>
              
              {renderTabContent(activeTab)}
            </div>

            {/* Unidade Curricular */}
            {project.unidadeCurricular && (
              <div className="mb-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-indigo-600 dark:bg-indigo-500 rounded-lg">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">Unidade Curricular</h4>
                  </div>
                  <p className="text-base text-gray-900 dark:text-white font-semibold mb-2">
                    {project.unidadeCurricular.nome}
                  </p>
                  {project.unidadeCurricular.descricao && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {project.unidadeCurricular.descricao}
                    </p>
                  )}
                  {project.unidadeCurricular.cargaHoraria && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{project.unidadeCurricular.cargaHoraria}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Líder do Projeto */}
            {project.liderProjeto && (
              <div className="mb-6">
                <div className="p-5 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200 dark:border-cyan-800 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-cyan-600 dark:bg-cyan-500 rounded-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">Líder do Projeto</h4>
                  </div>
                  <p className="text-base text-gray-900 dark:text-white font-semibold mb-1">
                    {project.liderProjeto.nome}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {project.liderProjeto.email}
                  </p>
                  {project.liderProjeto.matricula && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Matrícula: <span className="font-medium">{project.liderProjeto.matricula}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Código e Visibilidade */}
            {(project.codigo || project.visibilidadeCodigo || project.visibilidadeAnexos) && (
              <div className="mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Código */}
                  {project.codigo && (
                    <div className="p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                        <h4 className="font-bold text-gray-900 dark:text-white">Código</h4>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                        {project.codigo}
                      </p>
                      {project.visibilidadeCodigo && (
                        <div className="flex items-center gap-2 mt-2">
                          {project.visibilidadeCodigo === 'publico' ? (
                            <Globe className="w-4 h-4 text-green-600" />
                          ) : (
                            <Lock className="w-4 h-4 text-gray-600" />
                          )}
                          <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                            {project.visibilidadeCodigo}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Visibilidade de Anexos */}
                  {project.visibilidadeAnexos && (
                    <div className="p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        <h4 className="font-bold text-gray-900 dark:text-white">Anexos</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.visibilidadeAnexos === 'publico' ? (
                          <Globe className="w-5 h-5 text-green-600" />
                        ) : (
                          <Lock className="w-5 h-5 text-gray-600" />
                        )}
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize font-medium">
                          {project.visibilidadeAnexos}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timeline de Datas */}
            {(project.criadoEm || project.atualizadoEm) && (
              <div className="mb-6">
                <div className="p-5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-bold text-gray-900 dark:text-white">Timeline do Projeto</h4>
                  </div>
                  <div className="space-y-3">
                    {project.criadoEm && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Criado em:</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatDate(project.criadoEm)}
                        </span>
                      </div>
                    )}
                    {project.atualizadoEm && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Atualizado em:</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatDate(project.atualizadoEm)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Local (simulado) */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Local</h3>
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-medium">SENAI - Serviço Nacional de Aprendizagem Industrial</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Projeto desenvolvido nas dependências do SENAI</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção de Contato */}
            <div className="mb-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Entre em Contato
              </h3>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-5">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  Interessado neste projeto? Entre em contato com o aluno ou orientador para saber mais, tirar dúvidas ou discutir possíveis colaborações.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Botão Contatar Aluno */}
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 border-2 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-gray-600 transition-all shadow-sm hover:shadow-md group">
                    <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>Contatar Aluno</span>
                  </button>

                  {/* Botão Contatar Orientador */}
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 border-2 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-400 rounded-lg font-medium hover:bg-purple-50 dark:hover:bg-gray-600 transition-all shadow-sm hover:shadow-md group">
                    <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>Contatar Orientador</span>
                  </button>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                  💡 Faça login para enviar mensagens diretamente
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer com botões de ação */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 p-6 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>Publicado em {formatDate(project.publicadoEm)}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              Fechar
            </button>
            <button 
              onClick={handleVisitProject}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-900 dark:hover:from-blue-800 dark:hover:to-blue-950 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Entrar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailsModal
