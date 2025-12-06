import React, { useState } from 'react';
import { Notification } from '../types/types-queries';
import { formatNotificationDate, notificationTypeConfig } from '../services/api-notificacoes';
import { Plus, CheckCircle, MessageSquare, TrendingUp, FolderPlus, Globe, UserPlus, AtSign, Bell } from 'lucide-react';
import NotificationDetailsModal from './notification-details-modal';

interface NotificationCardProps {
  notification: Notification;
  onDelete: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onDelete, onMarkAsRead }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const handleCardClick = () => {
    setShowDetails(true);
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  const getNotificationIcon = () => {
    const config = notificationTypeConfig[notification.tipo];
    const iconClass = "w-5 h-5";
    
    if (!config) {
      return <Bell className={`${iconClass} text-gray-500`} />;
    }
    
    switch (config.icon) {
      case 'Plus':
        return <Plus className={`${iconClass} ${config.textColor}`} />;
      case 'CheckCircle':
        return <CheckCircle className={`${iconClass} ${config.textColor}`} />;
      case 'MessageSquare':
        return <MessageSquare className={`${iconClass} ${config.textColor}`} />;
      case 'TrendingUp':
        return <TrendingUp className={`${iconClass} ${config.textColor}`} />;
      case 'FolderPlus':
        return <FolderPlus className={`${iconClass} ${config.textColor}`} />;
      case 'Globe':
        return <Globe className={`${iconClass} ${config.textColor}`} />;
      case 'UserPlus':
        return <UserPlus className={`${iconClass} ${config.textColor}`} />;
      case 'AtSign':
        return <AtSign className={`${iconClass} ${config.textColor}`} />;
      default:
        return <Bell className={`${iconClass} text-gray-500`} />;
    }
  };

  const config = notificationTypeConfig[notification.tipo];

  return (
    <>
      <div 
        className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4 p-4 hover:shadow-lg transition-shadow cursor-pointer ${!notification.read ? `border-l-4 ${config?.borderColor || 'border-blue-500'}` : ''}`}
        onClick={handleCardClick}
      >
        <div className="absolute top-4 right-4 flex gap-2 z-10" onClick={e => e.stopPropagation()}>
          {!notification.read && onMarkAsRead && (
            <button 
              onClick={() => onMarkAsRead(notification.id)}
              className="bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/50 text-blue-600 dark:text-blue-400 rounded-md p-2 transition-colors"
              aria-label="Marcar como lido"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}
          <button 
            onClick={() => onDelete(notification.id)}
            className="bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400 rounded-md p-2 transition-colors"
            aria-label="Excluir notificação"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>

        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${config?.bgColor || 'bg-gray-100 dark:bg-gray-700'}`}>
            {getNotificationIcon()}
          </div>
          <div className="flex-1 min-w-0 pr-20">
            <div className="mb-1">
              <span className={`text-xs font-medium ${config?.textColor || 'text-gray-600 dark:text-gray-400'}`}>
                {config?.label || 'Notificação'}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
              {notification.titulo}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-2">
              {notification.mensagem}
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {formatNotificationDate(notification.createdAt)}
            </div>
          </div>
        </div>
      </div>

      {showDetails && (
        <NotificationDetailsModal 
          notification={notification} 
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};

export default NotificationCard;
