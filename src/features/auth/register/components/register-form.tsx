import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const RegisterForm = () => {
  const navigate = useNavigate()
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)

  const handleGoogleRegister = () => {
    setIsLoadingGoogle(true)
    // URL corrigida com validação e parâmetros adequados
    const baseUrl = import.meta.env.VITE_API_URL || '/api'
    const redirectUri = window.location.origin + '/auth/google/callback'

    // Salvar intent de registro para identificar o fluxo
    sessionStorage.setItem('google_intent', 'register')
    sessionStorage.setItem('google_redirect_uri', redirectUri)

    // URL corrigida e padronizada
    const googleAuthUrl = `${baseUrl}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}&registration=true`

    console.log('🔗 Google Register - URL completa:', googleAuthUrl)

    // Validar URL antes de redirecionar
    try {
      new URL(googleAuthUrl) // Validar se é uma URL válida
      window.location.href = googleAuthUrl
    } catch (error) {
      console.error('❌ URL do Google OAuth inválida:', error)
      setIsLoadingGoogle(false)
      alert('Erro na configuração do Google OAuth. Verifique a configuração do servidor.')
    }
  }

  const handleGuestAccess = () => {
    console.log('🎯 handleGuestAccess - Iniciando modo visitante')

    // Definir isGuest no localStorage ANTES de navegar
    localStorage.setItem('isGuest', 'true')

    // Aguardar um pouco para garantir que o localStorage seja processado
    setTimeout(() => {
      window.location.href = '/explorar-vitrine'
    }, 100)
  }

  return (
    <div className="space-y-6">
      {/* Botão de Cadastro com Google - Principal */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-6 shadow-sm">
        <div className="text-center mb-4">
          <p className="text-lg font-semibold text-gray-800 mb-1">
            Crie sua conta com Google
          </p>
          <p className="text-sm text-gray-600">
            Cadastro rápido e seguro usando sua conta Google
          </p>
        </div>
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={isLoadingGoogle}
          className="w-full flex justify-center items-center py-4 px-5 bg-white border-2 border-orange-300 rounded-md text-base font-semibold text-gray-700 hover:bg-orange-50 hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoadingGoogle ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600 mr-3"></div>
              Redirecionando...
            </span>
          ) : (
            <>
              <svg className="h-6 w-6 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Cadastrar com Google
            </>
          )}
        </button>
      </div>

      {/* Divisor */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-base">
          <span className="px-4 bg-white text-gray-500 font-medium">ou</span>
        </div>
      </div>

      {/* Acesso como visitante */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
        <div className="text-center mb-4">
          <p className="text-lg font-semibold text-gray-800 mb-1">
            Apenas explorando?
          </p>
          <p className="text-sm text-gray-600">
            Veja todos os projetos sem precisar de conta
          </p>
        </div>
        <button
          type="button"
          onClick={handleGuestAccess}
          className="w-full flex justify-center items-center py-4 px-5 bg-white border-2 border-blue-300 rounded-md text-base font-semibold text-blue-700 hover:bg-blue-50 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm hover:shadow-md"
        >
          <svg className="h-6 w-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Ver como Visitante
        </button>
      </div>

      {/* Link para login */}
      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">
          Já tem uma conta?{' '}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Faça login aqui
          </Link>
        </p>
        <p className="text-xs text-gray-500">
          Ao continuar com Google, você concorda com nossos{' '}
          <a href="#" className="text-blue-600 hover:underline">Termos de Uso</a>
          {' '}e{' '}
          <a href="#" className="text-blue-600 hover:underline">Política de Privacidade</a>
        </p>
      </div>
    </div>
  )
}

export default RegisterForm
