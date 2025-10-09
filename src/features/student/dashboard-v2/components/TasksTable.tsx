import React from 'react'

interface Task {
  id: string
  name: string
  project: string
  deadline: string
  priority: 'Alta' | 'Média' | 'Baixa'
}

interface TasksTableProps {
  tasks?: Task[]
  isLoading?: boolean
}

const TasksTable: React.FC<TasksTableProps> = ({ tasks = [], isLoading = false }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta':
        return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
      case 'Média':
        return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'
      case 'Baixa':
        return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
    }
  }

  if (isLoading) {
    return (
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-3">Carregando tarefas...</p>
        </div>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="p-8 text-center">
          <p className="text-sm text-gray-500">Nenhuma tarefa pendente</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400"
            >
              Tarefa
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400"
            >
              Projeto
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400"
            >
              Prazo
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400"
            >
              Prioridade
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {task.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {task.project}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {task.deadline}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TasksTable
