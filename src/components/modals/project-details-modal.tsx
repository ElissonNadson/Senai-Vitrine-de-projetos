import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Calendar, Eye, Users, Code, ExternalLink, Clock, MapPin, Award, BookOpen, Lightbulb, FileText, Rocket, CheckCircle2, Wrench, Lock, Mail, LogIn, Paperclip } from 'lucide-react'

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
      description: 'Fase inicial de concepção e planejamento do projeto',
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
      description: 'Criação de diagramas, protótipos e documentação técnica',
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
      description: 'Desenvolvimento ativo e testes do protótipo funcional',
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
      description: 'Projeto finalizado, testado e pronto para uso',
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header com gradiente azul */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 dark:hover:bg-white/10 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="pr-12">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold uppercase">
                {project.status}
              </span>
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                Projeto Público
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-2">{project.nome}</h2>
            <div className="flex items-center gap-2 text-blue-100">
              <Users className="h-4 w-4" />
              <span className="text-sm">Por: {project.autorNome}</span>
            </div>
          </div>
        </div>

        {/* Informações principais em cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Data</p>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">
                {formatDate(project.publicadoEm)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Visualizações</p>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">{project.visualizacoes}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Code className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tecnologias</p>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">{project.tecnologias.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Award className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">{project.status}</p>
            </div>
          </div>
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

            {/* Seção de Tecnologias (sempre visível) */}
            <div className="mb-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Code className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Tecnologias Utilizadas
              </h3>
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  {project.tecnologias.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-gray-800 dark:text-gray-200 rounded-lg font-medium border border-blue-200 dark:border-blue-700 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/40 dark:hover:to-purple-800/40 transition-all"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

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
