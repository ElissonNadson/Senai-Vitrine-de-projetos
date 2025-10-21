import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGuest } from '@/contexts/guest-context'
import { useAuth } from '@/contexts/auth-context'
import CreateProjectForm from './components/create-project-form'
import ProjectReview from './components/project-review'
import DraftRecoveryModal from '@/components/modals/DraftRecoveryModal'

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

const CreateProjectPage = () => {
  const navigate = useNavigate()
  const { isGuest } = useGuest()
  const { isAuthenticated } = useAuth()
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showDraftModal, setShowDraftModal] = useState(false)
  const [savedDraft, setSavedDraft] = useState<any>(null)
  const [draftDate, setDraftDate] = useState<Date | undefined>(undefined)

  // Redirecionar visitantes para o dashboard
  useEffect(() => {
    if (isGuest || !isAuthenticated) {
      navigate('/app/dashboard', { replace: true })
    }
  }, [isGuest, isAuthenticated, navigate])

  // Carregar rascunho do localStorage ao montar o componente
  useEffect(() => {
    const loadDraft = () => {
      try {
        const savedDraftData = localStorage.getItem('project_draft')
        const draftTimestamp = localStorage.getItem('project_draft_timestamp')
        
        if (savedDraftData) {
          const parsedDraft = JSON.parse(savedDraftData)
          setSavedDraft(parsedDraft)
          
          // Converter timestamp para Date
          if (draftTimestamp) {
            setDraftDate(new Date(parseInt(draftTimestamp)))
          }
          
          // Mostrar modal de recuperação
          setShowDraftModal(true)
        }
      } catch (error) {
        console.error('Erro ao carregar rascunho:', error)
        localStorage.removeItem('project_draft')
        localStorage.removeItem('project_draft_timestamp')
      }
    }
    loadDraft()
  }, [])

  const handleContinueDraft = () => {
    if (savedDraft) {
      setProjectData(savedDraft)
      setHasUnsavedChanges(true)
      setShowDraftModal(false)
      console.log('Rascunho recuperado do localStorage')
    }
  }

  const handleStartFresh = () => {
    localStorage.removeItem('project_draft')
    localStorage.removeItem('project_draft_timestamp')
    setShowDraftModal(false)
    setSavedDraft(null)
    console.log('Rascunho descartado - começando novo projeto')
  }

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

  const updateProjectData = (updates: Partial<ProjectData>) => {
    setProjectData(prev => {
      const newData = {
        ...prev,
        ...updates
      }
      // Salvar automaticamente no localStorage (sem arquivos)
      saveToLocalStorage(newData)
      setHasUnsavedChanges(true)
      return newData
    })
  }

  // Função para salvar no localStorage (excluindo arquivos File)
  const saveToLocalStorage = (data: ProjectData) => {
    try {
      // Criar uma cópia sem os arquivos File (que não podem ser serializados)
      const dataToSave = {
        ...data,
        banner: null, // Não salvar arquivos File
        codigo: null,
        ideacao: {
          descricao: data.ideacao.descricao,
          anexos: [] // Não salvar anexos File
        },
        modelagem: {
          descricao: data.modelagem.descricao,
          anexos: []
        },
        prototipagem: {
          descricao: data.prototipagem.descricao,
          anexos: []
        },
        implementacao: {
          descricao: data.implementacao.descricao,
          anexos: []
        }
      }
      localStorage.setItem('project_draft', JSON.stringify(dataToSave))
      localStorage.setItem('project_draft_timestamp', Date.now().toString())
      console.log('Rascunho salvo automaticamente no localStorage')
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error)
    }
  }

  // Auto-save a cada 30 segundos
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (hasUnsavedChanges) {
        saveToLocalStorage(projectData)
        console.log('Auto-save executado')
      }
    }, 30000) // 30 segundos

    return () => clearInterval(autoSaveInterval)
  }, [projectData, hasUnsavedChanges])

  const handleGoToReview = () => {
    // Validações básicas antes de ir para revisão
    if (!projectData.titulo.trim()) {
      alert('Por favor, preencha o título do projeto')
      return
    }
    if (!projectData.descricao.trim()) {
      alert('Por favor, preencha a descrição do projeto')
      return
    }
    if (!projectData.curso) {
      alert('Por favor, selecione um curso')
      return
    }
    if (!projectData.aceitouTermos) {
      alert('Por favor, aceite os Termos de Uso e Política de Privacidade para continuar')
      return
    }
    
    setIsReviewMode(true)
  }

  const handleBackToEdit = () => {
    setIsReviewMode(false)
  }

  const handleSaveAndPublish = () => {
    try {
      // Salvar no localStorage como projeto publicado
      const savedProjects = JSON.parse(localStorage.getItem('published_projects') || '[]')
      
      const newProject = {
        id: Date.now().toString(),
        ...projectData,
        createdAt: new Date().toISOString(),
        status: 'published'
      }
      
      savedProjects.push(newProject)
      localStorage.setItem('published_projects', JSON.stringify(savedProjects))
      
      // Remover o rascunho após publicação
      localStorage.removeItem('project_draft')
      localStorage.removeItem('project_draft_timestamp')
      setHasUnsavedChanges(false)
      
      console.log('Projeto publicado e salvo no localStorage:', newProject)
      alert('Projeto salvo com sucesso! (Salvo localmente no navegador)')
      navigate('/app/my-projects')
    } catch (error) {
      console.error('Erro ao salvar projeto:', error)
      alert('Erro ao salvar o projeto. Por favor, tente novamente.')
    }
  }

  // Aviso ao sair da página com alterações não salvas
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !isReviewMode) {
        e.preventDefault()
        e.returnValue = 'Você tem alterações não salvas. Deseja realmente sair?'
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges, isReviewMode])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      {/* Modal de Recuperação de Rascunho */}
      <DraftRecoveryModal
        isOpen={showDraftModal}
        onContinue={handleContinueDraft}
        onStartFresh={handleStartFresh}
        draftDate={draftDate}
      />

      <div className="max-w-7xl mx-auto">
        {!isReviewMode ? (
          <CreateProjectForm
            data={projectData}
            updateData={updateProjectData}
            onGoToReview={handleGoToReview}
          />
        ) : (
          <ProjectReview
            data={projectData}
            onBackToEdit={handleBackToEdit}
            onSaveAndPublish={handleSaveAndPublish}
          />
        )}
      </div>
    </div>
  )
}

export default CreateProjectPage
