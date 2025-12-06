import React, { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Bell,
  HelpCircle,
  BookOpen
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { getBaseRoute } from '@/utils/routes'
import senaiLogo from '@/assets/images/Imagens/022-Senai.png'
import senaiLogoS from '@/assets/images/Imagens/S do senai.png'

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  badge?: number
}

const AnimatedSidebar: React.FC = () => {
  const location = useLocation()
  const { user } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  
  // Obter rota base baseada no tipo de usuário
  const baseRoute = useMemo(() => getBaseRoute(user?.tipo), [user?.tipo])
  const isProfessor = user?.tipo?.toUpperCase() === 'PROFESSOR'

  // Carregar preferência salva
  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed')
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved))
    }
  }, [])

  // Salvar preferência
  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState))
  }

  // Menu dinâmico baseado no tipo de usuário
  const navItems: NavItem[] = useMemo(() => {
    if (isProfessor) {
      return [
        {
          name: 'Dashboard',
          href: baseRoute,
          icon: Home,
        },
        {
          name: 'Orientações',
          href: `${baseRoute}/orientacoes`,
          icon: BookOpen,
        },
        {
          name: 'Notificações',
          href: `${baseRoute}/student-notifications`,
          icon: Bell,
        },
        {
          name: 'Configurações',
          href: `${baseRoute}/account`,
          icon: Settings,
        },
        {
          name: 'Ajuda',
          href: `${baseRoute}/help`,
          icon: HelpCircle,
        }
      ]
    }
    
    // Menu para aluno
    return [
      {
        name: 'Dashboard',
        href: baseRoute,
        icon: Home,
      },
      {
        name: 'Meus Projetos',
        href: `${baseRoute}/my-projects`,
        icon: FolderOpen,
      },
      {
        name: 'Notificações',
        href: `${baseRoute}/student-notifications`,
        icon: Bell,
      },
      {
        name: 'Configurações',
        href: `${baseRoute}/account`,
        icon: Settings,
      },
      {
        name: 'Ajuda',
        href: `${baseRoute}/help`,
        icon: HelpCircle,
      }
    ]
  }, [baseRoute, isProfessor])

  const isActive = (path: string) => {
    if (path === baseRoute) {
      return location.pathname === baseRoute || location.pathname === `${baseRoute}/`
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg shadow-lg hover:bg-primary-dark transition-colors"
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? '5rem' : '16rem'
        }}
        transition={{
          duration: 0.3,
          type: 'tween'
        }}
        className={`
          flex flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800
          fixed lg:relative inset-y-0 left-0 z-40 shadow-xl lg:shadow-none
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 lg:transition-none
        `}
      >
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <motion.div
            animate={{
              scale: isCollapsed ? 0.9 : 1
            }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <img 
              src={isCollapsed ? senaiLogoS : senaiLogo}
              alt="SENAI Logo" 
              className="h-10 w-auto object-contain flex-shrink-0"
            />
          </motion.div>

          {/* Toggle Button - Desktop only */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </motion.div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 p-3">
          {navItems.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                  ${active
                    ? 'bg-primary text-white shadow-md hover:bg-primary-dark'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }
                `}
              >
                {/* Icon */}
                <Icon className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110 ${active ? 'text-white' : ''}`} />
                
                {/* Text */}
                <motion.span
                  animate={{
                    opacity: isCollapsed ? 0 : 1,
                    display: isCollapsed ? 'none' : 'block'
                  }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap"
                >
                  {item.name}
                </motion.span>

                {/* Badge */}
                {item.badge && (
                  <motion.span
                    animate={{
                      opacity: isCollapsed ? 0 : 1,
                      display: isCollapsed ? 'none' : 'block'
                    }}
                    transition={{ duration: 0.2 }}
                    className={`
                      ml-auto px-2 py-0.5 text-xs font-semibold rounded-full
                      ${active 
                        ? 'bg-white/20 text-white' 
                        : 'bg-primary/10 text-primary-dark dark:bg-primary/20 dark:text-primary-light'
                      }
                    `}
                  >
                    {item.badge}
                  </motion.span>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="hidden lg:block absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                    {item.name}
                    {item.badge && (
                      <span className="ml-2 px-1.5 py-0.5 bg-primary rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer - User Info */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-3">
          <motion.div
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-sm">
              {user?.nome?.charAt(0).toUpperCase() || 'U'}
            </div>
            <motion.div
              animate={{
                opacity: isCollapsed ? 0 : 1,
                display: isCollapsed ? 'none' : 'block'
              }}
              transition={{ duration: 0.2 }}
              className="flex-1 min-w-0"
            >
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.nome || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email || 'usuario@email.com'}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.aside>
    </>
  )
}

export default AnimatedSidebar
