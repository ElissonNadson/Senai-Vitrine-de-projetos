import React, { useState } from 'react'
import { Search, ChevronDown, ChevronUp, Filter, X, SlidersHorizontal } from 'lucide-react'

interface ProjectFiltersProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedCurso: string | null
  setSelectedCurso: (value: string | null) => void
  selectedCategoria: string | null
  setSelectedCategoria: (value: string | null) => void
  selectedNivel: string | null
  setSelectedNivel: (value: string | null) => void
  selectedDestaques: string[]
  setSelectedDestaques: (value: string[]) => void
  sortOrder: 'A-Z' | 'Z-A' | 'novos' | 'antigos' | 'mais-vistos'
  setSortOrder: (value: 'A-Z' | 'Z-A' | 'novos' | 'antigos' | 'mais-vistos') => void
}

// Listas de opções
const cursosDisponiveis = [
  'Técnico em Administração',
  'Técnico em Biotecnologia',
  'Técnico em Desenvolvimento de Sistemas',
  'Técnico em Eletromecânica',
  'Técnico em Eletrotécnica',
  'Técnico em Logística',
  'Técnico em Manutenção Automotiva',
  'Técnico em Mecânica',
  'Técnico em Química',
  'Técnico em Segurança do Trabalho'
]

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

const niveisDisponiveis = ['Ideação', 'Modelagem', 'Prototipagem', 'Implementação']
const destaquesDisponiveis = ['Itinerário', 'SENAI Lab', 'SAGA SENAI', 'Edital', 'Prêmio']

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCurso,
  setSelectedCurso,
  selectedCategoria,
  setSelectedCategoria,
  selectedNivel,
  setSelectedNivel,
  selectedDestaques,
  setSelectedDestaques,
  sortOrder,
  setSortOrder
}) => {
  // Estado para mobile drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Estados para controle de acordeão
  const [openSections, setOpenSections] = useState({
    curso: true,
    categoria: true,
    destaques: true,
    nivel: true,
    ordenacao: true
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const toggleDestaque = (destaque: string) => {
    if (selectedDestaques.includes(destaque)) {
      setSelectedDestaques(selectedDestaques.filter(d => d !== destaque))
    } else {
      setSelectedDestaques([...selectedDestaques, destaque])
    }
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedCurso(null)
    setSelectedCategoria(null)
    setSelectedNivel(null)
    setSelectedDestaques([])
    setSortOrder('novos')
  }

  const activeFiltersCount = [
    searchTerm ? 1 : 0,
    selectedCurso ? 1 : 0,
    selectedCategoria ? 1 : 0,
    selectedNivel ? 1 : 0,
    selectedDestaques.length
  ].reduce((a, b) => a + b, 0)

  // Conteúdo dos filtros (compartilhado entre desktop e mobile)
  const FiltersContent = () => (
    <>
      {/* Header com contador de filtros */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Filtros
          </h3>
          {activeFiltersCount > 0 && (
            <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Limpar
          </button>
        )}
      </div>

      {/* Busca */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
          />
        </div>
      </div>

      {/* Filtro por Curso */}
      <div className="mb-5">
        <button
          onClick={() => toggleSection('curso')}
          className="w-full flex items-center justify-between text-left font-semibold text-gray-700 dark:text-gray-300 mb-3 py-1"
        >
          <span className="text-sm">Curso</span>
          {openSections.curso ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {openSections.curso && (
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {cursosDisponiveis.map((curso) => (
              <button
                key={curso}
                onClick={() => setSelectedCurso(selectedCurso === curso ? null : curso)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedCurso === curso
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
              >
                {curso}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filtro por Categoria */}
      <div className="mb-5">
        <button
          onClick={() => toggleSection('categoria')}
          className="w-full flex items-center justify-between text-left font-semibold text-gray-700 dark:text-gray-300 mb-3 py-1"
        >
          <span className="text-sm">Categoria</span>
          {openSections.categoria ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {openSections.categoria && (
          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {categoriasDisponiveis.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setSelectedCategoria(selectedCategoria === categoria ? null : categoria)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedCategoria === categoria
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filtro por Destaques */}
      <div className="mb-5">
        <button
          onClick={() => toggleSection('destaques')}
          className="w-full flex items-center justify-between text-left font-semibold text-gray-700 dark:text-gray-300 mb-3 py-1"
        >
          <span className="text-sm">Destaques</span>
          {openSections.destaques ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {openSections.destaques && (
          <div className="space-y-1.5">
            {destaquesDisponiveis.map((destaque) => (
              <button
                key={destaque}
                onClick={() => toggleDestaque(destaque)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedDestaques.includes(destaque)
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-medium'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
              >
                {destaque}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filtro por Fase */}
      <div className="mb-5">
        <button
          onClick={() => toggleSection('nivel')}
          className="w-full flex items-center justify-between text-left font-semibold text-gray-700 dark:text-gray-300 mb-3 py-1"
        >
          <span className="text-sm">Fase de Desenvolvimento</span>
          {openSections.nivel ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {openSections.nivel && (
          <div className="space-y-1.5">
            {niveisDisponiveis.map((nivel) => (
              <button
                key={nivel}
                onClick={() => setSelectedNivel(selectedNivel === nivel ? null : nivel)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedNivel === nivel
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
              >
                {nivel}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ordenação */}
      <div>
        <button
          onClick={() => toggleSection('ordenacao')}
          className="w-full flex items-center justify-between text-left font-semibold text-gray-700 dark:text-gray-300 mb-3 py-1"
        >
          <span className="text-sm">Ordenar por</span>
          {openSections.ordenacao ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {openSections.ordenacao && (
          <div className="space-y-1.5">
            {[
              { value: 'novos', label: 'Mais Recentes' },
              { value: 'antigos', label: 'Mais Antigos' },
              { value: 'mais-vistos', label: 'Mais Vistos' },
              { value: 'A-Z', label: 'A-Z' },
              { value: 'Z-A', label: 'Z-A' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortOrder(option.value as any)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${sortOrder === option.value
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )

  return (
    <>
      {/* Botão Mobile - Visível apenas em telas pequenas */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span className="font-medium">Filtros</span>
        {activeFiltersCount > 0 && (
          <span className="px-2 py-0.5 bg-white text-blue-600 text-xs font-bold rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Desktop Sidebar - Visível apenas em telas grandes */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <FiltersContent />
      </div>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer */}
          <div className="lg:hidden fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-800 z-50 shadow-2xl overflow-y-auto">
            <div className="p-6">
              {/* Botão fechar */}
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>

              <FiltersContent />

              {/* Botão aplicar (mobile) */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default ProjectFilters
