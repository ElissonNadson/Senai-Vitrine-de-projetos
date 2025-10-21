import React from 'react'
import { AlertTriangle, X, RefreshCw, Mail, Lock, Eye, EyeOff, WifiOff, Server } from 'lucide-react'

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  errorType: 'invalid_credentials' | 'email_not_found' | 'wrong_password' | 'account_locked' | 'network_error' | 'server_error' | 'email_already_exists' | 'terms_required' | 'weak_password' | 'generic'
  onRetry?: () => void
  showRetryButton?: boolean
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  errorType,
  onRetry,
  showRetryButton = true
}) => {
  if (!isOpen) return null

  const getErrorInfo = () => {
    switch (errorType) {
      case 'invalid_credentials':
        return {
          title: 'Credenciais Inválidas',
          message: 'Email ou senha incorretos. Verifique seus dados e tente novamente.',
          icon: <Lock className="h-12 w-12" />,
          color: 'red',
          suggestions: [
            'Verifique se o email está correto',
            'Certifique-se de que a senha está correta',
            'Verifique se o Caps Lock está desativado'
          ]
        }
      case 'email_not_found':
        return {
          title: 'Email Não Encontrado',
          message: 'Este email não está registrado em nosso sistema.',
          icon: <Mail className="h-12 w-12" />,
          color: 'orange',
          suggestions: [
            'Verifique se digitou o email corretamente',
            'Tente com outro endereço de email',
            'Registre-se se ainda não tem uma conta'
          ]
        }
      case 'wrong_password':
        return {
          title: 'Senha Incorreta',
          message: 'A senha informada está incorreta.',
          icon: <EyeOff className="h-12 w-12" />,
          color: 'red',
          suggestions: [
            'Verifique se a senha está correta',
            'Certifique-se de que o Caps Lock está desativado',
            'Use a opção "Esqueci minha senha" se necessário'
          ]
        }
      case 'account_locked':
        return {
          title: 'Conta Bloqueada',
          message: 'Sua conta foi temporariamente bloqueada devido a muitas tentativas de login.',
          icon: <Lock className="h-12 w-12" />,
          color: 'red',
          suggestions: [
            'Aguarde alguns minutos antes de tentar novamente',
            'Entre em contato com o suporte se o problema persistir',
            'Verifique seu email para instruções de desbloqueio'
          ]
        }
      case 'network_error':
        return {
          title: 'Erro de Conexão',          message: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
          icon: <WifiOff className="h-12 w-12" />,
          color: 'blue',
          suggestions: [
            'Verifique sua conexão com a internet',
            'Tente novamente em alguns momentos',
            'Reinicie seu roteador se necessário'
          ]
        }
      case 'server_error':
        return {
          title: 'Erro do Servidor',
          message: 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.',
          icon: <Server className="h-12 w-12" />,
          color: 'purple',
          suggestions: [
            'Tente novamente em alguns minutos',
            'Se o problema persistir, entre em contato com o suporte',
            'Verifique se não há manutenção programada'
          ]
        }
      case 'email_already_exists':
        return {
          title: 'Email Já Cadastrado',
          message: 'Este email já está registrado em nosso sistema.',
          icon: <Mail className="h-12 w-12" />,
          color: 'orange',
          suggestions: [
            'Faça login se já tem uma conta',
            'Use outro endereço de email para criar uma nova conta',
            'Use a opção "Esqueci minha senha" se necessário'
          ]
        }
      case 'terms_required':
        return {
          title: 'Aceite dos Termos Obrigatório',
          message: 'É obrigatório aceitar os termos de uso para se cadastrar.',
          icon: <AlertTriangle className="h-12 w-12" />,
          color: 'yellow',
          suggestions: [
            'Marque a caixa de aceite dos termos de uso',
            'Leia os termos de uso antes de aceitar',
            'Entre em contato se tiver dúvidas sobre os termos'
          ]
        }
      case 'weak_password':
        return {
          title: 'Senha Muito Fraca',
          message: 'A senha deve ter pelo menos 6 caracteres e ser mais segura.',
          icon: <Lock className="h-12 w-12" />,
          color: 'yellow',
          suggestions: [
            'Use pelo menos 6 caracteres',
            'Combine letras, números e símbolos',
            'Evite senhas muito simples como "123456"'
          ]
        }
      default:
        return {
          title: 'Erro Inesperado',
          message: 'Ocorreu um erro inesperado. Tente novamente.',
          icon: <AlertTriangle className="h-12 w-12" />,
          color: 'red',
          suggestions: [
            'Tente novamente',
            'Atualize a página se necessário',
            'Entre em contato com o suporte se o problema persistir'
          ]
        }
    }
  }

  const errorInfo = getErrorInfo()

  const colorClasses = {
    red: {
      bg: 'bg-red-50',
      iconBg: 'bg-gradient-to-br from-red-400 to-red-600',
      text: 'text-red-600',
      border: 'border-red-200'
    },
    orange: {
      bg: 'bg-orange-50',
      iconBg: 'bg-gradient-to-br from-orange-400 to-orange-600',
      text: 'text-orange-600',
      border: 'border-orange-200'
    },
    yellow: {
      bg: 'bg-yellow-50',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      text: 'text-yellow-600',
      border: 'border-yellow-200'
    },
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-gradient-to-br from-blue-400 to-blue-600',
      text: 'text-blue-600',
      border: 'border-blue-200'
    },
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-gradient-to-br from-purple-400 to-purple-600',
      text: 'text-purple-600',
      border: 'border-purple-200'
    }
  }

  const colors = colorClasses[errorInfo.color as keyof typeof colorClasses]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header com ícone */}
          <div className={`${colors.bg} px-6 pt-8 pb-6 text-center border-b ${colors.border}`}>
            <div className={`mx-auto w-20 h-20 rounded-full ${colors.iconBg} flex items-center justify-center text-white shadow-lg mb-4`}>
              {errorInfo.icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {errorInfo.title}
            </h3>
            <p className="text-base text-gray-600">
              {errorInfo.message}
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Sugestões */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center mb-3">
                <div className="bg-yellow-400 rounded-full p-1.5 mr-2">
                  <span className="text-base">💡</span>
                </div>
                <h4 className="text-base font-semibold text-gray-800">
                  Sugestões:
                </h4>
              </div>
              <ul className="space-y-2.5">
                {errorInfo.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start text-base text-gray-700">
                    <span className={`${colors.text} mr-3 font-bold mt-0.5`}>•</span>
                    <span className="leading-relaxed">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer com botões */}
          <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center items-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 transition-all"
            >
              Fechar
            </button>
            {showRetryButton && onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex justify-center items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 transition-all hover:shadow-md"
              >
                <RefreshCw className="h-5 w-5" />
                Tentar Novamente
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorModal
