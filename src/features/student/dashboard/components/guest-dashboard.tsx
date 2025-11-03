import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, Users, BookOpen, TrendingUp, UserPlus, LogIn, AlertCircle, Calendar, Code, ExternalLink, CheckCircle, Lightbulb, FileText, Wrench, Rocket, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { PhaseStatsCards } from './PhaseStatsCards'
import UnifiedProjectCard from '@/components/cards/UnifiedProjectCard'
import ProjectFilters from '@/components/filters/ProjectFilters'
import { applyProjectFilters } from '@/utils/projectFilters'
import mockProjectsData from '@/data/mockProjects.json'

const GuestDashboard = () => {
  const navigate = useNavigate()
  const { effectiveTheme, setThemeMode } = useTheme()
  const [isAnimating, setIsAnimating] = useState(false)
  const [corsError, setCorsError] = useState<string | null>(null)
  
  // Função para obter informações do nível de maturidade
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
  
  // Função para alternar tema com animação
  const toggleTheme = () => {
    setIsAnimating(true)
    setThemeMode(effectiveTheme === 'dark' ? 'light' : 'dark')
    
    // Resetar animação após completar
    setTimeout(() => {
      setIsAnimating(false)
    }, 600)
  }
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null)
  const [selectedNivel, setSelectedNivel] = useState<string | null>(null)
  const [selectedCurso, setSelectedCurso] = useState<string | null>(null)
  const [selectedDestaques, setSelectedDestaques] = useState<string[]>([])
  const [sortOrder, setSortOrder] = useState<'A-Z' | 'Z-A' | 'novos' | 'antigos' | 'mais-vistos'>('novos')
  
  // Apenas marcar como visitante se não há autenticação
  useEffect(() => {
    // Verificar se realmente deveria estar aqui como visitante
    const hasAuth = document.cookie.includes('accessToken=')
    
    if (!hasAuth) {
      localStorage.setItem('isGuest', 'true')
    }
    
    return () => {
      // Só remover se não há autenticação
      if (!hasAuth) {
        localStorage.removeItem('isGuest')
      }
    }
  }, [])
  
  // Usar dados mockados
  const projects = mockProjectsData.projects || []
  const isLoading = false
  const error = null
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

  // Calcular estatísticas de projetos por fase
  const projetosIdeacao = projects.filter(p => getMaturityLevel(p).level === 1).length
  const projetosModelagem = projects.filter(p => getMaturityLevel(p).level === 2).length
  const projetosPrototipagem = projects.filter(p => getMaturityLevel(p).level === 3).length
  const projetosImplementacao = projects.filter(p => getMaturityLevel(p).level === 4).length
  
  useEffect(() => {
    if (error) {
      console.log('Erro ao buscar projetos:', error)
      if (error.message.includes('CORS') || error.message.includes('Access-Control')) {
        setCorsError('Erro de CORS detectado ao tentar acessar dados públicos')
      }
    }
  }, [error])

  // Funções para controlar o modal
  const handleOpenModal = (project: any) => {
    // Visitantes devem ir para a página específica de visitante
    navigate(`/guest/project/${project.id}`)
  }

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
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {corsError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="text-red-800 dark:text-red-300 font-medium">Erro de CORS Detectado</h3>
                <p className="text-red-600 dark:text-red-400 text-sm">{corsError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header com botão de tema */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Explorar Projetos
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Descubra projetos incríveis dos alunos SENAI
            </p>
          </div>

          {/* Botão de Tema */}
          <button 
            onClick={toggleTheme}
            className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 relative group overflow-hidden ${
              isAnimating ? 'scale-110 bg-blue-500/10 dark:bg-blue-400/10' : ''
            }`}
            title={effectiveTheme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            disabled={isAnimating}
          >
            {/* Animação de ripple ao clicar */}
            {isAnimating && (
              <span className="absolute inset-0 animate-ping bg-blue-500/20 dark:bg-blue-400/20 rounded-full"></span>
            )}
            
            {/* Ícone com animação de rotação e fade */}
            <div className={`transition-all duration-500 ${isAnimating ? 'rotate-180 scale-0' : 'rotate-0 scale-100'}`}>
              {effectiveTheme === 'dark' ? (
                <Sun className="h-6 w-6 group-hover:rotate-45 transition-transform duration-300 text-yellow-500" />
              ) : (
                <Moon className="h-6 w-6 group-hover:-rotate-12 transition-transform duration-300 text-indigo-600 dark:text-indigo-400" />
              )}
            </div>
          </button>
        </div>

        {/* Cards de Estatísticas por Fase */}
        <PhaseStatsCards
          projetosIdeacao={projetosIdeacao}
          projetosModelagem={projetosModelagem}
          projetosPrototipagem={projetosPrototipagem}
          projetosImplementacao={projetosImplementacao}
        />

        {/* Layout com Sidebar de Filtros + Conteúdo */}
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

          {/* CONTEÚDO PRINCIPAL */}
          <main className="flex-1">
            {/* Projetos em destaque */}
            <div className="mb-8">
              {isLoading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                  <div className="flex gap-2 mb-3">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Erro ao carregar
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-400 dark:text-red-500 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">Erro ao carregar projetos. Tente novamente mais tarde.</p>
            </div>
          ) : filteredProjects.length === 0 && projects.length > 0 ? (
            // Sem projetos após filtros
            <div className="text-center py-12 bg-white dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-8">
              <AlertCircle className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Nenhum projeto encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Não há projetos que correspondam aos filtros selecionados.
              </p>
              
              {/* Mostrar filtros ativos */}
              <div className="max-w-md mx-auto text-left bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4 border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filtros ativos:</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {searchTerm && (
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                      Busca: "{searchTerm}"
                    </li>
                  )}
                  {selectedCurso && (
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                      Curso: {selectedCurso}
                    </li>
                  )}
                  {selectedCategoria && (
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                      Categoria: {selectedCategoria}
                    </li>
                  )}
                  {selectedDestaques.length > 0 && (
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                      Destaques: {selectedDestaques.join(', ')}
                    </li>
                  )}
                  {selectedNivel && (
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                      Fase de desenvolvimento: {selectedNivel}
                    </li>
                  )}
                  {sortOrder !== 'novos' && (
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                      Ordenação: {
                        sortOrder === 'A-Z' ? 'De A-Z' :
                        sortOrder === 'Z-A' ? 'De Z-A' :
                        sortOrder === 'antigos' ? 'Mais Antigos' :
                        sortOrder === 'mais-vistos' ? 'Mais Visualizados' : ''
                      }
                    </li>
                  )}
                </ul>
              </div>

              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategoria(null)
                  setSelectedNivel(null)
                  setSelectedCurso(null)
                  setSelectedDestaques([])
                  setSortOrder('novos')
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
              >
                <AlertCircle className="h-4 w-4" />
                Limpar Filtros
              </button>
            </div>
          ) : filteredProjects.length > 0 ? (
            // Projetos reais da API (após filtros)
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProjects.map((project: any) => (
                <UnifiedProjectCard
                  key={project.id}
                  project={project}
                  variant="compact"
                  isGuest={true}
                  onClick={handleOpenModal}
                />
              ))}
            </div>
          ) : (
            // Sem projetos
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">Nenhum projeto disponível no momento.</p>
            </div>
          )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default GuestDashboard
