import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGuest } from '@/contexts/guest-context'
import { useAuth } from '@/contexts/auth-context'
import CreateProjectForm from './components/create-project-form'
import ProjectReview from './components/project-review'

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
  timelineFiles: (FileList | null)[]
  codigo?: File | null
  codigoVisibilidade: string
  anexosVisibilidade: string
}

const CreateProjectPageV2 = () => {
  const navigate = useNavigate()
  const { isGuest } = useGuest()
  const { isAuthenticated } = useAuth()
  const [isReviewMode, setIsReviewMode] = useState(false)

  // Redirecionar visitantes para o dashboard
  useEffect(() => {
    if (isGuest || !isAuthenticated) {
      navigate('/app/dashboard', { replace: true })
    }
  }, [isGuest, isAuthenticated, navigate])

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
    timelineFiles: [null, null, null, null],
    codigo: null,
    codigoVisibilidade: 'Público',
    anexosVisibilidade: 'Público'
  })

  const updateProjectData = (updates: Partial<ProjectData>) => {
    setProjectData(prev => ({
      ...prev,
      ...updates
    }))
  }

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
    
    setIsReviewMode(true)
  }

  const handleBackToEdit = () => {
    setIsReviewMode(false)
  }

  const handleSaveAndPublish = () => {
    console.log('Salvando e publicando projeto:', projectData)
    // Aqui você implementará a lógica de salvar no backend
    alert('Projeto salvo com sucesso!')
    navigate('/app/my-projects')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
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

export default CreateProjectPageV2
