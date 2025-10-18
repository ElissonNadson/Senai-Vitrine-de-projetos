import React, { useEffect } from 'react'
import { X, Clock, User, MessageCircle, Heart, Upload, Users, Eye, Share2, UserPlus, Bell } from 'lucide-react'

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

interface NotificationDetailModalProps {
  isOpen: boolean
  onClose: () => void
  notification: {
    id: number
    type: NotificationType
    title: string
    message: string
    projectName?: string
    userName?: string
    time: string
    read: boolean
    fullDetails?: string
  } | null
}

const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  isOpen,
  onClose,
  notification
}) => {
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

  const getNotificationIcon = (type: NotificationType) => {
    const iconClass = "h-6 w-6"
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

  const getDetailedMessage = () => {
    switch (notification.type) {
      case 'comment':
        return `${notification.userName} deixou um comentário no seu projeto "${notification.projectName}". Este é um momento importante para interagir com a comunidade e responder aos comentários. Confira o que foi dito e participe da conversa!`
      case 'like':
        return `Seu projeto "${notification.projectName}" está recebendo muito carinho da comunidade! ${notification.userName} e outras pessoas curtiram seu trabalho. Continue compartilhando seus projetos incríveis!`
      case 'published':
        return `Parabéns! Seu projeto "${notification.projectName}" foi publicado com sucesso e agora está visível na vitrine para todos verem. Compartilhe com seus colegas e mostre seu talento!`
      case 'collaboration':
        return `${notification.userName} adicionou você como colaborador no projeto "${notification.projectName}". Você agora pode contribuir com ideias, editar e fazer parte deste projeto. Acesse para começar a colaborar!`
      case 'follower':
        return `${notification.userName} começou a seguir seus projetos! Isso significa que essa pessoa está interessada no seu trabalho e quer acompanhar suas futuras publicações. Continue criando conteúdo incrível!`
      case 'reply':
        return `${notification.userName} respondeu ao seu comentário no projeto "${notification.projectName}". Continue a conversa e troque ideias com outros membros da comunidade!`
      case 'view':
        return `Seu projeto "${notification.projectName}" está fazendo sucesso! Atingiu um marco importante de visualizações. Continue assim e inspire mais pessoas com seu trabalho!`
      case 'share':
        return `${notification.userName} compartilhou seu projeto "${notification.projectName}" com outras pessoas. Seu trabalho está alcançando mais gente e inspirando a comunidade!`
      case 'mention':
        return `${notification.userName} mencionou você em um comentário no projeto "${notification.projectName}". Alguém quer sua opinião ou está te chamando para participar da discussão!`
      default:
        return notification.message
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
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">
                  {notification.title}
                </h2>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {notification.time}
                  </span>
                  {notification.userName && (
                    <span className="flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      {notification.userName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)]">
            {/* Project Badge */}
            {notification.projectName && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light rounded-lg mb-4 font-medium text-sm">
                <div className="h-2 w-2 bg-primary dark:bg-primary-light rounded-full"></div>
                Projeto: {notification.projectName}
              </div>
            )}

            {/* Detailed Message */}
            <div className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                  {getDetailedMessage()}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Ações rápidas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {notification.projectName && (
                    <button className="px-4 py-2 bg-primary hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary text-white rounded-lg text-sm font-medium transition-colors">
                      Ver Projeto
                    </button>
                  )}
                  {notification.type === 'comment' && (
                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
                      Responder Comentário
                    </button>
                  )}
                  {notification.type === 'collaboration' && (
                    <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors">
                      Acessar Colaboração
                    </button>
                  )}
                  {notification.userName && (
                    <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors">
                      Ver Perfil
                    </button>
                  )}
                </div>
              </div>

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
                Notificação #{notification.id}
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
