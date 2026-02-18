/**
 * API de Notificações
 * Funções para interagir com os endpoints de notificações do backend
 */

import axiosInstance from './axios-instance'
import { Notification, NotificacaoAPI } from '@/types/types-queries'
import { formatDistanceToNow, isToday, isYesterday, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Formata a data da notificação para exibição amigável
 * Ex: "há 5 minutos", "há 2 horas", "ontem", "15 de dezembro"
 */
export function formatNotificationDate(dateString: string): string {
  if (!dateString) return ''

  const date = new Date(dateString)

  // Verifica se a data é válida
  if (isNaN(date.getTime())) {
    return ''
  }

  if (isToday(date)) {
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
  }

  if (isYesterday(date)) {
    return 'Ontem'
  }

  // Para datas mais antigas, exibe o dia e mês
  return format(date, "d 'de' MMMM", { locale: ptBR })
}

/**
 * Mapeia a resposta da API para a interface Notification do frontend
 */
export function mapNotificacaoToNotification(notificacao: NotificacaoAPI): Notification {
  return {
    id: notificacao.uuid,
    uuid: notificacao.uuid,
    usuarioUuid: notificacao.usuario_uuid,
    tipo: notificacao.tipo as Notification['tipo'],
    titulo: notificacao.titulo,
    mensagem: notificacao.mensagem,
    link: notificacao.link,
    read: notificacao.lida,
    createdAt: notificacao.criado_em,
  }
}

/**
 * Busca todas as notificações do usuário logado
 */
export async function buscarNotificacoes(apenasNaoLidas = false): Promise<Notification[]> {
  const params = apenasNaoLidas ? { apenasNaoLidas: true } : {}
  const response = await axiosInstance.get<NotificacaoAPI[]>('/notificacoes', { params })
  return response.data.map(mapNotificacaoToNotification)
}

/**
 * Conta o número de notificações não lidas
 */
export async function contarNotificacoesNaoLidas(): Promise<number> {
  const response = await axiosInstance.get<{ count: number }>('/notificacoes/nao-lidas/contar')
  return response.data.count
}

/**
 * Marca uma notificação como lida
 */
export async function marcarNotificacaoLida(uuid: string): Promise<void> {
  await axiosInstance.post(`/notificacoes/${uuid}/marcar-lida`)
}

/**
 * Marca todas as notificações como lidas
 */
export async function marcarTodasNotificacoesLidas(): Promise<void> {
  await axiosInstance.post('/notificacoes/marcar-todas-lidas')
}

/**
 * Deleta uma notificação
 */
export async function deletarNotificacao(uuid: string): Promise<void> {
  await axiosInstance.delete(`/notificacoes/${uuid}`)
}

/**
 * Configuração de ícones e cores por tipo de notificação
 */
export const notificationTypeConfig = {
  NOVA_ETAPA: {
    icon: 'Plus',
    color: 'blue',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-500',
    label: 'Nova Etapa'
  },
  ETAPA_CONCLUIDA: {
    icon: 'CheckCircle',
    color: 'green',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-600 dark:text-green-400',
    borderColor: 'border-green-500',
    label: 'Etapa Concluída'
  },
  FEEDBACK_RECEBIDO: {
    icon: 'MessageSquare',
    color: 'purple',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    textColor: 'text-purple-600 dark:text-purple-400',
    borderColor: 'border-purple-500',
    label: 'Feedback Recebido'
  },
  PROGRESSAO_FASE: {
    icon: 'TrendingUp',
    color: 'amber',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    textColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-500',
    label: 'Progressão de Fase'
  },
  NOVO_PROJETO: {
    icon: 'FolderPlus',
    color: 'indigo',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    borderColor: 'border-indigo-500',
    label: 'Novo Projeto'
  },
  PROJETO_PUBLICADO: {
    icon: 'Globe',
    color: 'teal',
    bgColor: 'bg-teal-100 dark:bg-teal-900/30',
    textColor: 'text-teal-600 dark:text-teal-400',
    borderColor: 'border-teal-500',
    label: 'Projeto Publicado'
  },
  CONVITE_EQUIPE: {
    icon: 'UserPlus',
    color: 'pink',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    textColor: 'text-pink-600 dark:text-pink-400',
    borderColor: 'border-pink-500',
    label: 'Convite para Equipe'
  },
  MENCAO: {
    icon: 'AtSign',
    color: 'orange',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    textColor: 'text-orange-600 dark:text-orange-400',
    borderColor: 'border-orange-500',
    label: 'Menção'
  },
  PROJETO_CRIADO: {
    icon: 'FolderPlus',
    color: 'indigo',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    borderColor: 'border-indigo-500',
    label: 'Projeto Criado'
  },
  PROJETO_ATUALIZADO: {
    icon: 'RefreshCw',
    color: 'cyan',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    borderColor: 'border-cyan-500',
    label: 'Projeto Atualizado'
  },
  VINCULO_ADICIONADO: {
    icon: 'UserPlus',
    color: 'emerald',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-500',
    label: 'Adicionado ao Projeto'
  },
  VINCULO_REMOVIDO: {
    icon: 'UserMinus',
    color: 'red',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-600 dark:text-red-400',
    borderColor: 'border-red-500',
    label: 'Removido do Projeto'
  },
  PROJETO_ARQUIVADO: {
    icon: 'Archive',
    color: 'red',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-600 dark:text-red-400',
    borderColor: 'border-red-500',
    label: 'Projeto Desativado'
  },
  SOLICITACAO_DESATIVACAO: {
    icon: 'AlertTriangle',
    color: 'rose',
    bgColor: 'bg-rose-100 dark:bg-rose-900/30',
    textColor: 'text-rose-600 dark:text-rose-400',
    borderColor: 'border-rose-500',
    label: 'Solicitação de Desativação'
  },
  SOLICITACAO_DECISAO: {
    icon: 'Gavel',
    color: 'violet',
    bgColor: 'bg-violet-100 dark:bg-violet-900/30',
    textColor: 'text-violet-600 dark:text-violet-400',
    borderColor: 'border-violet-500',
    label: 'Decisão sobre Solicitação'
  }
} as const

export type NotificationTypeConfig = typeof notificationTypeConfig
