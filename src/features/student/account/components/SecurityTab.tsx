import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, Shield, Smartphone, Key, AlertTriangle } from 'lucide-react'

const SecurityTab: React.FC = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleChangePassword = () => {
    // TODO: Implementar mudança de senha
    console.log('Mudando senha...')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Change Password */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
            <Lock className="h-5 w-5 text-primary-dark dark:text-primary-light" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Alterar Senha
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mantenha sua conta segura com uma senha forte
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Senha Atual
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Digite sua senha atual"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nova Senha
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Digite sua nova senha"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {/* Password Strength Indicator */}
            {passwordData.newPassword && (
              <div className="mt-2">
                <div className="flex gap-1">
                  <div className={`h-1 flex-1 rounded ${passwordData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className={`h-1 flex-1 rounded ${passwordData.newPassword.length >= 10 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className={`h-1 flex-1 rounded ${/[A-Z]/.test(passwordData.newPassword) && /[0-9]/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Mínimo 8 caracteres, incluindo letras maiúsculas e números
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirmar Nova Senha
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Confirme sua nova senha"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                As senhas não coincidem
              </p>
            )}
          </div>

          <button
            onClick={handleChangePassword}
            className="w-full px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            Alterar Senha
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Autenticação de Dois Fatores
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Adicione uma camada extra de segurança à sua conta
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform translate-x-1" />
            </button>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Recurso em Desenvolvimento
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                A autenticação de dois fatores estará disponível em breve.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
            <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sessões Ativas
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gerencie onde você está conectado
            </p>
          </div>
        </div>

        {/* Development Alert */}
        <div className="mb-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Recurso em Desenvolvimento
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                O gerenciamento de sessões ativas será implementado em breve. 
                Esta funcionalidade permitirá visualizar e encerrar suas sessões em outros dispositivos.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {/* Current Session */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <Key className="h-5 w-5 text-primary-dark dark:text-primary-light" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Windows • Chrome
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  São Paulo, Brasil • Ativo agora
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
              Esta sessão
            </span>
          </div>
        </div>

        <button className="mt-4 w-full px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors">
          Encerrar Todas as Outras Sessões
        </button>
      </div>
    </motion.div>
  )
}

export default SecurityTab
