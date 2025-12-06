import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/auth-context'
import { getBaseRoute } from '../utils/routes'

interface AuthGuardProps {
  children: React.ReactNode
  redirectIfAuthenticated?: boolean // Para páginas de login/register
  redirectTo?: string // Para onde redirecionar usuários autenticados
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  redirectIfAuthenticated = false,
  redirectTo
}) => {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Se a página deve redirecionar usuários autenticados (ex: login, register)
  if (redirectIfAuthenticated && isAuthenticated && user) {
    // Redirecionar baseado no tipo de usuário usando a função helper
    const userRedirectTo = redirectTo || getBaseRoute(user.tipo)
    return <Navigate to={userRedirectTo} replace />
  }

  return <>{children}</>
}

export default AuthGuard
