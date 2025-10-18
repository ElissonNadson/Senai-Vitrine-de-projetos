import React, { useState, useRef, useEffect } from 'react'
import { Search, Bell, User, Clock, CheckCircle, AlertCircle, ExternalLink, Sun, Moon } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/contexts/theme-context'
import UserProfileModal from './UserProfileModal'

// Tipo de notificação
interface Notification {
  id: number
  title: string
  message: string
  time: string
  read: boolean
  type: 'info' | 'success' | 'warning'
}

const ModernHeader: React.FC = () => {
  const { user } = useAuth()
  const { effectiveTheme, setThemeMode } = useTheme()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const avatarRef = useRef<HTMLButtonElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Função para alternar tema com animação
  const toggleTheme = () => {
    setIsAnimating(true)
    setThemeMode(effectiveTheme === 'dark' ? 'light' : 'dark')
    
    // Resetar animação após completar
    setTimeout(() => {
      setIsAnimating(false)
    }, 600)
  }

  // Notificações mockadas - Contexto de Vitrine de Projetos
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Novo Comentário',
      message: 'Maria Silva comentou no seu projeto "App de Gestão Escolar"',
      time: 'Há 5 minutos',
      read: false,
      type: 'info'
    },
    {
      id: 2,
      title: 'Curtida no Projeto',
      message: '15 pessoas curtiram seu projeto "Sistema de Biblioteca"',
      time: 'Há 30 minutos',
      read: false,
      type: 'success'
    },
    {
      id: 3,
      title: 'Projeto Publicado',
      message: 'Seu projeto "Dashboard Analytics" foi publicado com sucesso',
      time: 'Há 2 horas',
      read: false,
      type: 'success'
    },
    {
      id: 4,
      title: 'Adicionado ao Projeto',
      message: 'João Pedro te adicionou como colaborador no projeto "E-commerce"',
      time: 'Há 5 horas',
      read: true,
      type: 'info'
    },
    {
      id: 5,
      title: 'Novo Seguidor',
      message: 'Ana Costa começou a seguir seus projetos',
      time: 'Há 8 horas',
      read: true,
      type: 'info'
    },
    {
      id: 6,
      title: 'Resposta em Comentário',
      message: 'Carlos respondeu ao seu comentário no projeto "App Mobile"',
      time: 'Ontem',
      read: true,
      type: 'info'
    }
  ])

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }

    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isNotificationsOpen])

  const unreadCount = notifications.filter(n => !n.read).length
  const displayNotifications = notifications.slice(0, 3)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <Clock className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-4 md:px-8 py-4 bg-white dark:bg-gray-800 relative">
      {/* Search Bar */}
      <div className="flex items-center gap-4 flex-1">
        <label className="relative hidden sm:block flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full resize-none overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            placeholder="Buscar projetos ou tarefas..."
          />
        </label>
      </div>

      {/* Right Side - Notifications and Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications Button */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative group"
          >
            <Bell className="h-5 w-5 group-hover:animate-bounce" />
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notificações
                </h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Você tem {unreadCount} notificação(ões) não lida(s)
                  </p>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Não há notificações
                    </p>
                  </div>
                ) : (
                  <>
                    {displayNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <span className="h-2 w-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1"></span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Ver Todas - só aparece se tiver mais de 3 */}
                    {notifications.length > 3 && (
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/30">
                        <button 
                          onClick={() => {
                            navigate('/app/student-notifications')
                            setIsNotificationsOpen(false)
                          }}
                          className="w-full text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center justify-center gap-2 transition-colors"
                        >
                          Ver todas as notificações
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 relative group overflow-hidden ${
            isAnimating ? 'scale-110 bg-primary/10 dark:bg-primary-light/10' : ''
          }`}
          title={effectiveTheme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          disabled={isAnimating}
        >
          {/* Animação de ripple ao clicar */}
          {isAnimating && (
            <span className="absolute inset-0 animate-ping bg-primary/20 dark:bg-primary-light/20 rounded-full"></span>
          )}
          
          {/* Ícone com animação de rotação e fade */}
          <div className={`transition-all duration-500 ${isAnimating ? 'rotate-180 scale-0' : 'rotate-0 scale-100'}`}>
            {effectiveTheme === 'dark' ? (
              <Sun className="h-5 w-5 group-hover:rotate-45 transition-transform duration-300 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 group-hover:-rotate-12 transition-transform duration-300 text-indigo-600 dark:text-indigo-400" />
            )}
          </div>
        </button>

        {/* Profile Section with Name */}
        <button
          ref={avatarRef}
          onClick={() => setIsProfileModalOpen(!isProfileModalOpen)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.nome || 'Usuário'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email || ''}
            </span>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary dark:bg-primary-light flex items-center justify-center text-white font-medium text-sm hover:shadow-lg transition-shadow flex-shrink-0">
            {user?.nome ? user.nome.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
          </div>
        </button>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        anchorRef={avatarRef}
      />
    </header>
  )
}

export default ModernHeader
