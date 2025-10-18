import React, { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Settings, LogOut, Bell, Shield, Palette, HelpCircle } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
  anchorRef?: React.RefObject<HTMLElement>
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, anchorRef }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const modalRef = useRef<HTMLDivElement>(null)

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        anchorRef?.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose, anchorRef])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute right-4 top-16 z-50 w-80 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl"
        >
          {/* User Info Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary dark:bg-primary-light flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.nome || 'Usuário'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || 'usuario@email.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              to="/app/account"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <User className="h-4 w-4" />
              <span>Ver Perfil</span>
            </Link>

            <Link
              to="/app/account?tab=settings"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Configurações</span>
            </Link>

            <Link
              to="/app/account?tab=notifications"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span>Notificações</span>
            </Link>

            <Link
              to="/app/account?tab=security"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Shield className="h-4 w-4" />
              <span>Segurança</span>
            </Link>

            <Link
              to="/app/account?tab=appearance"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Palette className="h-4 w-4" />
              <span>Aparência</span>
            </Link>

            <Link
              to="/app/help"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Ajuda</span>
            </Link>
          </div>

          {/* Logout Button */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-2">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default UserProfileModal
