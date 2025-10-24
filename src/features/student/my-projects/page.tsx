import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Filter, Lightbulb, FileText, Wrench, Rocket } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import UnifiedProjectCard from '@/components/cards/UnifiedProjectCard'
import UnifiedProjectModal from '@/components/modals/UnifiedProjectModal'
import mockProjectsData from '@/data/mockProjects.json'

function MyProjects() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [selectedFase, setSelectedFase] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Usar dados mockados do JSON - filtrar apenas projetos do usuário
  const isLoading = false
  const myProjects = (mockProjectsData.projects || []).filter(p => p.isOwner === true)

  // Função para obter nível de maturidade
  const getMaturityLevel = (project: any) => {
    const levels = [
      { level: 1, name: 'Ideação', icon: Lightbulb, color: 'yellow', bgColor: 'bg-yellow-400', borderColor: 'border-yellow-400' },
      { level: 2, name: 'Modelagem', icon: FileText, color: 'blue', bgColor: 'bg-blue-500', borderColor: 'border-blue-500' },
      { level: 3, name: 'Prototipagem', icon: Wrench, color: 'purple', bgColor: 'bg-purple-500', borderColor: 'border-purple-500' },
      { level: 4, name: 'Implementação', icon: Rocket, color: 'green', bgColor: 'bg-green-500', borderColor: 'border-green-500' }
    ]
    if (!project || typeof project.faseAtual === 'undefined') return levels[0]
    const fase = project.faseAtual || 1
    return levels[fase - 1] || levels[0]
  }

  // Filtrar projetos por fase se um filtro estiver selecionado
  const filteredProjects = selectedFase
    ? myProjects.filter(p => getMaturityLevel(p).name === selectedFase)
    : myProjects

  // Contar projetos por fase
  const contarPorFase = (faseName: string) => {
    return myProjects.filter(p => getMaturityLevel(p).name === faseName).length
  }

  const handleEditProject = (projectId: string) => {
    // Navega para a página de edição do projeto
    navigate(`/app/edit-project/${projectId}`)
  }

  const handleDeleteProject = (projectId: string) => {
    // Implementar lógica de exclusão com mutation
    // Por enquanto só mostra no console (o modal já funciona)
    console.log('Excluir projeto:', projectId)
    // TODO: Implementar mutation de exclusão
    // deleteProjectMutation.mutate(projectId)
  }

  const handleAddStage = (projectId: string) => {
    // Navega para a página de adicionar etapa
    navigate(`/app/projects/${projectId}/add-stage`)
  }

  const handleViewProject = (projectId: string) => {
    const project = myProjects.find(p => p.id === projectId)
    if (project) {
      // Converter dados para o formato do UnifiedProjectModal
      const convertedProject = {
        id: project.id,
        nome: project.nome,
        descricao: project.descricao,
        bannerUrl: project.bannerUrl,
        status: project.status,
        faseAtual: getMaturityLevel(project).level as 1 | 2 | 3 | 4,
        curso: project.curso,
        turma: project.turma,
        categoria: project.categoria,
        modalidade: project.modalidade,
        itinerario: project.itinerario,
        labMaker: project.labMaker,
        participouSaga: project.participouSaga,
        unidadeCurricular: project.unidadeCurricular,
        liderProjeto: project.liderProjeto,
        codigo: project.codigo,
        visibilidadeCodigo: project.visibilidadeCodigo as 'publico' | 'privado',
        visibilidadeAnexos: project.visibilidadeAnexos as 'publico' | 'privado',
        criadoEm: project.criadoEm,
        atualizadoEm: project.atualizadoEm,
        etapas: {
          ideacao: [],
          modelagem: [],
          prototipagem: [],
          validacao: []
        }
      }
      setSelectedProject(convertedProject)
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Meus Projetos
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Gerencie e acompanhe seus projetos
            </p>
          </div>
          <Link
            to="/app/create-project"
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Novo Projeto</span>
          </Link>
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
                Você tem <strong>{myProjects.length}</strong> {myProjects.length === 1 ? 'projeto' : 'projetos'}
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

        {/* Filtros por Fase de Desenvolvimento */}
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
              className={`relative overflow-hidden border-2 rounded-xl p-4 transition-all duration-300 ${
                selectedFase === 'Ideação'
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
              className={`relative overflow-hidden border-2 rounded-xl p-4 transition-all duration-300 ${
                selectedFase === 'Modelagem'
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
              className={`relative overflow-hidden border-2 rounded-xl p-4 transition-all duration-300 ${
                selectedFase === 'Prototipagem'
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
              className={`relative overflow-hidden border-2 rounded-xl p-4 transition-all duration-300 ${
                selectedFase === 'Implementação'
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

        {/* Grid de Projetos */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : myProjects.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
            <div className="flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto mb-4">
              <Plus className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum projeto ainda
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Crie seu primeiro projeto e comece a construir seu portfólio
            </p>
            <Link
              to="/app/create-project"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Criar Primeiro Projeto</span>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project: any) => (
              <UnifiedProjectCard
                key={project.uuid}
                project={project}
                variant="summary"
                showActions={true}
                actions={{
                  onEdit: handleEditProject,
                  onDelete: handleDeleteProject,
                  onAddStage: handleAddStage,
                  onView: handleViewProject
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de Visualização Completa */}
      {selectedProject && (
        <UnifiedProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          isGuest={false}
          mode="view"
          isOwner={true}
          readOnly={true}
          onEdit={() => {
            handleCloseModal()
            navigate(`/app/edit-project/${selectedProject.id}`)
          }}
          onAddStage={(phase) => {
            handleCloseModal()
            navigate(`/app/projects/${selectedProject.id}/add-stage?phase=${phase}`)
          }}
        />
      )}
    </div>
  )
}

export default MyProjects
