import React, { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, Users, BookOpen, TrendingUp, UserPlus, LogIn, AlertCircle, Calendar, Code, ExternalLink, CheckCircle, Lightbulb, FileText, Wrench, Rocket, Sun, Moon, ChevronLeft, ChevronRight, FolderOpen, Plus } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { PhaseStatsCards } from './PhaseStatsCards'
import UnifiedProjectCard from '@/components/cards/UnifiedProjectCard'
import ProjectFilters from '@/components/filters/ProjectFilters'
import { getProjetos } from '@/api/queries'
import { useQuery } from '@tanstack/react-query'
import { mapFaseToNumber } from '@/utils/phase-utils'

// Função para transformar projeto da API para o formato do card
const transformarProjeto = (projeto: any) => {
  const autores = projeto.autores || []
  const lider = autores.find((a: any) => a.papel === 'LIDER')
  const equipe = autores.filter((a: any) => a.papel !== 'LIDER')

  return {
    id: projeto.uuid,
    uuid: projeto.uuid,
    nome: projeto.titulo,
    descricao: projeto.descricao,
    bannerUrl: projeto.banner_url,
    faseAtual: mapFaseToNumber(projeto.fase_atual),
    fase_atual: projeto.fase_atual,
    curso: projeto.curso_nome || projeto.departamento || 'Não informado',
    categoria: projeto.categoria || projeto.departamento || 'Geral',
    liderProjeto: lider ? { nome: lider.nome } : null,
    equipe: equipe.map((a: any) => ({ nome: a.nome })),
    orientadores: (projeto.orientadores || []).map((o: any) => ({ nome: o.nome })),
    tecnologias: (projeto.tecnologias || []).map((t: any) => t.nome),
    criadoEm: projeto.criado_em,
    atualizadoEm: projeto.atualizado_em || projeto.criado_em,
    publicadoEm: projeto.data_publicacao || projeto.publicado_em || projeto.criado_em,
    repositorio_url: projeto.repositorio_url,
    demo_url: projeto.demo_url,
    isOwner: false,
    itinerario: projeto.itinerario,
    participouSaga: projeto.saga_senai || projeto.participou_saga,
    labMaker: projeto.senai_lab || projeto.lab_maker,
    participouEdital: projeto.participou_edital,
    ganhouPremio: projeto.ganhou_premio
  }
}

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

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 10

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

  // Buscar projetos da API com paginação
  const { data, isLoading, error } = useQuery({
    queryKey: ['projetos-publicos', searchTerm, paginaAtual],
    queryFn: () => getProjetos({
      busca: searchTerm || undefined,
      limit: itensPorPagina,
      offset: (paginaAtual - 1) * itensPorPagina
    }),
    staleTime: 30000, // 30 segundos
    retry: 1
  })

  // Extrair dados da resposta paginada
  const projetosAPI = data?.projetos || []
  const totalProjetos = data?.total || 0
  const totalPaginas = data?.totalPaginas || 1

  // Transformar projetos para o formato do card
  const projects = useMemo(() => {
    return projetosAPI.map(transformarProjeto)
  }, [projetosAPI])

  // Calcular estatísticas de projetos por fase
  const projetosIdeacao = projetosAPI.filter((p: any) => mapFaseToNumber(p.fase_atual) === 1).length
  const projetosModelagem = projetosAPI.filter((p: any) => mapFaseToNumber(p.fase_atual) === 2).length
  const projetosPrototipagem = projetosAPI.filter((p: any) => mapFaseToNumber(p.fase_atual) === 3).length
  const projetosImplementacao = projetosAPI.filter((p: any) => mapFaseToNumber(p.fase_atual) === 4).length

  useEffect(() => {
    if (error) {
      console.log('Erro ao buscar projetos:', error)
      if (error.message?.includes('CORS') || error.message?.includes('Access-Control')) {
        setCorsError('Erro de CORS detectado ao tentar acessar dados públicos')
      }
    }
  }, [error])

  // Funções para controlar o modal
  const handleOpenModal = (project: any) => {
    // Visitantes devem ir para a página específica de visitante
    navigate(`/visitante/projeto/${project.id}`)
  }

  // Aplicar filtros locais (categoria, nível, curso, ordenação)
  const filteredProjects = useMemo(() => {
    let result = [...projects]

    if (selectedCategoria) {
      result = result.filter(p => p.categoria === selectedCategoria)
    }

    if (selectedCurso) {
      result = result.filter(p => p.curso === selectedCurso)
    }

    if (selectedNivel) {
      const nivelNum = parseInt(selectedNivel)
      result = result.filter(p => p.faseAtual === nivelNum)
    }

    if (selectedDestaques.length > 0) {
      result = result.filter(p => {
        return selectedDestaques.some(d => {
          switch (d) {
            case 'Itinerário': return p.itinerario
            case 'SENAI Lab': return p.labMaker
            case 'SAGA SENAI': return p.participouSaga
            case 'Edital': return p.participouEdital
            case 'Prêmio': return p.ganhouPremio
            default: return false
          }
        })
      })
    }

    // Ordenação
    switch (sortOrder) {
      case 'A-Z':
        result.sort((a, b) => a.nome.localeCompare(b.nome))
        break
      case 'Z-A':
        result.sort((a, b) => b.nome.localeCompare(a.nome))
        break
      case 'novos':
        result.sort((a, b) => new Date(b.criadoEm || 0).getTime() - new Date(a.criadoEm || 0).getTime())
        break
      case 'antigos':
        result.sort((a, b) => new Date(a.criadoEm || 0).getTime() - new Date(b.criadoEm || 0).getTime())
        break
    }

    return result
  }, [projects, selectedCategoria, selectedCurso, selectedNivel, sortOrder])

  // Reset para página 1 quando busca mudar
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setPaginaAtual(1)
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
            className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 relative group overflow-hidden ${isAnimating ? 'scale-110 bg-blue-500/10 dark:bg-blue-400/10' : ''
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
                setSearchTerm={handleSearchChange}
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
            {/* Info de paginação */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mostrando <strong>{filteredProjects.length}</strong> de <strong>{totalProjetos}</strong> projetos
                {totalPaginas > 1 && (
                  <span className="ml-2">• Página {paginaAtual} de {totalPaginas}</span>
                )}
              </p>
            </div>

            {/* Projetos */}
            <div className="mb-8">
              {isLoading ? (
                // Loading skeleton
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                      <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                // Erro ao carregar
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
                    Erro ao carregar projetos
                  </h3>
                  <p className="text-red-600 dark:text-red-300 text-sm">
                    Não foi possível carregar os projetos. Tente novamente mais tarde.
                  </p>
                </div>
              ) : filteredProjects.length === 0 ? (
                // Sem projetos
                <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
                  <FolderOpen className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {totalProjetos === 0 ? 'Nenhum projeto cadastrado ainda' : 'Nenhum projeto encontrado'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {totalProjetos === 0
                      ? 'Em breve novos projetos serão publicados pelos alunos!'
                      : 'Tente ajustar os filtros ou limpar a busca'}
                  </p>
                  {projects.length > 0 && filteredProjects.length === 0 && (
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedCategoria(null)
                        setSelectedNivel(null)
                        setSelectedCurso(null)
                        setSelectedDestaques([])
                        setSortOrder('novos')
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Limpar Filtros
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Grid de Projetos */}
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

                  {/* Paginação */}
                  {totalPaginas > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                      <button
                        onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                        disabled={paginaAtual === 1}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                          let pageNum: number
                          if (totalPaginas <= 5) {
                            pageNum = i + 1
                          } else if (paginaAtual <= 3) {
                            pageNum = i + 1
                          } else if (paginaAtual >= totalPaginas - 2) {
                            pageNum = totalPaginas - 4 + i
                          } else {
                            pageNum = paginaAtual - 2 + i
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setPaginaAtual(pageNum)}
                              className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${paginaAtual === pageNum
                                  ? 'bg-indigo-600 text-white'
                                  : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                              {pageNum}
                            </button>
                          )
                        })}
                      </div>

                      <button
                        onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                        disabled={paginaAtual === totalPaginas}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Próximo
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default GuestDashboard
