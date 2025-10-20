import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Filter, ChevronDown, ChevronUp, Search, Lightbulb, FileText, Wrench, Rocket, Calendar, Code, ExternalLink } from 'lucide-react'
import { useProjetosPublicos } from '@/hooks/use-queries'
import { useAuth } from '@/contexts/auth-context'
import { useGuest } from '@/contexts/guest-context'
import GuestDashboard from './components/guest-dashboard'
import ProjectDetailsModal from '@/components/modals/project-details-modal'

function Dashboard() {
  const { user } = useAuth()
  const { isGuest } = useGuest()
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null)
  const [selectedNivel, setSelectedNivel] = useState<string | null>(null)
  const [selectedCurso, setSelectedCurso] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'A-Z' | 'Z-A' | 'novos' | 'antigos' | 'mais-vistos'>('novos')
  
  // Modal de detalhes
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Lista de cursos disponíveis
  const cursosDisponiveis = [
    'Administração',
    'Biotecnologia',
    'Desenvolvimento de Sistemas',
    'Eletromecânica',
    'Eletrotécnica',
    'Logística',
    'Manutenção Automotiva',
    'Mecânica',
    'Química',
    'Segurança do Trabalho'
  ]
  
  // Lista de categorias disponíveis
  const categoriasDisponiveis = [
    'Aplicativo / Site',
    'Automação de Processos',
    'Bioprodutos',
    'Chatbots e Automação Digital',
    'Dashboards e Análises de Dados',
    'Economia Circular',
    'Educação',
    'E-commerce e Marketplace',
    'Eficiência Energética',
    'Impressão 3D',
    'Impacto Social',
    'IoT',
    'Manufatura Inteligente',
    'Modelo de Negócio',
    'Sistemas de Gestão (ERP, CRM, etc.)',
    'Sustentabilidade e Meio Ambiente',
    'Tecnologias Assistivas e Acessibilidade',
    'Outro'
  ]
  
  // Estados para controle de acordeão
  const [openSections, setOpenSections] = useState({
    curso: true,
    categoria: true,
    nivel: true,
    ordenacao: true
  })

  // Se é visitante, mostrar dashboard de visitante
  if (isGuest) {
    return <GuestDashboard />
  }

  // Buscar projetos públicos (todos os projetos)
  const { data: publicProjectsData, isLoading } = useProjetosPublicos()
  
  // Extrair dados da resposta
  const projects = publicProjectsData?.projetos || []
  const totalProjetos = publicProjectsData?.total || 0
  const categorias = publicProjectsData?.categorias || []
  const tecnologiasMaisUsadas = publicProjectsData?.tecnologiasMaisUsadas || []

  // Função para obter nível de maturidade
  const getMaturityLevel = (projectId: string) => {
    const levels = [
      { level: 1, name: 'Ideação', icon: Lightbulb, color: 'yellow', bgColor: 'bg-yellow-400', borderColor: 'border-yellow-400' },
      { level: 2, name: 'Modelagem', icon: FileText, color: 'blue', bgColor: 'bg-blue-500', borderColor: 'border-blue-500' },
      { level: 3, name: 'Prototipagem', icon: Wrench, color: 'purple', bgColor: 'bg-purple-500', borderColor: 'border-purple-500' },
      { level: 4, name: 'Implementação', icon: Rocket, color: 'green', bgColor: 'bg-green-500', borderColor: 'border-green-500' }
    ]
    return levels[0] // Temporário - retorna sempre Ideação
  }

  // Calcular estatísticas de projetos por fase
  const projetosIdeacao = projects.filter(p => getMaturityLevel(p.id).level === 1).length
  const projetosModelagem = projects.filter(p => getMaturityLevel(p.id).level === 2).length
  const projetosPrototipagem = projects.filter(p => getMaturityLevel(p.id).level === 3).length
  const projetosImplementacao = projects.filter(p => getMaturityLevel(p.id).level === 4).length

  // Função para toggle de seções do filtro
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Função para filtrar e ordenar projetos
  const getFilteredAndSortedProjects = () => {
    let filtered = [...projects]

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.autorNome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategoria) {
      // Filtrar por categoria do projeto (verificar se o campo categoria existe)
      filtered = filtered.filter(p => 
        p.categoria === selectedCategoria || 
        (p.categorias && Array.isArray(p.categorias) && p.categorias.includes(selectedCategoria))
      )
    }

    if (selectedNivel) {
      filtered = filtered.filter(p => {
        const level = getMaturityLevel(p.id)
        return level.name === selectedNivel
      })
    }

    switch (sortOrder) {
      case 'A-Z':
        filtered.sort((a, b) => a.nome.localeCompare(b.nome))
        break
      case 'Z-A':
        filtered.sort((a, b) => b.nome.localeCompare(a.nome))
        break
      case 'novos':
        filtered.sort((a, b) => new Date(b.publicadoEm).getTime() - new Date(a.publicadoEm).getTime())
        break
      case 'antigos':
        filtered.sort((a, b) => new Date(a.publicadoEm).getTime() - new Date(b.publicadoEm).getTime())
        break
      case 'mais-vistos':
        filtered.sort((a, b) => b.visualizacoes - a.visualizacoes)
        break
    }

    return filtered
  }

  const filteredProjects = getFilteredAndSortedProjects()

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategoria(null)
    setSelectedNivel(null)
    setSelectedCurso(null)
    setSortOrder('novos')
  }

  const activeFiltersCount = [
    searchTerm,
    selectedCategoria,
    selectedNivel,
    selectedCurso,
    sortOrder !== 'novos' ? sortOrder : null
  ].filter(Boolean).length

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Ideação */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-400 dark:bg-yellow-500 rounded-full">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <span className="px-3 py-1 bg-yellow-500 dark:bg-yellow-600 text-white text-xs font-semibold rounded-full">
                Fase 1
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {projetosIdeacao}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Projetos em Ideação
            </p>
          </div>

          {/* Modelagem */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-full">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="px-3 py-1 bg-blue-500 dark:bg-blue-600 text-white text-xs font-semibold rounded-full">
                Fase 2
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {projetosModelagem}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Projetos em Modelagem
            </p>
          </div>

          {/* Prototipagem */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-500 dark:bg-purple-600 rounded-full">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <span className="px-3 py-1 bg-purple-500 dark:bg-purple-600 text-white text-xs font-semibold rounded-full">
                Fase 3
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {projetosPrototipagem}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Projetos em Prototipagem
            </p>
          </div>

          {/* Implementação */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500 dark:bg-green-600 rounded-full">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <span className="px-3 py-1 bg-green-500 dark:bg-green-600 text-white text-xs font-semibold rounded-full">
                Fase 4
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {projetosImplementacao}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Projetos Implementados
            </p>
          </div>
        </div>

        {/* Layout com Sidebar de Filtros + Grid de Projetos */}
        <div className="flex gap-6">
          {/* SIDEBAR DE FILTROS */}
          <aside className="w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 sticky top-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Filtros
                  {activeFiltersCount > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-blue-600 dark:bg-blue-500 text-white text-xs font-bold rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {/* Busca */}
              <div className="mb-5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Buscar projetos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Curso */}
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => toggleSection('curso')}
                  className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span>Curso</span>
                  {openSections.curso ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {openSections.curso && (
                  <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                    {cursosDisponiveis.map((curso) => (
                      <label key={curso} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors">
                        <input
                          type="radio"
                          name="curso"
                          checked={selectedCurso === curso}
                          onChange={() => setSelectedCurso(selectedCurso === curso ? null : curso)}
                          className="w-4 h-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{curso}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Categoria */}
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => toggleSection('categoria')}
                  className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span>Categoria</span>
                  {openSections.categoria ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {openSections.categoria && (
                  <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                    {categoriasDisponiveis.map((categoria) => (
                      <label key={categoria} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors">
                        <input
                          type="radio"
                          name="categoria"
                          checked={selectedCategoria === categoria}
                          onChange={() => setSelectedCategoria(selectedCategoria === categoria ? null : categoria)}
                          className="w-4 h-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{categoria}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Fase de desenvolvimento */}
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => toggleSection('nivel')}
                  className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span>Fase de desenvolvimento</span>
                  {openSections.nivel ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {openSections.nivel && (
                  <div className="mt-2 space-y-2">
                    {['Ideação', 'Modelagem', 'Prototipagem', 'Implementação'].map((nivel) => (
                      <label key={nivel} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors">
                        <input
                          type="radio"
                          name="nivel"
                          checked={selectedNivel === nivel}
                          onChange={() => setSelectedNivel(selectedNivel === nivel ? null : nivel)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{nivel}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Ordenação */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('ordenacao')}
                  className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span>Ordenar por</span>
                  {openSections.ordenacao ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {openSections.ordenacao && (
                  <div className="mt-2 space-y-2">
                    {[
                      { value: 'novos', label: 'Mais recentes' },
                      { value: 'antigos', label: 'Mais antigos' },
                      { value: 'A-Z', label: 'A-Z' },
                      { value: 'Z-A', label: 'Z-A' },
                      { value: 'mais-vistos', label: 'Mais visualizados' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors">
                        <input
                          type="radio"
                          name="ordenacao"
                          checked={sortOrder === option.value}
                          onChange={() => setSortOrder(option.value as any)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
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
                {filteredProjects.map((project: any) => {
                  const maturityLevel = getMaturityLevel(project.id)
                  const MaturityIcon = maturityLevel.icon

                  return (
                    <div
                      key={project.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleOpenModal(project)}
                    >
                      {/* Header do Card */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {project.nome}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            por {project.autorNome}
                          </p>
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${maturityLevel.bgColor} text-white text-xs font-semibold`}>
                          <MaturityIcon className="h-3.5 w-3.5" />
                          <span>{maturityLevel.name}</span>
                        </div>
                      </div>

                      {/* Descrição */}
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                        {project.descricao}
                      </p>

                      {/* Tecnologias */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tecnologias.slice(0, 3).map((tech: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full"
                          >
                            <Code className="h-3 w-3" />
                            {tech}
                          </span>
                        ))}
                        {project.tecnologias.length > 3 && (
                          <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
                            +{project.tecnologias.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{project.visualizacoes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(project.publicadoEm).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1">
                          Ver detalhes
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedProject && (
        <ProjectDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          project={selectedProject}
        />
      )}
    </div>
  )
}

export default Dashboard
