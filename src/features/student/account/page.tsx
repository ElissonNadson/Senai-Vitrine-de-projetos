import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getBaseRoute } from '@/utils/routes'
import { motion } from 'framer-motion'
import { User, Shield, Bell, Palette, Settings } from 'lucide-react'
import { useGuest } from '@/contexts/guest-context'
import { useAuth } from '@/contexts/auth-context'
import { useTheme } from '@/contexts/theme-context'
import { PageBanner } from '@/components/common/PageBanner'
import ProfileTab from './components/ProfileTab'
import SecurityTab from './components/SecurityTab'
import NotificationsTab from './components/NotificationsTab'
import AppearanceTab from './components/AppearanceTab'

type TabType = 'profile' | 'security' | 'notifications' | 'appearance'

const AccountPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { isGuest } = useGuest()
  const { isAuthenticated, user } = useAuth()
  const { effectiveTheme } = useTheme()
  const baseRoute = useMemo(() => getBaseRoute(user?.tipo), [user?.tipo])

  const tabFromUrl = (searchParams.get('tab') as TabType) || 'profile'
  const [activeTab, setActiveTab] = useState<TabType>(tabFromUrl)

  // Redirecionar visitantes para o dashboard
  useEffect(() => {
    if (isGuest || !isAuthenticated) {
      navigate(`${baseRoute}`, { replace: true })
    }
  }, [isGuest, isAuthenticated, navigate, baseRoute])

  // Atualizar URL quando a tab mudar
  useEffect(() => {
    if (activeTab !== 'profile') {
      setSearchParams({ tab: activeTab })
    } else {
      setSearchParams({})
    }
  }, [activeTab, setSearchParams])

  // Sincronizar tab com URL
  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl])

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'security', name: 'Segurança', icon: Shield },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'appearance', name: 'Aparência', icon: Palette }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />
      case 'security':
        return <SecurityTab />
      case 'notifications':
        return <NotificationsTab />
      case 'appearance':
        return <AppearanceTab />
      default:
        return <ProfileTab />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageBanner
        title="Minha Conta"
        subtitle="Gerencie suas informações pessoais e acadêmicas"
        icon={<User />}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8 relative z-20">

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2 sticky top-4">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${isActive
                      ? 'bg-primary text-white shadow-md hover:bg-primary-dark'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : ''}`} />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountPage
