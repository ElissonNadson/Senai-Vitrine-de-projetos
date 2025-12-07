import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { getNotifications } from '../api/queries';
import { Notification } from '../types/types-queries';
import { 
  marcarNotificacaoLida, 
  marcarTodasNotificacoesLidas, 
  deletarNotificacao 
} from '../services/api-notificacoes';

interface NotificationContextType {
  unreadCount: number;
  notifications: Notification[];
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  notifications: [],
  loading: false,
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  deleteNotification: async () => {},
  refreshNotifications: () => {}
});

export const useNotifications = () => useContext(NotificationContext);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      // getNotifications já retorna array ou []
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error: any) {
      // Silenciar erro 403 (não autorizado) no console
      if (error?.response?.status !== 403) {
        console.error('Erro ao buscar notificações:', error);
      }
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Só buscar notificações se houver token de autenticação
    const token = Cookies.get('accessToken') || localStorage.getItem('accessTokenIntegrado');
    const isGuest = localStorage.getItem('isGuest') === 'true';
    
    if (token && !isGuest) {
      fetchNotifications();
    }
    
    // Poderia implementar um polling para verificar notificações a cada X segundos
    // const interval = setInterval(fetchNotifications, 60000); // a cada minuto
    // return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = (notifications || []).filter(notif => !notif.read).length;
  
  const markAsRead = useCallback(async (id: string) => {
    try {
      await marcarNotificacaoLida(id);
      setNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await deletarNotificacao(id);
      setNotifications(prevNotifications =>
        prevNotifications.filter(notif => notif.id !== id)
      );
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await marcarTodasNotificacoesLidas();
      setNotifications(prevNotifications =>
        prevNotifications.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Erro ao marcar todas notificações como lidas:', error);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refreshNotifications: fetchNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
