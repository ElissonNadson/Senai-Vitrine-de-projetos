import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'
import { Notification } from '@/types/types-queries';
import NotificationCard from '@/components/notification-card';
import { useNotifications } from '@/contexts/notification-context';
import { useGuest } from '@/contexts/guest-context'
import { useAuth } from '@/contexts/auth-context'
import { getBaseRoute } from '@/utils/routes'
import SectionLayout from '@/features/visitor/layout/SectionLayout';
import { CheckCheck, Search, Filter, Calendar, Bell } from 'lucide-react';
import heroBg from '@/assets/noticias.png' // Usando o mesmo background de notícias por enquanto

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

  // Redirecionar visitantes para o dashboard
  useEffect(() => {
    if (isGuest || !isAuthenticated) {
      navigate(baseRoute, { replace: true })
      return
    }
  }, [isGuest, isAuthenticated, navigate, baseRoute])

  // Usando o contexto de notificações
  const {
    notifications,
    loading: isLoading,
    deleteNotification,
    markAsRead,
    markAllAsRead,
    refreshNotifications
  } = useNotifications();

  useEffect(() => {
    // Atualiza as notificações quando a página é carregada
    refreshNotifications();
  }, [refreshNotifications]);

  useEffect(() => {
    if (notifications) {
      let filtered = [...notifications];

      // Aplicando filtros de data
      if (startDate) {
        const startDateTime = new Date(startDate).getTime();
        filtered = filtered.filter(notif =>
          new Date(notif.createdAt).getTime() >= startDateTime
        );
      }

      if (endDate) {
        const endDateTime = new Date(endDate).getTime() + 86400000; // + 1 dia
        filtered = filtered.filter(notif =>
          new Date(notif.createdAt).getTime() <= endDateTime
        );
      }

      // Aplicando filtro de pesquisa
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(notif =>
          notif.titulo.toLowerCase().includes(term) ||
          notif.mensagem.toLowerCase().includes(term)
        );
      }

      // Aplicando filtros de ordenação/status
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

  const handleDeleteNotification = (id: string) => {
    deleteNotification(id);
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOption(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden bg-[#003B71]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Background"
            className="w-full h-full object-cover opacity-40"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#003B71]/90 to-[#003B71]/60 mix-blend-multiply" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full max-w-7xl px-6 pt-10 text-center">
          <div className="max-w-4xl flex flex-col items-center">
            <p className="text-[#00aceb] font-bold tracking-[0.2em] text-sm md:text-base uppercase mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Central de Notificações
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
              Suas Atividades e Alertas
            </h1>
            <p className="text-gray-200 text-base md:text-lg leading-relaxed max-w-2xl">
              Acompanhe feedbacks, novas etapas e atualizações dos seus projetos em tempo real.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-10 relative z-20 pb-20">

        {/* Controls Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              Filtrar Notificações
            </h2>

            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors text-sm font-medium"
            >
              <CheckCheck className="w-5 h-5" />
              Marcar todas como lidas
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative w-full lg:w-1/3">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Pesquisar notificações..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Date Filters */}
            <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <span className="mr-2 text-xs text-gray-500 font-medium whitespace-nowrap">De:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="bg-transparent text-sm text-gray-700 focus:outline-none"
                />
              </div>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <span className="mr-2 text-xs text-gray-500 font-medium whitespace-nowrap">Até:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="bg-transparent text-sm text-gray-700 focus:outline-none"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full lg:w-auto ml-auto">
              <select
                value={filterOption}
                onChange={handleFilterChange}
                className="w-full lg:w-48 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Mais recentes">Mais recentes</option>
                <option value="Mais antigas">Mais antigas</option>
                <option value="Não lidas">Não lidas</option>
                <option value="Lidas">Lidas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00aceb] mb-4"></div>
              <p className="text-gray-500">Carregando suas notificações...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Bell className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhuma notificação encontrada</h3>
              <p className="text-gray-500 max-w-md">
                Você não tem notificações que correspondam aos filtros selecionados ou ainda não recebeu nenhuma atualização.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredNotifications.map(notification => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onDelete={handleDeleteNotification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
