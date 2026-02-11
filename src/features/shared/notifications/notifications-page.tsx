import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'
import { Notification } from '@/types/types-queries';
import { useNotifications } from '@/contexts/notification-context';
import { useGuest } from '@/contexts/guest-context'
import { useAuth } from '@/contexts/auth-context'
import { getBaseRoute } from '@/utils/routes'
import { PageBanner } from '@/components/common/PageBanner'
import { formatNotificationDate, notificationTypeConfig } from '@/services/api-notificacoes'
import {
  CheckCheck, Search, Filter, Bell, Trash2, ChevronDown,
  ExternalLink, Clock,
  Plus, CheckCircle, MessageSquare, TrendingUp, FolderPlus,
  Globe, UserPlus, AtSign, RefreshCw, UserMinus, Archive,
  AlertTriangle, Gavel
} from 'lucide-react';

// Mapa de ícones por nome de string
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Plus, CheckCircle, MessageSquare, TrendingUp, FolderPlus,
  Globe, UserPlus, AtSign, RefreshCw, UserMinus, Archive,
  AlertTriangle, Gavel, Bell,
}

const getNotificationIcon = (tipo: string) => {
  const config = notificationTypeConfig[tipo as keyof typeof notificationTypeConfig]
  const IconComponent = config ? iconMap[config.icon] || Bell : Bell
  const colorClass = config?.textColor || 'text-gray-500'
  return <IconComponent className={`w-5 h-5 ${colorClass}`} />
}

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate()
  const { isGuest } = useGuest()
  const { isAuthenticated, user } = useAuth()
  const baseRoute = useMemo(() => getBaseRoute(user?.tipo), [user?.tipo])

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filterOption, setFilterOption] = useState<string>('Mais recentes');
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (isGuest || !isAuthenticated) {
      navigate(baseRoute, { replace: true })
      return
    }
  }, [isGuest, isAuthenticated, navigate, baseRoute])

  const {
    notifications,
    loading: isLoading,
    unreadCount,
    deleteNotification,
    markAsRead,
    markAllAsRead,
    refreshNotifications
  } = useNotifications();

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  useEffect(() => {
    if (notifications) {
      let filtered = [...notifications];

      if (startDate) {
        const startDateTime = new Date(startDate).getTime();
        filtered = filtered.filter(notif =>
          new Date(notif.createdAt).getTime() >= startDateTime
        );
      }

      if (endDate) {
        const endDateTime = new Date(endDate).getTime() + 86400000;
        filtered = filtered.filter(notif =>
          new Date(notif.createdAt).getTime() <= endDateTime
        );
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(notif =>
          notif.titulo.toLowerCase().includes(term) ||
          notif.mensagem.toLowerCase().includes(term)
        );
      }

      if (filterOption === 'Mais recentes') {
        filtered.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (filterOption === 'Mais antigas') {
        filtered.sort((a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (filterOption === 'Não lidas') {
        filtered = filtered.filter(notif => !notif.read);
      } else if (filterOption === 'Lidas') {
        filtered = filtered.filter(notif => notif.read);
      }

      setFilteredNotifications(filtered);
    }
  }, [notifications, startDate, endDate, filterOption, searchTerm]);

  const handleToggle = useCallback((notification: Notification) => {
    const isOpening = expandedId !== notification.id
    setExpandedId(isOpening ? notification.id : null)
    // Auto-mark as read ao expandir
    if (isOpening && !notification.read) {
      markAsRead(notification.id)
    }
  }, [expandedId, markAsRead])

  const handleNavigate = useCallback((link: string) => {
    // Links da API vêm como /projetos/:uuid — precisamos converter para /{role}/projetos/:uuid/visualizar
    const projetoMatch = link.match(/^\/projetos\/([a-f0-9-]+)$/i)
    if (projetoMatch) {
      navigate(`${baseRoute}/projetos/${projetoMatch[1]}/visualizar`)
      return
    }
    if (link.startsWith('http')) {
      window.location.href = link
    } else if (link.startsWith('/')) {
      navigate(link)
    } else {
      navigate(`${baseRoute}/${link}`)
    }
  }, [navigate, baseRoute])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageBanner
        title="Notificações"
        subtitle={
          unreadCount > 0
            ? `Você tem ${unreadCount} ${unreadCount === 1 ? 'notificação não lida' : 'notificações não lidas'}`
            : 'Acompanhe feedbacks, novas etapas e atualizações dos seus projetos em tempo real.'
        }
        icon={<Bell />}
        action={
          unreadCount > 0 ? (
            <button
              onClick={() => markAllAsRead()}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all shadow-sm hover:shadow-md backdrop-blur-sm"
            >
              <CheckCheck className="w-4 h-4" />
              Marcar todas como lidas
            </button>
          ) : undefined
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-20">

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 mb-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative w-full lg:w-1/3">
              <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Pesquisar notificações..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
              <div className="flex items-center bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2">
                <span className="mr-2 text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">De:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="bg-transparent text-sm text-gray-700 dark:text-gray-200 focus:outline-none"
                />
              </div>
              <div className="flex items-center bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2">
                <span className="mr-2 text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">Até:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="bg-transparent text-sm text-gray-700 dark:text-gray-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="w-full lg:w-auto ml-auto">
              <select
                value={filterOption}
                onChange={e => setFilterOption(e.target.value)}
                className="w-full lg:w-48 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Mais recentes">Mais recentes</option>
                <option value="Mais antigas">Mais antigas</option>
                <option value="Não lidas">Não lidas</option>
                <option value="Lidas">Lidas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Notificações */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Carregando suas notificações...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
              <Bell className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Nenhuma notificação encontrada</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              Você não tem notificações que correspondam aos filtros selecionados ou ainda não recebeu nenhuma atualização.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
            {filteredNotifications.map(notification => {
              const isExpanded = expandedId === notification.id
              const config = notificationTypeConfig[notification.tipo as keyof typeof notificationTypeConfig]

              return (
                <div key={notification.id} className="relative">
                  {/* Header — sempre visível */}
                  <button
                    onClick={() => handleToggle(notification)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-750 ${
                      isExpanded ? 'bg-gray-50/50 dark:bg-gray-750/50' : ''
                    }`}
                  >
                    {/* Indicador não lida */}
                    <div className="flex-shrink-0 w-2">
                      {!notification.read && (
                        <span className="block w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      )}
                    </div>

                    {/* Ícone do tipo */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${config?.bgColor || 'bg-gray-100 dark:bg-gray-700'}`}>
                      {getNotificationIcon(notification.tipo)}
                    </div>

                    {/* Conteúdo principal */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-semibold uppercase tracking-wide ${config?.textColor || 'text-gray-500 dark:text-gray-400'}`}>
                          {config?.label || 'Notificação'}
                        </span>
                      </div>
                      <h3 className={`text-sm leading-snug truncate ${!notification.read ? 'font-semibold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                        {notification.titulo}
                      </h3>
                    </div>

                    {/* Timestamp */}
                    <span className="flex-shrink-0 text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap hidden sm:block">
                      {formatNotificationDate(notification.createdAt)}
                    </span>

                    {/* Excluir */}
                    <button
                      onClick={e => { e.stopPropagation(); deleteNotification(notification.id) }}
                      className="flex-shrink-0 p-1.5 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all opacity-0 group-hover:opacity-100"
                      style={{ opacity: 1 }}
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Chevron */}
                    <ChevronDown className={`flex-shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown — conteúdo expandido */}
                  <div
                    className={`grid transition-all duration-200 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-4 pb-4 pt-1 ml-[60px]">
                        {/* Mensagem */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line mb-3">
                          {notification.mensagem}
                        </p>

                        {/* Footer: timestamp (mobile) + link */}
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {formatNotificationDate(notification.createdAt)}
                          </span>

                          {notification.link && (
                            <button
                              onClick={() => handleNavigate(notification.link!)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-md transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Ver detalhes
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
