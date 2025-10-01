import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, User, Users, Mail, Lock, LogIn, AlertCircle } from 'lucide-react'
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
      
      // Redirecionamento direto baseado no tipo de usuário
      if (formData.userType === 'professor') {
        navigate('/teacher')
      } else {
        navigate('/app')
      }
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

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as 'aluno' | 'professor'
    setFormData(prev => ({ ...prev, userType: value }))
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Erro geral */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-700 text-sm">{errors.submit}</span>
        </div>
      )}

      {/* Email e Tipo de Conta em grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              placeholder="seu.email@senai.br"
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Tipo de usuário - Seletor moderno com toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Conta
          </label>
          <div className="relative bg-gray-100 rounded-lg p-1 flex">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, userType: 'aluno' }))}
              className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-md transition-all duration-200 ${
                formData.userType === 'aluno' 
                  ? 'bg-white text-blue-600 shadow-sm font-semibold' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className={`h-4 w-4 mr-2 ${formData.userType === 'aluno' ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className="text-sm">Aluno</span>
            </button>
            
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, userType: 'professor' }))}
              className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-md transition-all duration-200 ${
                formData.userType === 'professor' 
                  ? 'bg-white text-green-600 shadow-sm font-semibold' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className={`h-4 w-4 mr-2 ${formData.userType === 'professor' ? 'text-green-600' : 'text-gray-500'}`} />
              <span className="text-sm">Professor</span>
            </button>
          </div>
        </div>
      </div>      {/* Senha */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Senha
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={handleChange}
            className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
            }`}
            placeholder="••••••••"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>

      {/* Botão de submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Entrando...
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4 mr-2" />
            Entrar
          </>
        )}
      </button>      {/* Divisor */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">ou</span>
        </div>
      </div>

      {/* Acesso como visitante */}
      <button
        type="button"
        onClick={handleGuestAccess}
        className="w-full flex justify-center items-center py-3 px-4 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all"
      >
        <svg className="h-5 w-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Continuar como Visitante
      </button>

      {/* Link para registro - DESTAQUE */}
      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-700 mb-2">
          Não tem uma conta?
        </p>
        <Link
          to="/register"
          className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md hover:shadow-lg"
        >
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Criar uma conta gratuita
        </Link>
      </div>

      {/* Modal de Erro */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorType={errorType}        onRetry={() => {
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
