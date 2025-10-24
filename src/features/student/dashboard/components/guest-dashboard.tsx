import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, Users, BookOpen, TrendingUp, UserPlus, LogIn, AlertCircle, Calendar, Code, ExternalLink, CheckCircle, Filter, ChevronDown, ChevronUp, Search, Sun, Moon, Lightbulb, FileText, Wrench, Rocket } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { PhaseStatsCards } from './PhaseStatsCards'
import UnifiedProjectCard from '@/components/cards/UnifiedProjectCard'
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
    destaques: true,
    nivel: true,
    ordenacao: true
  })
  
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

    // Filtrar por busca
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por categoria
    if (selectedCategoria) {
      filtered = filtered.filter(p => 
        p.categoria === selectedCategoria
      )
    }

    // Filtrar por destaques
    if (selectedDestaques.length > 0) {
      filtered = filtered.filter(p => {
        return selectedDestaques.every(destaque => {
          if (destaque === 'Itinerário') return p.itinerario === true
          if (destaque === 'SENAI Lab') return p.labMaker === true
          if (destaque === 'SAGA SENAI') return p.participouSaga === true
          return false
        })
      })
    }

    // Filtrar por curso (simulado - na prática viria da API)
    if (selectedCurso) {
      // Aqui você pode filtrar pelo campo curso do projeto quando estiver disponível na API
      // Por enquanto, mantém todos os projetos
      // filtered = filtered.filter(p => p.curso === selectedCurso)
    }

    // Filtrar por nível de maturidade
    if (selectedNivel) {
      filtered = filtered.filter(p => {
        const level = getMaturityLevel(p.id)
        return level.name === selectedNivel
      })
    }

    // Ordenar
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

  // Função para limpar filtros
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategoria(null)
    setSelectedNivel(null)
    setSelectedCurso(null)
    setSelectedDestaques([])
    setSortOrder('novos')
  }

  // Função para toggle de destaques (permite múltipla seleção)
  const toggleDestaque = (destaque: string) => {
    setSelectedDestaques(prev => 
      prev.includes(destaque)
        ? prev.filter(d => d !== destaque)
        : [...prev, destaque]
    )
  }

  // Contar filtros ativos
  const activeFiltersCount = [
    searchTerm,
    selectedCategoria,
    selectedNivel,
    selectedCurso,
    ...selectedDestaques,
    sortOrder !== 'novos' ? sortOrder : null
  ].filter(Boolean).length
  
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
          {/* SIDEBAR DE FILTROS */}
          <aside className="w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 sticky top-6">
              {/* Cabeçalho dos Filtros */}
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
                    placeholder="Encontre aqui projetos"
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

              {/* Destaques */}
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => toggleSection('destaques')}
                  className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span>Destaques</span>
                  {openSections.destaques ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {openSections.destaques && (
                  <div className="mt-2 space-y-2">
                    {[
                      { name: 'Itinerário', icon: BookOpen, color: 'blue' },
                      { name: 'SENAI Lab', icon: Wrench, color: 'purple' },
                      { name: 'SAGA SENAI', icon: TrendingUp, color: 'orange' }
                    ].map((destaque) => {
                      const Icon = destaque.icon
                      return (
                        <label key={destaque.name} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedDestaques.includes(destaque.name)}
                            onChange={() => toggleDestaque(destaque.name)}
                            className="w-4 h-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 rounded"
                          />
                          <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{destaque.name}</span>
                        </label>
                      )
                    })}
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
                          className="w-4 h-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
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
                  <span>Ordenação</span>
                  {openSections.ordenacao ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {openSections.ordenacao && (
                  <div className="mt-2 space-y-2">
                    {[
                      { value: 'A-Z', label: 'De A-Z' },
                      { value: 'Z-A', label: 'De Z-A' },
                      { value: 'novos', label: 'Mais Recentes' },
                      { value: 'antigos', label: 'Mais Antigos' },
                      { value: 'mais-vistos', label: 'Mais Visualizados' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors">
                        <input
                          type="radio"
                          name="ordenacao"
                          checked={sortOrder === option.value}
                          onChange={() => setSortOrder(option.value as any)}
                          className="w-4 h-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
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
              <Filter className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
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
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
              >
                <Filter className="h-4 w-4" />
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
