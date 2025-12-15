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
import { buscarPerfil } from '@/api/perfil'
import { message, Modal } from 'antd'

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
  codigo?: File | null
  linkRepositorio: string
  codigoVisibilidade: string
  anexosVisibilidade: string
  aceitouTermos: boolean
  autoresMetadata?: Record<string, any>
  orientadoresMetadata?: Record<string, any>
}

const CreateProjectPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isGuest } = useGuest()
  const { isAuthenticated, user } = useAuth()
  const baseRoute = useMemo(() => getBaseRoute(user?.tipo), [user?.tipo])

  console.log('[CreateProjectPage] Rendering. User:', user?.email, 'Type:', user?.tipo)
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
              // Mapeamento de campos acadêmicos
              curso: projeto.curso_nome || (projeto as any).curso?.nome || '',
              turma: (projeto as any).turma || '', // API retorna 'turma' textual ou objeto
              modalidade: (projeto as any).modalidade || '',
              unidadeCurricular: (projeto as any).unidade_curricular || '',
              itinerario: (projeto as any).itinerario ? 'Sim' : 'Não',
              senaiLab: (projeto as any).senai_lab ? 'Sim' : 'Não',
              sagaSenai: (projeto as any).saga_senai ? 'Sim' : 'Não',

              // Passo 3: Equipe
              autores: projeto.autores?.map(a => a.email) || [],
              orientador: projeto.orientadores?.map(o => o.email).join(', ') || '',
              // Define o líder se houver alguém com papel LIDER, senão usa o próprio user ou vazio
              liderEmail: (projeto as any).autores?.find((a: any) => a.papel === 'LIDER')?.email || user?.email || '',
              isLeader: (projeto as any).autores?.some((a: any) => a.email === user?.email && a.papel === 'LIDER') || false,

              // Passo 4: Fases (agora suportado pelo backend)
              ideacao: (projeto as any).fases?.['Ideação'] || { descricao: '', anexos: [] },
              modelagem: (projeto as any).fases?.['Modelagem'] || { descricao: '', anexos: [] },
              prototipagem: (projeto as any).fases?.['Prototipagem'] || { descricao: '', anexos: [] },
              implementacao: (projeto as any).fases?.['Implementação'] || { descricao: '', anexos: [] },

              // Passo 5: Privacidade
              hasRepositorio: (projeto as any).has_repositorio || false,
              linkRepositorio: (projeto as any).link_repositorio || '',
              codigoVisibilidade: (projeto as any).codigo_visibilidade || 'Público',
              anexosVisibilidade: (projeto as any).anexos_visibilidade || 'Público',
              aceitouTermos: (projeto as any).aceitou_termos || false,
              autoresMetadata: projeto.autores?.reduce((acc: any, a: any) => ({ ...acc, [a.email]: a }), {}) || {},
              orientadoresMetadata: projeto.orientadores?.reduce((acc: any, o: any) => ({ ...acc, [o.email]: o }), {}) || {},
            }))
            setLastSavedAt(new Date(projeto.criado_em || Date.now()))
            // Mostrar sucesso apenas se foi carregado manual, para não spammar se for auto-load de rascunho
            message.success('Projeto carregado com sucesso!')
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
    console.log('[CreateProjectPage] Initializing form data')
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
    codigo: null,
    linkRepositorio: '',
    codigoVisibilidade: 'Público',
    anexosVisibilidade: 'Público',
    aceitouTermos: false,
    autoresMetadata: {},
    orientadoresMetadata: {}
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

  // Pre-fill student data from profile
  useEffect(() => {
    const loadStudentProfile = async () => {
      if (isStudent && isAuthenticated) {
        try {
          const perfil = await buscarPerfil()

          setProjectData(prev => {
            // Tenta obter do perfil (API), depois do contexto (User), ou mantém o atual
            const profileCurso = perfil.curso_nome || perfil.curso?.nome || user?.curso

            // Turma geralmente vem apenas do perfil, mas tentamos um cast seguro do user se existir
            const profileTurma = perfil.turma_codigo || perfil.turma?.codigo || (user as any)?.turma

            // Só sobrescreve se o campo estiver vazio no form E tivermos um valor para preencher
            const newCurso = !prev.curso && profileCurso ? profileCurso : prev.curso
            const newTurma = !prev.turma && profileTurma ? profileTurma : prev.turma

            // Se nada mudou, retorna o estado anterior para evitar re-render
            if (newCurso === prev.curso && newTurma === prev.turma) {
              return prev
            }

            return {
              ...prev,
              curso: newCurso,
              turma: newTurma,
            }
          })
        } catch (error) {
          console.error('Erro ao carregar perfil para autofill:', error)
          // Fallback silencioso para dados do usuário se a API falhar
          if (user?.curso) {
            setProjectData(prev => ({
              ...prev,
              curso: !prev.curso ? user.curso : prev.curso
            }))
          }
        }
      }
    }
    loadStudentProfile()
  }, [isStudent, isAuthenticated, user])

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

    // Requer descrição e categoria para salvar na API (validação estrita para evitar 400)
    if (!projectData.descricao || projectData.titulo.length < 10 || projectData.descricao.length < 50 || !projectData.categoria) {
      console.log('Skipping auto-save: validation failed (Title < 10 or Desc < 50)')
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
            categoria: projectData.categoria,
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

  // Efeito específico para Auto-Upload do Banner
  useEffect(() => {
    const uploadBannerDraft = async () => {
      // Se não tem banner ou se o banner não mudou (verificação simples), retorna
      if (!projectData.banner || !(projectData.banner instanceof File)) return

      // Validação estrita antes de tentar criar rascunho
      if (projectData.titulo.length < 10 || projectData.descricao.length < 50) {
        console.warn('Cannot upload banner yet: Title or Description too short for project creation.')
        message.warning('Preencha o título (min 10) e descrição (min 50) antes de enviar o banner.')
        return
      }

      // Evita upload repetido se o arquivo já foi processado (podemos usar uma flag ou ref se necessário, 
      // mas por enquanto vamos confiar que o usuário não fica trocando loucamente)
      // Melhor: verificar se já temos uuid. Se não temos, precisamos criar o rascunho primeiro.

      try {
        message.loading({ content: 'Salvando banner...', key: 'banner-upload' })

        let currentUuid = projetoUuid

        // 1. Se não tem rascunho, cria um "Rascunho Inicial"
        if (!currentUuid) {
          const passo1Data = {
            titulo: projectData.titulo || 'Novo Projeto (Rascunho)',
            descricao: projectData.descricao || 'Rascunho criado automaticamente pelo upload de banner.',
            categoria: projectData.categoria || undefined,
          }
          const response = await criarProjetoMutation.mutateAsync(passo1Data)
          if (response.uuid) {
            currentUuid = response.uuid
            setProjetoUuid(response.uuid)
            console.log('Rascunho criado para o banner:', response.uuid)
          } else {
            throw new Error('Falha ao criar rascunho inicial')
          }
        }

        // 2. Faz o upload do Banner
        const uploadResponse = await uploadBanner(projectData.banner, 'project_banner')
        const bannerUrl = uploadResponse.url

        // 3. Atualiza o projeto com a URL do banner
        await atualizarProjetoMutation.mutateAsync({
          uuid: currentUuid!,
          dados: {
            banner_url: bannerUrl
          }
        })

        // 4. Salva no LocalStorage que este projeto tem um banner salvo (opcional, para persistência visual imediata se necessário)
        // Mas o principal é que está na API agora.

        message.success({ content: 'Banner salvo e vinculado ao rascunho!', key: 'banner-upload' })
        setLastSavedAt(new Date())
        setHasUnsavedChanges(false) // Banner está salvo

      } catch (error) {
        console.error('Erro no auto-upload do banner:', error)
        message.error({ content: 'Erro ao salvar banner autormaticamente.', key: 'banner-upload' })
      }
    }

    // Debounce pequeno para evitar múltiplos uploads se o usuário trocar rápido
    const timer = setTimeout(() => {
      uploadBannerDraft()
    }, 1000)

    return () => clearTimeout(timer)
  }, [projectData.banner]) // Dispara quando o banner muda

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
      Modal.warning({
        title: 'Título obrigatório',
        content: 'Por favor, preencha o título do projeto.',
      })
      return
    }
    if (projectData.titulo.length < 10) {
      Modal.warning({
        title: 'Título muito curto',
        content: 'O título deve ter no mínimo 10 caracteres.',
      })
      return
    }

    if (!projectData.descricao.trim()) {
      Modal.warning({
        title: 'Descrição obrigatória',
        content: 'Por favor, preencha a descrição do projeto.',
      })
      return
    }
    if (projectData.descricao.length < 50) {
      Modal.warning({
        title: 'Descrição muito curta',
        content: 'A descrição deve ter no mínimo 50 caracteres para garantir um bom entendimento do projeto.',
      })
      return
    }

    if (!projectData.curso) {
      message.warning('Por favor, selecione um curso')
      return
    }
    if (!projectData.aceitouTermos) {
      message.warning('Por favor, aceite os Termos de Uso e Política de Privacidade para continuar')
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
        message.warning('Por favor, preencha o título do projeto para salvar como rascunho')
        return
      }
      if (projectData.titulo.length < 10) {
        message.warning('O título deve ter no mínimo 10 caracteres')
        return
      }
      // Para rascunho, a descrição pode ser opcional ou curta, mas se estiver preenchida, deve seguir regras mínimas se a API exigir
      // A API exige 50 caracteres para descrição. Se for rascunho, o backend pode aceitar menos? 
      // O endpoint criarProjeto (Passo 1 DTO) tem validação @MinLength(10) para titulo e @MinLength(50) para descricao.
      // Então precisamos validar aqui também.

      if (projectData.descricao && projectData.descricao.length > 0 && projectData.descricao.length < 50) {
        message.warning('A descrição deve ter no mínimo 50 caracteres')
        return
      }

      let savedUuid = projetoUuid

      if (projetoUuid) {
        // Atualizar rascunho existente
        await atualizarProjetoMutation.mutateAsync({
          uuid: projetoUuid,
          dados: {
            titulo: projectData.titulo,
            descricao: projectData.descricao || 'Rascunho em progresso',
            categoria: projectData.categoria,
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
          await uploadBanner(projectData.banner, 'project_banner')
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
            descricao: projectData.descricao,
            categoria: projectData.categoria
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
      // Verificar erros na resolução
      if (usuariosResolvidos.invalidos?.length > 0) {
        throw new Error(`Usuários não encontrados: ${usuariosResolvidos.invalidos.join(', ')}. Verifique os e-mails.`)
      }

      // 3. Salvar Passo 2 (Informações Acadêmicas) - Apenas se houver dados
      if (projectData.curso && projectData.turma && projectData.modalidade) {
        console.log('Salvando Passo 2...')
        await salvarPasso2Mutation.mutateAsync({
          uuid,
          dados: {
            curso: projectData.curso,
            turma: projectData.turma,
            modalidade: projectData.modalidade,
            unidade_curricular: projectData.unidadeCurricular,
            itinerario: projectData.itinerario === 'Sim' || projectData.itinerario === true as any,
            senai_lab: projectData.senaiLab === 'Sim' || projectData.senaiLab === true as any,
            saga_senai: projectData.sagaSenai === 'Sim' || projectData.sagaSenai === true as any
          }
        })
      } else {
        console.log('Skipping Passo 2: Dados incompletos')
      }


      // 4. Salvar Passo 3 (Equipe) - Apenas se houver autores
      if (projectData.autores.length > 0) {
        console.log('Salvando Passo 3...')
        // Garantir que haja exatamente 1 líder nos dados a serem enviados
        let autoresPayload = projectData.autores.map(email => {
          const usuario = usuariosResolvidos.alunos.find((a: any) => a.email === email)

          if (!usuario) {
            const prof = usuariosResolvidos.professores.find((p: any) => p.email === email)
            if (prof) {
              throw new Error(`O usuário ${email} é um professor e não pode ser autor.`)
            }
            throw new Error(`O autor com e-mail ${email} não foi encontrado.`)
          }

          return {
            email, // Temporário para verificar líder
            usuario_uuid: usuario.usuario_uuid,
            papel: 'AUTOR' as any
          }
        })

        // Definir líder
        const hasLeader = autoresPayload.some(a => a.email === projectData.liderEmail)

        if (hasLeader) {
          autoresPayload = autoresPayload.map(a => ({
            ...a,
            papel: a.email === projectData.liderEmail ? 'LIDER' : 'AUTOR'
          }))
        } else if (autoresPayload.length > 0) {
          // Se não tem líder definido ou líder saiu da equipe, define o primeiro como líder
          autoresPayload[0].papel = 'LIDER'
          console.log('Líder indefinido, atribuindo ao primeiro autor:', projectData.autores[0])
        }

        // Removemos a propriedade `email` temporária antes de enviar
        const finalAutores = autoresPayload.map(({ email, ...rest }) => rest)

        const orientadoresUuids = orientadoresEmails.map(email => {
          const prof = usuariosResolvidos.professores.find((p: any) => p.email === email)
          return prof ? prof.usuario_uuid : null
        }).filter(Boolean) as string[]

        await salvarPasso3Mutation.mutateAsync({
          uuid,
          dados: {
            autores: finalAutores,
            orientadores_uuids: orientadoresUuids
          }
        })
      } else {
        console.log('Skipping Passo 3: Sem autores definidos')
      }

      // 5. Upload do Banner (se houver)
      let bannerUrl: string | undefined = undefined
      if (projectData.banner && projectData.banner instanceof File) {
        try {
          console.log('Fazendo upload do banner...')
          const uploadResponse = await uploadBanner(projectData.banner, 'project_banner')
          bannerUrl = uploadResponse.url

          // Salvar URL do banner no projeto (PATCH)
          await atualizarProjetoMutation.mutateAsync({
            uuid,
            dados: {
              banner_url: bannerUrl
            }
          })
          console.log('Banner salvo no projeto:', bannerUrl)
        } catch (uploadError) {
          console.error('Erro no upload ou salvamento do banner', uploadError)
          message.warning('Erro ao enviar banner, continuando sem ele.')
        }
      }

      // 6. Salvar Passo 4 (Fases)
      console.log('Salvando Passo 4 (Fases)...')

      // Helper para processar anexos de uma fase
      const processarFase = async (faseData: PhaseData): Promise<any> => {
        const anexosProcessados = []

        for (const anexo of faseData.anexos) {
          let url = ''
          let nome = anexo.file.name
          let tamanho = anexo.file.size
          let mime = anexo.file.type

          // Se for link salvo como arquivo
          if (anexo.file.name === 'link.txt') {
            url = await anexo.file.text()
            mime = 'text/uri-list'
          } else {
            // Upload do arquivo real
            try {
              // Determinar tipo de anexo
              let tipoAnexo: any = 'DOCUMENTO'
              if (anexo.file.type.startsWith('image/')) tipoAnexo = 'IMAGEM'
              else if (anexo.file.type.startsWith('video/')) tipoAnexo = 'VIDEO'

              const uploadRes = await uploadAnexo(anexo.file, tipoAnexo)
              url = uploadRes.url
            } catch (err) {
              console.error(`Erro ao enviar anexo ${nome}:`, err)
              // Continua sem esse anexo ou lança? Melhor avisar mas continuar?
              // Vamos lançar para garantir integridade
              throw new Error(`Falha ao enviar arquivo ${nome}`)
            }
          }

          anexosProcessados.push({
            id: anexo.id, // Mantém ID do frontend para referência? Backend gera novo UUID geralmente.
            tipo: anexo.type, // 'brainstorming', 'mapa_mental', etc (Tipo funcional da fase)
            nome_arquivo: nome,
            url_arquivo: url,
            tamanho_bytes: tamanho,
            mime_type: mime
          })
        }

        return {
          descricao: faseData.descricao,
          anexos: anexosProcessados
        }
      }

      // Processar todas as fases em paralelo
      const [ideacao, modelagem, prototipagem, implementacao] = await Promise.all([
        processarFase(projectData.ideacao),
        processarFase(projectData.modelagem),
        processarFase(projectData.prototipagem),
        processarFase(projectData.implementacao)
      ])

      const passo4Payload: any = {
        ideacao,
        modelagem,
        prototipagem,
        implementacao
      }

      await salvarPasso4Mutation.mutateAsync({
        projetoUuid: uuid,
        dados: passo4Payload
      })

      // 7. Salvar Passo 5 (Repositório e Privacidade)
      // 7. Salvar Passo 5 (Repositório e Privacidade)
      console.log('Salvando Passo 5 (Repositório)...')

      const payloadPasso5 = {
        has_repositorio: projectData.hasRepositorio,
        link_repositorio: projectData.linkRepositorio ? projectData.linkRepositorio : null,
        codigo_visibilidade: projectData.codigoVisibilidade,
        anexos_visibilidade: projectData.anexosVisibilidade,
        aceitou_termos: projectData.aceitouTermos
      }
      console.log('Payload Passo 5:', payloadPasso5)

      await configurarPasso5Mutation.mutateAsync({
        uuid,
        dados: payloadPasso5
      })

      message.success('Projeto publicado com sucesso!')

      // Limpa rascunho e redireciona
      if (searchParams.get('rascunho')) {
        // Lógica de limpeza se houvesse local storage específico
      }
      navigate(`${baseRoute}/meus-projetos`)

    } catch (error: any) {
      console.error('Erro ao salvar projeto:', error)
      const msg = error?.response?.data?.message || error?.message || 'Erro desconhecido'

      // Mostrar modal ou mensagem persistente
      message.error({
        content: `Falha ao salvar: ${msg}`,
        duration: 5,
        style: { marginTop: '20vh' }
      })
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
