import React from 'react'
import { motion } from 'framer-motion'
import { Bell, Mail, Clock } from 'lucide-react'

interface NotificationSetting {
  id: string
  title: string
  description: string
}

const NotificationsTab: React.FC = () => {
  const settings: NotificationSetting[] = [
    {
      id: 'projects',
      title: 'Atualizações de Projetos',
      description: 'Notificações sobre novos projetos e atualizações'
    },
    {
      id: 'feedback',
      title: 'Feedback de Orientadores',
      description: 'Notificações quando orientadores enviam feedback'
    },
    {
      id: 'deadlines',
      title: 'Prazos e Lembretes',
      description: 'Notificações sobre prazos de entrega'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
            <Bell className="h-5 w-5 text-primary-dark dark:text-primary-light" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Preferências de Notificações
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                <Clock className="h-3 w-3" />
                Em breve
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Escolha como e quando deseja receber notificações
            </p>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden opacity-60">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
          <div className="col-span-6 text-sm font-medium text-gray-700 dark:text-gray-300">
            Tipo de Notificação
          </div>
          <div className="col-span-3 text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
            <Mail className="h-4 w-4 inline mr-1" />
            Email
          </div>
          <div className="col-span-3 text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
            <Bell className="h-4 w-4 inline mr-1" />
            Push
          </div>
        </div>

        {/* Settings Rows */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {settings.map((setting) => (
            <div key={setting.id} className="grid grid-cols-12 gap-4 p-4">
              <div className="col-span-6 flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <Bell className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {setting.title}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {setting.description}
                  </p>
                </div>
              </div>
              <div className="col-span-3 flex items-center justify-center">
                <button
                  disabled
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
                  title="Funcionalidade em breve"
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-gray-400 dark:bg-gray-500 shadow-lg translate-x-1" />
                </button>
              </div>
              <div className="col-span-3 flex items-center justify-center">
                <button
                  disabled
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
                  title="Funcionalidade em breve"
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-gray-400 dark:bg-gray-500 shadow-lg translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info message */}
      <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          As preferências de notificações por email e push estarão disponíveis em breve. 
          Por enquanto, você receberá todas as notificações importantes na plataforma.
        </p>
      </div>
    </motion.div>
  )
}

export default NotificationsTab
