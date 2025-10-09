import React from 'react'

interface ProgressChartProps {
  percentage: number
  isLoading?: boolean
}

const ProgressChart: React.FC<ProgressChartProps> = ({ percentage = 0, isLoading = false }) => {
  // Limita o percentage entre 0 e 100
  const validPercentage = Math.min(Math.max(percentage, 0), 100)
  
  // Calcula o stroke-dasharray para o círculo (circunferência = 2πr, onde r = 15.9155)
  const circumference = 100
  const dashArray = `${validPercentage}, ${circumference}`

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-sm text-gray-500">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col items-center justify-center">
      <div className="relative h-40 w-40">
        <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
          {/* Background circle */}
          <path
            className="text-gray-200 dark:text-gray-700"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          {/* Progress circle */}
          <path
            className="text-indigo-600 dark:text-indigo-400 transition-all duration-500"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeDasharray={dashArray}
            strokeLinecap="round"
            strokeWidth="3"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{validPercentage}%</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Concluído</span>
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Progresso de todos os projetos ativos.
      </p>
    </div>
  )
}

export default ProgressChart
