import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home,
  FolderOpen,
  Settings,
  Database
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
}

const ModernSidebar: React.FC = () => {
  const location = useLocation()

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/app',
      icon: <Home className="h-5 w-5" />
    },
    {
      name: 'Meus Projetos',
      href: '/app/my-projects',
      icon: <FolderOpen className="h-5 w-5" />
    },
    {
      name: 'Configurações',
      href: '/app/account',
      icon: <Settings className="h-5 w-5" />
    }
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-4 text-gray-900 dark:text-white">
        <Database className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-xl font-bold">Gerenciador</h2>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => {
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default ModernSidebar
