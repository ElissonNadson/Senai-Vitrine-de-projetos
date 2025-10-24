import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useRegisterAuth } from '@/hooks/use-auth'
import RegistroSucessoModal from '@/components/modals/registro-sucesso-modal'
import ErrorModal from '@/components/modals/error-modal'

interface FormData {
  nome: string
  email: string
  password: string
  confirmPassword: string
  termsAccepted: boolean
}

const RegisterForm = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  
  // Estados para modais
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorType, setErrorType] = useState<'email_already_exists' | 'terms_required' | 'weak_password' | 'network_error' | 'server_error' | 'generic'>('generic')
  
  // Estados para o modal de sucesso
  const [registeredUserData, setRegisteredUserData] = useState<{
    nome: string
    tipo: 'PROFESSOR' | 'ALUNO'
  } | null>(null)
  // Validação de domínio removida - aceita qualquer email válido

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validação do nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres'
    }

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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }

    // Validação da confirmação de senha
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem'
    }

    // Validação dos termos
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'Você deve aceitar os termos de uso'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const registerMutation = useRegisterAuth({
    onSuccess: (data: any) => {
      console.log('Registro bem-sucedido:', data)
      setIsLoading(false)
      
      // Preparar dados do usuário registrado
      setRegisteredUserData({
        nome: formData.nome,
        tipo: 'ALUNO'
      })
      
      // Mostrar modal de sucesso
      setShowSuccessModal(true)
    },    onError: (error: any) => {
      console.error('Erro no registro:', error)
      setIsLoading(false)
      
      // Determinar tipo de erro baseado na resposta
      let errorTypeToShow: typeof errorType = 'generic'
      
      if (error?.response?.status === 409) {
        errorTypeToShow = 'email_already_exists'
      } else if (error?.response?.status === 400) {
        const errorMessage = error?.response?.data?.message?.toLowerCase() || ''
        
        if (errorMessage.includes('termos') || errorMessage.includes('aceite')) {
          errorTypeToShow = 'terms_required'
        } else if (errorMessage.includes('senha') || errorMessage.includes('password')) {
          errorTypeToShow = 'weak_password'
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
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
    
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
      // Preparar dados para a API conforme a interface RegisterMutation
      const registerData = {
        login: formData.email,
        senha: formData.password,
        nome: formData.nome,
        tipo: 'ALUNO' as 'PROFESSOR' | 'ALUNO',
        aceiteTermos: formData.termsAccepted // Incluir o aceite de termos
      }

      registerMutation.mutate(registerData)
    } catch (error) {
      console.error('Erro no registro:', error)
      setErrors({ submit: 'Erro ao criar conta. Tente novamente.' })
      setIsLoading(false)
    }
  }
    const handleGoogleRegister = () => {
    // URL corrigida com validação e parâmetros adequados
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    const redirectUri = window.location.origin + '/login/oauth2/code/google'
    
    // Salvar intent de registro para identificar o fluxo
    sessionStorage.setItem('google_intent', 'register')
    sessionStorage.setItem('google_redirect_uri', redirectUri)
    
    // URL corrigida e padronizada
    const googleAuthUrl = `${baseUrl}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(redirectUri)}&registration=true`
    
    console.log('🔗 Google Register - URL completa:', googleAuthUrl)
    console.log('📍 Redirect URI:', redirectUri)
    console.log('🌐 Base URL:', baseUrl)
    
    // Validar URL antes de redirecionar
    try {
      new URL(googleAuthUrl) // Validar se é uma URL válida
      window.location.href = googleAuthUrl
    } catch (error) {
      console.error('❌ URL do Google OAuth inválida:', error)
      alert('Erro na configuração do Google OAuth. Verifique a configuração do servidor.')
    }
  }

  // Funções para o modal de sucesso
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
  }
  const handleRedirectToDashboard = () => {
    setShowSuccessModal(false)
    
    // Redirecionamento baseado no tipo de usuário
    if (registeredUserData?.tipo === 'PROFESSOR') {
      navigate('/teacher')
    } else {
      navigate('/app')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nome Completo - Full Width */}
      <div className="grid grid-cols-1 gap-4">
        <div className="form-group">
          <label htmlFor="nome" className="block text-base font-semibold text-gray-700 mb-2">
            Nome Completo
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            value={formData.nome}
            onChange={handleChange}
            className={`w-full px-5 py-4 text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.nome ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
            }`}
            placeholder="Digite seu nome completo"
          />
          {errors.nome && <p className="mt-1.5 text-base text-red-600">{errors.nome}</p>}
        </div>
      </div>

      {/* Email */}
      <div className="grid grid-cols-1 gap-4">
        <div className="form-group">
          <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-2">
            E-mail
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
            placeholder="seu@email.com"
          />
          {errors.email && <p className="mt-1.5 text-base text-red-600">{errors.email}</p>}
        </div>
      </div>

      {/* Senha e Confirmar Senha em grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Senha */}
        <div className="form-group">
          <label htmlFor="password" className="block text-base font-semibold text-gray-700 mb-2">
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
              placeholder="••••••••"
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

        {/* Confirmar senha */}
        <div className="form-group">
          <label htmlFor="confirmPassword" className="block text-base font-semibold text-gray-700 mb-2">
            Confirmar Senha
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-5 py-4 pr-14 text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-5 flex items-center hover:opacity-70 transition-opacity"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-6 w-6 text-gray-400" />
              ) : (
                <Eye className="h-6 w-6 text-gray-400" />
              )}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1.5 text-base text-red-600">{errors.confirmPassword}</p>}
        </div>
      </div>

      {/* Termos de uso */}
      <div className="pt-2">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            className={`mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
              errors.termsAccepted ? 'border-red-300' : ''
            }`}
          />
          <span className="text-base text-gray-700 leading-relaxed">
            Eu aceito os{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Termos de Uso
            </a>{' '}
            e a{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Política de Privacidade
            </a>
          </span>
        </label>
        {errors.termsAccepted && <p className="mt-1.5 text-base text-red-600">{errors.termsAccepted}</p>}
      </div>

      {/* Botões - Centralizado */}
      <div className="flex justify-center pt-5">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto min-w-[240px] py-4 px-10 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
              Cadastrando...
            </span>
          ) : (
            <>
              <UserPlus className="h-6 w-6 mr-2 inline-block" />
              Cadastrar
            </>
          )}
        </button>
      </div>
        {/* Modal de Sucesso */}
      {showSuccessModal && registeredUserData && (
        <RegistroSucessoModal
          isOpen={showSuccessModal}
          onClose={handleCloseSuccessModal}
          userType={registeredUserData.tipo}
          userName={registeredUserData.nome}
          onRedirect={handleRedirectToDashboard}
        />
      )}

      {/* Modal de Erro */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorType={errorType}
        onRetry={() => {
          setShowErrorModal(false)
          // Opcional: retentar o registro com os mesmos dados
        }}
        showRetryButton={true}
      />
    </form>
  )
}

export default RegisterForm
