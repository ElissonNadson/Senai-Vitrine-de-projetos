import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Eye, Lightbulb, FileText, Wrench, Rocket, ChevronLeft, ChevronRight, FolderOpen, AlertCircle, Users, BookOpen } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { PhaseStatsCards } from '../../student/dashboard/components/PhaseStatsCards'
import UnifiedProjectCard from '@/components/cards/UnifiedProjectCard'
import HorizontalProjectFilters from '@/components/filters/HorizontalProjectFilters'
import { DashboardLayout } from '@/features/shared/dashboard/DashboardLayout'
import { useProjetos } from '@/hooks/use-queries'

// Função para mapear fase da API para número
const mapFaseToNumber = (fase: string): number => {
  const faseMap: Record<string, number> = {
    'IDEACAO': 1,
    'PLANEJAMENTO': 2,
    'EXECUCAO': 3,
    'FINALIZACAO': 4,
    'MODELAGEM': 2,
    'PROTOTIPAGEM': 3,
    'IMPLEMENTACAO': 4
  }
  return faseMap[fase] || 1
}

// Função para transformar projeto da API para o formato do card
const transformarProjeto = (projeto: any) => {
  const autores = projeto.autores || []
  const lider = autores.find((a: any) => a.papel === 'LIDER') || autores[0]
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
    categoria: projeto.departamento || 'Geral',
    liderProjeto: lider ? { nome: lider.nome, email: lider.email || '' } : undefined,
    equipe: equipe.map((a: any) => ({ nome: a.nome })),
    orientadores: (projeto.orientadores || []).map((o: any) => ({ nome: o.nome })),
    tecnologias: (projeto.tecnologias || []).map((t: any) => t.nome),
    criadoEm: projeto.criado_em,
    publicadoEm: projeto.data_publicacao || projeto.publicado_em || projeto.criado_em,
    repositorio_url: projeto.repositorio_url,
    demo_url: projeto.demo_url,
    isOwner: false,
    autorNome: lider ? lider.nome : 'Autor Desconhecido',
    status: projeto.status || 'ativo',
    visualizacoes: projeto.visualizacoes || 0,
    itinerario: projeto.itinerario,
    participouSaga: projeto.participou_saga,
    labMaker: projeto.lab_maker
  }
}

function ProfessorDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null)
  const [selectedNivel, setSelectedNivel] = useState<string | null>(null)
  const [selectedCurso, setSelectedCurso] = useState<string | null>(null)
  const [selectedDestaque, setSelectedDestaque] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'A-Z' | 'Z-A' | 'novos' | 'antigos' | 'mais-vistos'>('novos')

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 10



  // Buscar projetos da API com paginação
  const { data, isLoading, error } = useProjetos({
    busca: searchTerm || undefined,
    limit: itensPorPagina,
    offset: (paginaAtual - 1) * itensPorPagina
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

  // Contar projetos que o professor orienta
  const projetosOrientando = useMemo(() => {
    if (!user) return 0
    return projetosAPI.filter((p: any) =>
      (p.orientadores || []).some((o: any) =>
        o.email === user.email || o.nome === user.nome
      )
    ).length
  }, [projetosAPI, user])

  // Aplicar filtros locais
  const filteredProjects = useMemo(() => {
    let result = [...projects]

    if (selectedCategoria) {
      result = result.filter(p => p.categoria === selectedCategoria)
    }

    if (selectedCurso) {
      result = result.filter(p => p.curso === selectedCurso)
    }

    if (selectedNivel) {
      const targetPhase = mapFaseToNumber(selectedNivel)
      result = result.filter(p => p.faseAtual === targetPhase)
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
  }, [projects, selectedCategoria, selectedCurso, selectedNivel, selectedDestaque, sortOrder])

  const handleProjectClick = (project: any) => {
    navigate(`/professor/projects/${project.uuid || project.id}/view`)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setPaginaAtual(1)
  }

  return (
    <>
      <DashboardLayout
        bannerTitle="Painel do Professor"
        bannerSubtitle="Acompanhe os projetos e orientações"
        bannerIcon={<Rocket />}
        bannerAction={
          <Link
            to="/professor/create-project"
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Novo Projeto</span>
          </Link>
        }
        extraTopContent={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">Projetos que Oriento</p>
                  <p className="text-4xl font-bold mt-2">{projetosOrientando}</p>
                  <p className="text-indigo-200 text-sm mt-1">projetos sob sua orientação</p>
                </div>
                <div className="bg-white/20 rounded-full p-4">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Total de Projetos</p>
                  <p className="text-4xl font-bold mt-2">{totalProjetos}</p>
                  <p className="text-emerald-200 text-sm mt-1">na plataforma</p>
                </div>
                <div className="bg-white/20 rounded-full p-4">
                  <FolderOpen className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Alunos Orientados</p>
                  <p className="text-4xl font-bold mt-2">-</p>
                  <p className="text-amber-200 text-sm mt-1">em breve</p>
                </div>
                <div className="bg-white/20 rounded-full p-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        }
        statsContent={
          <PhaseStatsCards
            projetosIdeacao={projetosIdeacao}
            projetosModelagem={projetosModelagem}
            projetosPrototipagem={projetosPrototipagem}
            projetosImplementacao={projetosImplementacao}
          />
        }
        filtersContent={
          <HorizontalProjectFilters
            searchTerm={searchTerm}
            setSearchTerm={handleSearchChange}
            selectedCurso={selectedCurso}
            setSelectedCurso={setSelectedCurso}
            selectedCategoria={selectedCategoria}
            setSelectedCategoria={setSelectedCategoria}
            selectedNivel={selectedNivel}
            setSelectedNivel={setSelectedNivel}
            selectedDestaque={selectedDestaque}
            setSelectedDestaque={setSelectedDestaque}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            totalResults={totalProjetos}
          />
        }
        mainContent={
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mostrando <strong>{filteredProjects.length}</strong> de <strong>{totalProjetos}</strong> projetos
                {totalPaginas > 1 && (
                  <span className="ml-2">• Página {paginaAtual} de {totalPaginas}</span>
                )}
              </p>
            </div>

            {/* Estado de Erro */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center mb-6">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
                  Erro ao carregar projetos
                </h3>
                <p className="text-red-600 dark:text-red-300 text-sm">
                  Não foi possível carregar os projetos. Tente novamente mais tarde.
                </p>
              </div>
            )}

            {/* Estado de Loading */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                    <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
                <FolderOpen className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {totalProjetos === 0 ? 'Nenhum projeto cadastrado ainda' : 'Nenhum projeto encontrado'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {totalProjetos === 0
                    ? 'Os projetos dos alunos aparecerão aqui'
                    : 'Tente ajustar os filtros ou limpar a busca'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project: any) => (
                  <UnifiedProjectCard
                    key={project.id}
                    project={project}
                    variant="compact"
                    isGuest={false}
                    onClick={handleProjectClick}
                  />
                ))}
              </div>
            )}
          </>
        }
        paginationContent={
          totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-2">
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
          )
        }
      />


    </>
  )
}

export default ProfessorDashboard
