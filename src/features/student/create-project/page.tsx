import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGuest } from '@/contexts/guest-context'
import { useAuth } from '@/contexts/auth-context'
import { getBaseRoute } from '@/utils/routes'
import CreateProjectForm from './components/create-project-form'
import ProjectReview from './components/project-review'
import DraftRecoveryModal from '@/components/modals/DraftRecoveryModal'
import { useCriarProjeto, useSalvarPasso2, useSalvarPasso3, useSalvarPasso4, useConfigurarPasso5, useResolverUsuarios, useAtualizarProjeto } from '@/hooks/use-queries'
import { uploadBanner, uploadAnexo } from '@/api/upload'
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
  const salvarPasso2Mutation = useSalvarPasso2()
  const salvarPasso3Mutation = useSalvarPasso3()
  const salvarPasso4Mutation = useSalvarPasso4()
  const configurarPasso5Mutation = useConfigurarPasso5()
  const resolverUsuariosMutation = useResolverUsuarios()
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

      // 1. Garantir que o projeto (Passo 1) existe/está atualizado
      if (projetoUuid) {
        await atualizarProjetoMutation.mutateAsync({
          uuid: projetoUuid,
          dados: {
            titulo: projectData.titulo,
            descricao: projectData.descricao
          }
        })
        console.log('Passo 1 atualizado:', projetoUuid)
      } else {
        const passo1Data: any = {
          titulo: projectData.titulo,
          descricao: projectData.descricao,
          categoria: projectData.categoria
        }
        const projetoResponse = await criarProjetoMutation.mutateAsync(passo1Data)
        finalProjetoUuid = projetoResponse.uuid
        if (!finalProjetoUuid) throw new Error('Falha ao criar projeto')
        setProjetoUuid(finalProjetoUuid)
        console.log('Passo 1 criado:', finalProjetoUuid)
      }

      const uuid = finalProjetoUuid!

      // 2. Resolver Usuários (Autores e Orientadores)
      console.log('Resolvendo usuários...')
      const emailsToResolve = [...projectData.autores]
      const orientadoresEmails = projectData.orientador
        ? projectData.orientador.split(',').map(o => o.trim()).filter(Boolean)
        : []

      emailsToResolve.push(...orientadoresEmails)

      // Adicionar o próprio usuário (líder) se não estiver na lista (para garantir)
      if (user?.email && !emailsToResolve.includes(user.email)) {
        emailsToResolve.push(user.email)
      }

      const usuariosResolvidos = await resolverUsuariosMutation.mutateAsync([...new Set(emailsToResolve)])

      // Verificar erros na resolução
      if (usuariosResolvidos.nao_encontrados.length > 0) {
        throw new Error(`Usuários não encontrados: ${usuariosResolvidos.nao_encontrados.join(', ')}. Verifique os e-mails.`)
      }

      // 3. Salvar Passo 2 (Informações Acadêmicas)
      console.log('Salvando Passo 2...')
      await salvarPasso2Mutation.mutateAsync({
        uuid,
        dados: {
          curso: projectData.curso,
          turma: projectData.turma,
          modalidade: projectData.modalidade,
          unidade_curricular: projectData.unidadeCurricular,
          itinerario: projectData.itinerario === 'Sim' || projectData.itinerario === true as any, // Adjust based on actual type
          senai_lab: projectData.senaiLab === 'Sim' || projectData.senaiLab === true as any,
          saga_senai: projectData.sagaSenai === 'Sim' || projectData.sagaSenai === true as any
        }
      })

      // 4. Salvar Passo 3 (Equipe)
      console.log('Salvando Passo 3...')
      const autoresPayload = projectData.autores.map(email => {
        const usuario = usuariosResolvidos.alunos.find(a => a.email === email)
        // Se não achou em alunos, tenta professores (embora autores devam ser alunos)
        // O backend valida se é aluno.
        if (!usuario) {
          // Fallback ou erro. O backend já retornou 'nao_encontrados', então deve existir aqui.
          // A menos que seja um professor tentando ser autor?
          const prof = usuariosResolvidos.professores.find(p => p.email === email)
          return {
            aluno_uuid: prof ? prof.uuid : '', // Vai falhar no backend se for professor
            papel: email === projectData.liderEmail ? 'LIDER' : 'AUTOR'
          }
        }
        return {
          aluno_uuid: usuario.uuid,
          papel: (email === projectData.liderEmail) ? 'LIDER' : 'AUTOR'
        }
      }) as any[]

      // Garantir que o usuário logado (se líder) esteja incluído
      const currentUserIsLeader = projectData.isLeader || (user?.email === projectData.liderEmail)
      if (currentUserIsLeader && user?.email) {
        const alreadyIncluded = autoresPayload.some(a =>
          usuariosResolvidos.alunos.find(u => u.uuid === a.aluno_uuid)?.email === user.email
        )
        if (!alreadyIncluded && user.uuid) {
          // Se o user não estava na lista de autores visível (mas é líder), adiciona
          autoresPayload.push({ aluno_uuid: user.uuid, papel: 'LIDER' })
        }
      }

      const orientadoresUuids = orientadoresEmails.map(email => {
        const prof = usuariosResolvidos.professores.find(p => p.email === email)
        return prof ? prof.uuid : null
      }).filter(Boolean) as string[]

      await salvarPasso3Mutation.mutateAsync({
        uuid,
        dados: {
          autores: autoresPayload,
          orientadores_uuids: orientadoresUuids
        }
      })

      // 5. Upload do Banner (se houver)
      let bannerUrl: string | undefined = undefined
      if (projectData.banner && projectData.banner instanceof File) {
        try {
          console.log('Fazendo upload do banner...')
          const uploadResponse = await uploadBanner(projectData.banner)
          bannerUrl = uploadResponse.url
        } catch (uploadError) {
          console.error('Erro no upload do banner', uploadError)
          message.warning('Erro ao enviar banner, continuando sem ele.')
        }
      }

      // 6. Salvar Passo 4 (Fases) - Usando a mutation antiga 'usePublicarProjeto' que chama createPasso4
      // Preciso montar o objeto Passo4Payload corretamente.
      // O Passo4Payload na API espera: { banner_url, repositorio_url, demo_url } ?
      // ESPERA: Passo4 é SALVAR FASES no backend! 
      // Mas no projects.ts Passo4Payload estava definido como banner/repo/demo inicialmente?
      // Step 309 I redefined Passo4Payload to banner/repo/demo.
      // BUT Backend Passo4 is `salvarFases`.
      // Backend Passo5 is `configurarRepositorio`.

      // DISCREPANCY: Frontend `Passo4Payload` in `projects.ts` does NOT match Backend `Passo4ProjetoDto`.
      // Frontend `Passo4Payload` matches what `usePublicarProjeto` was sending (banner, repo).
      // Backend `Passo4` expects `ideacao`, `modelagem`, etc.

      // I need to fix `projects.ts` Passo4Payload as well to match Backend!
      // And I need to use `Passo4` for Phases.
      // And `Passo5` for Banner/Repo/Publish? No, Backend Passo5 has repo/publish. Banner seems to be in Passo1 or separate?
      // Backend `Passo1` has comment: "// Banner será enviado via multipart/form-data separadamente".

      // Let's assume for this step I will send Phases to Passo4.
      // I need to update projects.ts Passo4Payload first?
      // Yes.

      // I will STOP this replacement and fix `projects.ts` Passo4Payload first.

      throw new Error('ABORT_REFACTOR: Passo4Payload definition incorrect in projects.ts')

    } catch (error: any) {
      console.error('Erro ao salvar projeto:', error)
      const msg = error?.response?.data?.message || error?.message || 'Erro desconhecido'
      message.error(`Erro: ${msg}`)
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
