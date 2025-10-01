import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Users, BookOpen, TrendingUp, UserPlus, LogIn, AlertCircle, Calendar, Code, ExternalLink, Lightbulb, FileText, Rocket, CheckCircle, Filter, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { useProjetosPublicos } from '@/hooks/use-queries'
import ProjectDetailsModal from '@/components/modals/project-details-modal'

const GuestDashboard = () => {
  const [corsError, setCorsError] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null)
  const [selectedTecnologia, setSelectedTecnologia] = useState<string | null>(null)
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
  
  // Estados para controle de acordeão
  const [openSections, setOpenSections] = useState({
    curso: true,
    categoria: true,
    tecnologia: true,
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

    // Filtrar por categoria (simulado)
    if (selectedCategoria) {
      // Na prática, viria da API
      filtered = filtered.filter(p => categorias.includes(selectedCategoria))
    }

    // Filtrar por curso (simulado - na prática viria da API)
    if (selectedCurso) {
      // Aqui você pode filtrar pelo campo curso do projeto quando estiver disponível na API
      // Por enquanto, mantém todos os projetos
      // filtered = filtered.filter(p => p.curso === selectedCurso)
    }

    // Filtrar por tecnologia
    if (selectedTecnologia) {
      filtered = filtered.filter(p => 
        p.tecnologias.some((t: string) => t.toLowerCase() === selectedTecnologia.toLowerCase())
      )
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
    setSelectedTecnologia(null)
    setSelectedNivel(null)
    setSelectedCurso(null)
    setSortOrder('novos')
  }

  // Contar filtros ativos
  const activeFiltersCount = [
    searchTerm,
    selectedCategoria,
    selectedTecnologia,
    selectedNivel,
    selectedCurso,
    sortOrder !== 'novos' ? sortOrder : null
  ].filter(Boolean).length

  // Função para obter informações do nível de maturidade (exemplo)
  const getMaturityLevel = (projectId: string) => {
    // Simulação - na prática viria da API
    const levels = [
      { level: 1, name: 'Ideação', icon: Lightbulb, color: 'yellow', bgColor: 'bg-yellow-400', borderColor: 'border-yellow-400' },
      { level: 2, name: 'Modelagem', icon: FileText, color: 'blue', bgColor: 'bg-blue-500', borderColor: 'border-blue-500' },
      { level: 3, name: 'Prototipagem', icon: Code, color: 'purple', bgColor: 'bg-purple-500', borderColor: 'border-purple-500' },
      { level: 4, name: 'Implementação', icon: Rocket, color: 'green', bgColor: 'bg-green-500', borderColor: 'border-green-500' }
    ]
    
    // Retorna um nível aleatório para demonstração
    const randomIndex = Math.abs(projectId.charCodeAt(0) % 4)
    return levels[randomIndex]
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header para visitantes */}
      <div className="bg-blue-600 p-8 text-white mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Bem-vindo à Nossa Vitrine Tecnológica</h1>
            <p className="text-lg text-white/90">
              Este espaço foi criado para compartilhar experiências, inspirar novas práticas e aproximar pessoas que acreditam na inovação!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {corsError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="text-red-800 font-medium">Erro de CORS Detectado</h3>
                <p className="text-red-600 text-sm">{corsError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Layout com Sidebar de Filtros + Conteúdo */}
        <div className="flex gap-6">
          {/* SIDEBAR DE FILTROS */}
          <aside className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-5 sticky top-6">
              {/* Cabeçalho dos Filtros */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Filter className="h-5 w-5 text-blue-600" />
                  Filtros
                  {activeFiltersCount > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {/* Busca */}
              <div className="mb-5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Encontre aqui projetos"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Curso */}
              <div className="mb-4 pb-4 border-b">
                <button
                  onClick={() => toggleSection('curso')}
                  className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900 hover:text-blue-600 transition-colors"
                >
                  <span>Curso</span>
                  {openSections.curso ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {openSections.curso && (
                  <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                    {cursosDisponiveis.map((curso) => (
                      <label key={curso} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                        <input
                          type="radio"
                          name="curso"
                          checked={selectedCurso === curso}
                          onChange={() => setSelectedCurso(selectedCurso === curso ? null : curso)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{curso}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Categoria */}
              <div className="mb-4 pb-4 border-b">
                <button
                  onClick={() => toggleSection('categoria')}
                  className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900 hover:text-blue-600 transition-colors"
                >
                  <span>Categoria</span>
                  {openSections.categoria ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {openSections.categoria && (
                  <div className="mt-2 space-y-2">
                    {categorias.map((cat: string) => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                        <input
                          type="radio"
                          name="categoria"
                          checked={selectedCategoria === cat}
                          onChange={() => setSelectedCategoria(selectedCategoria === cat ? null : cat)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{cat}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Tecnologia */}
              <div className="mb-4 pb-4 border-b">
                <button
                  onClick={() => toggleSection('tecnologia')}
                  className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900 hover:text-blue-600 transition-colors"
                >
                  <span>Tecnologia</span>
                  {openSections.tecnologia ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {openSections.tecnologia && (
                  <div className="mt-2 space-y-2">
                    {tecnologiasMaisUsadas.map((tech: string) => (
                      <label key={tech} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                        <input
                          type="radio"
                          name="tecnologia"
                          checked={selectedTecnologia === tech}
                          onChange={() => setSelectedTecnologia(selectedTecnologia === tech ? null : tech)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{tech}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Nível de Maturidade */}
              <div className="mb-4 pb-4 border-b">
                <button
                  onClick={() => toggleSection('nivel')}
                  className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900 hover:text-blue-600 transition-colors"
                >
                  <span>Nível de Maturidade</span>
                  {openSections.nivel ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {openSections.nivel && (
                  <div className="mt-2 space-y-2">
                    {['Ideação', 'Modelagem', 'Prototipagem', 'Implementação'].map((nivel) => (
                      <label key={nivel} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                        <input
                          type="radio"
                          name="nivel"
                          checked={selectedNivel === nivel}
                          onChange={() => setSelectedNivel(selectedNivel === nivel ? null : nivel)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{nivel}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Ordenação */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('ordenacao')}
                  className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900 hover:text-blue-600 transition-colors"
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
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                        <input
                          type="radio"
                          name="ordenacao"
                          checked={sortOrder === option.value}
                          onChange={() => setSortOrder(option.value as any)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* CONTEÚDO PRINCIPAL */}
          <main className="flex-1">
            {/* Legenda de Níveis de Maturidade do Projeto */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Níveis de Maturidade do Projeto</h3>
            <p className="text-sm text-gray-600">
              Cada projeto passa por diferentes etapas de desenvolvimento. Os níveis são atualizados automaticamente conforme o progresso do projeto.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Nível 1 - Ideação */}
            <div className="relative overflow-hidden border-2 border-yellow-200 rounded-lg p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-200 opacity-20 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-4 mx-auto shadow-md">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-center font-bold text-gray-900 mb-2 text-lg">Ideação</h4>
                <p className="text-center text-sm text-gray-700 leading-relaxed">
                  Fase inicial de concepção e planejamento do projeto
                </p>
                <div className="mt-3 flex justify-center">
                  <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                    Nível 1
                  </span>
                </div>
              </div>
            </div>

            {/* Nível 2 - Modelagem */}
            <div className="relative overflow-hidden border-2 border-blue-200 rounded-lg p-5 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 opacity-20 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4 mx-auto shadow-md">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-center font-bold text-gray-900 mb-2 text-lg">Modelagem</h4>
                <p className="text-center text-sm text-gray-700 leading-relaxed">
                  Criação de diagramas, protótipos e documentação técnica
                </p>
                <div className="mt-3 flex justify-center">
                  <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                    Nível 2
                  </span>
                </div>
              </div>
            </div>

            {/* Nível 3 - Prototipagem */}
            <div className="relative overflow-hidden border-2 border-purple-200 rounded-lg p-5 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 opacity-20 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mb-4 mx-auto shadow-md">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-center font-bold text-gray-900 mb-2 text-lg">Prototipagem</h4>
                <p className="text-center text-sm text-gray-700 leading-relaxed">
                  Desenvolvimento ativo e testes do protótipo funcional
                </p>
                <div className="mt-3 flex justify-center">
                  <span className="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
                    Nível 3
                  </span>
                </div>
              </div>
            </div>

            {/* Nível 4 - Implementação */}
            <div className="relative overflow-hidden border-2 border-green-200 rounded-lg p-5 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 opacity-20 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4 mx-auto shadow-md">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-center font-bold text-gray-900 mb-2 text-lg">Implementação</h4>
                <p className="text-center text-sm text-gray-700 leading-relaxed">
                  Projeto finalizado, testado e pronto para uso
                </p>
                <div className="mt-3 flex justify-center">
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                    Nível 4
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Nota informativa */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900">
                  <strong>Atualização Automática:</strong> O nível de maturidade é atualizado automaticamente pelo sistema sempre que o aluno faz uma atualização no projeto, garantindo transparência no progresso.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Projetos em destaque */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Projetos em Destaque</h2>
              <p className="text-gray-600 text-sm mt-1">
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
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredProjects.length} {filteredProjects.length === 1 ? 'Projeto' : 'Projetos'}
                </span>
                {filteredProjects.length !== projects.length && (
                  <span className="text-xs text-gray-500">
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
                <div key={index} className="border rounded-lg p-5 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="flex gap-2 mb-3">
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Erro ao carregar
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
              <p className="text-gray-600">Erro ao carregar projetos. Tente novamente mais tarde.</p>
            </div>
          ) : filteredProjects.length === 0 && projects.length > 0 ? (
            // Sem projetos após filtros
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300 p-8">
              <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum projeto encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Não há projetos que correspondam aos filtros selecionados.
              </p>
              
              {/* Mostrar filtros ativos */}
              <div className="max-w-md mx-auto text-left bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Filtros ativos:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {searchTerm && (
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      Busca: "{searchTerm}"
                    </li>
                  )}
                  {selectedCurso && (
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      Curso: {selectedCurso}
                    </li>
                  )}
                  {selectedCategoria && (
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      Categoria: {selectedCategoria}
                    </li>
                  )}
                  {selectedTecnologia && (
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      Tecnologia: {selectedTecnologia}
                    </li>
                  )}
                  {selectedNivel && (
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      Nível de Maturidade: {selectedNivel}
                    </li>
                  )}
                  {sortOrder !== 'novos' && (
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
                  className={`border-2 ${maturityLevel.borderColor} rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group bg-white flex flex-col h-full`}
                >
                  {/* Imagem do Projeto */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {project.imagemUrl ? (
                      <img 
                        src={project.imagemUrl} 
                        alt={project.nome}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      // Imagem padrão quando não há imagem
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                        <div className="text-center">
                          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 font-medium">Sem imagem</p>
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
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                        {project.nome}
                      </h3>
                    </div>

                    {/* Descrição */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {project.descricao}
                    </p>

                    {/* Autor */}
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>{project.autorNome}</span>
                    </div>

                    {/* Data e visualizações */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
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
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tecnologias.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                          +{project.tecnologias.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Spacer para empurrar o botão para baixo */}
                    <div className="flex-1"></div>

                    {/* Botão de ver mais - sempre alinhado no bottom */}
                    <button 
                      onClick={() => handleOpenModal(project)}
                      className="w-full mt-auto py-2.5 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg font-medium"
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
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Nenhum projeto disponível no momento.</p>
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
