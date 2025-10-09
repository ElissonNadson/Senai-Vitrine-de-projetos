import React, { useState, useRef } from 'react'
import { Search, Bell, User } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import UserProfileModal from './UserProfileModal'

const ModernHeader: React.FC = () => {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const avatarRef = useRef<HTMLButtonElement>(null)

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-4 md:px-8 py-4 bg-white dark:bg-gray-800 relative">
      {/* Search Bar */}
      <div className="flex items-center gap-4 flex-1">
        <label className="relative hidden sm:block flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full resize-none overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            placeholder="Buscar projetos ou tarefas..."
          />
        </label>
      </div>

      {/* Right Side - Notifications and Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications Button */}
        <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
          <Bell className="h-5 w-5" />
          {/* Notification Badge */}
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Avatar */}
        <button
          ref={avatarRef}
          onClick={() => setIsProfileModalOpen(!isProfileModalOpen)}
          className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm hover:shadow-lg transition-shadow cursor-pointer"
        >
          {user?.nome ? user.nome.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
        </button>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        anchorRef={avatarRef}
      />
    </header>
  )
}

export default ModernHeader
