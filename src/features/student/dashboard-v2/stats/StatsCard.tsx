import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconBgColor?: string
  iconColor?: string
  isLoading?: boolean
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBgColor = 'bg-indigo-100 dark:bg-indigo-900/50',
  iconColor = 'text-indigo-500 dark:text-indigo-400',
  isLoading = false
}) => {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 transition-shadow hover:shadow-lg">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBgColor}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          {isLoading ? (
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default StatsCard
