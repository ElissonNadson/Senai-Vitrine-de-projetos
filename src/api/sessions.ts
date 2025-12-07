import axiosInstance from '../services/axios-instance';

export interface Session {
  uuid: string;
  navegador: string;
  sistema_operacional: string;
  dispositivo: string;
  localizacao: string;
  ip_mascarado: string;
  criado_em: string;
  ultimo_acesso: string;
  is_current: boolean;
}

export interface SessionsResponse {
  sessoes: Session[];
  total: number;
}

/**
 * Busca todas as sessões ativas do usuário
 */
export async function getSessions(): Promise<SessionsResponse> {
  const response = await axiosInstance.get<SessionsResponse>('/auth/sessions');
  return response.data;
}

/**
 * Encerra uma sessão específica
 */
export async function revokeSession(sessionId: string): Promise<void> {
  await axiosInstance.delete(`/auth/sessions/${sessionId}`);
}

/**
 * Encerra todas as outras sessões (exceto a atual)
 */
export async function revokeOtherSessions(): Promise<{ count: number }> {
  const response = await axiosInstance.delete<{ count: number }>('/auth/sessions/others');
  return response.data;
}

/**
 * Retorna ícone do dispositivo baseado no tipo
 */
export function getDeviceIcon(dispositivo: string): 'desktop' | 'mobile' | 'tablet' {
  const lower = dispositivo.toLowerCase();
  if (lower.includes('mobile') || lower.includes('phone')) return 'mobile';
  if (lower.includes('tablet') || lower.includes('ipad')) return 'tablet';
  return 'desktop';
}

/**
 * Retorna ícone do navegador baseado no nome
 */
export function getBrowserIcon(navegador: string): 'chrome' | 'firefox' | 'safari' | 'edge' | 'other' {
  const lower = navegador.toLowerCase();
  if (lower.includes('chrome')) return 'chrome';
  if (lower.includes('firefox')) return 'firefox';
  if (lower.includes('safari')) return 'safari';
  if (lower.includes('edge')) return 'edge';
  return 'other';
}

/**
 * Formata a data de último acesso de forma amigável
 */
export function formatLastAccess(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ativo agora';
  if (diffMins < 60) return `Ativo há ${diffMins} min`;
  if (diffHours < 24) return `Ativo há ${diffHours}h`;
  if (diffDays === 1) return 'Ativo ontem';
  if (diffDays < 7) return `Ativo há ${diffDays} dias`;
  
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}
