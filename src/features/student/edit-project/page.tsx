import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowLeft, FiSave, FiCheck, FiAlertCircle } from 'react-icons/fi'
import mockProjectsData from '@/data/mockProjects.json'
import CreateProjectForm from '../create-project/components/create-project-form'
import ProjectReview from '../create-project/components/project-review'

interface Attachment {
  id: string
  file: File
  type: string
}

interface PhaseData {
  descricao: string
  anexos: Attachment[]
}

interface ProjectData {
  curso: string
  turma: string
  itinerario: string
  unidadeCurricular: string
  senaiLab: string
  sagaSenai: string
  titulo: string
  descricao: string
  categoria: string
  modalidade: string
  autores: string[]
  orientador: string
  liderEmail: string
  isLeader: boolean
  banner?: File | null
  ideacao: PhaseData
  modelagem: PhaseData
  prototipagem: PhaseData
  implementacao: PhaseData
  hasRepositorio: boolean
  tipoRepositorio: 'arquivo' | 'link'
  codigo?: File | null
  linkRepositorio: string
  codigoVisibilidade: string
  anexosVisibilidade: string
  aceitouTermos: boolean
}

const EditProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isReviewMode, setIsReviewMode] = useState(false)
  
  const [projectData, setProjectData] = useState<ProjectData>({
    curso: '',
    turma: '',
    itinerario: '',
    unidadeCurricular: '',
    senaiLab: '',
    sagaSenai: '',
    titulo: '',
    descricao: '',
    categoria: '',
    modalidade: '',
    autores: [],
    orientador: '',
    liderEmail: '',
    isLeader: false,
    banner: null,
    ideacao: {
      descricao: '',
      anexos: []
    },
    modelagem: {
      descricao: '',
      anexos: []
    },
    prototipagem: {
      descricao: '',
      anexos: []
    },
    implementacao: {
      descricao: '',
      anexos: []
    },
    hasRepositorio: false,
    tipoRepositorio: 'arquivo',
    codigo: null,
    linkRepositorio: '',
    codigoVisibilidade: 'Público',
    anexosVisibilidade: 'Público',
    aceitouTermos: false
  })

  useEffect(() => {
    // Carregar dados do projeto
    const project = mockProjectsData.projects.find(p => p.id === projectId)
    if (project) {
      // Converter dados do projeto para o formato do formulário
      const autoresEmails = project.equipe?.map(m => m.email) || []
      const orientadorEmail = project.orientadores?.[0]?.email || ''
      const liderEmail = project.liderProjeto?.email || ''
      
      setProjectData({
        curso: project.curso,
        turma: project.turma,
        itinerario: project.itinerario ? 'Sim' : 'Não',
        unidadeCurricular: typeof project.unidadeCurricular === 'object' ? project.unidadeCurricular.nome : project.unidadeCurricular,
        senaiLab: project.labMaker ? 'Sim' : 'Não',
        sagaSenai: project.participouSaga ? 'Sim' : 'Não',
        titulo: project.nome,
        descricao: project.descricao,
        categoria: project.categoria,
        modalidade: project.modalidade,
        autores: autoresEmails,
        orientador: orientadorEmail,
        liderEmail: liderEmail,
        isLeader: true,
        banner: null,
        ideacao: {
          descricao: '',
          anexos: []
        },
        modelagem: {
          descricao: '',
          anexos: []
        },
        prototipagem: {
          descricao: '',
          anexos: []
        },
        implementacao: {
          descricao: '',
          anexos: []
        },
        hasRepositorio: project.codigo ? true : false,
        tipoRepositorio: typeof project.codigo === 'string' && project.codigo.startsWith('http') ? 'link' : 'arquivo',
        codigo: null,
        linkRepositorio: typeof project.codigo === 'string' && project.codigo.startsWith('http') ? project.codigo : '',
        codigoVisibilidade: project.visibilidadeCodigo || 'Público',
        anexosVisibilidade: project.visibilidadeAnexos || 'Público',
        aceitouTermos: true
      })
      
      setIsLoading(false)
    } else {
      setError('Projeto não encontrado')
      setIsLoading(false)
    }
  }, [projectId])

  const updateProjectData = (updates: Partial<ProjectData>) => {
    setProjectData(prev => ({
      ...prev,
      ...updates
    }))
  }

  const handleSubmitForReview = () => {
    setIsReviewMode(true)
  }

  const handleBackToEdit = () => {
    setIsReviewMode(false)
  }

  const handleFinalSubmit = async () => {
    // Simular salvamento (em produção, faria uma chamada à API)
    console.log('Salvando projeto editado:', projectData)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setShowSuccessModal(true)
    
    // Após 2 segundos, redirecionar
    setTimeout(() => {
      navigate('/app/my-projects')
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando dados do projeto...</p>
        </div>
      </div>
    )
  }

  if (error || !projectData.titulo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Erro ao Carregar Projeto
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'Não foi possível carregar os dados do projeto.'}
          </p>
          <button
            onClick={() => navigate('/app/my-projects')}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Voltar para Meus Projetos
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/app/my-projects')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-3"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Voltar para Meus Projetos</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FiSave className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Editar Projeto
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {projectData.titulo || 'Carregando...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form ou Review */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!isReviewMode ? (
          <CreateProjectForm
            data={projectData}
            updateData={updateProjectData}
            onGoToReview={handleSubmitForReview}
          />
        ) : (
          <ProjectReview
            data={projectData}
            onBackToEdit={handleBackToEdit}
            onSaveAndPublish={handleFinalSubmit}
          />
        )}
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCheck className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Projeto Atualizado!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  As alterações foram salvas com sucesso. Redirecionando...
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EditProjectPage
