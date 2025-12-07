import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGuest } from '@/contexts/guest-context'
import { useAuth } from '@/contexts/auth-context'
import { getBaseRoute } from '@/utils/routes'
import CreateProjectForm from './components/create-project-form'
import ProjectReview from './components/project-review'
import DraftRecoveryModal from '@/components/modals/DraftRecoveryModal'
import { useCriarProjeto, usePublicarProjeto, useAtualizarProjeto } from '@/hooks/use-queries'
import { uploadBanner } from '@/api/upload'
import { buscarProjeto } from '@/api/projetos'
import { message } from 'antd'

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
  const [searchParams] = useSearchParams()
  const { isGuest } = useGuest()
  const { isAuthenticated, user } = useAuth()
  const baseRoute = useMemo(() => getBaseRoute(user?.tipo), [user?.tipo])
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showDraftModal, setShowDraftModal] = useState(false)
  const [savedDraft, setSavedDraft] = useState<any>(null)
  const [draftDate, setDraftDate] = useState<Date | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)

  // Estados para auto-save na API
  const [projetoUuid, setProjetoUuid] = useState<string | null>(null)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const lastChangeRef = useRef<number>(Date.now())
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Mutations para API
  const criarProjetoMutation = useCriarProjeto()
  const publicarProjetoMutation = usePublicarProjeto()
  const atualizarProjetoMutation = useAtualizarProjeto()

  // Redirecionar visitantes para o dashboard
  useEffect(() => {
    if (isGuest || !isAuthenticated) {
      navigate(`${baseRoute}`, { replace: true })
    }
  }, [isGuest, isAuthenticated, navigate, baseRoute])

  // Carregar rascunho existente da API (via query param ?rascunho=uuid)
  useEffect(() => {
    const rascunhoUuid = searchParams.get('rascunho')
    if (rascunhoUuid) {
      const loadRascunhoFromApi = async () => {
        try {
          console.log('Carregando rascunho da API:', rascunhoUuid)
          const projeto = await buscarProjeto(rascunhoUuid)

          if (projeto && projeto.status === 'RASCUNHO') {
            setProjetoUuid(rascunhoUuid)
            setProjectData(prev => ({
              ...prev,
              titulo: projeto.titulo || '',
              descricao: projeto.descricao || '',
              // Outros campos podem ser mapeados conforme necessário
            }))
            setLastSavedAt(new Date(projeto.criado_em || Date.now()))
            message.success('Rascunho carregado! Continue editando.')
          }
        } catch (error) {
          console.error('Erro ao carregar rascunho da API:', error)
          message.error('Não foi possível carregar o rascunho.')
        }
      }
      loadRascunhoFromApi()
    }
  }, [searchParams])

  // Carregar rascunho do localStorage ao montar o componente
  useEffect(() => {
    // Só mostrar modal de localStorage se não estiver editando rascunho da API
    const rascunhoUuid = searchParams.get('rascunho')
    if (rascunhoUuid) return

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
  }, [searchParams])

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
      // Marcar timestamp da última mudança para debounce
      lastChangeRef.current = Date.now()
      return newData
    })
  }

  // Verificar se é aluno
  const isStudent = useMemo(() => {
    return user?.tipo === 'ALUNO' || user?.tipo === 'student'
  }, [user])

  // Pre-fill course for students
  useEffect(() => {
    if (isStudent && user?.curso && !projectData.curso) {
      setProjectData(prev => ({
        ...prev,
        curso: user.curso || ''
      }))
    }
  }, [isStudent, user, projectData.curso])

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
    } catch (error) {
      console.error('Erro ao salvar rascunho no localStorage:', error)
    }
  }

  // Função de auto-save na API
  const performAutoSave = useCallback(async () => {
    // Não salvar se não há título ou se está no modo de review
    if (!projectData.titulo.trim() || isReviewMode || isAutoSaving || isSavingDraft || isSubmitting) {
      return
    }

    // Requer descrição mínima para salvar na API
    if (!projectData.descricao || projectData.descricao.length < 100) {
      return
    }

    setIsAutoSaving(true)

    try {
      if (projetoUuid) {
        // Atualizar rascunho existente
        await atualizarProjetoMutation.mutateAsync({
          uuid: projetoUuid,
          dados: {
            titulo: projectData.titulo,
            descricao: projectData.descricao,
          }
        })
        console.log('Rascunho atualizado na API:', projetoUuid)
      } else {
        // Criar novo rascunho
        const passo1Data = {
          titulo: projectData.titulo,
          descricao: projectData.descricao,
          categoria: projectData.categoria || undefined,
        }
        const response = await criarProjetoMutation.mutateAsync(passo1Data)
        if (response.uuid) {
          setProjetoUuid(response.uuid)
          console.log('Novo rascunho criado na API:', response.uuid)
        }
      }

      setLastSavedAt(new Date())
      setHasUnsavedChanges(false)

      // Limpar localStorage após salvar na API
      localStorage.removeItem('project_draft')
      localStorage.removeItem('project_draft_timestamp')

    } catch (error) {
      console.error('Erro no auto-save:', error)
      // Em caso de erro, manter no localStorage
    } finally {
      setIsAutoSaving(false)
    }
  }, [projectData, projetoUuid, isReviewMode, isAutoSaving, isSavingDraft, isSubmitting, atualizarProjetoMutation, criarProjetoMutation])

  // Auto-save inteligente: debounce 5s + intervalo máximo 60s
  useEffect(() => {
    if (!hasUnsavedChanges || isReviewMode) return

    // Limpar timers anteriores
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Debounce: salvar 5s após parar de digitar
    debounceTimerRef.current = setTimeout(() => {
      performAutoSave()
    }, 5000)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [projectData, hasUnsavedChanges, isReviewMode, performAutoSave])

  // Intervalo máximo de 60s para garantir salvamento
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current)
    }

    autoSaveTimerRef.current = setInterval(() => {
      if (hasUnsavedChanges && !isReviewMode) {
        performAutoSave()
      }
    }, 60000) // 60 segundos

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current)
      }
    }
  }, [hasUnsavedChanges, isReviewMode, performAutoSave])

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

  // Função para salvar rascunho sem publicar
  const handleSaveDraft = async () => {
    if (isSavingDraft) return

    setIsSavingDraft(true)

    try {
      // Validações básicas
      if (!projectData.titulo.trim()) {
        message.error('Por favor, preencha o título do projeto para salvar como rascunho')
        return
      }

      let savedUuid = projetoUuid

      if (projetoUuid) {
        // Atualizar rascunho existente
        await atualizarProjetoMutation.mutateAsync({
          uuid: projetoUuid,
          dados: {
            titulo: projectData.titulo,
            descricao: projectData.descricao || 'Rascunho em progresso'
          }
        })
        console.log('Rascunho atualizado:', projetoUuid)
      } else {
        // Preparar dados do Passo 1 (cria rascunho)
        const passo1Data: any = {
          titulo: projectData.titulo,
          descricao: projectData.descricao || 'Rascunho em progresso'
        }

        // Passo 1: Criar o projeto como rascunho
        const projetoResponse = await criarProjetoMutation.mutateAsync(passo1Data)

        savedUuid = projetoResponse.uuid

        if (!savedUuid) {
          throw new Error('Não foi possível criar o rascunho')
        }

        setProjetoUuid(savedUuid)
        console.log('Rascunho criado com UUID:', savedUuid)
      }

      // Upload do banner se existir
      if (projectData.banner && projectData.banner instanceof File) {
        try {
          console.log('Fazendo upload do banner...')
          await uploadBanner(projectData.banner)
          console.log('Banner uploaded para rascunho')
        } catch (uploadError: any) {
          console.error('Erro ao fazer upload do banner:', uploadError)
        }
      }

      // Limpar rascunho local após salvar na API
      localStorage.removeItem('project_draft')
      localStorage.removeItem('project_draft_timestamp')
      setHasUnsavedChanges(false)
      setLastSavedAt(new Date())

      message.success('Rascunho salvo com sucesso! Você pode continuar editando depois em "Meus Projetos".')

      // Voltar para o modo de edição ou redirecionar
      setIsReviewMode(false)

    } catch (error: any) {
      console.error('Erro ao salvar rascunho:', error)

      const errorMessage = error?.response?.data?.message ||
        error?.message ||
        'Erro desconhecido ao salvar rascunho'

      message.error(`Erro ao salvar rascunho: ${errorMessage}`)
    } finally {
      setIsSavingDraft(false)
    }
  }

  const handleSaveAndPublish = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      let finalProjetoUuid = projetoUuid

      // Se já existe um rascunho, atualizar. Senão, criar novo.
      if (projetoUuid) {
        // Atualizar rascunho existente
        await atualizarProjetoMutation.mutateAsync({
          uuid: projetoUuid,
          dados: {
            titulo: projectData.titulo,
            descricao: projectData.descricao
          }
        })
        console.log('Rascunho atualizado antes de publicar:', projetoUuid)
      } else {
        // Preparar dados do Passo 1
        const passo1Data: any = {
          titulo: projectData.titulo,
          descricao: projectData.descricao
        }

        // Passo 1: Criar o projeto (rascunho)
        // A API vai automaticamente criar as 4 etapas
        const projetoResponse = await criarProjetoMutation.mutateAsync(passo1Data)

        finalProjetoUuid = projetoResponse.uuid

        if (!finalProjetoUuid) {
          throw new Error('Não foi possível criar o projeto')
        }

        console.log('Projeto criado com UUID:', finalProjetoUuid)
      }

      // Upload do banner se existir
      let bannerUrl: string | undefined = undefined
      if (projectData.banner && projectData.banner instanceof File) {
        try {
          console.log('Fazendo upload do banner...')
          const uploadResponse = await uploadBanner(projectData.banner)
          bannerUrl = uploadResponse.url
          console.log('Banner uploaded:', bannerUrl)
        } catch (uploadError: any) {
          console.error('Erro ao fazer upload do banner:', uploadError)
          // Continua mesmo se o upload do banner falhar
          message.warning('Não foi possível fazer upload do banner, mas o projeto será criado.')
        }
      }

      // Passo 4: Publicar o projeto
      await publicarProjetoMutation.mutateAsync({
        projetoUuid: finalProjetoUuid!,
        dados: {
          banner_url: bannerUrl,
          repositorio_url: projectData.linkRepositorio || undefined,
          demo_url: undefined
        }
      })

      console.log('Projeto publicado com sucesso!')

      // Limpar rascunho do localStorage após publicação
      localStorage.removeItem('project_draft')
      localStorage.removeItem('project_draft_timestamp')
      setHasUnsavedChanges(false)

      message.success('Projeto criado com sucesso! Seu projeto está disponível na sua lista de projetos.')

      navigate(`${baseRoute}/my-projects`)
    } catch (error: any) {
      console.error('Erro ao salvar projeto:', error)

      const errorMessage = error?.response?.data?.message ||
        error?.message ||
        'Erro desconhecido ao criar o projeto'

      message.error(`Erro ao criar projeto: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
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
            lastSavedAt={lastSavedAt}
            isAutoSaving={isAutoSaving}
            isStudent={isStudent}
          />
        ) : (
          <ProjectReview
            data={projectData}
            onBackToEdit={handleBackToEdit}
            onSaveAndPublish={handleSaveAndPublish}
            isSubmitting={isSubmitting}
            onSaveDraft={handleSaveDraft}
            isSavingDraft={isSavingDraft}
          />
        )}
      </div>
    </div>
  )
}

export default CreateProjectPage
