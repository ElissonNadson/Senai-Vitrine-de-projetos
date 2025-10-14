import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Filter, ChevronDown, ChevronUp, Search, Lightbulb, FileText, Wrench, Rocket, Calendar, Code, FolderOpen, Clock, AlertCircle, CheckCircle, Users, TrendingUp } from 'lucide-react'
import { useProjetosPublicos } from '@/hooks/use-queries'
import { useAuth } from '@/contexts/auth-context'
import { useGuest } from '@/contexts/guest-context'
import GuestDashboard from './components/guest-dashboard'
import ProjectDetailsModal from '@/components/modals/project-details-modal'
import StatsCard from '../dashboard-v2/stats/StatsCard'
import TasksTable from '../dashboard-v2/components/TasksTable'
import ProgressChart from '../dashboard-v2/stats/ProgressChart'

function Dashboard() {
  const { user } = useAuth()
  const { isGuest } = useGuest()
  const { data: projetos = [], isLoading: isLoadingProjetos } = useProjetosPublicos()

  console.log('🎯 Dashboard - isGuest:', isGuest)
  console.log('🎯 Dashboard - user:', user)

  // Se é visitante, mostrar dashboard de visitante
  if (isGuest) {
    console.log('🎯 Dashboard - Renderizando GuestDashboard')
    return <GuestDashboard />
  }

  console.log('🎯 Dashboard - Renderizando Dashboard normal')

  // Filtra projetos do usuário
  const userProjects = projetos.filter(projeto => 
    projeto.liderProjeto?.uuid === user?.uuid
  )

  // Calcula estatísticas
  const totalProjects = userProjects.length
  const completedProjects = userProjects.filter(
    p => p.status === 'CONCLUIDO' || p.status === 'FINALIZADO'
  ).length
  const inProgressProjects = userProjects.filter(
    p => p.status === 'EM_ANDAMENTO' || p.status === 'INICIADO'
  ).length

  // Tarefas de exemplo (você pode substituir por dados reais)
  const pendingTasks = [
    {
      id: '1',
      name: 'Desenvolver a landing page',
      project: 'Projeto Alpha',
      deadline: '15 de Outubro, 2025',
      priority: 'Alta' as const
    },
    {
      id: '2',
      name: 'Reunião de alinhamento',
      project: 'Projeto Beta',
      deadline: '20 de Outubro, 2025',
      priority: 'Média' as const
    },
    {
      id: '3',
      name: 'Testes de usabilidade',
      project: 'Projeto Gamma',
      deadline: '25 de Outubro, 2025',
      priority: 'Baixa' as const
    }
  ]

  // Calcula progresso geral
  const overallProgress = totalProjects > 0 
    ? Math.round((completedProjects / totalProjects) * 100)
    : 0

  return (
    <div className="flex flex-col gap-10 p-4 md:p-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Dashboard de Projetos
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Bem-vindo(a), {user?.nome || 'Usuário'}! Aqui está um resumo dos seus projetos.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/app/create-project"
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Novo Projeto</span>
          </Link>
          <Link
            to="/app/projects"
            className="flex items-center justify-center gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <FolderOpen className="h-5 w-5" />
            <span>Ver Todos</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Projetos Ativos"
          value={inProgressProjects}
          icon={FolderOpen}
          iconBgColor="bg-indigo-100 dark:bg-indigo-900/50"
          iconColor="text-indigo-500 dark:text-indigo-400"
          isLoading={isLoadingProjetos}
        />
        <StatsCard
          title="Tarefas Pendentes"
          value={pendingTasks.length}
          icon={Clock}
          iconBgColor="bg-amber-100 dark:bg-amber-900/50"
          iconColor="text-amber-500 dark:text-amber-400"
        />
        <StatsCard
          title="Prazos Importantes"
          value={3}
          icon={AlertCircle}
          iconBgColor="bg-red-100 dark:bg-red-900/50"
          iconColor="text-red-500 dark:text-red-400"
        />
        <StatsCard
          title="Projetos Concluídos"
          value={completedProjects}
          icon={CheckCircle}
          iconBgColor="bg-green-100 dark:bg-green-900/50"
          iconColor="text-green-500 dark:text-green-400"
          isLoading={isLoadingProjetos}
        />
      </div>

      {/* Fases de Maturidade do Projeto */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Fases de Maturidade do Projeto
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cada projeto passa por diferentes etapas de desenvolvimento. As fases são atualizadas automaticamente conforme o progresso do projeto.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Fase 1 - Ideação */}
          <div className="relative overflow-hidden border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 hover:shadow-lg transition-all duration-300 group flex flex-col">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-200 dark:bg-yellow-700 opacity-20 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex flex-col flex-1">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 dark:bg-yellow-500 rounded-full mb-4 mx-auto shadow-md">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-center font-bold text-gray-900 dark:text-white mb-2 text-lg">Ideação</h4>
              <p className="text-center text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4 flex-1">
                Fase inicial de concepção e planejamento do projeto
              </p>
              <div className="mt-auto flex justify-center">
                <span className="px-3 py-1 bg-yellow-500 dark:bg-yellow-600 text-white text-xs font-semibold rounded-full">
                  Fase 1
                </span>
              </div>
            </div>
          </div>

          {/* Fase 2 - Modelagem */}
          <div className="relative overflow-hidden border-2 border-blue-200 dark:border-blue-800 rounded-xl p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:shadow-lg transition-all duration-300 group flex flex-col">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 dark:bg-blue-700 opacity-20 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex flex-col flex-1">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-500 dark:bg-blue-600 rounded-full mb-4 mx-auto shadow-md">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-center font-bold text-gray-900 dark:text-white mb-2 text-lg">Modelagem</h4>
              <p className="text-center text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4 flex-1">
                Criação de diagramas, protótipos e documentação técnica
              </p>
              <div className="mt-auto flex justify-center">
                <span className="px-3 py-1 bg-blue-500 dark:bg-blue-600 text-white text-xs font-semibold rounded-full">
                  Fase 2
                </span>
              </div>
            </div>
          </div>

          {/* Fase 3 - Prototipagem */}
          <div className="relative overflow-hidden border-2 border-purple-200 dark:border-purple-800 rounded-xl p-5 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:shadow-lg transition-all duration-300 group flex flex-col">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 dark:bg-purple-700 opacity-20 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex flex-col flex-1">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-500 dark:bg-purple-600 rounded-full mb-4 mx-auto shadow-md">
                <Wrench className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-center font-bold text-gray-900 dark:text-white mb-2 text-lg">Prototipagem</h4>
              <p className="text-center text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4 flex-1">
                Desenvolvimento ativo e testes do protótipo funcional
              </p>
              <div className="mt-auto flex justify-center">
                <span className="px-3 py-1 bg-purple-500 dark:bg-purple-600 text-white text-xs font-semibold rounded-full">
                  Fase 3
                </span>
              </div>
            </div>
          </div>

          {/* Fase 4 - Implementação */}
          <div className="relative overflow-hidden border-2 border-green-200 dark:border-green-800 rounded-xl p-5 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:shadow-lg transition-all duration-300 group flex flex-col">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 dark:bg-green-700 opacity-20 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex flex-col flex-1">
              <div className="flex items-center justify-center w-16 h-16 bg-green-500 dark:bg-green-600 rounded-full mb-4 mx-auto shadow-md">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-center font-bold text-gray-900 dark:text-white mb-2 text-lg">Implementação</h4>
              <p className="text-center text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4 flex-1">
                Projeto finalizado, testado e pronto para uso
              </p>
              <div className="mt-auto flex justify-center">
                <span className="px-3 py-1 bg-green-500 dark:bg-green-600 text-white text-xs font-semibold rounded-full">
                  Fase 4
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nota sobre atualização automática */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>💡 Atualização Automática:</strong> A fase de maturidade é atualizada automaticamente pelo sistema sempre que você faz uma atualização no projeto, garantindo transparência no progresso.
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tasks Table - Takes 2 columns */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Tarefas Pendentes
            </h2>
            <TasksTable tasks={pendingTasks} />
          </div>
        </div>

        {/* Progress Chart - Takes 1 column */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Progresso Geral
          </h2>
          <ProgressChart percentage={overallProgress} isLoading={isLoadingProjetos} />
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Projetos Recentes
          </h2>
          <Link
            to="/app/projects"
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            Ver todos →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingProjetos ? (
            // Loading skeleton
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </>
          ) : userProjects.length === 0 ? (
            // Empty state
            <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <FolderOpen className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhum projeto encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Comece criando seu primeiro projeto!
              </p>
              <Link
                to="/app/create-project"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Criar Projeto</span>
              </Link>
            </div>
          ) : (
            // Recent projects (max 3)
            userProjects.slice(0, 3).map((projeto) => (
              <Link
                key={projeto.uuid}
                to={`/app/projects/${projeto.uuid}`}
                className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {projeto.titulo}
                  </h3>
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-2
                    ${projeto.status === 'CONCLUIDO' || projeto.status === 'FINALIZADO'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                      : projeto.status === 'EM_ANDAMENTO' || projeto.status === 'INICIADO'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                    }
                  `}>
                    {projeto.status === 'EM_ANDAMENTO' ? 'Em Andamento' :
                     projeto.status === 'CONCLUIDO' ? 'Concluído' :
                     projeto.status === 'FINALIZADO' ? 'Finalizado' :
                     projeto.status === 'INICIADO' ? 'Iniciado' : projeto.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {projeto.descricao || 'Sem descrição disponível'}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{projeto.liderProjeto?.usuarios?.usuario || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(projeto.criadoEm).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Activity Stats */}
      <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Continue progredindo! 🚀</h3>
            <p className="text-indigo-100">
              Você tem {inProgressProjects} {inProgressProjects === 1 ? 'projeto ativo' : 'projetos ativos'} e {pendingTasks.length} {pendingTasks.length === 1 ? 'tarefa pendente' : 'tarefas pendentes'}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-12 w-12" />
            <div>
              <p className="text-sm text-indigo-100">Taxa de Conclusão</p>
              <p className="text-3xl font-bold">{overallProgress}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

