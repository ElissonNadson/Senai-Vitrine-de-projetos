/**
 * EXEMPLO DE INTEGRAÇÃO NO ROUTER
 * 
 * Este arquivo mostra como integrar o novo dashboard V2 no router principal
 */

import ModernDashboardLayout from './layouts/ModernDashboardLayout'
import ModernDashboardPage from './page'

// Adicione esta rota no seu arquivo router.tsx:

/*
// Dentro do componente Router, adicione:

<Route 
  path="/app/dashboard-v2" 
  element={
    <Private>
      <ModernDashboardLayout />
    </Private>
  }
>
  <Route index element={<ModernDashboardPage />} />
  
  // Você pode adicionar outras rotas aqui que usarão o mesmo layout:
  // <Route path="tasks" element={<TasksPage />} />
  // <Route path="reports" element={<ReportsPage />} />
  // <Route path="settings" element={<SettingsPage />} />
</Route>
*/

// EXEMPLO COMPLETO DE INTEGRAÇÃO:
/*
const Routers: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <GuestProvider>
          <UserProvider>
            <Routes>
              {/* ... outras rotas ... *\/}
              
              {/* Nova rota do Dashboard V2 *\/}
              <Route path="/*" element={
                <NotificationProvider>
                  <Routes>
                    <Route 
                      path="/app/dashboard-v2" 
                      element={
                        <Private>
                          <ModernDashboardLayout />
                        </Private>
                      }
                    >
                      <Route index element={<ModernDashboardPage />} />
                    </Route>
                    
                    {/* Rotas antigas continuam funcionando *\/}
                    <Route path="/app" element={<Private><Layout /></Private>}>
                      <Route index element={<Dashboard />} />
                      {/* ... *\/}
                    </Route>
                  </Routes>
                </NotificationProvider>
              } />
            </Routes>
          </UserProvider>
        </GuestProvider>
      </AuthProvider>
    </Router>
  )
}
*/

// OPÇÃO 2: Substituir o dashboard atual
/*
// Se você quiser substituir completamente o dashboard antigo pelo novo:

<Route 
  path="/app" 
  element={
    <Private>
      <ModernDashboardLayout />  // Use o novo layout
    </Private>
  }
>
  <Route index element={<ModernDashboardPage />} />  // Use a nova página
  <Route path="projects" element={<ProjectsPage />} />
  <Route path="account" element={<AccountPage />} />
  // ... outras rotas
</Route>
*/

export {}
