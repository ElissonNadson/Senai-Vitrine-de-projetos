import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  Clock,
  Plus,
  TrendingUp,
  Award,
  Users,
  Globe
} from 'lucide-react'
import { useProjetos } from '@/hooks/use-queries'

interface User {
  uuid: string
  nome: string
  email: string
  tipo: string
  matricula?: string
  curso?: string
}

interface StudentDashboardProps {
  user: User
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user }) => {
  // Estado para controlar qual aba está ativa
  const [activeTab, setActiveTab] = useState<'meus' | 'todos'>('meus')

  // Busca projetos reais do usuário
  const { data: projetosData, isLoading: isLoadingProjetos } = useProjetos({ limit: 100 })
  const projetos = projetosData?.projetos || []

  // Filtra projetos do usuário (como autor)
  const userProjects = projetos.filter((projeto: any) =>
    projeto.autores?.some((autor: any) => autor.uuid === user.uuid)
  )

  // Todos os projetos (limitado aos mais recentes)
  const allProjects = [...projetos]
    .sort((a: any, b: any) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
    .slice(0, 9) // Limita a 9 projetos para manter o grid 3x3

  // Calcula estatísticas reais
  const totalProjects = userProjects.length
  const completedProjects = userProjects.filter((p: any) => p.status === 'CONCLUIDO' || p.status === 'FINALIZADO').length
  const inProgressProjects = userProjects.filter((p: any) => p.status === 'EM_ANDAMENTO' || p.status === 'INICIADO').length
  const totalAllProjects = projetos.length

  // Pega os projetos a serem exibidos baseado na aba ativa
  const displayProjects = activeTab === 'meus'
    ? userProjects.slice(0, 6)
    : allProjects

  // Função para mapear status do backend para display
  const getProjectStatus = (status: string) => {
    switch (status) {
      case 'CONCLUIDO':
      case 'FINALIZADO':
        return { text: 'Concluído', color: 'green', progress: 100 }
      case 'EM_ANDAMENTO':
      case 'INICIADO':
        return { text: 'Em Andamento', color: 'yellow', progress: 75 }
      case 'PAUSADO':
        return { text: 'Pausado', color: 'orange', progress: 50 }
      default:
        return { text: 'Não Iniciado', color: 'gray', progress: 0 }
    }
  }

  // Calcula progresso médio (simplificado)
  const calculateProgress = (projeto: any) => {
    const status = getProjectStatus(projeto.status)
    return status.progress
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header do estudante */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Olá, {user.nome}! 👋
              </h1>
              <p className="text-sm text-gray-600">
                {user.curso || 'Estudante'} • Matrícula: {user.matricula || 'N/A'}
              </p>
            </div>
            <Link
              to="/aluno/criar-projeto"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Link>
          </div>
        </div>        {/* Estatísticas do estudante */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Meus Projetos</p>
                <p className="text-xl font-bold text-gray-900">
                  {isLoadingProjetos ? '...' : totalProjects}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Concluídos</p>
                <p className="text-xl font-bold text-gray-900">
                  {isLoadingProjetos ? '...' : completedProjects}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Em Andamento</p>
                <p className="text-xl font-bold text-gray-900">
                  {isLoadingProjetos ? '...' : inProgressProjects}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Geral</p>
                <p className="text-xl font-bold text-gray-900">
                  {isLoadingProjetos ? '...' : totalAllProjects}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Tabs de navegação e projetos */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Tabs Header */}
            <div className="border-b bg-gray-50">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('meus')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${activeTab === 'meus'
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Meus Projetos</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'meus' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                      }`}>
                      {totalProjects}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('todos')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${activeTab === 'todos'
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>Todos os Projetos</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'todos' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                      }`}>
                      {totalAllProjects}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Tabs Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoadingProjetos ? (
                  <div className="col-span-full text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-3">Carregando projetos...</p>
                  </div>
                ) : displayProjects.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                    <p className="text-base text-gray-500 mb-3">
                      {activeTab === 'meus'
                        ? 'Você ainda não tem projetos'
                        : 'Nenhum projeto encontrado'}
                    </p>
                    {activeTab === 'meus' && (
                      <Link
                        to="/aluno/criar-projeto"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <Plus className="h-4 w-4" />
                        Criar primeiro projeto
                      </Link>
                    )}
                  </div>
                ) : (
                  displayProjects.map((projeto) => {
                    const status = getProjectStatus(projeto.status)
                    const progress = calculateProgress(projeto)
                    const createdDate = new Date(projeto.criadoEm).toLocaleDateString('pt-BR')
                    const isMyProject = projeto.liderProjeto?.uuid === user.uuid

                    return (
                      <div key={projeto.uuid} className="border rounded-lg p-4 hover:shadow-lg transition-all hover:border-blue-300 relative">
                        {/* Badge indicando se é projeto do usuário */}
                        {activeTab === 'todos' && isMyProject && (
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full font-medium">
                              Meu
                            </span>
                          </div>
                        )}

                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-base text-gray-900 line-clamp-1 flex-1 pr-2">
                            {projeto.titulo}
                          </h3>
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${status.color === 'green' ? 'bg-green-100 text-green-700' :
                              status.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                                status.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                                  'bg-gray-100 text-gray-700'
                            }`}>
                            {status.text}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
                          {projeto.descricao}
                        </p>

                        {/* Informação do líder do projeto (quando não for meu projeto) */}
                        {activeTab === 'todos' && !isMyProject && projeto.liderProjeto && (
                          <div className="flex items-center gap-2 mb-3 pb-3 border-b">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                              <Users className="h-3 w-3 text-gray-600" />
                            </div>
                            <span className="text-xs text-gray-600">
                              {projeto.liderProjeto.usuarios?.usuario || 'Líder do Projeto'}
                            </span>
                          </div>
                        )}

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="font-medium">Progresso</span>
                            <span className="font-semibold text-gray-700">{progress}%</span>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${status.color === 'green' ? 'bg-green-500' :
                                  status.color === 'yellow' ? 'bg-yellow-500' :
                                    status.color === 'orange' ? 'bg-orange-500' :
                                      'bg-gray-500'
                                }`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                            <span>Criado em</span>
                            <span className="font-medium">{createdDate}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Link para ver todos */}
              {!isLoadingProjetos && displayProjects.length > 0 && (
                <div className="mt-6 text-center">
                  <Link
                    to="/aluno/meus-projetos"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Ver todos os meus projetos →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
