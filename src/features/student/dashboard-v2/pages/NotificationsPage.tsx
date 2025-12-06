import React, { useState, useMemo } from 'react'
import {
  Bell,
  MessageCircle,
  Heart,
  UserPlus,
  Upload,
  Users,
  Eye,
  Share2,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  Trash2,
  Check,
  ChevronDown,
  CheckCheck,
  X,
  Square,
  CheckSquare,
  Trash,
  ExternalLink,
  Plus,
  TrendingUp,
  FolderPlus,
  Globe,
  AtSign
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '@/contexts/notification-context'
import { useAuth } from '@/contexts/auth-context'
import { getBaseRoute } from '@/utils/routes'
import { formatNotificationDate, notificationTypeConfig } from '@/services/api-notificacoes'
import { Notification, NotificationType } from '@/types/types-queries'
import NotificationDetailModal from '../components/NotificationDetailModal'

const NotificationsPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const baseRoute = useMemo(() => getBaseRoute(user?.tipo), [user?.tipo])
  const { 
    notifications, 
    unreadCount, 
    loading,
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications()
  
  const [filter, setFilter] = useState<'all' | 'unread' | NotificationType>('all')
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Ícone baseado no tipo de notificação da API
  const getNotificationIcon = (tipo: NotificationType) => {
    const iconClass = "h-5 w-5"
    const config = notificationTypeConfig[tipo]
    
    if (!config) {
      return <Bell className={`${iconClass} text-gray-500`} />
    }
    
    switch (config.icon) {
      case 'Plus':
        return <Plus className={`${iconClass} ${config.textColor}`} />
      case 'CheckCircle':
        return <CheckCircle className={`${iconClass} ${config.textColor}`} />
      case 'MessageSquare':
        return <MessageCircle className={`${iconClass} ${config.textColor}`} />
      case 'TrendingUp':
        return <TrendingUp className={`${iconClass} ${config.textColor}`} />
      case 'FolderPlus':
        return <FolderPlus className={`${iconClass} ${config.textColor}`} />
      case 'Globe':
        return <Globe className={`${iconClass} ${config.textColor}`} />
      case 'UserPlus':
        return <UserPlus className={`${iconClass} ${config.textColor}`} />
      case 'AtSign':
        return <AtSign className={`${iconClass} ${config.textColor}`} />
      default:
        return <Bell className={`${iconClass} text-gray-500`} />
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    return notification.tipo === filter
  })

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id)
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
  }

  const handleDeleteNotification = async (id: string) => {
    await deleteNotification(id)
    setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
  }

  const toggleSelectNotification = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredNotifications.map(n => n.id))
    }
  }

  const deleteSelectedNotifications = async () => {
    for (const id of selectedIds) {
      await deleteNotification(id)
    }
    setSelectedIds([])
  }

  const openNotificationDetail = async (notification: Notification) => {
    setSelectedNotification(notification)
    setIsModalOpen(true)
    // Marcar como lida ao abrir detalhes
    if (!notification.read) {
      await markAsRead(notification.id)
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id)
    }
    
    if (notification.link) {
      // Se o link já é uma URL completa ou começa com /, navegar diretamente
      if (notification.link.startsWith('http') || notification.link.startsWith('/')) {
        navigate(notification.link)
      } else {
        // Caso contrário, navegar relativo à rota base
        navigate(`${baseRoute}/${notification.link}`)
      }
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedNotification(null), 200)
  }

  const filterOptions = [
    { value: 'all', label: 'Todas', icon: Bell },
    { value: 'unread', label: 'Não Lidas', icon: AlertCircle },
    { value: 'NOVA_ETAPA', label: 'Nova Etapa', icon: Plus },
    { value: 'ETAPA_CONCLUIDA', label: 'Concluídas', icon: CheckCircle },
    { value: 'CONVITE_EQUIPE', label: 'Convites', icon: UserPlus },
    { value: 'PROJETO_PUBLICADO', label: 'Publicações', icon: Globe },
  ]

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                  <Bell className="h-6 w-6 md:h-7 md:w-7 text-primary dark:text-primary-light" />
                </div>
                Notificações
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {unreadCount > 0 ? (
                  <>
                    Você tem{' '}
                    <span className="font-semibold text-primary dark:text-primary-light">
                      {unreadCount} {unreadCount === 1 ? 'notificação' : 'notificações'}
                    </span>{' '}
                    não {unreadCount === 1 ? 'lida' : 'lidas'}
                  </>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Você está em dia com suas notificações
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {selectedIds.length > 0 && (
                <button
                  onClick={deleteSelectedNotifications}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 rounded-lg transition-all shadow-sm hover:shadow-md"
                >
                  <Trash className="h-4 w-4" />
                  Excluir ({selectedIds.length})
                </button>
              )}
              
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary rounded-lg transition-all shadow-sm hover:shadow-md"
                >
                  <CheckCheck className="h-4 w-4" />
                  Marcar todas como lidas
                </button>
              )}
            </div>
          </div>

          {/* Select All and Filters */}
          <div className="mt-6 space-y-3">
            {/* Select All Checkbox */}
            {filteredNotifications.length > 0 && (
              <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
                >
                  {selectedIds.length === filteredNotifications.length ? (
                    <CheckSquare className="h-5 w-5 text-primary dark:text-primary-light" />
                  ) : (
                    <Square className="h-5 w-5" />
                  )}
                  {selectedIds.length > 0 
                    ? `${selectedIds.length} selecionada(s)` 
                    : 'Selecionar todas'
                  }
                </button>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const Icon = option.icon
              const isActive = filter === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-md scale-105 dark:bg-primary-light'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 hover:scale-105'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {option.label}
                </button>
              )
            })}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                <Bell className="h-12 w-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Nenhuma notificação encontrada
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filter === 'unread' 
                  ? 'Parabéns! Você está em dia com todas as suas notificações.'
                  : `Não há notificações do tipo "${filterOptions.find(f => f.value === filter)?.label || 'selecionado'}".`
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`group bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all hover:shadow-md relative ${
                  !notification.read 
                    ? 'border-primary dark:border-primary-light' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex gap-4 p-4">
                  {/* Checkbox */}
                  <div className="flex-shrink-0 flex items-center">
                    <button
                      onClick={() => toggleSelectNotification(notification.id)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      {selectedIds.includes(notification.id) ? (
                        <CheckSquare className="h-5 w-5 text-primary dark:text-primary-light" />
                      ) : (
                        <Square className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      )}
                    </button>
                  </div>

                  {/* Icon */}
                  <div className="flex-shrink-0 flex items-center">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${
                      !notification.read 
                        ? 'bg-white dark:bg-gray-700 shadow-md ring-2 ring-primary/10' 
                        : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                    }`}>
                      {getNotificationIcon(notification.tipo)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {notification.titulo}
                          </h3>
                          {!notification.read && (
                            <span className="flex items-center gap-1 text-xs font-medium text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded-full">
                              <span className="h-1.5 w-1.5 bg-primary dark:bg-primary-light rounded-full animate-pulse"></span>
                              Novo
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {notification.mensagem}
                        </p>

                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {formatNotificationDate(notification.createdAt)}
                          </span>
                          
                          {notification.link && (
                            <button 
                              onClick={() => handleNotificationClick(notification)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 rounded-md transition-all hover:scale-105"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              Ver detalhes
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="group/btn p-2.5 text-gray-400 dark:text-gray-500 hover:text-white hover:bg-primary dark:hover:bg-primary-light rounded-md transition-all hover:scale-110 shadow-sm"
                        title="Marcar como lida"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="group/btn p-2.5 text-gray-400 dark:text-gray-500 hover:text-white hover:bg-red-500 dark:hover:bg-red-600 rounded-lg transition-all hover:scale-110 shadow-sm"
                      title="Excluir notificação"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notification Detail Modal */}
      <NotificationDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        notification={selectedNotification}
      />
    </div>
  )
}

export default NotificationsPage
