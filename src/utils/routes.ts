/**
 * Utilitários para gerenciamento de rotas baseadas no tipo de usuário
 */

import { isAdminUser } from './admin'

export type UserType = 'ALUNO' | 'DOCENTE' | 'ADMIN';

/**
 * Retorna a rota base para o tipo de usuário
 * @param userType - Tipo do usuário (ALUNO, DOCENTE, ADMIN)
 * @returns Rota base (/aluno ou /docente)
 */
export function getBaseRoute(userType?: string | null): string {
  if (!userType) return '/aluno';

  const tipo = userType.toUpperCase();

  switch (tipo) {
    case 'DOCENTE':
      return '/docente';
    case 'ADMIN':
      return '/admin';
    case 'ALUNO':
    default:
      return '/aluno';
  }
}

/**
 * Gera uma rota completa baseada no tipo de usuário
 * @param userType - Tipo do usuário
 * @param path - Caminho relativo (ex: '/my-projects', '/account')
 * @returns Rota completa  MY_PROJECTS: '/aluno/meus-projetos', '/docente/orientacoes')
 */
export function getUserRoute(userType?: string | null, path: string = ''): string {
  const baseRoute = getBaseRoute(userType);

  // Normaliza o path para não ter barra duplicada
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseRoute}${normalizedPath === '/' ? '' : normalizedPath}`;
}

/**
 * Verifica se o usuário pode acessar uma determinada rota
 * @param userType - Tipo do usuário
 * @param path - Caminho atual
 * @returns true se pode acessar, false se não
 */
export function canAccessRoute(userType?: string | null, path: string = ''): boolean {
  if (!userType) return false;

  const tipo = userType.toUpperCase();

  // Rotas de aluno
  if (path.startsWith('/aluno')) {
    return tipo === 'ALUNO';
  }

  // Rotas de docente
  if (path.startsWith('/docente')) {
    return tipo === 'DOCENTE';
  }

  // Rotas de admin (futuro)
  if (path.startsWith('/admin')) {
    return tipo === 'ADMIN';
  }

  // Rotas públicas
  return true;
}

/**
 * Retorna a rota de redirecionamento correta para quando o usuário
 * tenta acessar uma rota não permitida
 * @param userType - Tipo do usuário
 * @returns Rota para redirecionamento
 */
export function getRedirectRoute(userType?: string | null): string {
  return getBaseRoute(userType);
}

/**
 * Hook helper para usar em componentes - retorna objeto com funções de rota
 * Usar com useAuth() para obter o userType
 */
export function createRouteHelpers(userType?: string | null) {
  return {
    baseRoute: getBaseRoute(userType),
    getRoute: (path: string) => getUserRoute(userType, path),
    canAccess: (path: string) => canAccessRoute(userType, path),
    redirectRoute: getRedirectRoute(userType),
    isAluno: userType?.toUpperCase() === 'ALUNO',
    isDocente: userType?.toUpperCase() === 'DOCENTE',
    isAdmin: userType?.toUpperCase() === 'ADMIN',
  };
}
