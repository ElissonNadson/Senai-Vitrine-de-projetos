import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, ListCheck, FolderOpen, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { useProjetos } from '@/hooks/use-queries'
import { useAuth } from '@/contexts/auth-context'
import StatsCard from './stats/StatsCard'
import TasksTable from './components/TasksTable'
import ProgressChart from './stats/ProgressChart'

const ModernDashboardPage: React.FC = () => {
  const { user } = useAuth()
  const { data: projetosData, isLoading: isLoadingProjetos } = useProjetos({ limit: 100 })
  const projetos = projetosData?.projetos || []

  // Filtra projetos do usuário (como autor)
  const userProjects = projetos.filter((projeto: any) =>
    projeto.autores?.some((autor: any) => autor.uuid === user?.uuid)
  )

  // Calcula estatísticas
  const totalProjects = userProjects.length
  const completedProjects = userProjects.filter(
    (p: any) => p.status === 'CONCLUIDO' || p.status === 'FINALIZADO'
  ).length
  const inProgressProjects = userProjects.filter(
    (p: any) => p.status === 'EM_ANDAMENTO' || p.status === 'INICIADO'
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
    <div className="flex flex-col gap-10">
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
            to="/aluno/criar-projeto"
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Novo Projeto</span>
          </Link>
          <button className="flex items-center justify-center gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <ListCheck className="h-5 w-5" />
            <span>Nova Tarefa</span>
          </button>
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
    </div>
  )
}

export default ModernDashboardPage
