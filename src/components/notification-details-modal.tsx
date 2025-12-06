import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { getBaseRoute } from '@/utils/routes';
import { Notification, NotificationType } from '../types/types-queries';
import { formatNotificationDate, notificationTypeConfig } from '../services/api-notificacoes';
import { Plus, CheckCircle, MessageSquare, TrendingUp, FolderPlus, Globe, UserPlus, AtSign, Bell, ExternalLink, X } from 'lucide-react';

interface NotificationDetailsModalProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationDetailsModal: React.FC<NotificationDetailsModalProps> = ({ notification, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const baseRoute = useMemo(() => getBaseRoute(user?.tipo), [user?.tipo]);
  
  const config = notificationTypeConfig[notification.tipo];
  
  const getNotificationIcon = (tipo: NotificationType) => {
    const iconClass = "w-6 h-6";
    const iconConfig = notificationTypeConfig[tipo];
    
    if (!iconConfig) {
      return <Bell className={`${iconClass} text-white`} />;
    }
    
    switch (iconConfig.icon) {
      case 'Plus':
        return <Plus className={`${iconClass} text-white`} />;
      case 'CheckCircle':
        return <CheckCircle className={`${iconClass} text-white`} />;
      case 'MessageSquare':
        return <MessageSquare className={`${iconClass} text-white`} />;
      case 'TrendingUp':
        return <TrendingUp className={`${iconClass} text-white`} />;
      case 'FolderPlus':
        return <FolderPlus className={`${iconClass} text-white`} />;
      case 'Globe':
        return <Globe className={`${iconClass} text-white`} />;
      case 'UserPlus':
        return <UserPlus className={`${iconClass} text-white`} />;
      case 'AtSign':
        return <AtSign className={`${iconClass} text-white`} />;
      default:
        return <Bell className={`${iconClass} text-white`} />;
    }
  };

  const handleNavigateToLink = () => {
    if (notification.link) {
      if (notification.link.startsWith('http') || notification.link.startsWith('/')) {
        navigate(notification.link);
      } else {
        navigate(`${baseRoute}/${notification.link}`);
      }
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-primary dark:bg-primary-light p-6 text-white">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              {getNotificationIcon(notification.tipo)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
                  {config?.label || 'Notificação'}
                </span>
                {!notification.read && (
                  <span className="text-xs font-medium bg-yellow-500/30 px-2 py-1 rounded-full">
                    Não lida
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold mb-2">{notification.titulo}</h2>
              <p className="text-white/80 text-sm">
                {formatNotificationDate(notification.createdAt)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base whitespace-pre-line">
              {notification.mensagem}
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            ID: {notification.id.substring(0, 8)}...
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Fechar
            </button>
            {notification.link && (
              <button
                onClick={handleNavigateToLink}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary text-white rounded-lg text-sm font-medium transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Ver Detalhes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailsModal;
