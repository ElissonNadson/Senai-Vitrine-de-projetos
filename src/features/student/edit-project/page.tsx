import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowLeft, FiSave, FiCheck, FiAlertCircle } from 'react-icons/fi'
import { buscarProjeto, atualizarProjeto } from '@/api/projetos'
import { useAuth } from '@/contexts/auth-context'
import { getBaseRoute } from '@/utils/routes'
import { uploadAnexo, uploadBanner } from '@/api/upload'
import { message, Modal } from 'antd'
import CreateProjectForm from '../create-project/components/create-project-form'
import ProjectReview from '../create-project/components/project-review'
import {
  useResolverUsuarios,
  useSalvarPasso2,
  useSalvarPasso3,
  useSalvarPasso4,
  useConfigurarPasso5
} from '@/hooks/use-queries'

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
  const { user } = useAuth()
  const baseRoute = useMemo(() => getBaseRoute(user?.tipo), [user?.tipo])
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

  const [projectUuid, setProjectUuid] = useState<string>('')

  useEffect(() => {
    // Carregar dados do projeto da API
    const loadProject = async () => {
      if (!projectId) {
        setError('ID do projeto não informado')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const projeto = await buscarProjeto(projectId)
        console.log('DEBUG: Projeto recebido da API:', projeto)
        console.log('DEBUG: Categoria do projeto:', projeto.categoria)
        setProjectUuid(projeto.uuid)

        // Converter dados do projeto para o formato do formulário
        const autoresEmails = projeto.autores?.map(a => a.email) || []
        const orientadorEmail = projeto.orientadores?.[0]?.email || ''
        const liderEmail = projeto.autores?.find(a => a.papel === 'LIDER')?.email || ''


        // Data Transformation Logic for Pre-filling
        // Mapear dados do backend para o formato do formulário

        // Passo 2: Dados Acadêmicos (Muitos desses campos não vêm explicitamente no 'projeto' get,
        // dependendo do DTO, mas vamos tentar mapear o que temos ou manter defaults seguros se vazios)
        // OBS: Se a API buscarProjeto retornar esses dados, ótimo. Se não, podem vir vazios.
        // Assumindo que o backend retorna tudo no objeto projeto.

        const projetoAny = projeto as any

        const curso = projetoAny.curso || ''
        const turma = projetoAny.turma || ''
        const modalidade = projetoAny.modalidade || ''
        const unidadeCurricular = projetoAny.unidade_curricular || ''
        const itinerario = projetoAny.itinerario ? 'Sim' : 'Não'
        const senaiLab = projetoAny.senai_lab ? 'Sim' : 'Não'
        const sagaSenai = projetoAny.saga_senai ? 'Sim' : 'Não'

        // Passo 4: Fases
        // Precisa mapear fases do backend para o formato PhaseData
        // Helper para converter anexos do backend para o formato do frontend
        const mapAnexos = (anexosBackend: any[]): Attachment[] => {
          if (!anexosBackend || !Array.isArray(anexosBackend)) return []
          return anexosBackend.map((a: any) => ({
            id: a.uuid || a.id,
            file: {
              name: a.nome_arquivo,
              type: a.mime_type || 'application/octet-stream',
              size: a.tamanho_bytes || 0
            } as any,
            type: a.tipo_anexo || a.tipo,
            url: a.url_arquivo, // Campo extra para exibir/download
            // Marcar como anexo existente (não tem File object real)
            isExisting: true
          }) as any)
        }

        const ideacao = projetoAny.fases?.ideacao || projetoAny.etapas?.ideacao
        const modelagem = projetoAny.fases?.modelagem || projetoAny.etapas?.modelagem
        const prototipagem = projetoAny.fases?.prototipagem || projetoAny.etapas?.prototipagem
        const implementacao = projetoAny.fases?.implementacao || projetoAny.etapas?.implementacao

        setProjectData({
          curso,
          turma,
          itinerario,
          unidadeCurricular,
          senaiLab,
          sagaSenai,
          titulo: projeto.titulo,
          descricao: projeto.descricao,
          categoria: projeto.categoria || '',
          modalidade,
          autores: autoresEmails,
          orientador: orientadorEmail,
          liderEmail: liderEmail,
          isLeader: !!liderEmail,
          banner: null,

          ideacao: {
            descricao: ideacao?.descricao || '',
            anexos: mapAnexos(ideacao?.anexos)
          },
          modelagem: {
            descricao: modelagem?.descricao || '',
            anexos: mapAnexos(modelagem?.anexos)
          },
          prototipagem: {
            descricao: prototipagem?.descricao || '',
            anexos: mapAnexos(prototipagem?.anexos)
          },
          implementacao: {
            descricao: implementacao?.descricao || '',
            anexos: mapAnexos(implementacao?.anexos)
          },
          hasRepositorio: !!projeto.repositorio_url,
          tipoRepositorio: projeto.repositorio_url ? 'link' : 'arquivo',
          codigo: null,
          linkRepositorio: projeto.repositorio_url || '',
          codigoVisibilidade: 'Público',
          anexosVisibilidade: 'Público',
          aceitouTermos: true
        })

        setIsLoading(false)
      } catch (err: any) {
        console.error('Erro ao carregar projeto:', err)
        setError(err?.response?.data?.message || 'Projeto não encontrado')
        setIsLoading(false)
      }
    }

    loadProject()
  }, [projectId])

  // Auto-upload banner when changed
  useEffect(() => {
    const uploadBannerDraft = async () => {
      if (!projectData.banner || !(projectData.banner instanceof File) || !projectUuid) return

      try {
        message.loading({ content: 'Atualizando banner...', key: 'banner-upload' })

        // Upload com contexto 'project_banner'
        const uploadResponse = await uploadBanner(projectData.banner, 'project_banner')
        const bannerUrl = uploadResponse.url

        // Salvar URL
        await atualizarProjeto(projectUuid, {
          banner_url: bannerUrl
        })

        message.success({ content: 'Banner atualizado com sucesso!', key: 'banner-upload' })

        // Atualizar estado local para não tentar subir de novo (opcional, mas o file object não muda sozinho)
      } catch (error) {
        console.error('Erro no upload do banner:', error)
        message.error({ content: 'Erro ao atualizar banner.', key: 'banner-upload' })
      }
    }

    const timer = setTimeout(() => {
      uploadBannerDraft()
    }, 1000)

    return () => clearTimeout(timer)
  }, [projectData.banner, projectUuid])

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

  // Mutations
  const resolverUsuariosMutation = useResolverUsuarios()
  const salvarPasso2Mutation = useSalvarPasso2()
  const salvarPasso3Mutation = useSalvarPasso3()
  const salvarPasso4Mutation = useSalvarPasso4()
  const configurarPasso5Mutation = useConfigurarPasso5()

  const handleFinalSubmit = async () => {
    try {
      message.loading({ content: 'Salvando alterações...', key: 'save_project' })

      // 1. Atualizar Passo 1 (Básico)
      await atualizarProjeto(projectUuid, {
        titulo: projectData.titulo,
        descricao: projectData.descricao,
        categoria: projectData.categoria,
        repositorio_url: projectData.linkRepositorio || undefined,
      })

      // 2. Resolver Usuários para pegar UUIDs corretos
      const emailsToResolve = [...projectData.autores]
      const orientadoresEmails = projectData.orientador
        ? projectData.orientador.split(',').map(o => o.trim()).filter(Boolean)
        : []

      emailsToResolve.push(...orientadoresEmails)
      // Garantir user atual se precisar (geralmente na edição ele já deve estar ou não)

      if (emailsToResolve.length > 0) {
        const usuariosResolvidos = await resolverUsuariosMutation.mutateAsync([...new Set(emailsToResolve)])

        if (usuariosResolvidos.invalidos?.length > 0) {
          throw new Error(`Usuários não encontrados: ${usuariosResolvidos.invalidos.join(', ')}`)
        }

        // 3. Salvar Passo 2 (Acadêmico)
        if (projectData.curso && projectData.turma) {
          await salvarPasso2Mutation.mutateAsync({
            uuid: projectUuid,
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
        }

        // 4. Salvar Passo 3 (Equipe)
        if (projectData.autores.length > 0) {
          let autoresPayload = projectData.autores.map(email => {
            const usuario = usuariosResolvidos.alunos.find((a: any) => a.email === email)
            if (!usuario) {
              // Fallback check if needed or throw
              // Assuming validation passed
              return null
            }
            return {
              email,
              usuario_uuid: usuario.usuario_uuid,
              papel: 'AUTOR' as any
            }
          }).filter(Boolean) as any[]

          // Definir líder
          const hasLeader = autoresPayload.some(a => a.email === projectData.liderEmail)
          if (hasLeader) {
            autoresPayload = autoresPayload.map(a => ({
              ...a,
              papel: a.email === projectData.liderEmail ? 'LIDER' : 'AUTOR'
            }))
          } else if (autoresPayload.length > 0) {
            autoresPayload[0].papel = 'LIDER'
          }

          const finalAutores = autoresPayload.map(({ email, ...rest }) => rest)

          const orientadoresUuids = orientadoresEmails.map(email => {
            const prof = usuariosResolvidos.docentes.find((d: any) => d.email === email)
            return prof ? prof.usuario_uuid : null
          }).filter(Boolean) as string[]

          await salvarPasso3Mutation.mutateAsync({
            uuid: projectUuid,
            dados: {
              autores: finalAutores,
              orientadores_uuids: orientadoresUuids
            }
          })
        }
      }

      // 5. Salvar Passo 4 (Fases) - Apenas descrições por enquanto
      // 5. Passo 4 (Fases com anexos)
      // Helper para processar anexos de uma fase
      const processarAnexosFase = (faseData: PhaseData) => {
        return faseData.anexos.map((anexo: any) => {
          // Se é anexo existente e não foi substituído
          if (anexo.isExisting && anexo.url) {
            return {
              id: anexo.id,
              tipo: anexo.type,
              nome_arquivo: anexo.file.name,
              url_arquivo: anexo.url, // Mantém URL existente
              tamanho_bytes: anexo.file.size,
              mime_type: anexo.file.type
            }
          }

          // Se é novo anexo ou foi substituído
          return {
            id: anexo.id,
            tipo: anexo.type,
            nome_arquivo: anexo.file.name,
            file: anexo.file instanceof File ? anexo.file : undefined, // Só envia se for File real
            tamanho_bytes: anexo.file.size,
            mime_type: anexo.file.type
          }
        }).filter(a => a.file || a.url_arquivo) // Remove anexos sem file nem URL
      }

      const passo4Payload = {
        ideacao: {
          descricao: projectData.ideacao.descricao,
          anexos: processarAnexosFase(projectData.ideacao)
        },
        modelagem: {
          descricao: projectData.modelagem.descricao,
          anexos: processarAnexosFase(projectData.modelagem)
        },
        prototipagem: {
          descricao: projectData.prototipagem.descricao,
          anexos: processarAnexosFase(projectData.prototipagem)
        },
        implementacao: {
          descricao: projectData.implementacao.descricao,
          anexos: processarAnexosFase(projectData.implementacao)
        }
      }

      await salvarPasso4Mutation.mutateAsync({
        projetoUuid: projectUuid,
        dados: passo4Payload
      })

      // 6. Passo 5 (Configurações)
      await configurarPasso5Mutation.mutateAsync({
        uuid: projectUuid,
        dados: {
          has_repositorio: projectData.hasRepositorio,
          tipo_repositorio: projectData.tipoRepositorio,
          link_repositorio: projectData.linkRepositorio,
          codigo_visibilidade: projectData.codigoVisibilidade,
          anexos_visibilidade: projectData.anexosVisibilidade,
          aceitou_termos: projectData.aceitouTermos
        }
      })

      message.success({ content: 'Projeto salvo com sucesso!', key: 'save_project' })
      setShowSuccessModal(true)

      setTimeout(() => {
        navigate(`${baseRoute}/meus-projetos`)
      }, 2000)

    } catch (err: any) {
      console.error('Erro ao atualizar projeto:', err)
      setError(err?.message || 'Erro ao salvar projeto')
      message.error({ content: err?.message || 'Erro ao salvar projeto', key: 'save_project' })
    }
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
            onClick={() => navigate(`${baseRoute}/meus-projetos`)}
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
            onClick={() => navigate(`${baseRoute}/meus-projetos`)}
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
