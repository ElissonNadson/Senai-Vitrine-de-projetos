import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Eye, Calendar, ExternalLink, Lightbulb, FileText, Wrench, Rocket, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useGuest } from '@/contexts/guest-context'
import GuestDashboard from './components/guest-dashboard'
import UnifiedProjectModal from '@/components/modals/UnifiedProjectModal'
import { PhaseStatsCards } from './components/PhaseStatsCards'
import UnifiedProjectCard from '@/components/cards/UnifiedProjectCard'
import ProjectFilters from '@/components/filters/ProjectFilters'
import { applyProjectFilters } from '@/utils/projectFilters'
import mockProjectsData from '@/data/mockProjects.json'
// Import de dados mockados

function Dashboard() {
  const { user } = useAuth()
  const { isGuest } = useGuest()
  const navigate = useNavigate()
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null)
  const [selectedNivel, setSelectedNivel] = useState<string | null>(null)
  const [selectedCurso, setSelectedCurso] = useState<string | null>(null)
  const [selectedDestaques, setSelectedDestaques] = useState<string[]>([])
  const [sortOrder, setSortOrder] = useState<'A-Z' | 'Z-A' | 'novos' | 'antigos' | 'mais-vistos'>('novos')
  
  // Modal de detalhes
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Se é visitante, mostrar dashboard de visitante
  if (isGuest) {
    return <GuestDashboard />
  }

  // Usar dados mockados
  const projects = mockProjectsData.projects || []
  const isLoading = false
  const totalProjetos = projects.length
  
  // Extrair categorias únicas dos projetos
  const categorias = Array.from(new Set(projects.map(p => p.categoria).filter(Boolean)))
  
  // Extrair tecnologias mais usadas
  const allTechs = projects.flatMap(p => p.tecnologias || [])
  const techCounts = allTechs.reduce((acc, tech) => {
    acc[tech] = (acc[tech] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const tecnologiasMaisUsadas = Object.entries(techCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([nome, count]) => ({ nome, count }))

  // Função para obter nível de maturidade
  const getMaturityLevel = (project: any) => {
    const levels = [
      { level: 1, name: 'Ideação', icon: Lightbulb, color: 'yellow', bgColor: 'bg-yellow-400', borderColor: 'border-yellow-400' },
      { level: 2, name: 'Modelagem', icon: FileText, color: 'blue', bgColor: 'bg-blue-500', borderColor: 'border-blue-500' },
      { level: 3, name: 'Prototipagem', icon: Wrench, color: 'purple', bgColor: 'bg-purple-500', borderColor: 'border-purple-500' },
      { level: 4, name: 'Implementação', icon: Rocket, color: 'green', bgColor: 'bg-green-500', borderColor: 'border-green-500' }
    ]
    const fase = project.faseAtual || 1
    return levels[fase - 1] || levels[0]
  }

  // Calcular estatísticas de projetos por fase
  const projetosIdeacao = projects.filter(p => getMaturityLevel(p).level === 1).length
  const projetosModelagem = projects.filter(p => getMaturityLevel(p).level === 2).length
  const projetosPrototipagem = projects.filter(p => getMaturityLevel(p).level === 3).length
  const projetosImplementacao = projects.filter(p => getMaturityLevel(p).level === 4).length

  // Aplicar filtros usando a função utilitária
  const filteredProjects = applyProjectFilters(
    projects,
    {
      searchTerm,
      selectedCurso,
      selectedCategoria,
      selectedNivel,
      selectedDestaques,
      sortOrder
    }
  )

  const handleOpenModal = (project: any) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Explorar Projetos
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Descubra todos os projetos da vitrine SENAI
            </p>
          </div>
          <Link
            to="/app/create-project"
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Novo Projeto</span>
          </Link>
        </div>

        {/* Cards de Estatísticas por Fase */}
        <PhaseStatsCards
          projetosIdeacao={projetosIdeacao}
          projetosModelagem={projetosModelagem}
          projetosPrototipagem={projetosPrototipagem}
          projetosImplementacao={projetosImplementacao}
        />

        {/* Layout com Sidebar de Filtros + Grid de Projetos */}
        <div className="flex gap-6">
          {/* SIDEBAR DE FILTROS - Visível apenas em desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-6">
              <ProjectFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCurso={selectedCurso}
                setSelectedCurso={setSelectedCurso}
                selectedCategoria={selectedCategoria}
                setSelectedCategoria={setSelectedCategoria}
                selectedNivel={selectedNivel}
                setSelectedNivel={setSelectedNivel}
                selectedDestaques={selectedDestaques}
                setSelectedDestaques={setSelectedDestaques}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />
            </div>
          </aside>

          {/* GRID DE PROJETOS */}
          <main className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mostrando <strong>{filteredProjects.length}</strong> de <strong>{totalProjetos}</strong> projetos
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
                <Eye className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhum projeto encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Tente ajustar os filtros ou limpar a busca
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProjects.map((project: any) => (
                  <UnifiedProjectCard
                    key={project.id}
                    project={project}
                    variant="compact"
                    isGuest={false}
                    onClick={handleOpenModal}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedProject && (
        <UnifiedProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          isGuest={false}
          mode="view"
          isOwner={selectedProject.isOwner || false}
          readOnly={selectedProject.isOwner || false}
          onEdit={() => {
            handleCloseModal()
            navigate(`/app/edit-project/${selectedProject.id}`)
          }}
          onAddStage={(phase) => {
            handleCloseModal()
            navigate(`/app/projects/${selectedProject.id}/add-stage?phase=${phase}`)
          }}
        />
      )}
    </div>
  )
}

export default Dashboard
