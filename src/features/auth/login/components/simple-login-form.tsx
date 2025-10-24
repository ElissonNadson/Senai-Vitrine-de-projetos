import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useLoginAuth } from '@/hooks/use-auth'
import ErrorModal from '@/components/modals/error-modal'

interface FormData {
  email: string
  password: string
  userType: 'aluno' | 'professor'
}

const LoginForm = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    userType: 'aluno'  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorType, setErrorType] = useState<'invalid_credentials' | 'email_not_found' | 'wrong_password' | 'account_locked' | 'network_error' | 'server_error' | 'generic'>('generic')
  
  // Validação de domínio removida - aceita qualquer email válido

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validação do email
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'    } else if (false) { // Validação de domínio removida
      // newErrors.email = 'Este domínio de e-mail não é permitido'
    }

    // Validação da senha
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    }    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const loginMutation = useLoginAuth({
    onSuccess: (data: any) => {
      console.log('Login bem-sucedido:', data)
      login(data)
      
      // Redirecionamento sempre para /app (aluno)
      navigate('/app')
    },
    onError: (error: any) => {
      console.error('Erro no login:', error)
      setIsLoading(false)
      
      // Determinar tipo de erro baseado na resposta
      let errorTypeToShow: typeof errorType = 'generic'
      
      if (error?.response?.status === 401) {
        const errorMessage = error?.response?.data?.message?.toLowerCase() || ''
          if (errorMessage.includes('email') || errorMessage.includes('usuário')) {
          errorTypeToShow = 'email_not_found'
        } else if (errorMessage.includes('senha') || errorMessage.includes('password')) {
          errorTypeToShow = 'wrong_password'
        } else if (errorMessage.includes('bloqueada') || errorMessage.includes('locked') || errorMessage.includes('inativa')) {
          errorTypeToShow = 'account_locked'
        } else {
          errorTypeToShow = 'invalid_credentials'
        }
      } else if (error?.response?.status >= 500) {
        errorTypeToShow = 'server_error'
      } else if (!error?.response) {
        errorTypeToShow = 'network_error'
      }
      
      setErrorType(errorTypeToShow)
      setShowErrorModal(true)
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpar erro específico do campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setErrors({})

    try {
      // Preparar dados para a API conforme a interface LoginMutation
      const loginData = {
        login: formData.email,
        senha: formData.password
      }

      loginMutation.mutate(loginData)
    } catch (error) {
      console.error('Erro no login:', error)
      setErrors({ submit: 'Erro ao fazer login. Tente novamente.' })
      setIsLoading(false)
    }
  }
  const handleGoogleLogin = () => {
    // Armazenar a URL de retorno
    const returnUrl = window.location.origin + '/login/oauth2/code/google'
    sessionStorage.setItem('google_login_return_url', returnUrl)
    
    const googleAuthUrl = `${import.meta.env.VITE_API_URL}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(returnUrl)}`
    window.location.href = googleAuthUrl
  }

  const handleGuestAccess = () => {
    console.log('🎯 handleGuestAccess - Iniciando modo visitante')
    
    // Definir isGuest no localStorage ANTES de navegar
    localStorage.setItem('isGuest', 'true')
    console.log('🎯 handleGuestAccess - localStorage definido:', localStorage.getItem('isGuest'))
    
    // Aguardar um pouco para garantir que o localStorage seja processado
    setTimeout(() => {
      console.log('🎯 handleGuestAccess - Navegando para /app?guest=true via window.location')
      window.location.href = '/app?guest=true'
    }, 100) // 100ms de delay
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Erro geral */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-2">
          <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
          <span className="text-red-700 text-base">{errors.submit}</span>
        </div>
      )}

      {/* Email */}
      <div className="form-group">
        <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-5 py-4 text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
          }`}
          placeholder="Digite seu email"
          autoComplete="username"
        />
        {errors.email && <p className="mt-1.5 text-base text-red-600">{errors.email}</p>}
      </div>

      {/* Senha */}
      <div className="form-group">
        <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-2">
          Senha
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-5 py-4 pr-14 text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
            }`}
            placeholder="Digite sua senha"
            autoComplete="current-password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-5 flex items-center hover:opacity-70 transition-opacity"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-6 w-6 text-gray-400" />
            ) : (
              <Eye className="h-6 w-6 text-gray-400" />
            )}
          </button>
        </div>
        {errors.password && <p className="mt-1.5 text-base text-red-600">{errors.password}</p>}
      </div>

      {/* Botão de submit - Estilo Anhanguera */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-5 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
            Carregando...
          </span>
        ) : (
          'Avançar'
        )}
      </button>

      {/* Divisor */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-base">
          <span className="px-4 bg-white text-gray-500 font-medium">ou</span>
        </div>
      </div>

      {/* Acesso como visitante - DESTACADO */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-5">
        <div className="text-center mb-3">
          <p className="text-base font-semibold text-gray-800 mb-1">
            Não tem uma conta?
          </p>
          <p className="text-sm text-gray-600">
            Explore a vitrine de projetos sem precisar se cadastrar
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

      {/* Divisor "ou" */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-base">
          <span className="px-4 bg-white text-gray-500 font-medium">ou</span>
        </div>
      </div>

      {/* Link para registro */}
      <div className="text-center">
        <p className="text-base text-gray-600 mb-3">
          Quer criar projetos e participar?
        </p>
        <Link
          to="/register"
          className="inline-flex items-center justify-center px-7 py-3 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all shadow-sm hover:shadow-md text-base"
        >
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Criar conta gratuita
        </Link>
      </div>

      {/* Modal de Erro */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorType={errorType}
        onRetry={() => {
          setShowErrorModal(false)
          // Refocus no primeiro campo com erro
          if (errors.email) {
            (document.querySelector('input[name="email"]') as HTMLInputElement)?.focus()
          } else if (errors.password) {
            (document.querySelector('input[name="password"]') as HTMLInputElement)?.focus()
          }
        }}
      />
    </form>
  )
}

export default LoginForm
