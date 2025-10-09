import React from 'react'
import { Outlet } from 'react-router-dom'
import AnimatedSidebar from '../features/student/dashboard-v2/components/AnimatedSidebar'
import ModernHeader from '../features/student/dashboard-v2/components/ModernHeader'
import GuestBanner from '../components/guest-banner'
import ModalManager from '../components/modals/modal-manager'
import { useGuest } from '../contexts/guest-context'

const Layout = () => {
  const { isGuest } = useGuest()

  // Layout para visitantes (sem sidebar e header)
  if (isGuest) {
    return (
      <div className="relative w-full min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Banner de visitante fixo no topo */}
        <GuestBanner />
        
        {/* Conteúdo principal sem sidebar e header */}
        <main className="w-full">
          <Outlet />
        </main>

        {/* Gerenciador de modais global */}
        <ModalManager />
      </div>
    )
  }

  // Layout normal para usuários autenticados (com sidebar e header)
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Container principal com sidebar e conteúdo */}
      <div className="flex h-full w-full overflow-hidden">
        {/* Animated Sidebar */}
        <AnimatedSidebar />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Modern Header */}
          <ModernHeader />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Gerenciador de modais global */}
      <ModalManager />
    </div>
  )
}

export default Layout
