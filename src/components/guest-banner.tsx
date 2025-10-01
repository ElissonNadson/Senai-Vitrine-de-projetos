import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, UserPlus, LogIn, ArrowLeft } from 'lucide-react'
import { useGuest } from '../contexts/guest-context'

const GuestBanner = () => {
  const { isGuest, setIsGuest } = useGuest()
  const navigate = useNavigate()

  if (!isGuest) return null

  const handleBackToLogin = () => {
    setIsGuest(false)
    localStorage.removeItem('isGuest')
    navigate('/login')
  }

  return (
    <div className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">
                Você está navegando como <strong>Visitante</strong>
              </p>
              <p className="text-xs text-white/80">
                Algumas funcionalidades estão limitadas. Faça login para acesso completo.
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBackToLogin}
              className="inline-flex items-center space-x-1.5 px-4 py-2 border border-white/30 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 transition-all transform hover:scale-105"
              title="Voltar para login"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </button>
            
            <Link
              to="/login"
              className="inline-flex items-center space-x-1.5 px-4 py-2 border border-white/30 rounded-lg text-sm font-medium bg-transparent text-white hover:bg-white/10 transition-all transform hover:scale-105"
            >
              <LogIn className="h-4 w-4" />
              <span>Fazer Login</span>
            </Link>
            
            <Link
              to="/login"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-white text-blue-600 hover:bg-blue-50 transition-all transform hover:scale-105 shadow-sm"
            >
              <UserPlus className="h-4 w-4" />
              <span>Criar Conta</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuestBanner
