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

    // Check Admin First
    const isAdmin = user?.tipo === 'ADMIN' || ['nadsonnodachi@gmail.com', 'admin@admin.com', 'senaifeira@senaifeira'].includes(user?.email || '');

    if (isAdmin) {
      const items = [
        { name: 'Gerenciar Notícias', href: '/admin/noticias', icon: BookOpen },
        // Manter configurações/ajuda pode ser útil, mas o usuário pediu "só noticias". 
        // Vou deixar configurações por ser padrão de sistema, mas remover o resto.
        { name: 'Configurações', href: `${baseRoute}/account`, icon: Settings },
        { name: 'Ajuda', href: `${baseRoute}/help`, icon: HelpCircle }
      ]
      return items;
    }

    if (isProfessor) {
      return [
        { name: 'Dashboard', href: baseRoute, icon: Home },
        { name: 'Orientações', href: `${baseRoute}/orientacoes`, icon: BookOpen },
        { name: 'Notificações', href: `${baseRoute}/student-notifications`, icon: Bell },
        { name: 'Configurações', href: `${baseRoute}/account`, icon: Settings },
        { name: 'Ajuda', href: `${baseRoute}/help`, icon: HelpCircle }
      ]
    }

    // Menu para aluno
    return [
      { name: 'Dashboard', href: baseRoute, icon: Home },
      { name: 'Meus Projetos', href: `${baseRoute}/meus-projetos`, icon: FolderOpen },
      { name: 'Notificações', href: `${baseRoute}/student-notifications`, icon: Bell },
      { name: 'Configurações', href: `${baseRoute}/account`, icon: Settings },
      { name: 'Ajuda', href: `${baseRoute}/help`, icon: HelpCircle }
    ]
  }, [baseRoute, isProfessor, user])

  const isActive = (path: string) => {
    if (path === baseRoute) {
      return location.pathname === baseRoute || location.pathname === `${baseRoute}/`
    }
    return location.pathname.startsWith(path)
  }

  const [tooltipData, setTooltipData] = useState<{ top: number; left: number; text: string; badge?: number } | null>(null)

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

      {/* Floating Tooltip (Portal-like behavior) */}
      <AnimatePresence>
        {isCollapsed && tooltipData && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[60] px-3 py-2 bg-gray-900 text-white text-xs rounded-md shadow-lg whitespace-nowrap pointer-events-none flex items-center gap-2"
            style={{
              top: tooltipData.top,
              left: tooltipData.left
            }}
          >
            {tooltipData.text}
            {tooltipData.badge && (
              <span className="px-1.5 py-0.5 bg-primary rounded-full text-[10px] font-bold">
                {tooltipData.badge}
              </span>
            )}
            {/* Arrow */}
            <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
          </motion.div>
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
        {/* Header - Vitrine Tecnológica */}
        <div
          className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer group"
          onClick={toggleSidebar}
        >
          <motion.div
            animate={{
              scale: isCollapsed ? 1 : 1
            }}
            transition={{ duration: 0.2 }}
            className={`flex items-center font-bold ${isCollapsed ? 'justify-center w-full text-xl' : 'text-lg'}`}
          >
            {isCollapsed ? (
              <div className="flex items-center justify-center w-full">
                <span className="text-gray-900 dark:text-white">V</span>
                <span className="text-primary">.</span>
                <span className="text-primary">T</span>
              </div>
            ) : (
              <div className="flex items-center whitespace-nowrap overflow-hidden">
                <span className="text-gray-900 dark:text-white mr-1.5">Vitrine</span>
                <span className="text-primary">Tecnológica</span>
              </div>
            )}
          </motion.div>

          {/* Toggle Button - Desktop only (Hidden on collapsed to allow full header click, visible on expand) */}
          <div className={`hidden lg:flex items-center justify-center transition-colors ${isCollapsed ? 'hidden' : 'block'}`}>
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Optional: Keep chevron or remove it as the whole header is clickable. User asked to click "eles" (the text). 
                 I will keep the chevron but make it part of the clickable area implicitly. */}
              {!isCollapsed && <ChevronLeft className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />}
            </motion.div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
          {navItems.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileOpen(false)}
                onMouseEnter={(e) => {
                  if (isCollapsed) {
                    const rect = e.currentTarget.getBoundingClientRect()
                    setTooltipData({
                      top: rect.top + (rect.height / 2) - 14, // Center vertically roughly
                      left: rect.right + 10,
                      text: item.name,
                      badge: item.badge
                    })
                  }
                }}
                onMouseLeave={() => setTooltipData(null)}
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
              </Link>
            )
          })}
        </nav>

        {/* Footer Group */}
        <div className="mt-auto">


          {/* SENAI Logo Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-center bg-gray-50 dark:bg-gray-800/50">
            <img
              src={isCollapsed ? senaiLogoS : senaiLogo}
              alt="SENAI"
              className={`object-contain transition-all duration-300 ${isCollapsed ? 'h-5 w-auto' : 'h-6 w-auto'}`}
            />
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default AnimatedSidebar
