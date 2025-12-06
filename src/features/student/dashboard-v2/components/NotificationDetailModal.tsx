import React, { useEffect, useMemo } from 'react'
import { X, Clock, Plus, CheckCircle, MessageSquare, TrendingUp, FolderPlus, Globe, UserPlus, AtSign, Bell, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { getBaseRoute } from '@/utils/routes'
import { formatNotificationDate, notificationTypeConfig } from '@/services/api-notificacoes'
import { Notification, NotificationType } from '@/types/types-queries'

interface NotificationDetailModalProps {
  isOpen: boolean
  onClose: () => void
  notification: Notification | null
}

const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  isOpen,
  onClose,
  notification
}) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const baseRoute = useMemo(() => getBaseRoute(user?.tipo), [user?.tipo])

  // Fechar modal com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !notification) return null

  const getNotificationIcon = (tipo: NotificationType) => {
    const iconClass = "h-6 w-6"
    const config = notificationTypeConfig[tipo]
    
    if (!config) {
      return <Bell className={`${iconClass} text-gray-500`} />
    }
    
    switch (config.icon) {
      case 'Plus':
        return <Plus className={`${iconClass} text-white`} />
      case 'CheckCircle':
        return <CheckCircle className={`${iconClass} text-white`} />
      case 'MessageSquare':
        return <MessageSquare className={`${iconClass} text-white`} />
      case 'TrendingUp':
        return <TrendingUp className={`${iconClass} text-white`} />
      case 'FolderPlus':
        return <FolderPlus className={`${iconClass} text-white`} />
      case 'Globe':
        return <Globe className={`${iconClass} text-white`} />
      case 'UserPlus':
        return <UserPlus className={`${iconClass} text-white`} />
      case 'AtSign':
        return <AtSign className={`${iconClass} text-white`} />
      default:
        return <Bell className={`${iconClass} text-white`} />
    }
  }

  const getTypeLabel = (tipo: NotificationType) => {
    return notificationTypeConfig[tipo]?.label || 'Notificação'
  }

  const handleNavigateToLink = () => {
    if (notification.link) {
      if (notification.link.startsWith('http') || notification.link.startsWith('/')) {
        navigate(notification.link)
      } else {
        navigate(`${baseRoute}/${notification.link}`)
      }
      onClose()
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden pointer-events-auto animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-primary dark:bg-primary-light p-6 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                {getNotificationIcon(notification.tipo)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
                    {getTypeLabel(notification.tipo)}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {notification.titulo}
                </h2>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {formatNotificationDate(notification.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)]">
            {/* Detailed Message */}
            <div className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                  {notification.mensagem}
                </p>
              </div>

              {/* Quick Actions */}
              {notification.link && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Ações rápidas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={handleNavigateToLink}
                      className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              )}

              {/* Status Badge */}
              {!notification.read && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                    <span className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></span>
                    Notificação não lida
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ID: {notification.id.substring(0, 8)}...
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotificationDetailModal
