import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Smartphone, 
  Monitor, 
  Tablet, 
  MapPin,
  Clock,
  LogOut,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react'
import { useSessions } from '../../../../hooks/use-sessions'
import { formatLastAccess, getDeviceIcon } from '../../../../api/sessions'

const SecurityTab: React.FC = () => {
  const {
    sessions,
    total,
    loading,
    error,
    refreshSessions,
    endSession,
    endOtherSessions,
    endingSession,
    endingOthers,
    successMessage,
  } = useSessions()

  // Ícone do dispositivo
  const DeviceIcon = ({ tipo }: { tipo: string }) => {
    const deviceType = getDeviceIcon(tipo)
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="h-5 w-5" />
      case 'tablet':
        return <Tablet className="h-5 w-5" />
      default:
        return <Monitor className="h-5 w-5" />
    }
  }

  // Conta sessões que não são a atual
  const otherSessionsCount = sessions.filter(s => !s.is_current).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Informação sobre autenticação Google */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Autenticação via Google
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              Sua conta está conectada ao Google. A segurança da senha e autenticação de dois fatores 
              é gerenciada pela sua conta Google. Para alterar essas configurações, acesse{' '}
              <a 
                href="https://myaccount.google.com/security" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-blue-900 dark:hover:text-blue-300"
              >
                myaccount.google.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sessões Ativas
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {loading ? 'Carregando...' : `${total} dispositivo(s) conectado(s)`}
              </p>
            </div>
          </div>
          <button
            onClick={refreshSessions}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            title="Atualizar sessões"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                <button
                  onClick={refreshSessions}
                  className="mt-2 text-sm text-red-600 dark:text-red-400 underline hover:no-underline"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
          >
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-sm text-green-700 dark:text-green-400">{successMessage}</p>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && sessions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Carregando sessões...</p>
          </div>
        )}

        {/* Sessions List */}
        {!loading && sessions.length === 0 && !error && (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Nenhuma sessão encontrada</p>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {sessions.map((session, index) => (
              <motion.div
                key={session.uuid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                  session.is_current
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    session.is_current
                      ? 'bg-green-100 dark:bg-green-800/50'
                      : 'bg-gray-100 dark:bg-gray-600'
                  }`}>
                    <DeviceIcon tipo={session.dispositivo} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {session.sistema_operacional} • {session.navegador}
                      </p>
                      {session.is_current && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                          <CheckCircle2 className="h-3 w-3" />
                          Esta sessão
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {session.ip_mascarado}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatLastAccess(session.ultimo_acesso)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* End Session Button */}
                {!session.is_current && (
                  <button
                    onClick={() => endSession(session.uuid)}
                    disabled={endingSession === session.uuid}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                    title="Encerrar sessão"
                  >
                    {endingSession === session.uuid ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">Encerrar</span>
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {/* End All Other Sessions Button */}
        {otherSessionsCount > 0 && (
          <button
            onClick={endOtherSessions}
            disabled={endingOthers || loading}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {endingOthers ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Encerrando sessões...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Encerrar Todas as Outras Sessões ({otherSessionsCount})
              </>
            )}
          </button>
        )}
      </div>

      {/* Security Tips */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Dicas de Segurança
        </h4>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Encerre sessões em dispositivos que você não reconhece ou não usa mais</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Evite fazer login em computadores públicos ou compartilhados</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Ative a verificação em duas etapas na sua conta Google</span>
          </li>
        </ul>
      </div>
    </motion.div>
  )
}

export default SecurityTab
