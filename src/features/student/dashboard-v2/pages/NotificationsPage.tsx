import React, { useState } from 'react'
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
  ExternalLink
} from 'lucide-react'
import NotificationDetailModal from '../components/NotificationDetailModal'

// Tipos de notificação
type NotificationType = 
  | 'comment' 
  | 'like' 
  | 'published' 
  | 'collaboration' 
  | 'follower' 
  | 'mention'
  | 'view'
  | 'share'
  | 'reply'

interface Notification {
  id: number
  type: NotificationType
  title: string
  message: string
  projectName?: string
  userName?: string
  userAvatar?: string
  time: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

const NotificationsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'unread' | NotificationType>('all')
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'comment',
      title: 'Novo Comentário',
      message: 'comentou no seu projeto',
      projectName: 'App de Gestão Escolar',
      userName: 'Maria Silva',
      userAvatar: 'MS',
      time: 'Há 5 minutos',
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
      actionUrl: '/projects/1'
    },
    {
      id: 2,
      type: 'like',
      title: 'Curtidas no Projeto',
      message: 'e outras 14 pessoas curtiram seu projeto',
      projectName: 'Sistema de Biblioteca',
      userName: 'João Pedro',
      userAvatar: 'JP',
      time: 'Há 30 minutos',
      timestamp: new Date(Date.now() - 30 * 60000),
      read: false,
      actionUrl: '/projects/2'
    },
    {
      id: 3,
      type: 'published',
      title: 'Projeto Publicado',
      message: 'Seu projeto foi publicado com sucesso e já está visível na vitrine',
      projectName: 'Dashboard Analytics',
      time: 'Há 2 horas',
      timestamp: new Date(Date.now() - 2 * 60 * 60000),
      read: false,
      actionUrl: '/projects/3'
    },
    {
      id: 4,
      type: 'collaboration',
      title: 'Adicionado como Colaborador',
      message: 'te adicionou como colaborador',
      projectName: 'E-commerce Platform',
      userName: 'Ana Costa',
      userAvatar: 'AC',
      time: 'Há 5 horas',
      timestamp: new Date(Date.now() - 5 * 60 * 60000),
      read: true,
      actionUrl: '/projects/4'
    },
    {
      id: 5,
      type: 'follower',
      title: 'Novo Seguidor',
      message: 'começou a seguir seus projetos',
      userName: 'Carlos Mendes',
      userAvatar: 'CM',
      time: 'Há 8 horas',
      timestamp: new Date(Date.now() - 8 * 60 * 60000),
      read: true,
      actionUrl: '/profile/carlos'
    },
    {
      id: 6,
      type: 'reply',
      title: 'Resposta em Comentário',
      message: 'respondeu ao seu comentário',
      projectName: 'App Mobile',
      userName: 'Pedro Santos',
      userAvatar: 'PS',
      time: 'Ontem',
      timestamp: new Date(Date.now() - 24 * 60 * 60000),
      read: true,
      actionUrl: '/projects/5'
    },
    {
      id: 7,
      type: 'view',
      title: 'Projeto em Destaque',
      message: 'Seu projeto atingiu 100 visualizações esta semana!',
      projectName: 'Portfolio Website',
      time: 'Há 2 dias',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000),
      read: true,
      actionUrl: '/projects/6'
    },
    {
      id: 8,
      type: 'share',
      title: 'Projeto Compartilhado',
      message: 'compartilhou seu projeto',
      projectName: 'Sistema de Gestão',
      userName: 'Fernanda Lima',
      userAvatar: 'FL',
      time: 'Há 3 dias',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000),
      read: true,
      actionUrl: '/projects/7'
    },
    {
      id: 9,
      type: 'mention',
      title: 'Menção em Comentário',
      message: 'mencionou você em um comentário',
      projectName: 'API REST',
      userName: 'Lucas Oliveira',
      userAvatar: 'LO',
      time: 'Há 4 dias',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60000),
      read: true,
      actionUrl: '/projects/8'
    }
  ])

  const getNotificationIcon = (type: NotificationType) => {
    const iconClass = "h-5 w-5"
    switch (type) {
      case 'comment':
        return <MessageCircle className={`${iconClass} text-blue-500`} />
      case 'like':
        return <Heart className={`${iconClass} text-red-500`} />
      case 'published':
        return <Upload className={`${iconClass} text-green-500`} />
      case 'collaboration':
        return <Users className={`${iconClass} text-purple-500`} />
      case 'follower':
        return <UserPlus className={`${iconClass} text-indigo-500`} />
      case 'mention':
        return <Bell className={`${iconClass} text-yellow-500`} />
      case 'view':
        return <Eye className={`${iconClass} text-cyan-500`} />
      case 'share':
        return <Share2 className={`${iconClass} text-orange-500`} />
      case 'reply':
        return <MessageCircle className={`${iconClass} text-teal-500`} />
      default:
        return <Bell className={`${iconClass} text-gray-500`} />
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    return notification.type === filter
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id))
    setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
  }

  const toggleSelectNotification = (id: number) => {
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

  const deleteSelectedNotifications = () => {
    setNotifications(notifications.filter(n => !selectedIds.includes(n.id)))
    setSelectedIds([])
  }

  const openNotificationDetail = (notification: Notification) => {
    setSelectedNotification(notification)
    setIsModalOpen(true)
    // Marcar como lida ao abrir detalhes
    if (!notification.read) {
      markAsRead(notification.id)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedNotification(null), 200)
  }

  const filterOptions = [
    { value: 'all', label: 'Todas', icon: Bell },
    { value: 'unread', label: 'Não Lidas', icon: AlertCircle },
    { value: 'comment', label: 'Comentários', icon: MessageCircle },
    { value: 'like', label: 'Curtidas', icon: Heart },
    { value: 'collaboration', label: 'Colaboração', icon: Users },
    { value: 'published', label: 'Publicações', icon: Upload },
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
                  onClick={markAllAsRead}
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
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="flex items-center gap-1 text-xs font-medium text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded-full">
                              <span className="h-1.5 w-1.5 bg-primary dark:bg-primary-light rounded-full animate-pulse"></span>
                              Novo
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {notification.userName && (
                            <span className="font-medium text-gray-900 dark:text-white">
                              {notification.userName}{' '}
                            </span>
                          )}
                          {notification.message}
                          {notification.projectName && (
                            <span className="font-medium text-primary dark:text-primary-light">
                              {' '}"{ notification.projectName}"
                            </span>
                          )}
                        </p>

                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {notification.time}
                          </span>
                          
                          <button 
                            onClick={() => openNotificationDetail(notification)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 rounded-md transition-all hover:scale-105"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Ver detalhes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="group/btn p-2.5 text-gray-400 dark:text-gray-500 hover:text-white hover:bg-primary dark:hover:bg-primary-light rounded-md transition-all hover:scale-110 shadow-sm"
                        title="Marcar como lida"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
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
