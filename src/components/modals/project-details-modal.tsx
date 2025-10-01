import React, { useState } from 'react'
import { X, Calendar, Eye, Users, Code, ExternalLink, Clock, MapPin, Award, BookOpen, Lightbulb, FileText, Rocket, CheckCircle2 } from 'lucide-react'

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
  // Determinar nível de maturidade baseado no ID do projeto (simulação)
  const getProjectMaturityLevel = () => {
    const hash = project.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return (hash % 4) + 1
  }

  const currentMaturityLevel = getProjectMaturityLevel()
  const [activeTab, setActiveTab] = useState<number>(currentMaturityLevel)

  if (!isOpen) return null

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
      icon: Rocket,
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
    const isCurrentLevel = level === currentMaturityLevel
    const hasContent = level <= currentMaturityLevel

    if (!hasContent && level > currentMaturityLevel) {
      return (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Esta etapa ainda não foi iniciada</h4>
          <p className="text-gray-500">O projeto ainda não atingiu este nível de maturidade.</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Descrição da Etapa</h4>
          <p className="text-gray-700 leading-relaxed">{project.descricao}</p>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Atividades Realizadas</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="text-sm text-gray-800">Definição do escopo e objetivos do projeto</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="text-sm text-gray-800">Levantamento de requisitos e recursos necessários</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="text-sm text-gray-800">Planejamento das próximas etapas de desenvolvimento</p>
              </div>
            </div>
          </div>
        </div>

        {isCurrentLevel && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Etapa Atual do Projeto</h4>
                <p className="text-sm text-gray-700">Este projeto está atualmente nesta fase de desenvolvimento.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header com gradiente azul */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Data</p>
              <p className="font-semibold text-sm text-gray-900">
                {formatDate(project.publicadoEm)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Visualizações</p>
              <p className="font-semibold text-sm text-gray-900">{project.visualizacoes}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Code className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tecnologias</p>
              <p className="font-semibold text-sm text-gray-900">{project.tecnologias.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Award className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <p className="font-semibold text-sm text-gray-900">{project.status}</p>
            </div>
          </div>
        </div>

        {/* Conteúdo scrollável */}
        <div className="overflow-y-auto max-h-[calc(90vh-320px)]">
          {/* Sistema de Abas para Etapas de Maturidade */}
          <div className="border-b bg-white">
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
                        ? `${level.borderColor} bg-gradient-to-b from-${level.color}-50 to-white` 
                        : 'border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${isActive ? level.activeColor : 'bg-gray-200'} ${isActive ? 'text-white' : 'text-gray-600'} transition-colors`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${isActive ? level.textColor : 'text-gray-700'}`}>
                            {level.name}
                          </span>
                          {isCurrentLevel && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-medium">
                              Atual
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">Nível {level.id}</span>
                      </div>
                    </div>
                    <p className={`text-xs ${isActive ? 'text-gray-700' : 'text-gray-500'}`}>
                      {level.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Conteúdo da Aba Ativa */}
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                {React.createElement(maturityLevels[activeTab - 1].icon, {
                  className: `h-6 w-6 ${maturityLevels[activeTab - 1].textColor}`
                })}
                <h3 className="text-2xl font-bold text-gray-900">
                  {maturityLevels[activeTab - 1].name}
                </h3>
              </div>
              <p className="text-gray-600 mb-6">{maturityLevels[activeTab - 1].description}</p>
              
              {renderTabContent(activeTab)}
            </div>

            {/* Seção de Tecnologias (sempre visível) */}
            <div className="mb-6 pt-6 border-t">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Code className="h-5 w-5 text-purple-600" />
                Tecnologias Utilizadas
              </h3>
              <div className="bg-white border rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  {project.tecnologias.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800 rounded-lg font-medium border border-blue-200 hover:from-blue-100 hover:to-purple-100 transition-all"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Local (simulado) */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Local</h3>
              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">SENAI - Serviço Nacional de Aprendizagem Industrial</p>
                    <p className="text-sm text-gray-600">Projeto desenvolvido nas dependências do SENAI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer com botões de ação */}
        <div className="border-t bg-gray-50 p-6 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="text-sm text-gray-600">
            <p>Publicado em {formatDate(project.publicadoEm)}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Fechar
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-900 transition-all flex items-center gap-2 shadow-md hover:shadow-lg">
              <ExternalLink className="h-4 w-4" />
              <span>Visitar Projeto</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailsModal
