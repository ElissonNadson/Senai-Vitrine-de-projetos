import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGuest } from '@/contexts/guest-context'
import { useAuth } from '@/contexts/auth-context'
import { getBaseRoute } from '@/utils/routes'
import CreateProjectForm from './components/create-project-form'
import ProjectReview from './components/project-review'
import ErrorModal from './components/ErrorModal'
import DraftRecoveryModal from '@/components/modals/DraftRecoveryModal'
import { useCriarProjeto, useSalvarPasso2, useSalvarPasso3, useSalvarPasso4, useConfigurarPasso5, useResolverUsuarios, useAtualizarProjeto } from '@/hooks/use-queries'
import { uploadBanner, uploadAnexo } from '@/api/upload'
import { buscarProjeto } from '@/api/projetos'
import { buscarPerfil } from '@/api/perfil'
import { useErrorModal } from './hooks/useErrorModal'
import { message, Modal } from 'antd'
import { AlertCircle } from 'lucide-react'

interface Attachment {
  id: string
  file: File
  type: string
}

interface PhaseData {
  descricao: string
  anexos: Attachment[]
}

// Helper para converter fase da API para formato do componente
const converterFaseDaAPI = (faseApi: any): PhaseData => {
  if (!faseApi) {
    return { descricao: '', anexos: [] }
  }

  const anexos: Attachment[] = []

  // Converter anexos da API para formato do componente
  if (faseApi.anexos && Array.isArray(faseApi.anexos)) {
    for (const anexoApi of faseApi.anexos) {
      // Se o anexo tem URL, criar um File temporário
      if (anexoApi.url_arquivo) {
        // Verificar se é um link (URL externa) ou arquivo salvo
        const isLink = anexoApi.url_arquivo.startsWith('http://') ||
          anexoApi.url_arquivo.startsWith('https://')

        if (isLink) {
          // Para links externos, criar um File com o texto da URL
          const linkBlob = new Blob([anexoApi.url_arquivo], { type: 'text/plain' })
          const linkFile = new File([linkBlob], 'link.txt', { type: 'text/plain' })

          anexos.push({
            id: anexoApi.id || `anexo-${Date.now()}-${Math.random()}`,
            file: linkFile,
            type: anexoApi.tipo || 'link'
          })
        } else {
          // Para arquivos salvos na API, criar um File placeholder
          // O nome do arquivo vem de nome_arquivo ou inferido da URL
          const nomeArquivo = anexoApi.nome_arquivo || 'arquivo_salvo'
          const mimeType = anexoApi.mime_type || 'application/octet-stream'
          const placeholderBlob = new Blob([''], { type: mimeType })
          const placeholderFile = new File([placeholderBlob], nomeArquivo, { type: mimeType })

            // Adicionar URL como propriedade customizada para referência futura
            ; (placeholderFile as any).url_arquivo = anexoApi.url_arquivo

          anexos.push({
            id: anexoApi.id || `anexo-${Date.now()}-${Math.random()}`,
            file: placeholderFile,
            type: anexoApi.tipo || 'arquivo'
          })
        }
      }
      // Se o anexo tem file (já é um File object), usar diretamente
      else if (anexoApi.file instanceof File) {
        anexos.push({
          id: anexoApi.id || `anexo-${Date.now()}-${Math.random()}`,
          file: anexoApi.file,
          type: anexoApi.tipo || 'arquivo'
        })
      }
    }
  }

  return {
    descricao: faseApi.descricao || '',
    anexos
  }
}

interface ProjectData {
  curso: string
  turma: string
  itinerario: string
  unidadeCurricular: string
  senaiLab: string
  sagaSenai: string
  participouEdital: string
  ganhouPremio: string
  titulo: string
  descricao: string
  categoria: string
  modalidade: string
  autores: string[]
  orientador: string
  liderEmail: string
  isLeader: boolean
  orientadorAtualEmail?: string
  banner?: File | null
  bannerUrl?: string
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
  historicoOrientadores?: any[]
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
  const [isEditingPublished, setIsEditingPublished] = useState(false)
  const [showPrimeiraFaseModal, setShowPrimeiraFaseModal] = useState<'review' | 'draft' | 'publish' | null>(null)
  const { errorState, showError, clearError } = useErrorModal()

  // Estados para auto-save na API
  const [projetoUuid, setProjetoUuid] = useState<string | null>(null)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
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

          if (projeto) {
            const isPublished = projeto.status === 'PUBLICADO'
            setIsEditingPublished(isPublished)
            setProjetoUuid(rascunhoUuid)

            // Carregar banner como File se existir banner_url
            let bannerFile: File | null = null
            const bannerUrlFromApi = projeto.banner_url || (projeto as any).banner_url
            if (bannerUrlFromApi) {
              try {
                const bannerBlob = await fetch(bannerUrlFromApi).then(r => r.blob())
                bannerFile = new File([bannerBlob], 'banner.jpg', { type: bannerBlob.type })
              } catch (e) {
                console.warn('Falha ao carregar blob do banner:', e)
              }
            }

            setProjectData(prev => ({
              ...prev,
              titulo: projeto.titulo || '',
              descricao: projeto.descricao || '',
              categoria: projeto.categoria || (projeto as any).categoria || '',
              // Mapeamento de campos acadêmicos
              curso: projeto.curso || (projeto as any).curso?.nome || '',
              turma: (projeto as any).turma || '', // API retorna 'turma' textual ou objeto
              modalidade: (projeto as any).modalidade || '',
              unidadeCurricular: (projeto as any).unidade_curricular || '',
              itinerario: (projeto as any).itinerario ? 'Sim' : 'Não',
              senaiLab: (projeto as any).senai_lab ? 'Sim' : 'Não',
              sagaSenai: (projeto as any).saga_senai ? 'Sim' : 'Não',
              participouEdital: (projeto as any).participou_edital ? 'Sim' : 'Não',
              ganhouPremio: (projeto as any).ganhou_premio ? 'Sim' : 'Não',

              // Banner
              banner: bannerFile,
              bannerUrl: bannerUrlFromApi || '',

              // Passo 3: Equipe
              autores: projeto.autores?.map(a => a.email) || [],
              orientador: projeto.orientadores?.map(o => o.email).join(', ') || '',
              // Define o líder se houver alguém com papel LIDER, senão usa o próprio user ou vazio
              liderEmail: (projeto as any).autores?.find((a: any) => a.papel === 'LIDER')?.email || user?.email || '',
              isLeader: (projeto as any).autores?.some((a: any) => a.email === user?.email && a.papel === 'LIDER') || false,
              orientadorAtualEmail: projeto.orientadores?.find((o: any) => o.papel === 'ORIENTADOR')?.email || '',

              // Passo 4: Fases (API retorna em minúsculas: fases.ideacao, fases.modelagem, etc.)
              ideacao: converterFaseDaAPI((projeto as any).fases?.ideacao),
              modelagem: converterFaseDaAPI((projeto as any).fases?.modelagem),
              prototipagem: converterFaseDaAPI((projeto as any).fases?.prototipagem),
              implementacao: converterFaseDaAPI((projeto as any).fases?.implementacao),

              // Passo 5: Privacidade
              hasRepositorio: (projeto as any).has_repositorio || false,
              linkRepositorio: (projeto as any).link_repositorio || '',
              codigoVisibilidade: (projeto as any).codigo_visibilidade || 'Público',
              anexosVisibilidade: (projeto as any).anexos_visibilidade || 'Privado',
              aceitouTermos: (projeto as any).aceitou_termos || false,
              autoresMetadata: projeto.autores?.reduce((acc: any, a: any) => ({ ...acc, [a.email]: a }), {}) || {},
              orientadoresMetadata: projeto.orientadores?.reduce((acc: any, o: any) => ({ ...acc, [o.email]: o }), {}) || {},
              historicoOrientadores: (projeto as any).historico_orientadores || []
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

    // Admin não usa rascunho local
    if (user?.tipo === 'ADMIN') return

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
    participouEdital: '',
    ganhouPremio: '',
    titulo: '',
    descricao: '',
    categoria: '',
    modalidade: '',
    autores: [],
    orientador: '',
    liderEmail: '',
    isLeader: false,
    orientadorAtualEmail: '',
    banner: null,
    bannerUrl: '',
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
    codigoVisibilidade: 'Privado',
    anexosVisibilidade: 'Privado',
    aceitouTermos: false,
    autoresMetadata: {},
    orientadoresMetadata: {},
    historicoOrientadores: []
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

            // Modalidade do perfil
            const profileModalidade = perfil.modalidade || (user as any)?.modalidade

            // Só sobrescreve se o campo estiver vazio no form E tivermos um valor para preencher
            const newCurso = !prev.curso && profileCurso ? profileCurso : prev.curso
            const newTurma = !prev.turma && profileTurma ? profileTurma : prev.turma
            const newModalidade = !prev.modalidade && profileModalidade ? profileModalidade : prev.modalidade

            // Se nada mudou, retorna o estado anterior para evitar re-render
            if (newCurso === prev.curso && newTurma === prev.turma && newModalidade === prev.modalidade) {
              return prev
            }

            return {
              ...prev,
              curso: newCurso,
              turma: newTurma,
              modalidade: newModalidade
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

  // Função para salvar no localStorage (excluindo arquivos File) - Admin não usa rascunho local
  const saveToLocalStorage = (data: ProjectData) => {
    if (user?.tipo === 'ADMIN') return
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

  // Funções helper para salvar passos 1, 2, 3, 4 e 5
  const salvarPasso1Rascunho = useCallback(async (uuid: string | null, projectData: ProjectData): Promise<string | null> => {
    try {
      if (uuid) {
        // Atualizar rascunho existente - apenas campos do Passo 1
        await atualizarProjetoMutation.mutateAsync({
          uuid,
          dados: {
            titulo: projectData.titulo,
            descricao: projectData.descricao,
            categoria: projectData.categoria,
            banner_url: projectData.bannerUrl,
            // Campos removidos (são salvos pelos endpoints específicos):
            // - curso, turma, modalidade, unidade_curricular (Passo 2)
            // - itinerario, senai_lab, saga_senai, participou_edital, ganhou_premio (Passo 2)
          }
        })
        console.log('Passo 1 atualizado no rascunho')
        return uuid
      } else {
        // Criar novo rascunho
        const passo1Data = {
          titulo: projectData.titulo,
          descricao: projectData.descricao,
          categoria: projectData.categoria || undefined,
        }
        const response = await criarProjetoMutation.mutateAsync(passo1Data)
        if (response.uuid) {
          console.log('Passo 1 criado no rascunho:', response.uuid)
          return response.uuid
        }
        return null
      }
    } catch (error) {
      console.warn('Erro ao salvar Passo 1 no rascunho:', error)
      return uuid
    }
  }, [atualizarProjetoMutation, criarProjetoMutation])

  const salvarPasso2Rascunho = useCallback(async (uuid: string, projectData: ProjectData) => {
    try {
      // Só salvar se houver dados acadêmicos mínimos
      if (!projectData.curso || !projectData.turma || !projectData.modalidade) {
        return
      }

      await salvarPasso2Mutation.mutateAsync({
        uuid,
        dados: {
          curso: projectData.curso,
          turma: projectData.turma,
          modalidade: projectData.modalidade,
          unidade_curricular: projectData.unidadeCurricular,
          itinerario: projectData.itinerario === 'Sim',
          senai_lab: projectData.senaiLab === 'Sim',
          saga_senai: projectData.sagaSenai === 'Sim',
          participou_edital: projectData.participouEdital === 'Sim',
          ganhou_premio: projectData.ganhouPremio === 'Sim'
        }
      })
      console.log('Passo 2 salvo no rascunho')
    } catch (error) {
      console.warn('Erro ao salvar Passo 2 no rascunho:', error)
      // Não bloquear o salvamento, apenas logar
    }
  }, [salvarPasso2Mutation])

  const salvarPasso3Rascunho = useCallback(async (uuid: string, projectData: ProjectData) => {
    // Só salvar se houver autores ou orientadores
    if (projectData.autores.length === 0 && !projectData.orientador) {
      return
    }

    try {
      // Resolver emails para UUIDs
      const emailsToResolve = [...projectData.autores]
      const orientadoresEmails = projectData.orientador
        ? projectData.orientador.split(',').map(o => o.trim()).filter(Boolean)
        : []

      emailsToResolve.push(...orientadoresEmails)

      // Adicionar o próprio usuário (líder) se não estiver na lista
      if (user?.email && user?.tipo !== 'ADMIN' && !emailsToResolve.includes(user.email)) {
        emailsToResolve.push(user.email)
      }

      if (emailsToResolve.length === 0) {
        return
      }

      const usuariosResolvidos = await resolverUsuariosMutation.mutateAsync([...new Set(emailsToResolve)])

      // Verificar erros na resolução
      if (usuariosResolvidos.invalidos?.length > 0) {
        console.warn('Usuários inválidos encontrados no auto-save:', usuariosResolvidos.invalidos)
        // Não bloquear, apenas logar
        return
      }

      // Preparar payload de autores
      let autoresPayload: any[] = []
      if (projectData.autores.length > 0) {
        autoresPayload = projectData.autores.map(email => {
          const usuario = usuariosResolvidos.alunos.find((a: any) => a.email === email)

          if (!usuario) {
            // Se não encontrou como aluno, não adiciona (pode ser docente, mas não deve ser autor)
            return null
          }

          return {
            email, // Temporário para verificar líder
            usuario_uuid: usuario.usuario_uuid,
            papel: 'AUTOR' as any
          }
        }).filter(Boolean)

        // Definir líder
        const hasLeader = autoresPayload.some(a => a.email === projectData.liderEmail)

        if (hasLeader) {
          autoresPayload = autoresPayload.map(a => ({
            ...a,
            papel: a.email === projectData.liderEmail ? 'LIDER' : 'AUTOR'
          }))
        } else if (autoresPayload.length > 0) {
          // Se não tem líder definido, define o primeiro como líder
          autoresPayload[0].papel = 'LIDER'
        }

        // Remover propriedade email temporária
        autoresPayload = autoresPayload.map(({ email, ...rest }) => rest)
      }

      // Preparar UUIDs dos orientadores
      const orientadoresUuids = orientadoresEmails.map(email => {
        const prof = usuariosResolvidos.docentes.find((d: any) => d.email === email)
        return prof ? prof.usuario_uuid : null
      }).filter(Boolean) as string[]

      // Identificar o UUID do orientador atual
      let orientadorAtualUuid = undefined;
      if (projectData.orientadorAtualEmail) {
        const profAtual = usuariosResolvidos.docentes.find((d: any) => d.email === projectData.orientadorAtualEmail)
        if (profAtual) {
          orientadorAtualUuid = profAtual.usuario_uuid;
        }
      }

      // Salvar Passo 3 apenas se houver dados
      if (autoresPayload.length > 0 || orientadoresUuids.length > 0) {
        const passo3Payload: any = {
          autores: autoresPayload,
          docentes_uuids: orientadoresUuids
        }

        if (orientadorAtualUuid) {
          passo3Payload.orientador_atual_uuid = orientadorAtualUuid;
        }

        await salvarPasso3Mutation.mutateAsync({
          uuid,
          dados: passo3Payload
        })
        console.log('Passo 3 salvo no rascunho')
      }
    } catch (error) {
      console.warn('Erro ao salvar Passo 3 no rascunho:', error)
      // Não bloquear o salvamento, apenas logar
    }
  }, [resolverUsuariosMutation, salvarPasso3Mutation, user])

  const salvarPasso4Rascunho = useCallback(async (uuid: string, projectData: ProjectData) => {
    try {
      // Helper para processar anexos de uma fase
      const processarFase = async (faseData: PhaseData): Promise<any> => {
        const anexosProcessados = []

        for (const anexo of faseData.anexos) {
          let url = ''
          let nome = anexo.file.name
          let tamanho = anexo.file.size
          let mime = anexo.file.type

          // Verificar se é um anexo que já existe na API (tem url_arquivo e arquivo vazio)
          const urlExistente = (anexo.file as any).url_arquivo
          const isAnexoExistente = urlExistente && anexo.file.size === 0

          // Se for link salvo como arquivo (IdeacaoSection usa 'link.txt', AttachmentsSection usa 'LINK: <url>')
          const isLinkFile = anexo.file.name === 'link.txt' || anexo.file.name.startsWith('LINK: ')
          if (isLinkFile) {
            // Extrair URL: de 'link.txt' lemos o conteúdo, de 'LINK: <url>' extraímos do nome
            url = anexo.file.name === 'link.txt'
              ? await anexo.file.text()
              : anexo.file.name.replace('LINK: ', '')
            mime = 'text/uri-list'

            // Para links, não enviamos arquivo físico
            anexosProcessados.push({
              id: anexo.id,
              tipo: anexo.type,
              nome_arquivo: nome,
              url_arquivo: url,
              tamanho_bytes: tamanho,
              mime_type: mime
            })
          }
          // Se for anexo que já existe na API, enviar apenas URL
          else if (isAnexoExistente) {
            anexosProcessados.push({
              id: anexo.id,
              tipo: anexo.type,
              nome_arquivo: nome,
              url_arquivo: urlExistente,
              tamanho_bytes: tamanho || 0,
              mime_type: mime
            })
          }
          // Se for arquivo novo (tem conteúdo), enviar o arquivo
          else if (anexo.file.size > 0) {
            // Mantém o arquivo no payload para upload via FormData
            anexosProcessados.push({
              id: anexo.id,
              tipo: anexo.type,
              nome_arquivo: nome,
              file: anexo.file, // Mantém o File object
              tamanho_bytes: tamanho,
              mime_type: mime
            })
          }
          // Ignorar arquivos vazios sem URL (não devem ser enviados)
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
      console.log('Passo 4 salvo no rascunho')
    } catch (error) {
      console.warn('Erro ao salvar Passo 4 no rascunho:', error)
      // Não bloquear o salvamento, apenas logar
    }
  }, [salvarPasso4Mutation])

  const salvarPasso5Rascunho = useCallback(async (uuid: string, projectData: ProjectData) => {
    try {
      // Usar PATCH ao invés de POST /passo5 para não publicar o projeto
      await atualizarProjetoMutation.mutateAsync({
        uuid,
        dados: {
          has_repositorio: projectData.hasRepositorio,
          link_repositorio: projectData.hasRepositorio && projectData.linkRepositorio ? projectData.linkRepositorio : null,
          codigo_visibilidade: projectData.hasRepositorio ? projectData.codigoVisibilidade : null,
          anexos_visibilidade: projectData.anexosVisibilidade,
          aceitou_termos: projectData.aceitouTermos
        }
      })
      console.log('Passo 5 salvo no rascunho (via PATCH)')
    } catch (error) {
      console.warn('Erro ao salvar Passo 5 no rascunho:', error)
      // Não bloquear o salvamento, apenas logar
    }
  }, [atualizarProjetoMutation])

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
      // Sempre salvar Passo 1 primeiro (cria ou atualiza o projeto)
      let currentUuid = await salvarPasso1Rascunho(projetoUuid, projectData)

      if (!currentUuid) {
        console.warn('Não foi possível criar/atualizar o projeto no auto-save')
        return
      }

      // Atualizar estado do UUID se foi criado
      if (!projetoUuid && currentUuid) {
        setProjetoUuid(currentUuid)
      }

      // Salvar apenas o passo atual e anterior baseado no currentStep
      // Passo 1: salvar apenas Passo 1 (já foi salvo acima)
      // Passo 2: salvar Passo 1 (já salvo) e Passo 2
      // Passo 3: salvar Passo 2 e Passo 3
      // Passo 4: salvar Passo 3 e Passo 4
      // Passo 5: salvar Passo 4 e Passo 5

      if (currentStep >= 2) {
        try {
          await salvarPasso2Rascunho(currentUuid, projectData)
        } catch (e) {
          console.warn('Erro ao salvar Passo 2 no auto-save:', e)
        }
      }

      if (currentStep >= 3) {
        try {
          await salvarPasso3Rascunho(currentUuid, projectData)
        } catch (e) {
          console.warn('Erro ao salvar Passo 3 no auto-save:', e)
        }
      }

      if (currentStep >= 4) {
        try {
          await salvarPasso4Rascunho(currentUuid, projectData)
        } catch (e) {
          console.warn('Erro ao salvar Passo 4 no auto-save:', e)
        }
      }

      if (currentStep >= 5) {
        try {
          await salvarPasso5Rascunho(currentUuid, projectData)
        } catch (e) {
          console.warn('Erro ao salvar Passo 5 no auto-save:', e)
        }
      }

      setLastSavedAt(new Date())
      setHasUnsavedChanges(false)

      // Limpar localStorage após salvar na API
      localStorage.removeItem('project_draft')
      localStorage.removeItem('project_draft_timestamp')

    } catch (error: any) {
      console.error('Erro no auto-save:', error)

      // Tratamento específico para título duplicado
      if (error?.response?.data?.message?.includes('Já existe um projeto com este título')) {
        // Exibir erro apenas uma vez para não spammar
        message.warning('Já existe um projeto com este título. O rascunho não será salvo na nuvem até que o título seja alterado.')
        // Impedimos que o auto-save continue tentando "cegamente" manter hasUnsavedChanges como true
        // Mas não podemos setar false senão perdemos o estado de "sujo". 
        // A melhor estratégia UX é avisar o usuário.
      } else {
        // Outros erros (rede, etc)
        console.warn('Falha no auto-save (retentativa automática em breve).')
      }
      // Em caso de erro, manter no localStorage (já é feito pelo saveToLocalStorage na atualização do estado)
    } finally {
      setIsAutoSaving(false)
    }
  }, [projectData, projetoUuid, currentStep, isReviewMode, isAutoSaving, isSavingDraft, isSubmitting, salvarPasso1Rascunho, salvarPasso2Rascunho, salvarPasso3Rascunho, salvarPasso4Rascunho, salvarPasso5Rascunho])

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

        // 4. Atualizar o estado local com a URL do banner
        updateProjectData({ bannerUrl: bannerUrl })

        // 5. Salva no LocalStorage que este projeto tem um banner salvo (opcional, para persistência visual imediata se necessário)
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

  // Função helper para validar primeira fase (Ideação)
  const validarPrimeiraFase = (): boolean => {
    const ideacao = projectData.ideacao
    const temDescricao = ideacao?.descricao?.trim().length > 0
    const temAnexo = ideacao?.anexos?.length > 0

    return temDescricao && temAnexo
  }

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

    // Validação específica para Docente: Deve ter um líder definido
    if (user?.tipo === 'DOCENTE' && !projectData.liderEmail) {
      Modal.warning({
        title: 'Líder Obrigatório',
        content: 'Como orientador, você deve adicionar um aluno à equipe e defini-lo como Líder antes de prosseguir.',
      })
      return
    }

    if (!projectData.aceitouTermos) {
      message.warning('Por favor, aceite os Termos de Uso e Política de Privacidade para continuar')
      return
    }

    // Validação da primeira fase (Ideação) - obrigatória para publicação
    if (!validarPrimeiraFase()) {
      setShowPrimeiraFaseModal('review')
      return
    }

    setIsReviewMode(true)
  }

  const handleBackToEdit = () => {
    setIsReviewMode(false)
  }

  const handleStepChange = useCallback((step: number) => {
    setCurrentStep(step)
  }, [])

  // Função para salvar rascunho sem publicar
  const handleSaveDraft = async () => {
    if (isSavingDraft) return

    // Mostrar aviso se primeira fase estiver incompleta, mas permitir salvar rascunho
    if (!validarPrimeiraFase()) {
      setShowPrimeiraFaseModal('draft')
      return
    }

    // Continuar com o salvamento se a fase estiver completa ou após usuário confirmar
    await performSaveDraft()
  }

  // Função auxiliar para executar o salvamento do rascunho
  const performSaveDraft = async () => {
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
            banner_url: projectData.bannerUrl,
            itinerario: projectData.itinerario === 'Sim',
            senai_lab: projectData.senaiLab === 'Sim',
            saga_senai: projectData.sagaSenai === 'Sim',
            participou_edital: projectData.participouEdital === 'Sim',
            ganhou_premio: projectData.ganhouPremio === 'Sim',
            curso: projectData.curso,
            turma: projectData.turma,
            unidade_curricular: projectData.unidadeCurricular,
            modalidade: projectData.modalidade,
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

      // Salvar Passo 3 (Equipe) - apenas se houver autores ou orientadores
      if (projectData.autores.length > 0 || projectData.orientador) {
        try {
          await salvarPasso3Rascunho(savedUuid, projectData)
        } catch (error: any) {
          console.error('Erro ao salvar Passo 3 no rascunho:', error)
          // Continuar mesmo se falhar, mas logar o erro
        }
      }

      // Salvar Passo 4 (Fases)
      try {
        await salvarPasso4Rascunho(savedUuid, projectData)
      } catch (error: any) {
        console.error('Erro ao salvar Passo 4 no rascunho:', error)
        // Continuar mesmo se falhar, mas logar o erro
      }

      // Salvar Passo 5 (Repositório e Termos)
      try {
        await salvarPasso5Rascunho(savedUuid, projectData)
      } catch (error: any) {
        console.error('Erro ao salvar Passo 5 no rascunho:', error)
        // Continuar mesmo se falhar, mas logar o erro
      }

      // Limpar rascunho local após salvar na API
      localStorage.removeItem('project_draft')
      localStorage.removeItem('project_draft_timestamp')
      setHasUnsavedChanges(false)
      setLastSavedAt(new Date())

      message.success('Rascunho salvo com sucesso!')

      // Redirecionar para aba Rascunhos em Meus Projetos (admin vai para /projetos)
      const destino = user?.tipo === 'ADMIN' ? `${baseRoute}/projetos` : `${baseRoute}/meus-projetos`
      navigate(destino, { state: { activeTab: 'rascunhos' } })

    } catch (error: unknown) {
      console.error('Erro ao salvar rascunho:', error)
      showError(error)
    } finally {
      setIsSavingDraft(false)
    }
  }

  const handleSaveAndPublish = async () => {
    if (isSubmitting) return

    // Validação da primeira fase (Ideação) - obrigatória para publicação
    if (!validarPrimeiraFase()) {
      setShowPrimeiraFaseModal('publish')
      return
    }

    // Continuar com a publicação se a fase estiver completa
    await performPublish()
  }

  // Função auxiliar para executar a publicação
  const performPublish = async () => {
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

      // Adicionar o próprio usuário (líder) se não estiver na lista (pular se for ADMIN)
      if (user?.email && user?.tipo !== 'ADMIN' && !emailsToResolve.includes(user.email)) {
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
            saga_senai: projectData.sagaSenai === 'Sim' || projectData.sagaSenai === true as any,
            participou_edital: projectData.participouEdital === 'Sim' || projectData.participouEdital === true as any,
            ganhou_premio: projectData.ganhouPremio === 'Sim' || projectData.ganhouPremio === true as any
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
            const prof = usuariosResolvidos.docentes.find((d: any) => d.email === email)
            if (prof) {
              throw new Error(`O usuário ${email} é um docente e não pode ser autor.`)
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
          const prof = usuariosResolvidos.docentes.find((d: any) => d.email === email)
          return prof ? prof.usuario_uuid : null
        }).filter(Boolean) as string[]

        await salvarPasso3Mutation.mutateAsync({
          uuid,
          dados: {
            autores: finalAutores,
            docentes_uuids: orientadoresUuids
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
      // NOVO: Mantém os arquivos no payload para envio via FormData
      const processarFase = async (faseData: PhaseData): Promise<any> => {
        const anexosProcessados = []

        for (const anexo of faseData.anexos) {
          let url = ''
          let nome = anexo.file.name
          let tamanho = anexo.file.size
          let mime = anexo.file.type

          // Verificar se é um anexo que já existe na API (tem url_arquivo e arquivo vazio)
          const urlExistente = (anexo.file as any).url_arquivo
          const isAnexoExistente = urlExistente && anexo.file.size === 0

          // Se for link salvo como arquivo (IdeacaoSection usa 'link.txt', AttachmentsSection usa 'LINK: <url>')
          const isLinkFile = anexo.file.name === 'link.txt' || anexo.file.name.startsWith('LINK: ')
          if (isLinkFile) {
            // Extrair URL: de 'link.txt' lemos o conteúdo, de 'LINK: <url>' extraímos do nome
            url = anexo.file.name === 'link.txt'
              ? await anexo.file.text()
              : anexo.file.name.replace('LINK: ', '')
            mime = 'text/uri-list'

            // Para links, não enviamos arquivo físico
            anexosProcessados.push({
              id: anexo.id,
              tipo: anexo.type,
              nome_arquivo: nome,
              url_arquivo: url,
              tamanho_bytes: tamanho,
              mime_type: mime
            })
          }
          // Se for anexo que já existe na API, enviar apenas URL
          else if (isAnexoExistente) {
            anexosProcessados.push({
              id: anexo.id,
              tipo: anexo.type,
              nome_arquivo: nome,
              url_arquivo: urlExistente,
              tamanho_bytes: tamanho || 0,
              mime_type: mime
            })
          }
          // Se for arquivo novo (tem conteúdo), enviar o arquivo
          else if (anexo.file.size > 0) {
            // NOVO: Mantém o arquivo no payload ao invés de fazer upload separado
            // O backend agora recebe e processa os arquivos via multipart/form-data
            anexosProcessados.push({
              id: anexo.id,
              tipo: anexo.type,
              nome_arquivo: nome,
              file: anexo.file, // Mantém o File object
              tamanho_bytes: tamanho,
              mime_type: mime
            })
          }
          // Ignorar arquivos vazios sem URL (não devem ser enviados)
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
        link_repositorio: projectData.hasRepositorio && projectData.linkRepositorio ? projectData.linkRepositorio : null,
        codigo_visibilidade: projectData.hasRepositorio ? projectData.codigoVisibilidade : null,
        anexos_visibilidade: projectData.anexosVisibilidade,
        aceitou_termos: projectData.aceitouTermos
      }
      console.log('Payload Passo 5:', payloadPasso5)

      await configurarPasso5Mutation.mutateAsync({
        uuid,
        dados: payloadPasso5
      })

      message.success(isEditingPublished ? 'Projeto atualizado com sucesso!' : 'Projeto publicado com sucesso!')

      // Limpa rascunho e redireciona
      if (searchParams.get('rascunho')) {
        // Lógica de limpeza se houvesse local storage específico
      }
      const destino = user?.tipo === 'ADMIN' ? `${baseRoute}/projetos` : `${baseRoute}/meus-projetos`
      navigate(destino)

    } catch (error: unknown) {
      console.error('Erro ao salvar projeto:', error)
      showError(error)
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

      {/* Modal de Primeira Fase Incompleta */}
      {showPrimeiraFaseModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            if (showPrimeiraFaseModal === 'review' || showPrimeiraFaseModal === 'draft') {
              setShowPrimeiraFaseModal(null)
            }
          }}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Fase de Ideação incompleta
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {showPrimeiraFaseModal === 'review' && 'Ação necessária para revisão'}
                  {showPrimeiraFaseModal === 'draft' && 'Aviso sobre publicação'}
                  {showPrimeiraFaseModal === 'publish' && 'Não é possível publicar'}
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Para publicar o projeto, é obrigatório preencher a descrição e adicionar pelo menos um anexo na fase de <strong>Ideação</strong>.
            </p>
            <div className="flex gap-3">
              {/* Modal de Revisão: 2 botões */}
              {showPrimeiraFaseModal === 'review' && (
                <>
                  <button
                    onClick={() => {
                      setShowPrimeiraFaseModal(null)
                      // Primeiro garantir que está no modo de edição
                      setIsReviewMode(false)
                      // Depois ir para a etapa 4 (Fases do Projeto)
                      setCurrentStep(4)
                      handleStepChange(4)
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Voltar para Edição
                  </button>
                  <button
                    onClick={() => {
                      setShowPrimeiraFaseModal(null)
                      setIsReviewMode(true)
                    }}
                    className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Ir para Revisão
                  </button>
                </>
              )}
              {/* Modal de Rascunho: 2 botões */}
              {showPrimeiraFaseModal === 'draft' && (
                <>
                  <button
                    onClick={() => {
                      setShowPrimeiraFaseModal(null)
                      // Primeiro garantir que está no modo de edição (não revisão)
                      setIsReviewMode(false)
                      // Depois ir para a etapa 4 (Fases do Projeto)
                      setCurrentStep(4)
                      handleStepChange(4)
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Voltar para Edição
                  </button>
                  <button
                    onClick={async () => {
                      setShowPrimeiraFaseModal(null)
                      await performSaveDraft()
                    }}
                    className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Salvar Rascunho
                  </button>
                </>
              )}
              {/* Modal de Publicação: 1 botão "Entendi" (bloqueia publicação) */}
              {showPrimeiraFaseModal === 'publish' && (
                <button
                  onClick={() => setShowPrimeiraFaseModal(null)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Entendi
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Erro da API */}
      <ErrorModal
        error={errorState}
        onClose={clearError}
        onAction={() => {
          clearError()
          if (errorState.navigateTarget) {
            setIsReviewMode(false)
            setCurrentStep(errorState.navigateTarget)
            handleStepChange(errorState.navigateTarget)
          }
        }}
        onRetry={() => {
          clearError()
          // Re-tentar a última ação (publicar ou salvar rascunho)
          if (isReviewMode) {
            performPublish()
          }
        }}
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
            isEditMode={isEditingPublished}
            onStepChange={handleStepChange}
            targetStep={currentStep}
            projetoUuid={projetoUuid}
          />
        ) : (
          <ProjectReview
            data={projectData}
            onBackToEdit={handleBackToEdit}
            onSaveAndPublish={handleSaveAndPublish}
            isSubmitting={isSubmitting}
            onSaveDraft={isEditingPublished ? undefined : handleSaveDraft}
            isSavingDraft={isSavingDraft}
            submitLabel={isEditingPublished ? 'Salvar Alterações' : undefined}
            savingLabel={isEditingPublished ? 'Salvando...' : undefined}
          />
        )}
      </div>
    </div>
  )
}

export default CreateProjectPage
