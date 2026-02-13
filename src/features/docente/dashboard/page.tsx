import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Eye, Lightbulb, FileText, Wrench, Rocket, ChevronLeft, ChevronRight, FolderOpen, AlertCircle, Users, BookOpen } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { PhaseStatsCards } from '../../student/dashboard/components/PhaseStatsCards'
import UnifiedProjectCard from '@/components/cards/UnifiedProjectCard'
import HorizontalProjectFilters from '@/components/filters/HorizontalProjectFilters'
import { DashboardLayout } from '@/features/shared/dashboard/DashboardLayout'
import { useProjetos } from '@/hooks/use-queries'
import Pagination from '@/components/ui/Pagination'
import { mapFaseToNumber, mapFaseNameToStatusKey } from '@/utils/phase-utils'

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
    categoria: projeto.categoria || projeto.departamento || 'Geral',
    liderProjeto: lider ? { nome: lider.nome, email: lider.email || '' } : undefined,
    equipe: equipe.map((a: any) => ({ nome: a.nome })),
    orientadores: (projeto.orientadores || []).map((o: any) => ({ nome: o.nome })),
    tecnologias: (projeto.tecnologias || []).map((t: any) => t.nome),
    criadoEm: projeto.criado_em,
    atualizadoEm: projeto.atualizado_em || projeto.criado_em,
    publicadoEm: projeto.data_publicacao || projeto.publicado_em || projeto.criado_em,
    repositorio_url: projeto.repositorio_url,
    demo_url: projeto.demo_url,
    isOwner: false,
    autorNome: lider ? lider.nome : 'Autor Desconhecido',
    status: projeto.status || 'ativo',
    visualizacoes: projeto.visualizacoes || 0,
    itinerario: projeto.itinerario,
    participouSaga: projeto.saga_senai || projeto.participou_saga,
    labMaker: projeto.senai_lab || projeto.lab_maker,
    participouEdital: projeto.participou_edital,
    ganhouPremio: projeto.ganhou_premio,
    // Adicionar status_fases vindo da API
    status_fases: projeto.status_fases || {}
  }
}

function DocenteDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null)
  const [selectedNivel, setSelectedNivel] = useState<string | null>(null)
  const [selectedStatusFase, setSelectedStatusFase] = useState<string | null>(null)
  const [apenasFaseAtual, setApenasFaseAtual] = useState<boolean>(true)
  const [selectedCurso, setSelectedCurso] = useState<string | null>(null)
  const [selectedDestaque, setSelectedDestaque] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'A-Z' | 'Z-A' | 'novos' | 'antigos' | 'mais-vistos'>('novos')

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 10



  // Buscar todos os projetos da API (para filtro local e paginação correta)
  const { data, isLoading, error } = useProjetos({
    limit: 1000,
    offset: 0
  })

  // Extrair dados da resposta
  const projetosAPI = data?.projetos || []

  // Transformar projetos para o formato do card
  const projects = useMemo(() => {
    return projetosAPI.map(transformarProjeto)
  }, [projetosAPI])

  // Calcular estatísticas de projetos por fase (todos)
  const projetosIdeacao = projects.filter(p => p.faseAtual === 1).length
  const projetosModelagem = projects.filter(p => p.faseAtual === 2).length
  const projetosPrototipagem = projects.filter(p => p.faseAtual === 3).length
  const projetosImplementacao = projects.filter(p => p.faseAtual === 4).length

  // Contar projetos que o professor orienta
  const projetosOrientando = useMemo(() => {
    if (!user) return 0
    return projects.filter(p =>
      (p.orientadores || []).some((o: any) =>
        o.nome === user.nome || (o.email && o.email === user.email)
      )
    ).length
  }, [projects, user])

  // Aplicar filtros locais
  const filteredProjects = useMemo(() => {
    let result = [...projects]

    if (searchTerm) {
      const lower = searchTerm.toLowerCase()
      result = result.filter(p =>
        p.nome.toLowerCase().includes(lower) ||
        p.descricao?.toLowerCase().includes(lower)
      )
    }

    if (selectedCategoria) {
      result = result.filter(p => p.categoria === selectedCategoria)
    }

    if (selectedCurso) {
      const cursoSelecionadoNorm = selectedCurso.replace('Técnico em ', '').trim().toLowerCase()
      result = result.filter(p => {
        const cursoProjeto = p.curso || ''
        const cursoProjetoNorm = cursoProjeto.replace('Técnico em ', '').trim().toLowerCase()
        return cursoProjetoNorm === cursoSelecionadoNorm ||
          cursoProjetoNorm.includes(cursoSelecionadoNorm) ||
          cursoSelecionadoNorm.includes(cursoProjetoNorm)
      })
    }

    if (selectedNivel) {
      result = result.filter(p => {
        const targetPhase = mapFaseToNumber(selectedNivel)
        const faseProjeto = p.faseAtual
        const faseKey = mapFaseNameToStatusKey(selectedNivel)
        const statusFases = (p as any).status_fases || {}
        const faseStatus = statusFases[faseKey]?.status

        // Se "Apenas fase atual" está marcado, usar lógica antiga (filtrar apenas pela fase atual)
        if (apenasFaseAtual) {
          const faseMatch = faseProjeto === targetPhase

          // Se status da fase também foi selecionado, filtrar por ele
          if (selectedStatusFase && faseMatch) {
            return faseStatus === selectedStatusFase
          }

          return faseMatch
        }

        // Lógica nova: filtrar por status da fase específica, independente da fase atual
        // Se status da fase também foi selecionado, filtrar apenas por status da fase específica
        // Isso permite encontrar projetos em fases posteriores que já concluíram a fase filtrada
        if (selectedStatusFase) {
          return faseStatus === selectedStatusFase
        }

        // Se apenas a fase foi selecionada (sem status), verificar se o projeto está nessa fase ou em fases posteriores
        // e se a fase filtrada tem algum conteúdo (não está pendente)
        if (faseStatus && faseStatus !== 'Pendente') {
          return true
        }

        // Se não tem status definido, verificar pela fase atual do projeto
        return faseProjeto === targetPhase
      })
    }

    if (selectedDestaque) {
      switch (selectedDestaque) {
        case 'Itinerário':
          result = result.filter(p => p.itinerario)
          break
        case 'SENAI Lab':
          result = result.filter(p => p.labMaker)
          break
        case 'SAGA SENAI':
          result = result.filter(p => p.participouSaga)
          break
        case 'Edital':
          result = result.filter(p => p.participouEdital)
          break
        case 'Prêmio':
          result = result.filter(p => p.ganhouPremio)
          break
      }
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
      case 'mais-vistos':
        result.sort((a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0))
        break
    }

    return result
  }, [projects, searchTerm, selectedCategoria, selectedCurso, selectedNivel, selectedStatusFase, apenasFaseAtual, selectedDestaque, sortOrder])

  // Paginação Client-Side
  const totalResultados = filteredProjects.length
  const totalPaginas = Math.ceil(totalResultados / itensPorPagina) || 1

  const paginatedProjects = useMemo(() => {
    const startIndex = (paginaAtual - 1) * itensPorPagina
    return filteredProjects.slice(startIndex, startIndex + itensPorPagina)
  }, [filteredProjects, paginaAtual])

  const handleProjectClick = (project: any) => {
    navigate(`/docente/projetos/${project.uuid || project.id}/visualizar`)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setPaginaAtual(1)
  }

  return (
    <>
      <DashboardLayout
        bannerTitle="Painel do Docente"
        bannerSubtitle="Acompanhe os projetos e orientações"
        bannerIcon={<Rocket />}
        bannerAction={
          <Link
            to="/docente/criar-projeto"
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
                  <p className="text-4xl font-bold mt-2">{projects.length}</p>
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
            selectedStatusFase={selectedStatusFase}
            setSelectedStatusFase={setSelectedStatusFase}
            apenasFaseAtual={apenasFaseAtual}
            setApenasFaseAtual={setApenasFaseAtual}
            selectedDestaque={selectedDestaque}
            setSelectedDestaque={setSelectedDestaque}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            totalResults={totalResultados}
          />
        }
        mainContent={
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mostrando <strong>{filteredProjects.length}</strong> de <strong>{projects.length}</strong> projetos
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
            ) : paginatedProjects.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
                <FolderOpen className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {projects.length === 0 ? 'Nenhum projeto cadastrado ainda' : 'Nenhum projeto encontrado'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {projects.length === 0
                    ? 'Os projetos dos alunos aparecerão aqui'
                    : 'Tente ajustar os filtros ou limpar a busca'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProjects.map((project: any) => (
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
          <Pagination
            currentPage={paginaAtual}
            totalPages={totalPaginas}
            onPageChange={setPaginaAtual}
          />
        }
      />


    </>
  )
}

export default DocenteDashboard
