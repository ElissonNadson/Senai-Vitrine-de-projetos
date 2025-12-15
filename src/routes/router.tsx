import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Layout from '../layout/layout'
import Private from './private-router'
import AuthGuard from '../components/auth-guard'
import RoleGuard from '../components/role-guard'
import '../index.css'
import LandingPage from '../features/visitor/landing-page/page'
import Dashboard from '../features/student/dashboard/page'
import MyProjects from '../features/student/my-projects/page'
import AccountPage from '../features/student/account/page'
import CompleteProfilePage from '../features/student/complete-profile/page'
import CompleteProfileProfessorPage from '../features/professor/complete-profile/page'
import LoginPage from '../features/auth/login/page'
import RegisterPage from '../features/auth/register/page'
import GoogleCallback from '../features/auth/google-callback'
import ProjectDetailPage from '../features/student/project-detail/page'
import ProjectViewPage from '../features/student/project-view/ProjectViewPage'
import GuestProjectViewPage from '../features/visitor/project-view/GuestProjectViewPage'
import ExplorerPage from '../features/visitor/explorer/page'
import TestProjectsList from '../features/student/project-view/test-projects'
import CreateProjectPage from '../features/student/create-project/page'
import AddStagePage from '../features/student/add-stage/page'
import EditProjectPage from '../features/student/edit-project/page'
import NotificationsPage from '../features/shared/notifications/notifications-page'
import StudentNotificationsPage from '../features/student/dashboard-v2/pages/NotificationsPage'
import HelpPage from '../features/student/dashboard-v2/pages/HelpPage'
import { NotificationProvider } from '../contexts/notification-context'
import { UserProvider } from '../contexts/user-context'
import { AuthProvider } from '../contexts/auth-context'
import { GuestProvider } from '../contexts/guest-context'
import { ThemeProvider } from '../contexts/theme-context'
import ProfessorDashboard from '../features/professor/dashboard/page'
import NoticiasPage from '../features/visitor/noticias/page'
import SectionLayout from '../features/visitor/layout/SectionLayout'
import {
  ComunidadeMaker,
  BibliotecaMaker,
  LaboratorioMaker,
  VitrineTecnologica,
  Sobre,
  Equipe
} from '../features/visitor/sections'
import NewsDetailPage from '../features/visitor/news/NewsDetailPage'
import { NewsDashboard } from '../features/admin/news/NewsDashboard'
import { NewsForm } from '../features/admin/news/NewsForm'

import { ConfigProvider, theme } from 'antd'
import { useTheme } from '../contexts/theme-context'

const AntdThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { effectiveTheme } = useTheme()

  return (
    <ConfigProvider
      theme={{
        algorithm: effectiveTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  )
}

const Routers: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AntdThemeWrapper>
          <AuthProvider>
            <GuestProvider>
              <UserProvider>
                <Routes>
                  {/* Landing page sem NotificationProvider para evitar chamadas de API */}
                  <Route path="/" element={<LandingPage />} />
                  {/* <Route path="/sobre-projeto" element={<AboutProjectPage />} /> */}

                  {/* Rota para visitantes visualizarem projetos - SEM autenticação */}
                  <Route path="/guest/project/:id" element={<GuestProjectViewPage />} />
                  <Route path="/vitrine/:id" element={<GuestProjectViewPage />} />
                  <Route path="/explorar-vitrine" element={<ExplorerPage />} />

                  {/* Páginas das Seções */}
                  <Route path="/vitrine-tecnologica" element={<VitrineTecnologica />} />
                  <Route path="/biblioteca-maker" element={<BibliotecaMaker />} />
                  <Route path="/laboratorio-maker" element={<LaboratorioMaker />} />
                  <Route path="/comunidade-maker" element={<ComunidadeMaker />} />


                  {/* Novas páginas */}
                  <Route path="/noticias/:slug" element={<NewsDetailPage />} />
                  <Route path="/sobre" element={<Sobre />} />
                  <Route path="/equipe" element={<Equipe />} />
                  <Route path="/noticias" element={<NoticiasPage />} />
                  <Route path="/politica-de-privacidade" element={
                    <SectionLayout>
                      <div className="min-h-screen bg-gray-50">
                        {/* Hero Section with LGPD Banner */}
                        <section className="relative h-[40vh] overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700">
                          <div className="absolute inset-0 bg-blue-900 bg-opacity-60" />
                          <div className="relative z-10 flex items-center justify-center h-full">
                            <div className="text-center text-white max-w-4xl px-4">
                              <h1 className="text-4xl md:text-6xl font-bold mb-4 uppercase tracking-wider">
                                Política de Privacidade
                              </h1>
                            </div>
                          </div>
                        </section>

                        {/* Empty Content Section */}
                        <section className="py-12 px-4">
                          <div className="max-w-4xl mx-auto p-8 min-h-[300px]">
                            {/* Conteúdo em branco por enquanto */}
                          </div>
                        </section>
                      </div>
                    </SectionLayout>
                  } />

                  {/* Rotas que precisam do NotificationProvider */}
                  <Route path="/*" element={
                    <NotificationProvider>
                      <Routes>
                        <Route
                          path="/login"
                          element={
                            <AuthGuard redirectIfAuthenticated={true}>
                              <LoginPage />
                            </AuthGuard>
                          }
                        />
                        <Route
                          path="/register"
                          element={
                            <AuthGuard redirectIfAuthenticated={true}>
                              <RegisterPage />
                            </AuthGuard>
                          }
                        />                  <Route path="/auth/google/callback" element={<GoogleCallback />} />
                        <Route path="/auth/callback" element={<GoogleCallback />} />
                        <Route path="/login/oauth2/code/google" element={<GoogleCallback />} />

                        {/* Página de completar perfil */}
                        <Route path="/complete-profile" element={<CompleteProfilePage />} />
                        <Route path="/professor/complete-profile" element={<CompleteProfileProfessorPage />} />

                        {/* Rotas do Aluno */}
                        <Route
                          path="/aluno"
                          element={
                            <Private>
                              <RoleGuard allowedRoles={['ALUNO']}>
                                <Layout />
                              </RoleGuard>
                            </Private>
                          }
                        >
                          <Route index element={<Dashboard />} />
                          <Route path="dashboard" element={<Dashboard />} />
                          <Route path="meus-projetos" element={<MyProjects />} />
                          <Route path="account" element={<AccountPage />} />
                          <Route
                            path="projects/:projectId"
                            element={<ProjectDetailPage />}
                          />
                          <Route
                            path="projects/:id/view"
                            element={<ProjectViewPage />}
                          />
                          <Route
                            path="projects/test"
                            element={<TestProjectsList />}
                          />
                          <Route
                            path="projects/:projectId/add-stage"
                            element={<AddStagePage />}
                          />
                          <Route
                            path="edit-project/:projectId"
                            element={<EditProjectPage />}
                          />
                          <Route path="create-project" element={<CreateProjectPage />} />
                          <Route path="notifications" element={<NotificationsPage />} />
                          <Route path="student-notifications" element={<StudentNotificationsPage />} />
                          <Route path="help" element={<HelpPage />} />
                        </Route>

                        {/* Rotas do Professor */}
                        <Route
                          path="/professor"
                          element={
                            <Private>
                              <RoleGuard allowedRoles={['PROFESSOR']}>
                                <Layout />
                              </RoleGuard>
                            </Private>
                          }
                        >
                          <Route index element={<ProfessorDashboard />} />
                          <Route path="dashboard" element={<ProfessorDashboard />} />
                          <Route path="orientacoes" element={<MyProjects />} />
                          <Route path="account" element={<AccountPage />} />
                          <Route
                            path="projects/:projectId"
                            element={<ProjectDetailPage />}
                          />
                          <Route
                            path="projects/:id/view"
                            element={<ProjectViewPage />}
                          />
                          <Route
                            path="projects/:projectId/add-stage"
                            element={<AddStagePage />}
                          />
                          <Route
                            path="edit-project/:projectId"
                            element={<EditProjectPage />}
                          />
                          <Route path="create-project" element={<CreateProjectPage />} />
                          <Route path="notifications" element={<NotificationsPage />} />
                          <Route path="student-notifications" element={<StudentNotificationsPage />} />
                          <Route path="help" element={<HelpPage />} />
                        </Route>
                        <Route
                          path="/admin"
                          element={
                            <Private allowGuest={false}>
                              <Layout />
                            </Private>
                          }
                        >
                          <Route path="noticias" element={<NewsDashboard />} />
                          <Route path="noticias/nova" element={<NewsForm />} />
                          <Route path="noticias/editar/:id" element={<NewsForm />} />
                        </Route>
                      </Routes>
                    </NotificationProvider>
                  } />
                </Routes>
              </UserProvider>

            </GuestProvider>
          </AuthProvider>
        </AntdThemeWrapper>
      </ThemeProvider>
    </Router>
  )
}

export default Routers
