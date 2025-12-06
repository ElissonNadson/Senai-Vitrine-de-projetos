import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/auth-context'
import { getBaseRoute, canAccessRoute } from '../utils/routes'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: ('ALUNO' | 'PROFESSOR' | 'ADMIN')[]
}

/**
 * Guard que protege rotas baseado no tipo de usuário
 * Redireciona silenciosamente para a rota correta se o usuário não tem permissão
 */
const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  // Se não está autenticado, redireciona para login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Verifica se o tipo do usuário está na lista de permitidos
  const userType = user.tipo?.toUpperCase() as 'ALUNO' | 'PROFESSOR' | 'ADMIN'
  const isAllowed = allowedRoles.includes(userType)

  if (!isAllowed) {
    // Redireciona silenciosamente para a rota correta do usuário
    const correctRoute = getBaseRoute(userType)
    return <Navigate to={correctRoute} replace />
  }

  return <>{children}</>
}

export default RoleGuard
