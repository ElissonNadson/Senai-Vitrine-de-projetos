import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Rocket, AlertCircle, FolderOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useGuest } from '@/contexts/guest-context'
import { getBaseRoute } from '@/utils/routes'
import GuestDashboard from './components/guest-dashboard'

import { PhaseStatsCards } from './components/PhaseStatsCards'
import UnifiedProjectCard from '@/components/cards/UnifiedProjectCard'
import HorizontalProjectFilters from '@/components/filters/HorizontalProjectFilters'
import { PageBanner } from '@/components/common/PageBanner'
import { useProjetos } from '@/hooks/use-queries'
import { DashboardLayout } from '@/features/shared/dashboard/DashboardLayout'
import Pagination from '@/components/ui/Pagination'

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
    ganhouPremio: projeto.ganhou_premio
  }
}

function Dashboard() {
  const { user } = useAuth()
  const { isGuest } = useGuest()
  const navigate = useNavigate()

  // Rota base dinâmica
  const baseRoute = useMemo(() => getBaseRoute(user?.tipo), [user?.tipo])

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null)
  const [selectedNivel, setSelectedNivel] = useState<string | null>(null)
  const [selectedCurso, setSelectedCurso] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'A-Z' | 'Z-A' | 'novos' | 'antigos' | 'mais-vistos'>('novos')

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 10

  // Se é visitante, mostrar dashboard de visitante
  if (isGuest) {
    return <GuestDashboard />
  }

  // Buscar todos os projetos para filtragem no cliente
  const { data, isLoading, error } = useProjetos({
    limit: 1000,
    offset: 0
  })

  // Extrair dados
  const projetosAPI = data?.projetos || []

  // Transformar projetos
  const projects = useMemo(() => {
    return projetosAPI.map(transformarProjeto)
  }, [projetosAPI])

  // Estatísticas globais (todos os projetos)
  const projetosIdeacao = projects.filter(p => p.faseAtual === 1).length
  const projetosModelagem = projects.filter(p => p.faseAtual === 2).length
  const projetosPrototipagem = projects.filter(p => p.faseAtual === 3).length
  const projetosImplementacao = projects.filter(p => p.faseAtual === 4).length

  // Estado adicional para Destaque
  const [selectedDestaque, setSelectedDestaque] = useState<string | null>(null)

  // Lógica de Filtragem (Client-Side)
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
      const nivelNum = mapFaseToNumber(selectedNivel.toUpperCase())
      result = result.filter(p => p.faseAtual === nivelNum)
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
  }, [projects, searchTerm, selectedCategoria, selectedCurso, selectedNivel, selectedDestaque, sortOrder])

  // Paginação Client-Side
  const totalResultados = filteredProjects.length
  const totalPaginas = Math.ceil(totalResultados / itensPorPagina) || 1

  const paginatedProjects = useMemo(() => {
    const startIndex = (paginaAtual - 1) * itensPorPagina
    return filteredProjects.slice(startIndex, startIndex + itensPorPagina)
  }, [filteredProjects, paginaAtual])


  // Reset para página 1 quando busca mudar
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setPaginaAtual(1)
  }

  return (
    <DashboardLayout
      bannerTitle="Explorar Projetos"
      bannerSubtitle="Descubra todos os projetos da vitrine SENAI"
      bannerIcon={<Rocket />}
      bannerAction={
        <Link
          to={`${baseRoute}/criar-projeto`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all shadow-lg backdrop-blur-sm transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Novo Projeto
        </Link>
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
          totalResults={totalResultados}
        />
      }
      mainContent={
        <>
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Mostrando {filteredProjects.length} de {projects.length} projetos
              </h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl h-96 animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Erro ao carregar projetos</h3>
                <p className="text-gray-500 dark:text-gray-400">Por favor, tente novamente mais tarde.</p>
              </div>
            ) : paginatedProjects.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FolderOpen className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Nenhum projeto encontrado</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Tente ajustar seus filtros de busca ou crie um novo projeto para começar.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProjects.map((project) => (
                    <UnifiedProjectCard
                      key={project.id}
                      project={project}
                    />
                  ))}
                </div>


              </>
            )}
          </>
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
  )
}

export default Dashboard
