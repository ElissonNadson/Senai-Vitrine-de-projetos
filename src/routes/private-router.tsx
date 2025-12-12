import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/auth-context'
import { useGuest } from '../contexts/guest-context'

interface PrivateProps {
  children: React.ReactNode
  requireAuth?: boolean // Por padrão true, pode ser false para permitir visitantes
  allowGuest?: boolean // Por padrão true, se false, bloqueia acesso mesmo se for guest (ex: rotas de admin)
}

const Private: React.FC<PrivateProps> = ({ children, requireAuth = true, allowGuest = true }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const { isGuest } = useGuest()

  // Debug logs
  console.log('🛡️ Private Router Debug:', {
    isAuthenticated,
    isLoading,
    isGuest,
    requireAuth,
    allowGuest,
    currentUrl: window.location.href
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Se requer autenticação e (não está autenticado) e (não é guest OU não permite guest)
  if (requireAuth && !isAuthenticated && (!isGuest || !allowGuest)) {
    console.log('🛡️ Private Router: Redirecting to login - not authenticated and guest not allowed or not active')
    return <Navigate to="/login" replace />
  }

  // Se não está autenticado nem é visitante, mas a rota não requer auth
  if (!requireAuth && !isAuthenticated && !isGuest) {
    return <Navigate to="/" replace />
  }

  // Se não requer autenticação, permite acesso a qualquer um (auth, guest, ou não-auth)
  // Se requer autenticação, só permite se autenticado OU (visitante E permitido)
  return <>{children}</>
}

export default Private
