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

  // Buscar projetos da API com paginação
  const { data, isLoading, error } = useProjetos({
    busca: searchTerm || undefined,
    limit: itensPorPagina,
    offset: (paginaAtual - 1) * itensPorPagina,
    // Note: API might not support all filters directly yet, or useProjetos handles it.
    // Ideally pass category, level etc to API. For now strictly layout refactor.
  })

  // Extrair dados da resposta paginada
  const projetosAPI = data?.projetos || []
  const totalProjetos = data?.total || 0
  const totalPaginas = data?.totalPaginas || 1

  // Transformar projetos para o formato do card
  const projects = useMemo(() => {
    return projetosAPI.map(transformarProjeto)
  }, [projetosAPI])

  // Calcular estatísticas de projetos por fase (baseado no total da API)
  const projetosIdeacao = projetosAPI.filter((p: any) => mapFaseToNumber(p.fase_atual) === 1).length
  const projetosModelagem = projetosAPI.filter((p: any) => mapFaseToNumber(p.fase_atual) === 2).length
  const projetosPrototipagem = projetosAPI.filter((p: any) => mapFaseToNumber(p.fase_atual) === 3).length
  const projetosImplementacao = projetosAPI.filter((p: any) => mapFaseToNumber(p.fase_atual) === 4).length

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
          to={`${baseRoute}/create-project`}
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
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          totalResults={totalProjetos}
        />
      }
      mainContent={
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Mostrando {projects.length} de {totalProjetos} projetos
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
          ) : projects.length === 0 ? (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project) => (
                <UnifiedProjectCard
                  key={project.id}
                  project={project}
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
              onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
              disabled={paginaAtual === 1}
              className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPaginas > 5) {
                  if (paginaAtual > 3) {
                    pageNum = paginaAtual - 2 + i;
                  }
                  if (pageNum > totalPaginas) pageNum = totalPaginas - (4 - i);
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPaginaAtual(pageNum)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${paginaAtual === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
              disabled={paginaAtual === totalPaginas}
              className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )
      }
    />
  )
}

export default Dashboard
