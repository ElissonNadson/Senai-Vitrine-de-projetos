import React from 'react'
import { Outlet } from 'react-router-dom'
import AnimatedSidebar from '../components/AnimatedSidebar'
import ModernHeader from '../components/ModernHeader'

const ModernDashboardLayout: React.FC = () => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-gray-50 dark:bg-gray-900">
      <div className="layout-container flex h-full grow">
        {/* Animated Sidebar */}
        <AnimatedSidebar />

        {/* Main Content Area */}
        <div className="flex grow flex-col">
          {/* Header */}
          <ModernHeader />

          {/* Page Content */}
          <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default ModernDashboardLayout
