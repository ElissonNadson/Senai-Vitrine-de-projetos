import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Plus, Filter, Lightbulb, FileText, Wrench, Rocket, Trash2, Edit, Eye, AlertTriangle, FolderOpen } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { getBaseRoute } from '@/utils/routes'
import UnifiedProjectCard from '@/components/cards/UnifiedProjectCard'
import { PageBanner } from '@/components/common/PageBanner'
import { ArchiveRequestModal } from '@/components/modals/ArchiveRequestModal'

import { useMeusProjetos } from '@/hooks/use-meus-projetos'

import { useRef } from 'react'

// Helper para transformar projeto para o formato unificado
const transformarProjeto = (projeto: any, isRascunho: boolean = false) => {
  // Garantir que temos um objeto válido
  if (!projeto) return null

  return {
    ...projeto,
    id: projeto.uuid || projeto.id,
    titulo: projeto.titulo || 'Sem título',
    descricao: projeto.descricao || 'Sem descrição',
    bannerUrl: projeto.banner_url || projeto.bannerUrl,
    faseAtual: projeto.fase_atual ? (
      ['IDEACAO', 'MODELAGEM', 'PROTOTIPAGEM', 'IMPLEMENTACAO'].indexOf(projeto.fase_atual) + 1
    ) : 1,
    status: isRascunho ? 'Rascunho' : (projeto.status || 'Publicado'),
    // Campos adicionais para compatibilidade e verificação de tipos
    autorNome: projeto.autores?.[0]?.nome || 'Você',
    criadoEm: projeto.criado_em || new Date().toISOString(),
    publicadoEm: projeto.data_publicacao || projeto.publicado_em || projeto.criado_em,
    visualizacoes: projeto.visualizacoes || 0,
    itinerario: projeto.itinerario,
    participouSaga: projeto.participou_saga,
    labMaker: projeto.lab_maker,

    // CORREÇÃO DE ERRO REACT #31: Mapear objetos para strings
    curso: typeof projeto.curso === 'object' ? projeto.curso?.nome : projeto.curso,
    departamento_nome: projeto.departamento?.nome || projeto.departamento_nome,
    // Se departamento for objeto, evitar passar ele se o componente espera string, 
    // mas UnifiedProjectCard lida com departamento object de forma diferente.
    // O erro estava em CURSO que é renderizado diretamente.
  }
}

function MyProjects() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Rota base dinâmica
  const baseRoute = useMemo(() => getBaseRoute(user?.tipo), [user?.tipo])

  const [selectedFase, setSelectedFase] = useState<string | null>(null)
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<'publicados' | 'rascunhos'>(() => {
    const state = location.state as { activeTab?: 'publicados' | 'rascunhos' } | null
    return state?.activeTab === 'rascunhos' ? 'rascunhos' : 'publicados'
  })
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<any>(null)

  const [archiveModalOpen, setArchiveModalOpen] = useState(false)
  const [projectToArchive, setProjectToArchive] = useState<any>(null)

  // Estado para justificativa de exclusão
  const [deleteJustification, setDeleteJustification] = useState('')

  // Usar hook de API real
  const { publicados, rascunhos, loading: isLoading, error, deleteProjeto, isDeleting, refetch } = useMeusProjetos()

  // Selecionar projetos baseado na tab ativa
  const currentProjects = activeTab === 'publicados' ? publicados : rascunhos

  useEffect(() => {
    const state = location.state as { activeTab?: 'publicados' | 'rascunhos' } | null
    if (state?.activeTab) {
      if (state.activeTab !== activeTab) {
        setActiveTab(state.activeTab)
      }
      setSelectedFase(null)
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [activeTab, location.pathname, location.state, navigate])

  // Função para obter nível de maturidade
  const getMaturityLevel = (project: any) => {
    const levels = [
      { level: 1, name: 'Ideação', fase: 'IDEACAO', icon: Lightbulb, color: 'yellow', bgColor: 'bg-yellow-400', borderColor: 'border-yellow-400' },
      { level: 2, name: 'Modelagem', fase: 'MODELAGEM', icon: FileText, color: 'blue', bgColor: 'bg-blue-500', borderColor: 'border-blue-500' },
      { level: 3, name: 'Prototipagem', fase: 'PROTOTIPAGEM', icon: Wrench, color: 'purple', bgColor: 'bg-purple-500', borderColor: 'border-purple-500' },
      { level: 4, name: 'Implementação', fase: 'IMPLEMENTACAO', icon: Rocket, color: 'green', bgColor: 'bg-green-500', borderColor: 'border-green-500' }
    ]
    if (!project || !project.fase_atual) return levels[0]
    const found = levels.find(l => l.fase === project.fase_atual)
    return found || levels[0]
  }

  // Transformar projetos para o formato do card unificado
  const projectsList = useMemo(() => {
    return activeTab === 'publicados'
      ? publicados.map(p => transformarProjeto(p, false))
      : rascunhos.map(p => transformarProjeto(p, true))
  }, [activeTab, publicados, rascunhos])

  // Filtrar projetos por fase se um filtro estiver selecionado
  const filteredProjects = useMemo(() => {
    if (!selectedFase) return projectsList
    // Mapear nome da fase para o objeto de fase do transformarProjeto (numerico) ou string
    // O filtro original usava 'Ideação', 'Modelagem' etc.
    // O UnifiedProjectCard usa numerico 1,2,3,4.
    // Vamos manter a logica original de filtro por string por enquanto, mas usando o objeto transformado
    return projectsList.filter((p: any) => {
      // Recalcular nome da fase baseado no numero ou string original
      // Helper rapido
      const mapNumToName = ['Ideação', 'Modelagem', 'Prototipagem', 'Implementação']
      const pFaseNum = p.faseAtual ? p.faseAtual - 1 : 0
      const pFaseName = mapNumToName[pFaseNum] || 'Ideação'
      return pFaseName === selectedFase
    })
  }, [projectsList, selectedFase])

  // Contar projetos por fase (usando lista completa de publicados/rascunhos transformados)
  const contarPorFase = (faseName: string) => {
    const mapNumToName = ['Ideação', 'Modelagem', 'Prototipagem', 'Implementação']
    return projectsList.filter((p: any) => {
      const pFaseNum = p.faseAtual ? p.faseAtual - 1 : 0
      const pFaseName = mapNumToName[pFaseNum] || 'Ideação'
      return pFaseName === faseName
    }).length
  }

  const handleEditProject = (projectId: string) => {
    // Navega para a página de edição do projeto
    navigate(`${baseRoute}/edit-project/${projectId}`)
  }

  const handleContinueEditing = (projectId: string) => {
    // Navega para a página de criação com o rascunho
    navigate(`${baseRoute}/create-project?rascunho=${projectId}`)
  }

  const handleDeleteProject = (project: any) => {
    setProjectToDelete(project)
    setDeleteJustification('') // Limpar justificativa anterior
    setDeleteModalOpen(true)
  }

  const handleArchiveProject = (project: any) => {
    setProjectToArchive(project)
    setArchiveModalOpen(true)
  }

  const confirmDelete = async () => {
    if (projectToDelete) {
      try {
        await deleteProjeto(projectToDelete.uuid)

        // Também limpar o rascunho local se existir, para evitar confusão
        localStorage.removeItem('project_draft')
        localStorage.removeItem('project_draft_timestamp')

        setDeleteModalOpen(false)
        setProjectToDelete(null)
      } catch (err: any) {
        console.error('Erro ao excluir projeto:', err)
        alert(err.message || 'Erro ao excluir projeto')
      }
    }
  }

  const handleAddStage = (projectId: string) => {
    // Navega para a página de adicionar etapa
    navigate(`${baseRoute}/projects/${projectId}/add-stage`)
  }

  const handleViewProject = (projectId: string) => {
    // Navega diretamente para a página de visualização
    navigate(`${baseRoute}/projects/${projectId}/view`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageBanner
        title="Meus Projetos"
        subtitle="Gerencie e acompanhe seus projetos"
        icon={<FolderOpen />}
        action={
          <Link
            to={`${baseRoute}/create-project`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all shadow-lg backdrop-blur-sm transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Novo Projeto
          </Link>
        }
      />

      <div className="max-w-7xl mx-auto px-6 py-8 -mt-8 relative z-20">

        {/* Tabs de Publicados e Rascunhos */}
        <div className="mb-6 flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              setActiveTab('publicados')
              setSelectedFase(null)
            }}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'publicados'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            Publicados ({publicados.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('rascunhos')
              setSelectedFase(null)
            }}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'rascunhos'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            Rascunhos ({rascunhos.length})
          </button>
        </div>

        {/* Contador */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedFase ? (
              <>
                Mostrando <strong>{filteredProjects.length}</strong> {filteredProjects.length === 1 ? 'projeto' : 'projetos'} em <strong>{selectedFase}</strong>
              </>
            ) : (
              <>
                Você tem <strong>{currentProjects.length}</strong> {currentProjects.length === 1 ? 'projeto' : 'projetos'} {activeTab === 'publicados' ? 'publicados' : 'em rascunho'}
              </>
            )}
          </p>
          {selectedFase && (
            <button
              onClick={() => setSelectedFase(null)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              Limpar filtro
            </button>
          )}
        </div>

        {/* Filtros por Fase de Desenvolvimento - só mostra para publicados */}
        {activeTab === 'publicados' && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-gray-900 dark:text-white">
                Filtrar por Etapa de Desenvolvimento
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Ideação */}
              <button
                onClick={() => setSelectedFase(selectedFase === 'Ideação' ? null : 'Ideação')}
                className={`relative overflow-hidden border-2 rounded-xl p-4 transition-all duration-300 ${selectedFase === 'Ideação'
                  ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/40 dark:to-yellow-800/40 shadow-lg scale-105'
                  : 'border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 hover:shadow-md hover:scale-102'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-yellow-400 dark:bg-yellow-500 rounded-full flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Ideação</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{contarPorFase('Ideação')} projetos</p>
                  </div>
                </div>
              </button>

              {/* Modelagem */}
              <button
                onClick={() => setSelectedFase(selectedFase === 'Modelagem' ? null : 'Modelagem')}
                className={`relative overflow-hidden border-2 rounded-xl p-4 transition-all duration-300 ${selectedFase === 'Modelagem'
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 shadow-lg scale-105'
                  : 'border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:shadow-md hover:scale-102'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-full flex-shrink-0">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Modelagem</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{contarPorFase('Modelagem')} projetos</p>
                  </div>
                </div>
              </button>

              {/* Prototipagem */}
              <button
                onClick={() => setSelectedFase(selectedFase === 'Prototipagem' ? null : 'Prototipagem')}
                className={`relative overflow-hidden border-2 rounded-xl p-4 transition-all duration-300 ${selectedFase === 'Prototipagem'
                  ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40 shadow-lg scale-105'
                  : 'border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:shadow-md hover:scale-102'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-500 dark:bg-purple-600 rounded-full flex-shrink-0">
                    <Wrench className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Prototipagem</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{contarPorFase('Prototipagem')} projetos</p>
                  </div>
                </div>
              </button>

              {/* Implementação */}
              <button
                onClick={() => setSelectedFase(selectedFase === 'Implementação' ? null : 'Implementação')}
                className={`relative overflow-hidden border-2 rounded-xl p-4 transition-all duration-300 ${selectedFase === 'Implementação'
                  ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40 shadow-lg scale-105'
                  : 'border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:shadow-md hover:scale-102'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-500 dark:bg-green-600 rounded-full flex-shrink-0">
                    <Rocket className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Implementação</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{contarPorFase('Implementação')} projetos</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Grid de Projetos */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Tentar novamente
            </button>
          </div>
        ) : currentProjects.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
            <div className="flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto mb-4">
              <Plus className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {activeTab === 'publicados' ? 'Nenhum projeto publicado' : 'Nenhum rascunho'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {activeTab === 'publicados'
                ? 'Crie seu primeiro projeto e comece a construir seu portfólio'
                : 'Você não tem projetos em rascunho no momento'}
            </p>
            <Link
              to={`${baseRoute}/create-project`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Criar Novo Projeto</span>
            </Link>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
            <Filter className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum projeto nesta fase
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Você não possui projetos em <strong>{selectedFase}</strong>
            </p>
            <button
              onClick={() => setSelectedFase(null)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              Ver todos os projetos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: any) => (
              <UnifiedProjectCard
                key={project.id}
                project={project}
                variant="compact"
                showActions={true}
                isOwner={true}
                actions={{
                  onEdit: (id) => {
                    if (activeTab === 'rascunhos') {
                      handleContinueEditing(id)
                    } else {
                      handleEditProject(id)
                    }
                  },
                  onDelete: (id) => handleDeleteProject(project),
                  onArchive: (id) => handleArchiveProject(project),
                  onView: (id) => handleViewProject(id)
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {deleteModalOpen && projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Excluir Projeto
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Esta ação não pode ser desfeita
                </p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Tem certeza que deseja excluir o projeto <strong>"{projectToDelete.titulo}"</strong>?
              <br />
              <span className="text-xs text-gray-500 mt-2 block">O projeto será arquivado e não ficará mais visível publicamente.</span>
            </p>

            <div className="mb-6">
              <label htmlFor="delete-justification" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Justificativa da exclusão *
              </label>
              <textarea
                id="delete-justification"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                placeholder="Por que você está excluindo este projeto?"
                value={deleteJustification}
                onChange={(e) => setDeleteJustification(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false)
                  setProjectToDelete(null)
                }}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDeleting || !deleteJustification.trim()}
              >
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Solicitação de Arquivamento */}
      <ArchiveRequestModal
        isOpen={archiveModalOpen}
        onClose={() => {
          setArchiveModalOpen(false)
          setProjectToArchive(null)
        }}
        project={projectToArchive}
        onSuccess={() => {
          refetch()
        }}
      />
    </div>
  )
}

export default MyProjects
