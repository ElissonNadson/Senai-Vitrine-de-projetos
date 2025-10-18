import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Mail, MessageSquare, Calendar, CheckCircle, AlertCircle } from 'lucide-react'

interface NotificationSetting {
  id: string
  title: string
  description: string
  email: boolean
  push: boolean
  icon: React.ElementType
}

const NotificationsTab: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'projects',
      title: 'Atualizações de Projetos',
      description: 'Notificações sobre novos projetos e atualizações',
      email: true,
      push: true,
      icon: CheckCircle
    },
    {
      id: 'calendar',
      title: 'Eventos do Calendário',
      description: 'Lembretes de eventos e reuniões',
      email: true,
      push: false,
      icon: Calendar
    }
  ])

  const toggleEmail = (id: string) => {
    setSettings(settings.map(setting =>
      setting.id === id ? { ...setting, email: !setting.email } : setting
    ))
  }

  const togglePush = (id: string) => {
    setSettings(settings.map(setting =>
      setting.id === id ? { ...setting, push: !setting.push } : setting
    ))
  }

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
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Preferências de Notificações
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Escolha como e quando deseja receber notificações
            </p>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
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
          {settings.map((setting) => {
            const Icon = setting.icon
            return (
              <div key={setting.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <div className="col-span-6 flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {setting.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {setting.description}
                    </p>
                  </div>
                </div>
                <div className="col-span-3 flex items-center justify-center">
                  <button
                    onClick={() => toggleEmail(setting.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      setting.email
                        ? 'bg-primary'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                        setting.email ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="col-span-3 flex items-center justify-center">
                  <button
                    onClick={() => togglePush(setting.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      setting.push
                        ? 'bg-primary'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                        setting.push ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors shadow-sm">
          Salvar Preferências
        </button>
      </div>
    </motion.div>
  )
}

export default NotificationsTab
