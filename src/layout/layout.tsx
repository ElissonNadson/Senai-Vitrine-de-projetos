import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/layout/header'
import GuestBanner from '../components/guest-banner'
import GuestDebug from '../components/guest-debug'
import ModalManager from '../components/modals/modal-manager'

const Layout = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <GuestBanner />
      
      <div className="flex-shrink-0">
        <Header />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Gerenciador de modais global */}
      <ModalManager />
      
      {/* Debug do estado de visitante - apenas em desenvolvimento */}
      {/* {import.meta.env.DEV && <GuestDebug />} */}
    </div>
  )
}

export default Layout
