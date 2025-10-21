import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Users, BookOpen, TrendingUp, UserPlus, LogIn, AlertCircle, Calendar, Code, ExternalLink, Lightbulb, FileText, Rocket, CheckCircle, Filter, ChevronDown, ChevronUp, Search, Wrench, Sun, Moon } from 'lucide-react'
import { useProjetosPublicos } from '@/hooks/use-queries'
import ProjectDetailsModal from '@/components/modals/project-details-modal'
import { useTheme } from '@/contexts/theme-context'

const GuestDashboard = () => {
  const { effectiveTheme, setThemeMode } = useTheme()
  const [isAnimating, setIsAnimating] = useState(false)
  const [corsError, setCorsError] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
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
  
  // Buscar projetos públicos da API
  const { data: publicProjectsData, isLoading, error } = useProjetosPublicos()
  
  // Extrair dados da resposta
  const projects = publicProjectsData?.projetos || []
  const totalProjetos = publicProjectsData?.total || 0
  const categorias = publicProjectsData?.categorias || []
  const tecnologiasMaisUsadas = publicProjectsData?.tecnologiasMaisUsadas || []

  // Calcular estatísticas de projetos por fase
  const projetosIdeacao = projects.filter(p => getMaturityLevel(p.id).level === 1).length
  const projetosModelagem = projects.filter(p => getMaturityLevel(p.id).level === 2).length
  const projetosPrototipagem = projects.filter(p => getMaturityLevel(p.id).level === 3).length
  const projetosImplementacao = projects.filter(p => getMaturityLevel(p.id).level === 4).length
  
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
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
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
        p.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.autorNome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por categoria
    if (selectedCategoria) {
      // Filtrar por categoria do projeto (verificar se o campo categoria existe)
      filtered = filtered.filter(p => 
        p.categoria === selectedCategoria || 
        (p.categorias && Array.isArray(p.categorias) && p.categorias.includes(selectedCategoria))
      )
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
    setSortOrder('novos')
  }

  // Contar filtros ativos
  const activeFiltersCount = [
    searchTerm,
    selectedCategoria,
    selectedNivel,
    selectedCurso,
    sortOrder !== 'novos' ? sortOrder : null
  ].filter(Boolean).length

  // Função para obter informações do nível de maturidade
  // IMPORTANTE: Esta função está usando uma simulação baseada no ID do projeto
  // Em produção, o campo 'nivelMaturidade' ou 'fase' deve vir diretamente da API
  const getMaturityLevel = (projectId: string) => {
    // Simulação - na prática viria da API
    const levels = [
      { level: 1, name: 'Ideação', icon: Lightbulb, color: 'yellow', bgColor: 'bg-yellow-400', borderColor: 'border-yellow-400' },
      { level: 2, name: 'Modelagem', icon: FileText, color: 'blue', bgColor: 'bg-blue-500', borderColor: 'border-blue-500' },
      { level: 3, name: 'Prototipagem', icon: Wrench, color: 'purple', bgColor: 'bg-purple-500', borderColor: 'border-purple-500' },
      { level: 4, name: 'Implementação', icon: Rocket, color: 'green', bgColor: 'bg-green-500', borderColor: 'border-green-500' }
    ]
    
    // TEMPORÁRIO: Retorna sempre Ideação (nível 1) para todos os projetos
    // TODO: Substituir por project.nivelMaturidade ou project.fase quando disponível na API
    return levels[0] // Sempre retorna Ideação
  }
  
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {/* Ideação */}
          <div className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border border-gray-200 dark:border-gray-700">
            {/* Barra colorida no topo */}
            <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"></div>
            
            <div className="p-6">
              {/* Header com barra colorida clara, nome da fase e ícone discreto */}
              <div className="mb-6">
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">Ideação</h4>
                  <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
                    <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </div>
              
              {/* Número e descrição */}
              <div className="space-y-3">
                <h3 className="text-5xl font-black text-gray-900 dark:text-white group-hover:text-yellow-500 transition-colors duration-300">
                  {projetosIdeacao}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Fase inicial de concepção do projeto
                </p>
              </div>
            </div>
            
            {/* Footer do card */}
            <div className="px-6 py-3 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-yellow-700 dark:text-yellow-400 font-semibold">Fase 1</span>
                <span className="text-yellow-700 dark:text-yellow-400 font-medium">{projetosIdeacao} {projetosIdeacao === 1 ? 'projeto' : 'projetos'}</span>
              </div>
            </div>
          </div>

          {/* Modelagem */
          <div className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border border-gray-200 dark:border-gray-700">
            {/* Barra colorida no topo */}
            <div className="h-1.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
            
            <div className="p-6">
              {/* Header com barra colorida clara, nome da fase e ícone discreto */}
              <div className="mb-6">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">Modelagem</h4>
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
              
              {/* Número e descrição */}
              <div className="space-y-3">
                <h3 className="text-5xl font-black text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors duration-300">
                  {projetosModelagem}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Definição de processos, recursos e documentação
                </p>
              </div>
            </div>
            
            {/* Footer do card */}
            <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-700 dark:text-blue-400 font-semibold">Fase 2</span>
                <span className="text-blue-700 dark:text-blue-400 font-medium">{projetosModelagem} {projetosModelagem === 1 ? 'projeto' : 'projetos'}</span>
              </div>
            </div>
          </div>

          {/* Prototipagem */
          <div className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border border-gray-200 dark:border-gray-700">
            {/* Barra colorida no topo */}
            <div className="h-1.5 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600"></div>
            
            <div className="p-6">
              {/* Header com barra colorida clara, nome da fase e ícone discreto */}
              <div className="mb-6">
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">Prototipagem</h4>
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                    <Wrench className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
              
              {/* Número e descrição */}
              <div className="space-y-3">
                <h3 className="text-5xl font-black text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors duration-300">
                  {projetosPrototipagem}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Desenvolvimento e testes do protótipo funcional
                </p>
              </div>
            </div>
            
            {/* Footer do card */}
            <div className="px-6 py-3 bg-purple-50 dark:bg-purple-900/20 border-t border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-700 dark:text-purple-400 font-semibold">Fase 3</span>
                <span className="text-purple-700 dark:text-purple-400 font-medium">{projetosPrototipagem} {projetosPrototipagem === 1 ? 'projeto' : 'projetos'}</span>
              </div>
            </div>
          </div>

          {/* Implementação */
          <div className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border border-gray-200 dark:border-gray-700">
            {/* Barra colorida no topo */}
            <div className="h-1.5 bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>
            
            <div className="p-6">
              {/* Header com barra colorida clara, nome da fase e ícone discreto */}
              <div className="mb-6">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">Implementação</h4>
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-lg">
                    <Rocket className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>
              
              {/* Número e descrição */}
              <div className="space-y-3">
                <h3 className="text-5xl font-black text-gray-900 dark:text-white group-hover:text-green-500 transition-colors duration-300">
                  {projetosImplementacao}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Aplicação da solução em contexto real ou simulado
                </p>
              </div>
            </div>
            
            {/* Footer do card */}
            <div className="px-6 py-3 bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-700 dark:text-green-400 font-semibold">Fase 4</span>
                <span className="text-green-700 dark:text-green-400 font-medium">{projetosImplementacao} {projetosImplementacao === 1 ? 'projeto' : 'projetos'}</span>
              </div>
            </div>
          </div>
        </div>

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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Projetos em Destaque</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {!isLoading && filteredProjects.length !== projects.length ? (
                  <>
                    Mostrando {filteredProjects.length} de {totalProjetos} projetos
                  </>
                ) : (
                  <>
                    Conheça os {totalProjetos} projetos disponíveis na nossa vitrine
                  </>
                )}
              </p>
            </div>
            {!isLoading && filteredProjects.length > 0 && (
              <div className="flex flex-col items-end gap-1">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredProjects.length} {filteredProjects.length === 1 ? 'Projeto' : 'Projetos'}
                </span>
                {filteredProjects.length !== projects.length && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    (filtrado de {totalProjetos})
                  </span>
                )}
              </div>
            )}
          </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project: any) => {
                const maturityLevel = getMaturityLevel(project.id)
                const MaturityIcon = maturityLevel.icon
                
                return (
                <div 
                  key={project.id} 
                  className={`border-2 ${maturityLevel.borderColor} rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group bg-white dark:bg-gray-800 flex flex-col h-full`}
                >
                  {/* Imagem do Projeto */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                    {project.imagemUrl ? (
                      <img 
                        src={project.imagemUrl} 
                        alt={project.nome}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      // Imagem padrão quando não há imagem
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                        <div className="text-center">
                          <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Sem imagem</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Badge de nível sobreposto na imagem */}
                    <div className="absolute top-3 left-3">
                      <div className={`flex items-center gap-2 px-3 py-1.5 ${maturityLevel.bgColor} text-white rounded-full shadow-lg`}>
                        <MaturityIcon className="h-4 w-4" />
                        <span className="text-xs font-bold">{maturityLevel.name}</span>
                      </div>
                    </div>
                    
                    {/* Badge de status sobreposto na imagem */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Conteúdo do card */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Cabeçalho do card */}
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {project.nome}
                      </h3>
                    </div>

                    {/* Descrição */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {project.descricao}
                    </p>

                    {/* Autor */}
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-500 dark:text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>{project.autorNome}</span>
                    </div>

                    {/* Data e visualizações */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(project.publicadoEm).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{project.visualizacoes} visualizações</span>
                      </div>
                    </div>

                    {/* Tecnologias */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tecnologias.slice(0, 3).map((tech: string, idx: number) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-md font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tecnologias.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md">
                          +{project.tecnologias.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Spacer para empurrar o botão para baixo */}
                    <div className="flex-1"></div>

                    {/* Botão de ver mais - sempre alinhado no bottom */}
                    <button 
                      onClick={() => handleOpenModal(project)}
                      className="w-full mt-auto py-2.5 px-4 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg font-medium"
                    >
                      <span className="text-sm">Ver Detalhes</span>
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                )
              })}
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

      {/* Modal de detalhes do projeto */}
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default GuestDashboard
